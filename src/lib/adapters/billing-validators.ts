import type { BillingValidator, BillingAdapterConfig } from './adapter-types'

// ─── LEMON SQUEEZY VALIDATOR ──────────────────────────────────────────────────
export class LemonSqueezyValidator implements BillingValidator {
  private apiKey: string

  constructor(config: BillingAdapterConfig) {
    this.apiKey = config.apiKey
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const res = await fetch('https://api.lemonsqueezy.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/vnd.api+json',
        },
      })
      return res.ok
    } catch {
      return false
    }
  }
}

// ─── PADDLE VALIDATOR ─────────────────────────────────────────────────────────
export class PaddleValidator implements BillingValidator {
  private apiKey: string

  constructor(config: BillingAdapterConfig) {
    this.apiKey = config.apiKey
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const res = await fetch('https://api.paddle.com/businesses', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      return res.ok || res.status === 403 // 403 = valid key, no permission; still authenticated
    } catch {
      return false
    }
  }
}

// ─── FACTORY ──────────────────────────────────────────────────────────────────
export function getBillingValidator(provider: string, apiKey: string): BillingValidator {
  switch (provider) {
    case 'lemon_squeezy':
      return new LemonSqueezyValidator({ apiKey })
    case 'paddle':
      return new PaddleValidator({ apiKey })
    default:
      throw new Error(`Unknown billing provider: ${provider}`)
  }
}
