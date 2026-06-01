import { db, automationRules, communityConnections, billingConnections, eventLogs, memberSync } from './db'
import { eq, and } from 'drizzle-orm'
import { decrypt } from './encrypt'
import { CircleAdapter } from './adapters/circle'
import { SkoolAdapter } from './adapters/skool'

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type BillingEventType =
  | 'subscription.created'
  | 'subscription.cancelled'
  | 'subscription.updated'
  | 'payment.success'
  | 'payment.failed'

interface BillingEvent {
  provider: 'lemon_squeezy' | 'paddle'
  eventId: string
  eventType: BillingEventType
  memberEmail: string
  memberName?: string
  billingCustomerId?: string
  productId?: string
  orgId: string
  billingConnectionId: string
  rawPayload: object
}

// ─── MAIN RULES ENGINE ────────────────────────────────────────────────────────

export async function processEvent(event: BillingEvent): Promise<void> {
  console.log(`[RulesEngine] Processing ${event.eventType} for ${event.memberEmail}`)

  // Find all active matching rules for this org + event type
  const rules = await db.query.automationRules.findMany({
    where: and(
      eq(automationRules.orgId, event.orgId),
      eq(automationRules.triggerEvent, event.eventType),
      eq(automationRules.isActive, true)
    ),
    with: {
      communityConnection: true,
    }
  })

  if (rules.length === 0) {
    console.log(`[RulesEngine] No matching rules for ${event.eventType}`)
    await logEvent(event, null, null, 'skipped', undefined, 'No matching rules')
    return
  }

  // Execute each matching rule
  for (const rule of rules) {
    await executeRule(rule, event)
  }
}

// ─── EXECUTE A SINGLE RULE ────────────────────────────────────────────────────

