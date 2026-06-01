import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db, memberSync, organizations } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.clerkUserId, userId),
  })
  if (!org) return NextResponse.json([])

  const members = await db.query.memberSync.findMany({
    where: eq(memberSync.orgId, org.id),
    orderBy: [desc(memberSync.updatedAt)],
    limit: 500,
  })

  return NextResponse.json(members)
}
