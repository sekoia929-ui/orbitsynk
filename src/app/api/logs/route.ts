import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db, eventLogs, organizations, memberSync } from '@/lib/db'
import { eq, desc, count, and, gte } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, userId),
  })
  if (!org) return NextResponse.json({ logs: [], total: 0 })

  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = 50
  const offset = (page - 1) * limit

  const [logs, total] = await Promise.all([
    db.query.eventLogs.findMany({
      where: eq(eventLogs.orgId, org.id),
      orderBy: [desc(eventLogs.processedAt)],
      limit,
      offset,
    }),
    db.select({ count: count() })
      .from(eventLogs)
      .where(eq(eventLogs.orgId, org.id))
      .then(r => r[0].count),
  ])

  return NextResponse.json({ logs, total, page, limit })
}