async function executeRule(rule: any, event: BillingEvent): Promise<void> {
  // Optional: filter by product ID
  if (rule.triggerProductId && rule.triggerProductId !== event.productId) {
    console.log(`[RulesEngine] Skipping rule ${rule.id} — product ID mismatch`)
    return
  }

  // FIX 5: Key each log row by event + rule so multiple rules produce separate rows
  const ruleEventId = `${event.eventId}__rule_${rule.id}`

  try {
    const adapter = await getCommunityAdapter(rule.communityConnection)

    switch (rule.actionType) {
      case 'grant_access': {
        await adapter.grantAccess(event.memberEmail, event.memberName)
        await updateMemberSync(event, 'granted')
        await logEvent({ ...event, eventId: ruleEventId }, rule.id, rule.communityConnection.platform, 'success', 'grant_access')
        console.log(`[RulesEngine] ✅ Granted access to ${event.memberEmail}`)
        break
      }

      case 'revoke_access': {
        if (rule.gracePeriodDays > 0) {
          const gracePeriodEndsAt = new Date()
          gracePeriodEndsAt.setDate(gracePeriodEndsAt.getDate() + rule.gracePeriodDays)
          await updateMemberSync(event, 'grace_period', gracePeriodEndsAt)
          await logEvent(
            { ...event, eventId: ruleEventId },
            rule.id, rule.communityConnection.platform, 'success', 'grace_period_started',
            `Access revoke scheduled for ${gracePeriodEndsAt.toISOString()}`
          )
          console.log(`[RulesEngine] ⏳ Grace period started for ${event.memberEmail} until ${gracePeriodEndsAt}`)
        } else {
          await adapter.revokeAccess(event.memberEmail)
          await updateMemberSync(event, 'revoked')
          await logEvent({ ...event, eventId: ruleEventId }, rule.id, rule.communityConnection.platform, 'success', 'revoke_access')
          console.log(`[RulesEngine] 🚫 Revoked access for ${event.memberEmail}`)
        }
        break
      }

      default:
        console.warn(`[RulesEngine] Unknown action type: ${rule.actionType}`)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[RulesEngine] ❌ Rule ${rule.id} failed:`, message)
    await logEvent({ ...event, eventId: ruleEventId }, rule.id, null, 'failed', rule.actionType, message)
  }
}

// ─── GET ADAPTER FOR PLATFORM ─────────────────────────────────────────────────

async function getCommunityAdapter(connection: any): Promise<CircleAdapter | SkoolAdapter> {
  const apiKey = decrypt(connection.apiKey)

  switch (connection.platform) {
    case 'circle':
      return new CircleAdapter({ apiKey, communityId: connection.communityId })
    case 'skool':
      return new SkoolAdapter({ apiKey, communityId: connection.communityId })
    default:
      throw new Error(`Unsupported platform: ${connection.platform}`)
  }
}

// ─── HELPER: LOG EVENT ────────────────────────────────────────────────────────

async function logEvent(
  event: BillingEvent,
  ruleId: string | null,
  platform: string | null,
  result: 'success' | 'failed' | 'skipped',
  actionTaken?: string,
  errorMessage?: string
) {
  await db.insert(eventLogs).values({
    orgId: event.orgId,
    ruleId: ruleId || undefined,
    billingProvider: event.provider,
    eventType: event.eventType,
    eventId: event.eventId,
    rawPayload: event.rawPayload,
    actionTaken: actionTaken || null,
    actionResult: result,
    errorMessage: errorMessage || null,
    memberEmail: event.memberEmail,
    memberName: event.memberName || null,
  }).onConflictDoNothing() // idempotency — don't error on duplicate event IDs
}

// ─── HELPER: UPDATE MEMBER SYNC STATE ────────────────────────────────────────

async function updateMemberSync(
  event: BillingEvent,
  accessStatus: 'granted' | 'revoked' | 'grace_period',
  gracePeriodEndsAt?: Date
) {
  await db.insert(memberSync).values({
    orgId: event.orgId,
    email: event.memberEmail,
    memberName: event.memberName || null,
    billingCustomerId: event.billingCustomerId || null,
    subscriptionStatus: mapEventToStatus(event.eventType),
    accessStatus,
    gracePeriodEndsAt: gracePeriodEndsAt || null,
  })
  .onConflictDoUpdate({
    target: [memberSync.orgId, memberSync.email],
    set: {
      subscriptionStatus: mapEventToStatus(event.eventType),
      accessStatus,
      gracePeriodEndsAt: gracePeriodEndsAt || null,
      updatedAt: new Date(),
    }
  })
}

function mapEventToStatus(eventType: string): string {
  const map: Record<string, string> = {
    'subscription.created': 'active',
    'payment.success': 'active',
    'subscription.cancelled': 'cancelled',
    'payment.failed': 'past_due',
    'subscription.paused': 'paused',
  }
  return map[eventType] || 'unknown'
}

// ─── GRACE PERIOD CRON JOB ───────────────────────────────────────────────────
// Call this from /api/cron/grace-period every hour (set up in vercel.json)

export async function processExpiredGracePeriods(): Promise<void> {
  const { lt } = await import('drizzle-orm')
  const now = new Date()

  const expired = await db.query.memberSync.findMany({
    where: and(
      eq(memberSync.accessStatus, 'grace_period'),
      lt(memberSync.gracePeriodEndsAt, now)
    )
  })

  for (const member of expired) {
    console.log(`[Cron] Grace period expired for ${member.email}`)

    const rules = await db.query.automationRules.findMany({
      where: and(
        eq(automationRules.orgId, member.orgId),
        eq(automationRules.isActive, true)
      ),
      with: { communityConnection: true }
    })

    for (const rule of rules) {
      // FIX 6: Wrap each revoke independently — missing env vars won't stop other members
      try {
        const adapter = await getCommunityAdapter(rule.communityConnection)
        await adapter.revokeAccess(member.email)
        await db.update(memberSync)
          .set({ accessStatus: 'revoked', updatedAt: now })
          .where(eq(memberSync.id, member.id))
        console.log(`[Cron] ✅ Revoked access for ${member.email}`)
      } catch (err) {
        // Log and continue — don't let one failure block other members
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`[Cron] ❌ Failed to revoke ${member.email}: ${msg}`)
        // Skip if it's a config error (e.g. missing RESEND_API_KEY) rather than an API error
        if (msg.includes('RESEND') || msg.includes('environment') || msg.includes('env')) {
          console.warn(`[Cron] Skipping — looks like a missing env var, not a platform error`)
          continue
        }
      }
    }
  }
}
