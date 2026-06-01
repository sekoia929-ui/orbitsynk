import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Lazy connection — only connects when a query is actually made,
// NOT during `next build` when DATABASE_URL isn't available
function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  const sql = neon(url)
  return drizzle(sql, { schema })
}

// Proxy that creates the connection on first use
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_target, prop) {
    const realDb = getDb()
    return (realDb as any)[prop]
  },
})

export * from './schema'
