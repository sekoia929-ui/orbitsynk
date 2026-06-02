import { NextRequest, NextResponse } from 'next/server'
import { db, waitlist } from '@/lib/db'
import { eq, count } from 'drizzle-orm'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Insert (ignore duplicate)
    await db.insert(waitlist).values({
      email: email.toLowerCase().trim(),
      source: source || 'landing',
    }).onConflictDoNothing()

    // Get total count for social proof
    const [{ total }] = await db.select({ total: count() }).from(waitlist)

    // Send confirmation email (non-blocking — don't fail the request if email fails)
    try {
      const resendKey = process.env.RESEND_API_KEY
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'OrbitSynk <noreply@orbitsynk.com>'
      
      if (resendKey) {
        const resend = new Resend(resendKey)
        await resend.emails.send({
          from: fromEmail,
          to: email.toLowerCase().trim(),
          subject: "🎉 You're on the OrbitSynk waitlist!",
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#080808;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;">
        Orbit<span style="color:#a855f7;">Synk</span>
      </h1>
    </div>

    <!-- Main Card -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border:1px solid rgba(168,85,247,0.2);border-radius:16px;padding:40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">🚀</div>
      <h2 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 12px 0;">
        You're on the list!
      </h2>
      <p style="color:#a0a0b0;font-size:16px;line-height:1.6;margin:0 0 24px 0;">
        Thanks for joining the OrbitSynk waitlist. We're building the sync layer between your payments and communities — and you'll be among the first to try it.
      </p>
      <div style="background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.2);border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="color:#c084fc;font-size:14px;font-weight:600;margin:0;">
          🎯 You're #${Number(total)} on the waitlist
        </p>
      </div>
      <p style="color:#707080;font-size:14px;line-height:1.5;margin:0;">
        We'll notify you as soon as early access opens. In the meantime, stay tuned for updates!
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;">
      <p style="color:#505060;font-size:12px;margin:0;">
        © ${new Date().getFullYear()} OrbitSynk · The sync layer between payments and communities
      </p>
    </div>
  </div>
</body>
</html>
          `.trim(),
        })
      }
    } catch (emailError) {
      // Log but don't fail the request if email sending fails
      console.error('[Waitlist] Email send error (non-critical):', emailError)
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list!",
      totalSignups: Number(total),
    })
  } catch (error) {
    console.error('[Waitlist] Error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// GET — return total waitlist count (for social proof on landing page)
export async function GET() {
  try {
    const [{ total }] = await db.select({ total: count() }).from(waitlist)
    return NextResponse.json({ total: Number(total) })
  } catch {
    return NextResponse.json({ total: 0 })
  }
}
