import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db, billingConnections, communityConnections, organizations } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { encrypt } from '@/lib/encrypt'
import { z } from 'zod'

const BillingSchema = z.object({
  provider: z.enum(['lemon_squeezy', 'paddle']),
  apiKey: z.string().min(1),
  webhookSecret: z.string().min(1),
  storeId: z.string().optional(),
})

const CommunitySchema = z.object({
  platform: z.enum(['circle', 'skool']),
  apiKey: z.string().min(1),
  communityId: z.string().min(1),
  communityName: z.string().optional(),
})

// GET — fetch all connections for current org
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, userId),
  })
  if (!org) return NextResponse.json({ billing: [], community: [] })

  const [billing, community] = await Promise.all([
    db.query.billingConnections.findMany({
      where: eq(billingConnections.orgId, org.id),
    }),
    db.query.communityConnections.findMany({
      where: eq(communityConnections.orgId, org.id),
    }),
  ])

  // Don't return encrypted keys
  return NextResponse.json({
    billing: billing.map(c => ({ ...c, apiKey: '••••••••', webhookSecret: '••••••••' })),
    community: community.map(c => ({ ...c, apiKey: '••••••••' })),
  })
}

// POST — add a new connection
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get or create org
  let org = await db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, userId),
  })

  if (!org) {
    const [newOrg] = await db.insert(organizations).values({
      clerkUserId: userId,
      name: 'My Organization',
      email: '',
    }).returning()
    org = newOrg
  }

  const body = await req.json()
  const type = body.type // 'billing' | 'community'

  if (type === 'billing') {
    const parsed = BillingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const [connection] = await db.insert(billingConnections).values({
      orgId: org.id,
      provider: parsed.data.provider,
      apiKey: encrypt(parsed.data.apiKey),
      webhookSecret: encrypt(parsed.data.webhookSecret),
      storeId: parsed.data.storeId,
    }).returning()

    return NextResponse.json({
      ...connection,
      apiKey: '••••••••',
      webhookSecret: '••••••••',
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/${parsed.data.provider.replace('_', '-')}?org=${org.id}`,
    })
  }

  if (type === 'community') {
    const parsed = CommunitySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const [connection] = await db.insert(communityConnections).values({
      orgId: org.id,
      platform: parsed.data.platform,
      apiKey: encrypt(parsed.data.apiKey),
      communityId: parsed.data.communityId,
      communityName: parsed.data.communityName,
    }).returning()

    return NextResponse.json({ ...connection, apiKey: '••••••••' })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

// DELETE — remove a connection (scoped to authenticated org)
export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, userId),
  })
  if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

  const { id, type } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  if (type === 'billing') {
    await db.delete(billingConnections).where(
      and(eq(billingConnections.id, id), eq(billingConnections.orgId, org.id))
    )
  } else {
    await db.delete(communityConnections).where(
      and(eq(communityConnections.id, id), eq(communityConnections.orgId, org.id))
    )
  }

  return NextResponse.json({ success: true })
}
