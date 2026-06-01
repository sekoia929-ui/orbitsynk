// Circle Community Platform Adapter
// Docs: https://api.circle.so

interface CircleConfig {
  apiKey: string
  communityId: string
}

interface CircleMember {
  id: number
  email: string
  name: string
  community_member: boolean
}

export class CircleAdapter {
  private apiKey: string
  private communityId: string
  private baseUrl = 'https://app.circle.so/api/v1'

  constructor(config: CircleConfig) {
    this.apiKey = config.apiKey
    this.communityId = config.communityId
  }

  private async request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Circle API error ${res.status}: ${error}`)
    }

    return res.json()
  }

  // Add a member to the community
  async grantAccess(email: string, name?: string): Promise<void> {
    await this.request('/community_members', {
      method: 'POST',
      body: JSON.stringify({
        email,
        name: name || email.split('@')[0],
        community_id: this.communityId,
        skip_invitation: false, // sends welcome email
      }),
    })
  }

  // Remove a member from the community
  async revokeAccess(email: string): Promise<void> {
    // First find the member
    const member = await this.getMember(email)
    if (!member) {
      throw new Error(`Member ${email} not found in Circle community`)
    }

    await this.request(`/community_members/${member.id}?community_id=${this.communityId}`, {
      method: 'DELETE',
    })
  }

  // Look up a member by email
  async getMember(email: string): Promise<CircleMember | null> {
    try {
      const data = await this.request(
        `/community_members?community_id=${this.communityId}&email=${encodeURIComponent(email)}`
      )
      return data?.[0] || null
    } catch {
      return null
    }
  }

  // Check if a member has access
  async hasAccess(email: string): Promise<boolean> {
    const member = await this.getMember(email)
    return !!member
  }
}
