import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db, automationRules, organizations } from '@/lib/db'
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
  actionType: z.enum(['grant_access', 'revoke_access']),
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

  const { id, isActive } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await db.update(automationRules)
    .set({ isActive })
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
