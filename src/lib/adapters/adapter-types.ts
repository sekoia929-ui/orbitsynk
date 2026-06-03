// ─── ADAPTER TYPES ────────────────────────────────────────────────────────────
// All community platform adapters must implement this interface.
// This enables plug-and-play addition of new platforms (Discord, Slack, etc.)

export interface AdapterResult {
  success: boolean
  message: string
  data?: Record<string, unknown>
}

export interface CommunityAdapterConfig {
  apiKey: string
  communityId: string
}

export interface CommunityAdapter {
  /** Grant a user access to the community */
  grantAccess(email: string, name?: string): Promise<AdapterResult>
  /** Revoke a user's access from the community — must be idempotent (no error if not found) */
  revokeAccess(email: string): Promise<AdapterResult>
  /** Check if a user currently has access */
  hasAccess(email: string): Promise<boolean>
  /** Test the API credentials — returns true if valid */
  validateCredentials(): Promise<boolean>
}

export interface BillingAdapterConfig {
  apiKey: string
}

export interface BillingValidator {
  /** Test the API credentials — returns true if valid */
  validateCredentials(): Promise<boolean>
}

// ─── SUPPORTED PLATFORMS ─────────────────────────────────────────────────────

export const BILLING_PROVIDERS = ['lemon_squeezy', 'paddle'] as const
export const COMMUNITY_PLATFORMS = ['circle', 'skool', 'discord'] as const

export type BillingProvider = typeof BILLING_PROVIDERS[number]
export type CommunityPlatform = typeof COMMUNITY_PLATFORMS[number]

export const BILLING_PROVIDER_LABELS: Record<BillingProvider, string> = {
  lemon_squeezy: 'Lemon Squeezy',
  paddle: 'Paddle',
}

export const COMMUNITY_PLATFORM_LABELS: Record<CommunityPlatform, string> = {
  circle: 'Circle',
  skool: 'Skool',
  discord: 'Discord',
}

export const COMMUNITY_PLATFORM_STATUS: Record<CommunityPlatform, 'live' | 'coming_soon'> = {
  circle: 'live',
  skool: 'coming_soon',
  discord: 'coming_soon',
}
