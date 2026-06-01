import { pgTable, uuid, text, boolean, integer, jsonb, timestamp, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── ORGANIZATIONS ────────────────────────────────────────────────────────────
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  plan: text('plan').notNull().default('starter'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── BILLING CONNECTIONS ──────────────────────────────────────────────────────
export const billingConnections = pgTable('billing_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  provider: text('provider').notNull(),
  apiKey: text('api_key').notNull(),
  webhookSecret: text('webhook_secret').notNull(),
  storeId: text('store_id'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── COMMUNITY CONNECTIONS ────────────────────────────────────────────────────
export const communityConnections = pgTable('community_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  platform: text('platform').notNull(),
  apiKey: text('api_key').notNull(),
  communityId: text('community_id').notNull(),
  communityName: text('community_name'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── AUTOMATION RULES ─────────────────────────────────────────────────────────
export const automationRules = pgTable('automation_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  billingConnectionId: uuid('billing_connection_id').notNull(),
  communityConnectionId: uuid('community_connection_id').notNull(),
  triggerEvent: text('trigger_event').notNull(),
  triggerProductId: text('trigger_product_id'),
  actionType: text('action_type').notNull(),
  gracePeriodDays: integer('grace_period_days').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── EVENT LOGS ───────────────────────────────────────────────────────────────
export const eventLogs = pgTable('event_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull(),
  ruleId: uuid('rule_id'),
  billingProvider: text('billing_provider').notNull(),
  eventType: text('event_type').notNull(),
  eventId: text('event_id').notNull().unique(),
  rawPayload: jsonb('raw_payload').notNull(),
  actionTaken: text('action_taken'),
  actionResult: text('action_result'),
  errorMessage: text('error_message'),
  memberEmail: text('member_email'),
  memberName: text('member_name'),
  processedAt: timestamp('processed_at').defaultNow().notNull(),
})

// ─── MEMBER SYNC STATE ────────────────────────────────────────────────────────
export const memberSync = pgTable('member_sync', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  email: text('email').notNull(),
  memberName: text('member_name'),
  billingCustomerId: text('billing_customer_id'),
  subscriptionStatus: text('subscription_status'),
  accessStatus: text('access_status'),
  gracePeriodEndsAt: timestamp('grace_period_ends_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  uniqueOrgEmail: unique().on(table.orgId, table.email),
}))

// ─── WAITLIST ─────────────────────────────────────────────────────────────────
export const waitlist = pgTable('waitlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  source: text('source').default('landing'),  // landing | hero | cta
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── RELATIONS (required for Drizzle `with` queries) ──────────────────────────

export const organizationsRelations = relations(organizations, ({ many }) => ({
  billingConnections: many(billingConnections),
  communityConnections: many(communityConnections),
  automationRules: many(automationRules),
  eventLogs: many(eventLogs),
  memberSync: many(memberSync),
}))

export const billingConnectionsRelations = relations(billingConnections, ({ one }) => ({
  org: one(organizations, {
    fields: [billingConnections.orgId],
    references: [organizations.id],
  }),
}))

export const communityConnectionsRelations = relations(communityConnections, ({ one }) => ({
  org: one(organizations, {
    fields: [communityConnections.orgId],
    references: [organizations.id],
  }),
}))

export const automationRulesRelations = relations(automationRules, ({ one }) => ({
  org: one(organizations, {
    fields: [automationRules.orgId],
    references: [organizations.id],
  }),
  billingConnection: one(billingConnections, {
    fields: [automationRules.billingConnectionId],
    references: [billingConnections.id],
  }),
  communityConnection: one(communityConnections, {
    fields: [automationRules.communityConnectionId],
    references: [communityConnections.id],
  }),
}))

export const eventLogsRelations = relations(eventLogs, ({ one }) => ({
  org: one(organizations, {
    fields: [eventLogs.orgId],
    references: [organizations.id],
  }),
  rule: one(automationRules, {
    fields: [eventLogs.ruleId],
    references: [automationRules.id],
  }),
}))

export const memberSyncRelations = relations(memberSync, ({ one }) => ({
  org: one(organizations, {
    fields: [memberSync.orgId],
    references: [organizations.id],
  }),
}))

// ─── TYPES ────────────────────────────────────────────────────────────────────
export type Organization = typeof organizations.$inferSelect
export type BillingConnection = typeof billingConnections.$inferSelect
export type CommunityConnection = typeof communityConnections.$inferSelect
export type AutomationRule = typeof automationRules.$inferSelect
export type EventLog = typeof eventLogs.$inferSelect
export type MemberSync = typeof memberSync.$inferSelect
export type WaitlistEntry = typeof waitlist.$inferSelect
