const { neon } = require('@neondatabase/serverless');

const sql = neon('postgresql://neondb_owner:npg_cFe13klHdPuz@ep-restless-butterfly-ap4frunx.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require');

async function migrate() {
  console.log('Creating tables...');
  
  // Drop existing tables if any (clean slate)
  await sql`DROP TABLE IF EXISTS automation_rules CASCADE`;
  await sql`DROP TABLE IF EXISTS billing_connections CASCADE`;
  await sql`DROP TABLE IF EXISTS community_connections CASCADE`;
  await sql`DROP TABLE IF EXISTS event_logs CASCADE`;
  await sql`DROP TABLE IF EXISTS member_sync CASCADE`;
  await sql`DROP TABLE IF EXISTS organizations CASCADE`;
  await sql`DROP TABLE IF EXISTS waitlist CASCADE`;
  console.log('Dropped old tables (if any)');

  // Create organizations first (referenced by others)
  await sql`CREATE TABLE "organizations" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "clerk_user_id" text NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "plan" text DEFAULT 'starter' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "organizations_clerk_user_id_unique" UNIQUE("clerk_user_id")
  )`;
  console.log('✓ organizations');

  await sql`CREATE TABLE "billing_connections" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "provider" text NOT NULL,
    "api_key" text NOT NULL,
    "webhook_secret" text NOT NULL,
    "store_id" text,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  console.log('✓ billing_connections');

  await sql`CREATE TABLE "community_connections" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "platform" text NOT NULL,
    "api_key" text NOT NULL,
    "community_id" text NOT NULL,
    "community_name" text,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  console.log('✓ community_connections');

  await sql`CREATE TABLE "automation_rules" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "name" text NOT NULL,
    "billing_connection_id" uuid NOT NULL,
    "community_connection_id" uuid NOT NULL,
    "trigger_event" text NOT NULL,
    "trigger_product_id" text,
    "action_type" text NOT NULL,
    "grace_period_days" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
  )`;
  console.log('✓ automation_rules');

  await sql`CREATE TABLE "event_logs" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "org_id" uuid NOT NULL,
    "rule_id" uuid,
    "billing_provider" text NOT NULL,
    "event_type" text NOT NULL,
    "event_id" text NOT NULL,
    "raw_payload" jsonb NOT NULL,
    "action_taken" text,
    "action_result" text,
    "error_message" text,
    "member_email" text,
    "member_name" text,
    "processed_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "event_logs_event_id_unique" UNIQUE("event_id")
  )`;
  console.log('✓ event_logs');

  await sql`CREATE TABLE "member_sync" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "org_id" uuid NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "email" text NOT NULL,
    "member_name" text,
    "billing_customer_id" text,
    "subscription_status" text,
    "access_status" text,
    "grace_period_ends_at" timestamp,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "member_sync_org_id_email_unique" UNIQUE("org_id","email")
  )`;
  console.log('✓ member_sync');

  await sql`CREATE TABLE "waitlist" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "email" text NOT NULL,
    "source" text DEFAULT 'landing',
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "waitlist_email_unique" UNIQUE("email")
  )`;
  console.log('✓ waitlist');

  console.log('\n🎉 All 7 tables created successfully!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
