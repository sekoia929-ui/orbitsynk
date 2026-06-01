import { NextRequest, NextResponse } from 'next/server'
import { db, waitlist } from '@/lib/db'
import { eq, count } from 'drizzle-orm'

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
