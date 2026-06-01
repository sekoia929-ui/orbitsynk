import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db, eventLogs, organizations, memberSync, automationRules } from '@/lib/db'
import { eq, desc, count, and, gte, sql } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, userId),
  })
  if (!org) return NextResponse.json({
    totalMembers: 0, activeRules: 0, totalEvents: 0,
    successRate: 0, recentLogs: [],
  })

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [totalMembers, activeRules, totalEvents, successEvents, recentLogs] = await Promise.all([
    db.select({ count: count() }).from(memberSync)
      .where(and(eq(memberSync.orgId, org.id), eq(memberSync.accessStatus, 'granted')))
      .then(r => r[0].count),

    db.select({ count: count() }).from(automationRules)
      .where(and(eq(automationRules.orgId, org.id), eq(automationRules.isActive, true)))
      .then(r => r[0].count),

    db.select({ count: count() }).from(eventLogs)
      .where(eq(eventLogs.orgId, org.id))
      .then(r => r[0].count),

    db.select({ count: count() }).from(eventLogs)
      .where(and(eq(eventLogs.orgId, org.id), eq(eventLogs.actionResult, 'success')))
      .then(r => r[0].count),

    db.query.eventLogs.findMany({
      where: eq(eventLogs.orgId, org.id),
      orderBy: [desc(eventLogs.processedAt)],
      limit: 10,
    }),
  ])

  const successRate = totalEvents > 0
    ? Math.round((Number(successEvents) / Number(totalEvents)) * 100)
    : 100

  return NextResponse.json({
    totalMembers: Number(totalMembers),
    activeRules: Number(activeRules),
    totalEvents: Number(totalEvents),
    successRate,
    recentLogs,
  })
}
