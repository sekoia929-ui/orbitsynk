import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db, billingConnections } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { decrypt } from '@/lib/encrypt'
import { processEvent, type BillingEvent, type BillingEventType } from '@/lib/rules-engine'

const EVENT_MAP: Record<string, BillingEventType> = {
  'subscription.created':       'subscription.created',
  'subscription.updated':       'subscription.updated',
  'subscription.cancelled':     'subscription.cancelled',
  'subscription.paused':        'subscription.cancelled',
  'subscription.resumed':       'subscription.resumed',
  'transaction.completed':      'payment.success',
  'transaction.payment_failed': 'payment.failed',
  'transaction.updated':        'subscription.updated',
}

export async function POST(req: NextRequest) {
  const body = await req.text()

  const orgId = req.nextUrl.searchParams.get('org')
  if (!orgId) {
    return NextResponse.json({ error: 'Missing org parameter' }, { status: 400 })
  }

  const connection = await db.query.billingConnections.findFirst({
    where: and(
      eq(billingConnections.provider, 'paddle'),
      eq(billingConnections.orgId, orgId),
      eq(billingConnections.isActive, true)
    ),
  })

  if (!connection) {
    return NextResponse.json({ error: 'No Paddle connection found' }, { status: 404 })
  }

  // ─── Verify Paddle signature (format: "ts=1234567890;h1=abcdef...") ─────────
  const rawSignature = req.headers.get('Paddle-Signature') ?? ''
  if (!rawSignature) {
    return NextResponse.json({ error: 'Missing Paddle-Signature header' }, { status: 401 })
  }

  let isValidSignature = false
  try {
    const parts = Object.fromEntries(
      rawSignature.split(';')
        .map(p => p.split('=') as [string, string])
        .filter(([k]) => k === 'ts' || k === 'h1')
    )
    const ts = parts['ts']
    const h1 = parts['h1']

    if (!ts || !h1) throw new Error('Malformed Paddle-Signature header')

    // ─── Timestamp freshness check — reject replays older than 5 minutes ───────
    const tsSeconds = parseInt(ts, 10)
    const nowSeconds = Math.floor(Date.now() / 1000)
    if (Math.abs(nowSeconds - tsSeconds) > 300) {
      console.warn('[Paddle] Webhook timestamp too old — possible replay attack')
      return NextResponse.json({ error: 'Webhook timestamp expired' }, { status: 401 })
    }

    const webhookSecret = decrypt(connection.webhookSecret)
    const signedPayload = `${ts}:${body}`
    const digest = crypto.createHmac('sha256', webhookSecret).update(signedPayload).digest('hex')

    isValidSignature = crypto.timingSafeEqual(
      Buffer.from(digest, 'utf8'),
      Buffer.from(h1, 'utf8')
    )
  } catch (err) {
    console.error('[Paddle] Signature verification error:', err)
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 })
  }

  if (!isValidSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // ─── Parse event ─────────────────────────────────────────────────────────────
  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const paddleEventType = payload.event_type as string
  const eventType = EVENT_MAP[paddleEventType]
  if (!eventType) {
    return NextResponse.json({ received: true, skipped: true })
  }

  const data = (payload.data ?? {}) as Record<string, unknown>
  const customer = (data.customer ?? {}) as Record<string, unknown>
  const customerEmail = (customer.email as string ?? '').toLowerCase().trim()

  if (!customerEmail) {
    console.warn('[Paddle] No customer email in payload')
    return NextResponse.json({ received: true })
  }

  const eventId = `paddle_${payload.notification_id ?? data.id ?? Date.now()}`
  const items = data.items as Array<Record<string, unknown>> | undefined
  const productId = (items?.[0]?.price as Record<string, unknown>)?.product_id as string | undefined
  const subscriptionStatus = (data.status as string) ?? undefined

  const event: BillingEvent = {
    orgId,
    billingProvider: 'paddle',
    billingConnectionId: connection.id,
    eventType,
    eventId,
    memberEmail: customerEmail,
    memberName: customer.name as string | undefined,
    productId,
    subscriptionStatus,
    rawPayload: payload,
  }

  try {
    await processEvent(event)
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[Paddle] Rules engine error:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
