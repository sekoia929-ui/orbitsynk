import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db, automationRules, organizations, billingConnections, communityConnections } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const RuleSchema = z.object({
  name: z.string().min(1),
  billingConnectionId: z.string().uuid(),
  communityConnectionId: z.string().uuid(),
  triggerEvent: z.enum([
    'subscription.created',
    'subscription.cancelled',
    'subscription.updated',
    'payment.success',
    'payment.failed',
  ]),
  actionType: z.enum(['grant_access', 'revoke_access', 'sync_access']),
  gracePeriodDays: z.number().int().min(0).max(30).default(0),
  triggerProductId: z.string().optional(),
})

async function getOrg(userId: string) {
  return db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, userId),
  })
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await getOrg(userId)
  if (!org) return NextResponse.json([])

  const rules = await db.query.automationRules.findMany({
    where: eq(automationRules.orgId, org.id),
    with: {
      billingConnection: true,
      communityConnection: true,
    },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  })

  return NextResponse.json(rules)
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await getOrg(userId)
  if (!org) return NextResponse.json({ error: 'No organization found' }, { status: 404 })

  const body = await req.json()
  const parsed = RuleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Validate that the connections belong to this org
  const { billingConnectionId, communityConnectionId } = parsed.data
  const [billingConn, communityConn] = await Promise.all([
    db.query.billingConnections.findFirst({
      where: and(eq(billingConnections.id, billingConnectionId), eq(billingConnections.orgId, org.id))
    }),
    db.query.communityConnections.findFirst({
      where: and(eq(communityConnections.id, communityConnectionId), eq(communityConnections.orgId, org.id))
    }),
  ])
  if (!billingConn) return NextResponse.json({ error: 'Billing connection not found' }, { status: 404 })
  if (!communityConn) return NextResponse.json({ error: 'Community connection not found' }, { status: 404 })

  const [rule] = await db.insert(automationRules).values({
    orgId: org.id,
    ...parsed.data,
  }).returning()

  return NextResponse.json(rule)
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await getOrg(userId)
  if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  const body = await req.json()
  const { id, isActive, name, triggerEvent, actionType, gracePeriodDays, triggerProductId } = body
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  // Build update object from only provided fields
  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (isActive !== undefined) updates.isActive = isActive
  if (name !== undefined) updates.name = name
  if (triggerEvent !== undefined) updates.triggerEvent = triggerEvent
  if (actionType !== undefined) updates.actionType = actionType
  if (gracePeriodDays !== undefined) updates.gracePeriodDays = gracePeriodDays
  if (triggerProductId !== undefined) updates.triggerProductId = triggerProductId

  await db.update(automationRules)
    .set(updates)
    .where(and(eq(automationRules.id, id), eq(automationRules.orgId, org.id)))

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await getOrg(userId)
  if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await db.delete(automationRules).where(
    and(eq(automationRules.id, id), eq(automationRules.orgId, org.id))
  )

  return NextResponse.json({ success: true })
}
