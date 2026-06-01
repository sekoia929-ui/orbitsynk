import { NextResponse } from 'next/server'
import { processExpiredGracePeriods } from '@/lib/rules-engine'

// This runs every hour via Vercel Cron
// Set up in vercel.json below
export async function GET(req: Request) {
  // Verify it's called by Vercel cron (not a random request)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await processExpiredGracePeriods()
    return NextResponse.json({ success: true, ran: new Date().toISOString() })
  } catch (error) {
    console.error('[Cron] Grace period job failed:', error)
    return NextResponse.json({ error: 'Job failed' }, { status: 500 })
  }
}
