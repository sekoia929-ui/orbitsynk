import { db, automationRules, billingConnections, communityConnections, eventLogs, memberSync } from '@/lib/db'
import { eq, and, lte, isNotNull } from 'drizzle-orm'
import { decrypt } from '@/lib/encrypt'
import { CircleAdapter } from '@/lib/adapters/circle'
import { SkoolAdapter } from '@/lib/adapters/skool'
import type { CommunityAdapter } from '@/lib/adapters/adapter-types'

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type BillingEventType =
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.cancelled'
  | 'subscription.expired'
  | 'subscription.paused'
  | 'subscription.resumed'
  | 'payment.failed'
  | 'payment.success'

export type ActionType = 'grant_access' | 'revoke_access' | 'sync_access'

export interface BillingEvent {
  orgId: string
  billingProvider: string
  billingConnectionId: string
  eventType: BillingEventType
  eventId: string
  memberEmail: string
  memberName?: string
  productId?: string
  subscriptionStatus?: string
  rawPayload: Record<string, unknown>
}

// ─── ADAPTER FACTORY ─────────────────────────────────────────────────────────

function getCommunityAdapter(platform: string, apiKey: string, communityId: string): CommunityAdapter {
  const config = { apiKey, communityId }
  switch (platform) {
    case 'circle':
      return new CircleAdapter(config)
    case 'skool':
      return new SkoolAdapter(config)
    default:
      throw new Error(`Unsupported community platform: ${platform}`)
  }
}

// ─── RULE EXECUTION ───────────────────────────────────────────────────────────

async function executeAction(
  adapter: CommunityAdapter,
  actionType: ActionType,
  email: string,
  memberName?: string,
  subscriptionStatus?: string
) {
  switch (actionType) {
    case 'grant_access':
      return adapter.grantAccess(email, memberName)

    case 'revoke_access':
      return adapter.revokeAccess(email)

    case 'sync_access': {
      // For subscription.updated — grant if active, revoke if not
      const activeStatuses = ['active', 'trialing', 'on_trial', 'paused']
      const isActive = activeStatuses.includes(subscriptionStatus?.toLowerCase() ?? '')
      if (isActive) {
        return adapter.grantAccess(email, memberName)
      } else {
        return adapter.revokeAccess(email)
      }
    }

    default:
      return { success: false, message: `Unknown action type: ${actionType}` }
  }
}

// ─── MAIN EVENT PROCESSOR ────────────────────────────────────────────────────

export async function processEvent(event: BillingEvent): Promise<void> {
  console.log(`[RulesEngine] Processing event: ${event.eventType} for ${event.memberEmail}`)

  // Find all active rules for this org + billing connection that match this event
  const rules = await db.query.automationRules.findMany({
    where: and(
      eq(automationRules.orgId, event.orgId),
      eq(automationRules.billingConnectionId, event.billingConnectionId),
      eq(automationRules.isActive, true),
      eq(automationRules.triggerEvent, event.eventType)
    ),
    with: {
      communityConnection: true,
    },
  })

  const matchingRules = rules.filter(rule => {
    // If rule specifies a product, filter to that product only
    if (rule.triggerProductId && event.productId) {
      return rule.triggerProductId === event.productId
    }
    return true
  })

  if (matchingRules.length === 0) {
    console.log(`[RulesEngine] No matching rules for event ${event.eventType}`)
    // Still log the event even if no rules matched
    await db.insert(eventLogs).values({
      orgId: event.orgId,
      billingProvider: event.billingProvider,
      eventType: event.eventType,
      eventId: event.eventId,
      rawPayload: event.rawPayload,
      memberEmail: event.memberEmail,
      memberName: event.memberName,
      actionTaken: 'none',
      actionResult: 'No matching rules found',
    }).onConflictDoNothing()
    return
  }

  // Execute all matching rules in parallel
  const results = await Promise.allSettled(
    matchingRules.map(rule => executeRule(rule, event))
  )

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`[RulesEngine] Rule ${matchingRules[i].id} failed:`, result.reason)
    }
  })
}

