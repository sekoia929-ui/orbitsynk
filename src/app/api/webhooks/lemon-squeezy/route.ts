import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db, billingConnections } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { decrypt } from '@/lib/encrypt'
import { processEvent, type BillingEvent, type BillingEventType } from '@/lib/rules-engine'

// ─── LEMON SQUEEZY WEBHOOK HANDLER ───────────────────────────────────────────
// Verifies HMAC-SHA256 signature then passes to rules engine

// Map Lemon Squeezy event names → internal event types
const EVENT_MAP: Record<string, BillingEventType> = {
  subscription_created:           'subscription.created',
  subscription_updated:           'subscription.updated',
  subscription_cancelled:         'subscription.cancelled',
  subscription_resumed:           'subscription.resumed',
  subscription_expired:           'subscription.expired',
  subscription_paused:            'subscription.paused',
  subscription_unpaused:          'subscription.resumed',
  subscription_payment_success:   'payment.success',
  subscription_payment_failed:    'payment.failed',
  subscription_payment_recovered: 'payment.success',
  order_created:                  'subscription.created',
  order_refunded:                 'subscription.cancelled',
}

export async function POST(req: NextRequest) {
  // Read raw body BEFORE parsing JSON — required for HMAC verification
  const rawBody = await req.text()

  const orgId = req.nextUrl.searchParams.get('org')
  if (!orgId) {
    return NextResponse.json({ error: 'Missing org parameter' }, { status: 400 })
  }

  // ─── Signature verification ─────────────────────────────────────────────────
  const rawSignature = req.headers.get('x-signature')
  if (!rawSignature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
  }

  // Find the billing connection to get the webhook secret
  const connection = await db.query.billingConnections.findFirst({
    where: and(
      eq(billingConnections.orgId, orgId),
      eq(billingConnections.provider, 'lemon_squeezy'),
      eq(billingConnections.isActive, true)
    ),
  })

  if (!connection) {
    return NextResponse.json({ error: 'No active Lemon Squeezy connection found' }, { status: 404 })
  }

  let webhookSecret: string
  try {
    webhookSecret = decrypt(connection.webhookSecret)
  } catch {
    console.error('[LemonSqueezy] Failed to decrypt webhook secret')
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  // Compute expected HMAC-SHA256 signature
  const digest = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  // Compare using UTF-8 buffers (per Lemon Squeezy docs) — prevents timing attacks
  let signaturesMatch = false
  try {
    signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(digest, 'utf8'),
      Buffer.from(rawSignature, 'utf8')
    )
  } catch {
    // timingSafeEqual throws if buffers have different lengths
    signaturesMatch = false
  }

  if (!signaturesMatch) {
    console.warn('[LemonSqueezy] Invalid webhook signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // ─── Parse payload ──────────────────────────────────────────────────────────
  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const meta = payload.meta as Record<string, unknown> | undefined
  const data = payload.data as Record<string, unknown> | undefined
  const attrs = data?.attributes as Record<string, unknown> | undefined

  const lsEventName = meta?.event_name as string | undefined
  if (!lsEventName) {
    return NextResponse.json({ error: 'Missing event_name in meta' }, { status: 400 })
  }

  const eventType = EVENT_MAP[lsEventName]
  if (!eventType) {
    console.log(`[LemonSqueezy] Unrecognised event: ${lsEventName} — ignoring`)
    return NextResponse.json({ received: true, skipped: true })
  }

  // ─── Extract member email ───────────────────────────────────────────────────
  const customData = attrs?.custom_data as Record<string, unknown> | undefined
  const memberEmail = (
    attrs?.user_email as string ||
    attrs?.customer_email as string ||
    customData?.email as string ||
    ''
  ).toLowerCase().trim()

  if (!memberEmail) {
    console.warn(`[LemonSqueezy] No email found in event ${lsEventName}`)
    return NextResponse.json({ error: 'No member email in payload' }, { status: 422 })
  }

  // ─── Build stable event ID ──────────────────────────────────────────────────
  const webhookId = meta?.webhook_id as string | undefined
  const eventId = webhookId
    ?? `${orgId}:${lsEventName}:${data?.id ?? Date.now()}`

  // ─── Extract product/subscription info ──────────────────────────────────────
  const productId = (attrs?.first_subscription_item as Record<string, unknown>)?.product_id as string | undefined
    ?? attrs?.product_id as string | undefined
  const subscriptionStatus = attrs?.status as string | undefined
  const memberName = attrs?.user_name as string | undefined
    ?? attrs?.customer_name as string | undefined

  // ─── Process via rules engine ───────────────────────────────────────────────
  const event: BillingEvent = {
    orgId,
    billingProvider: 'lemon_squeezy',
    billingConnectionId: connection.id,
    eventType,
    eventId,
    memberEmail,
    memberName,
    productId,
    subscriptionStatus,
    rawPayload: payload,
  }

  try {
    await processEvent(event)
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[LemonSqueezy] Rules engine error:', err)
    // Return 500 so Lemon Squeezy retries the webhook
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
