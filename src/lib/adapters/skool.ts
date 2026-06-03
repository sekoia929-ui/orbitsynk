import type { CommunityAdapter, CommunityAdapterConfig, AdapterResult } from './adapter-types'

// ─── SKOOL ADAPTER (STUB — Coming Soon) ───────────────────────────────────────
// Skool does not currently have a public API.
// This stub implements the CommunityAdapter interface for forward compatibility.
// When Skool releases an official API, this file will be updated.

export class SkoolAdapter implements CommunityAdapter {
  constructor(_config: CommunityAdapterConfig) {
    // Config ignored — no API available yet
  }

  async validateCredentials(): Promise<boolean> {
    throw new Error('Skool integration is coming soon. No public API is currently available.')
  }

  async grantAccess(_email: string, _name?: string): Promise<AdapterResult> {
    return {
      success: false,
      message: 'Skool integration is coming soon. No public API is currently available.',
    }
  }

  async revokeAccess(_email: string): Promise<AdapterResult> {
    return {
      success: false,
      message: 'Skool integration is coming soon. No public API is currently available.',
    }
  }

  async hasAccess(_email: string): Promise<boolean> {
    return false
  }
}