async function executeRule(
  rule: typeof automationRules.$inferSelect & {
    communityConnection: typeof communityConnections.$inferSelect
  },
  event: BillingEvent
): Promise<void> {
  const conn = rule.communityConnection
  const actionType = rule.actionType as ActionType

  // Decrypt the API key
  let decryptedKey: string
  try {
    decryptedKey = decrypt(conn.apiKey)
  } catch (err) {
    console.error(`[RulesEngine] Failed to decrypt API key for connection ${conn.id}:`, err)
    await logEvent(event, rule.id, actionType, 'failed', 'Failed to decrypt API key')
    return
  }

  const adapter = getCommunityAdapter(conn.platform, decryptedKey, conn.communityId)

  // Handle grace period for revoke_access
  if (actionType === 'revoke_access' && rule.gracePeriodDays > 0) {
    const gracePeriodEndsAt = new Date()
    gracePeriodEndsAt.setDate(gracePeriodEndsAt.getDate() + rule.gracePeriodDays)

    await db.insert(memberSync).values({
      orgId: event.orgId,
      ruleId: rule.id, // Track which rule triggered the grace period
      email: event.memberEmail,
      memberName: event.memberName,
      subscriptionStatus: event.subscriptionStatus,
      accessStatus: 'grace_period',
      gracePeriodEndsAt,
    }).onConflictDoUpdate({
      target: [memberSync.orgId, memberSync.email],
      set: {
        ruleId: rule.id,
        subscriptionStatus: event.subscriptionStatus,
        accessStatus: 'grace_period',
        gracePeriodEndsAt,
        updatedAt: new Date(),
      },
    })

    await logEvent(event, rule.id, actionType, 'grace_period',
      `Grace period of ${rule.gracePeriodDays} days applied. Access revoked on ${gracePeriodEndsAt.toISOString()}`)
    return
  }

  // Execute the action
  try {
    const result = await executeAction(adapter, actionType, event.memberEmail, event.memberName, event.subscriptionStatus)
    const status = result.success ? 'completed' : 'failed'

    // Update member sync state
    await db.insert(memberSync).values({
      orgId: event.orgId,
      ruleId: rule.id,
      email: event.memberEmail,
      memberName: event.memberName,
      subscriptionStatus: event.subscriptionStatus,
      accessStatus: actionType === 'grant_access' || (actionType === 'sync_access' && result.success) ? 'active' : 'inactive',
    }).onConflictDoUpdate({
      target: [memberSync.orgId, memberSync.email],
      set: {
        ruleId: rule.id,
        subscriptionStatus: event.subscriptionStatus,
        accessStatus: actionType === 'grant_access' ? 'active' : 'inactive',
        gracePeriodEndsAt: null,
        updatedAt: new Date(),
      },
    })

    await logEvent(event, rule.id, actionType, status, result.message)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[RulesEngine] Action failed for rule ${rule.id}:`, message)
    await logEvent(event, rule.id, actionType, 'failed', message)
  }
}

// ─── GRACE PERIOD CRON ───────────────────────────────────────────────────────
// Called by /api/cron/grace-period — processes members whose grace period has ended

export async function processExpiredGracePeriods(): Promise<{ processed: number; errors: number }> {
  const now = new Date()
  let processed = 0
  let errors = 0

  // Find all members in grace_period whose time has expired
  const expired = await db.query.memberSync.findMany({
    where: and(
      eq(memberSync.accessStatus, 'grace_period'),
      isNotNull(memberSync.gracePeriodEndsAt),
      lte(memberSync.gracePeriodEndsAt, now)
    ),
  })

  console.log(`[GracePeriodCron] Found ${expired.length} members with expired grace periods`)

  for (const member of expired) {
    try {
      // Use the specific rule that triggered the grace period
      if (!member.ruleId) {
        console.warn(`[GracePeriodCron] Member ${member.email} has no ruleId — skipping`)
        continue
      }

      const rule = await db.query.automationRules.findFirst({
        where: eq(automationRules.id, member.ruleId),
        with: { communityConnection: true },
      })

      if (!rule || !rule.isActive) {
        // Rule was deleted or disabled — just mark member as inactive
        await db.update(memberSync)
          .set({ accessStatus: 'inactive', gracePeriodEndsAt: null, updatedAt: new Date() })
          .where(eq(memberSync.id, member.id))
        continue
      }

      const conn = rule.communityConnection
      const decryptedKey = decrypt(conn.apiKey)
      const adapter = getCommunityAdapter(conn.platform, decryptedKey, conn.communityId)

      const result = await adapter.revokeAccess(member.email)

      await db.update(memberSync)
        .set({
          accessStatus: result.success ? 'inactive' : 'grace_period',
          gracePeriodEndsAt: result.success ? null : member.gracePeriodEndsAt,
          updatedAt: new Date(),
        })
        .where(eq(memberSync.id, member.id))

      if (result.success) {
        processed++
        console.log(`[GracePeriodCron] Revoked access for ${member.email}: ${result.message}`)
      } else {
        errors++
        console.error(`[GracePeriodCron] Failed to revoke access for ${member.email}: ${result.message}`)
      }
    } catch (err) {
      errors++
      console.error(`[GracePeriodCron] Error processing ${member.email}:`, err)
    }
  }

  return { processed, errors }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

async function logEvent(
  event: BillingEvent,
  ruleId: string,
  actionTaken: string,
  actionResult: string,
  message: string
) {
  await db.insert(eventLogs).values({
    orgId: event.orgId,
    ruleId,
    billingProvider: event.billingProvider,
    eventType: event.eventType,
    eventId: event.eventId,
    rawPayload: event.rawPayload,
    memberEmail: event.memberEmail,
    memberName: event.memberName,
    actionTaken,
    actionResult,
    errorMessage: actionResult === 'failed' ? message : null,
  }).onConflictDoNothing() // Idempotency — ignore duplicate events
}
