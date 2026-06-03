import type { CommunityAdapter, CommunityAdapterConfig, AdapterResult } from './adapter-types'

// ─── CIRCLE API v2 ADAPTER ────────────────────────────────────────────────────
// Circle.so — API v2 with Bearer authentication
// Docs: https://api.circle.so

const CIRCLE_BASE_URL = 'https://app.circle.so/api/admin/v2'
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 500

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function circleRequest(
  apiKey: string,
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<{ ok: boolean; status: number; data: unknown }> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${CIRCLE_BASE_URL}${path}`, {
        method,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      const text = await res.text()
      let data: unknown = null
      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }

      return { ok: res.ok, status: res.status, data }
    } catch (err) {
      lastError = err as Error
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt) // exponential backoff
      }
    }
  }

  throw lastError ?? new Error('Circle API request failed after retries')
}

export class CircleAdapter implements CommunityAdapter {
  private apiKey: string
  private communityId: string

  constructor(config: CommunityAdapterConfig) {
    this.apiKey = config.apiKey
    this.communityId = config.communityId
  }

  /** Test the API key by fetching community info */
  async validateCredentials(): Promise<boolean> {
    try {
      const res = await circleRequest(this.apiKey, 'GET', `/communities/${this.communityId}`)
      return res.ok
    } catch {
      return false
    }
  }

  /** Add a member to the Circle community */
  async grantAccess(email: string, name?: string): Promise<AdapterResult> {
    try {
      // Check if already a member first
      const existing = await this.findMember(email)
      if (existing) {
        return {
          success: true,
          message: `Member ${email} already has access to the community`,
          data: existing as Record<string, unknown>,
        }
      }

      const res = await circleRequest(this.apiKey, 'POST', '/community_members', {
        email,
        name: name ?? email.split('@')[0],
        community_id: this.communityId,
        skip_invitation: false,
      })

      if (res.ok || res.status === 201) {
        return {
          success: true,
          message: `Successfully granted access to ${email}`,
          data: res.data as Record<string, unknown>,
        }
      }

      const errData = res.data as Record<string, unknown>
      const errMsg = (errData?.error as string) ?? (errData?.message as string) ?? `HTTP ${res.status}`
      return {
        success: false,
        message: `Failed to grant access: ${errMsg}`,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return { success: false, message: `Circle grantAccess error: ${message}` }
    }
  }

  /** Remove a member from the Circle community — idempotent (no error if not found) */
  async revokeAccess(email: string): Promise<AdapterResult> {
    try {
      const member = await this.findMember(email)

      // Not a member — treat as success (idempotent)
      if (!member) {
        return {
          success: true,
          message: `Member ${email} was not found in the community (already removed)`,
        }
      }

      const memberId = (member as Record<string, unknown>).id
      const res = await circleRequest(
        this.apiKey,
        'DELETE',
        `/community_members/${memberId}`
      )

      if (res.ok || res.status === 200 || res.status === 204) {
        return {
          success: true,
          message: `Successfully revoked access for ${email}`,
        }
      }

      const errData = res.data as Record<string, unknown>
      const errMsg = (errData?.error as string) ?? (errData?.message as string) ?? `HTTP ${res.status}`
      return {
        success: false,
        message: `Failed to revoke access: ${errMsg}`,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return { success: false, message: `Circle revokeAccess error: ${message}` }
    }
  }

  /** Check if a user is a member of the community */
  async hasAccess(email: string): Promise<boolean> {
    try {
      const member = await this.findMember(email)
      return member !== null
    } catch {
      return false
    }
  }

  /** Search for a member by email address */
  private async findMember(email: string): Promise<unknown | null> {
    const encoded = encodeURIComponent(email)
    const res = await circleRequest(
      this.apiKey,
      'GET',
      `/community_members?email=${encoded}&community_id=${this.communityId}`
    )

    if (!res.ok) return null

    const data = res.data as { community_members?: unknown[] } | unknown[]
    const members = Array.isArray(data)
      ? data
      : (data as { community_members?: unknown[] })?.community_members ?? []

    return members.length > 0 ? members[0] : null
  }
}
