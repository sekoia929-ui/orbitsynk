import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db, billingConnections } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { decrypt } from '@/lib/encrypt'
import { processEvent, BillingEventType } from '@/lib/rules-engine'

const EVENT_MAP: Record<string, string> = {
  'subscription_created':           'subscription.created',
  'subscription_updated':           'subscription.updated',
  'subscription_cancelled':         'subscription.cancelled',
  'subscription_resumed':           'subscription.created',
  'subscription_expired':           'subscription.cancelled',
  'subscription_paused':            'subscription.cancelled',
  'subscription_unpaused':          'subscription.created',
  'subscription_payment_success':   'payment.success',
  'subscription_payment_failed':    'payment.failed',
  'subscription_payment_recovered': 'payment.success',
  'order_created':                  'payment.success',
  'order_refunded':                 'subscription.cancelled',
}

export async function POST(req: NextRequest) {
  // ─── 1. Read raw body before anything else ────────────────────────────────
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

  // Find the billing connection scoped to this org
  const connection = await db.query.billingConnections.findFirst({
    where: and(
      eq(billingConnections.provider, 'lemon_squeezy'),
      eq(billingConnections.orgId, orgId)
    ),
  })

  if (!connection) {
    return NextResponse.json({ error: 'No billing connection found' }, { status: 404 })
  }

  // ─── 3. Verify webhook signature (safe against malformed values) ───────────
  const rawSignature = req.headers.get('X-Signature') ?? ''
  if (!rawSignature) {
    return NextResponse.json({ error: 'Missing X-Signature header' }, { status: 401 })
  }

  let isValidSignature = false
  try {
    const webhookSecret = decrypt(connection.webhookSecret)
    const digest = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex')
    // Both buffers must be the same length for timingSafeEqual
    const digestBuf = Buffer.from(digest, 'hex')
    const sigBuf    = Buffer.from(rawSignature, 'hex')
    if (digestBuf.length === sigBuf.length) {
      isValidSignature = crypto.timingSafeEqual(digestBuf, sigBuf)
    }
  } catch {
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 })
  }

  if (!isValidSignature) {
    console.error('[LemonSqueezy] Invalid signature for org:', orgId)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // ─── 4. Parse event ───────────────────────────────────────────────────────
  let payload: any
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const lsEventName = payload.meta?.event_name
  if (!lsEventName) {
    return NextResponse.json({ error: 'Missing event name' }, { status: 400 })
  }

  const internalEventType = EVENT_MAP[lsEventName]
  if (!internalEventType) {
    console.log(`[LemonSqueezy] Ignoring unknown event: ${lsEventName}`)
    return NextResponse.json({ received: true })
  }

  const attributes   = payload.data?.attributes || {}
  const memberEmail  =
    attributes.user_email     ||
    attributes.customer_email ||
    payload.meta?.custom_data?.email ||
    ''

  if (!memberEmail) {
    console.warn('[LemonSqueezy] No email found in payload — skipping')
    return NextResponse.json({ received: true })
  }

  // ─── FIX 1: Safer event ID using the provider's own stable event ID ───────
  // Prefer the webhook notification ID > data ID > fallback composite
  const providerEventId =
    payload.meta?.webhook_id   ||   // stable notification ID (LS v2)
    payload.data?.id           ||   // resource ID
    `${lsEventName}_${Date.now()}`  // absolute fallback

  const eventId = `ls_${providerEventId}`

  // ─── 5. Process through rules engine ──────────────────────────────────────
  // FIX 2: Return 500 on failure so Lemon Squeezy retries the webhook
  try {
    await processEvent({
      provider: 'lemon_squeezy',
      eventId,
      eventType: internalEventType as BillingEventType,
      memberEmail,
      memberName:        attributes.user_name || attributes.customer_name,
      billingCustomerId: String(attributes.customer_id || ''),
      productId:         String(attributes.product_id || attributes.variant_id || ''),
      orgId:             connection.orgId,
      billingConnectionId: connection.id,
      rawPayload:        payload,
    })
  } catch (error) {
    console.error('[LemonSqueezy] Rules engine error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
