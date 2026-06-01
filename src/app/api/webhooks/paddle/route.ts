import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db, billingConnections } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { decrypt } from '@/lib/encrypt'
import { processEvent, BillingEventType } from '@/lib/rules-engine'

const EVENT_MAP: Record<string, string> = {
  'subscription.created':       'subscription.created',
  'subscription.updated':       'subscription.updated',
  'subscription.cancelled':     'subscription.cancelled',
  'subscription.paused':        'subscription.cancelled',
  'subscription.resumed':       'subscription.created',
  'transaction.completed':      'payment.success',
  'transaction.payment_failed': 'payment.failed',
  'transaction.updated':        'subscription.updated',
}

export async function POST(req: NextRequest) {
  // ─── 1. Read body ─────────────────────────────────────────────────────────
  let body: string
  try {
    body = await req.text()
  } catch {
    return NextResponse.json({ error: 'Failed to read body' }, { status: 400 })
  }

  // ─── 2. Identify org from query param ─────────────────────────────────────
  const orgId = req.nextUrl.searchParams.get('org')
  if (!orgId) {
    return NextResponse.json({ error: 'Missing org parameter' }, { status: 400 })
  }

  // Find connection scoped to this org
  const connection = await db.query.billingConnections.findFirst({
    where: and(
      eq(billingConnections.provider, 'paddle'),
      eq(billingConnections.orgId, orgId)
    ),
  })

  if (!connection) {
    return NextResponse.json({ error: 'No Paddle connection found' }, { status: 404 })
  }

  // ─── 3. Verify Paddle signature (safe against malformed header) ────────────
  // Paddle format: "ts=1234567890;h1=abcdef..."
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

    const webhookSecret  = decrypt(connection.webhookSecret)
    const signedPayload  = `${ts}:${body}`
    const digest         = crypto.createHmac('sha256', webhookSecret).update(signedPayload).digest('hex')

    const digestBuf = Buffer.from(digest, 'hex')
    const sigBuf    = Buffer.from(h1,     'hex')
    if (digestBuf.length === sigBuf.length) {
      isValidSignature = crypto.timingSafeEqual(digestBuf, sigBuf)
    }
  } catch (err) {
    console.error('[Paddle] Signature verification error:', err)
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 })
  }

  if (!isValidSignature) {
    console.error('[Paddle] Invalid signature for org:', orgId)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // ─── 4. Parse event ───────────────────────────────────────────────────────
  let payload: any
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const paddleEventType    = payload.event_type
  const internalEventType  = EVENT_MAP[paddleEventType]
  if (!internalEventType) {
    return NextResponse.json({ received: true })
  }

  const data          = payload.data || {}
  const customerEmail = data.customer?.email || data.address?.email || ''
  if (!customerEmail) {
    return NextResponse.json({ received: true })
  }

  // FIX 1: Use Paddle's stable notification_id as event ID
  const eventId = `paddle_${payload.notification_id || data.id || Date.now()}`

  // ─── 5. Process — return 500 on failure so Paddle retries ─────────────────
  try {
    await processEvent({
      provider: 'paddle',
      eventId,
      eventType:           internalEventType as BillingEventType,
      memberEmail:         customerEmail,
      memberName:          data.customer?.name,
      billingCustomerId:   String(data.customer_id || data.customer?.id || ''),
      productId:           String(data.items?.[0]?.price?.product_id || ''),
      orgId:               connection.orgId,
      billingConnectionId: connection.id,
      rawPayload:          payload,
    })
  } catch (error) {
    console.error('[Paddle] Rules engine error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
