// Migration v2 — adds indexes, missing FKs, new columns
// Safe to run multiple times (uses IF NOT EXISTS / IF EXISTS guards)
const { neon } = require('@neondatabase/serverless')

const sql = neon('postgresql://neondb_owner:npg_cFe13klHdPuz@ep-restless-butterfly-ap4frunx.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require')

async function migrate() {
  console.log('Running migration v2...\n')

  // ── Add new columns ──────────────────────────────────────────────────────────
  await sql`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL`
  console.log('✓ organizations.updated_at')

  await sql`ALTER TABLE automation_rules ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL`
  console.log('✓ automation_rules.updated_at')

  await sql`ALTER TABLE member_sync ADD COLUMN IF NOT EXISTS rule_id UUID REFERENCES automation_rules(id) ON DELETE SET NULL`
  console.log('✓ member_sync.rule_id')

  // ── Add missing foreign keys (safe — check if they exist first) ───────────────
  // eventLogs.org_id FK
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'event_logs_org_id_organizations_id_fk'
      ) THEN
        ALTER TABLE event_logs ADD CONSTRAINT event_logs_org_id_organizations_id_fk
          FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `
  console.log('✓ event_logs.org_id FK')

  // automation_rules billing/community connection FKs
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'automation_rules_billing_connection_id_fk'
      ) THEN
        ALTER TABLE automation_rules ADD CONSTRAINT automation_rules_billing_connection_id_fk
          FOREIGN KEY (billing_connection_id) REFERENCES billing_connections(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `
  console.log('✓ automation_rules.billing_connection_id FK')

  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'automation_rules_community_connection_id_fk'
      ) THEN
        ALTER TABLE automation_rules ADD CONSTRAINT automation_rules_community_connection_id_fk
          FOREIGN KEY (community_connection_id) REFERENCES community_connections(id) ON DELETE CASCADE;
      END IF;
    END $$;
  `
  console.log('✓ automation_rules.community_connection_id FK')

  // ── Add indexes ──────────────────────────────────────────────────────────────
  await sql`CREATE INDEX IF NOT EXISTS billing_connections_org_provider_idx ON billing_connections(org_id, provider)`
  console.log('✓ billing_connections index')

  await sql`CREATE INDEX IF NOT EXISTS community_connections_org_platform_idx ON community_connections(org_id, platform)`
  console.log('✓ community_connections index')

  await sql`CREATE INDEX IF NOT EXISTS automation_rules_org_idx ON automation_rules(org_id)`
  console.log('✓ automation_rules index')

  await sql`CREATE INDEX IF NOT EXISTS event_logs_org_idx ON event_logs(org_id)`
  await sql`CREATE INDEX IF NOT EXISTS event_logs_member_email_idx ON event_logs(member_email)`
  await sql`CREATE INDEX IF NOT EXISTS event_logs_event_type_idx ON event_logs(event_type)`
  console.log('✓ event_logs indexes')

  await sql`CREATE INDEX IF NOT EXISTS member_sync_access_status_idx ON member_sync(access_status)`
  await sql`CREATE INDEX IF NOT EXISTS member_sync_grace_period_idx ON member_sync(grace_period_ends_at)`
  console.log('✓ member_sync indexes')

  console.log('\n🎉 Migration v2 complete!')
}

migrate().catch(err => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
