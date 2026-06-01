// Skool Community Platform Adapter
// Note: Skool doesn't have an official public API yet.
// This uses their internal API (reverse-engineered, may change).
// We'll add official support when they release a public API.

interface SkoolConfig {
  apiKey: string      // session cookie / auth token
  communityId: string // group URL slug or ID
}

export class SkoolAdapter {
  private apiKey: string
  private communityId: string
  private baseUrl = 'https://www.skool.com/api'

  constructor(config: SkoolConfig) {
    this.apiKey = config.apiKey
    this.communityId = config.communityId
  }

  private async request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Cookie': `session=${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Skool API error ${res.status}: ${error}`)
    }

    return res.json().catch(() => ({}))
  }

  // Invite a member to the community via email
  async grantAccess(email: string): Promise<void> {
    await this.request(`/groups/${this.communityId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  // Remove a member from the community
  async revokeAccess(email: string): Promise<void> {
    const member = await this.getMember(email)
    if (!member) {
      throw new Error(`Member ${email} not found in Skool community`)
    }

    await this.request(`/groups/${this.communityId}/members/${member.id}`, {
      method: 'DELETE',
    })
  }

  async getMember(email: string): Promise<{ id: string; email: string } | null> {
    try {
      const data = await this.request(
        `/groups/${this.communityId}/members?email=${encodeURIComponent(email)}`
      )
      return data?.members?.[0] || null
    } catch {
      return null
    }
  }

  async hasAccess(email: string): Promise<boolean> {
    const member = await this.getMember(email)
    return !!member
  }
}
