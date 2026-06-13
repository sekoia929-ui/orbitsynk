import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { db, organizations, billingConnections, communityConnections } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { encrypt, decrypt } from '@/lib/encrypt'
import { getBillingValidator } from '@/lib/adapters/billing-validators'
import { CircleAdapter } from '@/lib/adapters/circle'

// ─── VALIDATION SCHEMAS ───────────────────────────────────────────────────────

const BillingConnectionSchema = z.object({
  type: z.literal('billing'),
  provider: z.enum(['lemon_squeezy', 'paddle']),
  apiKey: z.string().min(10, 'API key is too short'),
  webhookSecret: z.string().min(8, 'Webhook secret is too short'),
  storeId: z.string().optional(),
})

const CommunityConnectionSchema = z.object({
  type: z.literal('community'),
  platform: z.enum(['circle', 'skool', 'discord']),
  apiKey: z.string().min(10, 'API key is too short'),
  communityId: z.string().min(1, 'Community ID is required'),
  communityName: z.string().optional(),
})

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function getOrCreateOrg(clerkUserId: string) {
  let org = await db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, clerkUserId),
  })

  if (!org) {
    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress ?? ''
    const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'My Org'

    try {
      const [created] = await db.insert(organizations).values({
        clerkUserId,
        name,
        email,
      }).returning()
      org = created
    } catch {
      // Two concurrent requests both passed the findFirst check and raced to insert.
      // The second insert hits the clerkUserId UNIQUE constraint — re-fetch the row
      // that the first request already created.
      org = await db.query.organizations.findFirst({
        where: eq(organizations.clerkUserId, clerkUserId),
      })
      if (!org) throw new Error('Failed to create or retrieve organization')
    }
  }

  return org
}

// ─── GET — list all connections ───────────────────────────────────────────────

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, userId),
  })

  if (!org) {
    return NextResponse.json({ billingConnections: [], communityConnections: [] })
  }

  const [billing, community] = await Promise.all([
    db.query.billingConnections.findMany({
      where: eq(billingConnections.orgId, org.id),
    }),
    db.query.communityConnections.findMany({
      where: eq(communityConnections.orgId, org.id),
    }),
  ])

  // Mask API keys in responses
  const maskKey = (key: string) => {
    try {
      const decrypted = decrypt(key)
      return '••••••••' + decrypted.slice(-4)
    } catch {
      return '••••••••'
    }
  }

  return NextResponse.json({
    billingConnections: billing.map(c => ({ ...c, apiKey: maskKey(c.apiKey), webhookSecret: '••••••••' })),
    communityConnections: community.map(c => ({ ...c, apiKey: maskKey(c.apiKey) })),
  })
}

// ─── POST — create a new connection ──────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const org = await getOrCreateOrg(userId)

  if (body.type === 'billing') {
    // ── Validate input ─────────────────────────────────────────────────────────
    const parsed = BillingConnectionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    }
    const { provider, apiKey, webhookSecret, storeId } = parsed.data

    // ── Check for duplicate connection ─────────────────────────────────────────
    const existing = await db.query.billingConnections.findFirst({
      where: and(
        eq(billingConnections.orgId, org.id),
        eq(billingConnections.provider, provider)
      ),
    })
    if (existing) {
      return NextResponse.json(
        { error: `You already have a ${provider.replace('_', ' ')} connection. Remove it first to add a new one.` },
        { status: 409 }
      )
    }

    // ── Validate credentials with the real API ─────────────────────────────────
    try {
      const validator = getBillingValidator(provider, apiKey)
      const isValid = await validator.validateCredentials()
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid API key — could not authenticate with the billing provider. Please check your key and try again.' },
          { status: 400 }
        )
      }
    } catch (err) {
      console.error('[Connections] Credential validation error:', err)
      return NextResponse.json(
        { error: 'Could not validate API key. Check your internet connection and try again.' },
        { status: 400 }
      )
    }

    // ── Save (encrypt sensitive fields) ───────────────────────────────────────
    const [conn] = await db.insert(billingConnections).values({
      orgId: org.id,
      provider,
      apiKey: encrypt(apiKey),
      webhookSecret: encrypt(webhookSecret),
      storeId: storeId ?? null,
    }).returning()

    // Build the webhook URL for this org
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://orbitsynk.vercel.app'
    const webhookUrl = `${appUrl}/api/webhooks/${provider.replace('_', '-')}?org=${org.id}`

    return NextResponse.json({ success: true, connectionId: conn.id, webhookUrl })
  }

  if (body.type === 'community') {
    // ── Validate input ─────────────────────────────────────────────────────────
    const parsed = CommunityConnectionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    }
    const { platform, apiKey, communityId, communityName } = parsed.data

    // ── Check for duplicate connection ─────────────────────────────────────────
    const existing = await db.query.communityConnections.findFirst({
      where: and(
        eq(communityConnections.orgId, org.id),
        eq(communityConnections.platform, platform),
        eq(communityConnections.communityId, communityId)
      ),
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A connection for this community already exists.' },
        { status: 409 }
      )
    }

    // ── Validate credentials with the real API ─────────────────────────────────
    if (platform === 'circle') {
      try {
        const adapter = new CircleAdapter({ apiKey, communityId })
        const isValid = await adapter.validateCredentials()
        if (!isValid) {
          return NextResponse.json(
            { error: 'Invalid Circle API key or Community ID — could not authenticate. Please check your credentials.' },
            { status: 400 }
          )
        }
      } catch (err) {
        console.error('[Connections] Circle validation error:', err)
        return NextResponse.json(
          { error: 'Could not validate Circle credentials. Check your API key and Community ID.' },
          { status: 400 }
        )
      }
    } else if (platform === 'skool' || platform === 'discord') {
      return NextResponse.json(
        { error: `${platform.charAt(0).toUpperCase() + platform.slice(1)} integration is coming soon.` },
        { status: 400 }
      )
    }

    // ── Save ───────────────────────────────────────────────────────────────────
    const [conn] = await db.insert(communityConnections).values({
      orgId: org.id,
      platform,
      apiKey: encrypt(apiKey),
      communityId,
      communityName: communityName ?? null,
    }).returning()

    return NextResponse.json({ success: true, connectionId: conn.id })
  }

  return NextResponse.json({ error: 'Invalid connection type' }, { status: 400 })
}

// ─── DELETE — remove a connection ─────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, type } = await req.json()
  if (!id || !type) return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, userId),
  })
  if (!org) return NextResponse.json({ error: 'No org found' }, { status: 404 })

  if (type === 'billing') {
    await db.delete(billingConnections).where(
      and(eq(billingConnections.id, id), eq(billingConnections.orgId, org.id))
    )
  } else if (type === 'community') {
    await db.delete(communityConnections).where(
      and(eq(communityConnections.id, id), eq(communityConnections.orgId, org.id))
    )
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
