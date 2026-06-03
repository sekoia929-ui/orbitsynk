'use client'

import { useState, useEffect } from 'react'
import { Plug2, Plus, Trash2, Copy, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react'

interface Connection {
  id: string
  provider?: string
  platform?: string
  communityId?: string
  communityName?: string
  isActive: boolean
  createdAt: string
}

interface ConnectionsData {
  billingConnections: Connection[]
  communityConnections: Connection[]
}

const BILLING_PROVIDERS = [
  { value: 'lemon_squeezy', label: 'Lemon Squeezy', emoji: '🍋', docsUrl: 'https://docs.lemonsqueezy.com/help/webhooks' },
  { value: 'paddle', label: 'Paddle', emoji: '🏓', docsUrl: 'https://developer.paddle.com/webhooks/overview' },
]

const COMMUNITY_PLATFORMS = [
  { value: 'circle', label: 'Circle', emoji: '⭕', status: 'live' },
  { value: 'skool',  label: 'Skool',  emoji: '🏫', status: 'coming_soon' },
  { value: 'discord', label: 'Discord', emoji: '💬', status: 'coming_soon' },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
      {copied
        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        : <Copy className="w-3.5 h-3.5 text-white/40" />}
    </button>
  )
}

function Alert({ type, message }: { type: 'error' | 'success'; message: string }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl mb-4 text-sm ${
      type === 'error'
        ? 'bg-red-500/10 border border-red-500/20 text-red-300'
        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
    }`}>
      {type === 'error'
        ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        : <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />}
      <span>{message}</span>
    </div>
  )
}

export default function ConnectionsPage() {
  const [data, setData] = useState<ConnectionsData>({ billingConnections: [], communityConnections: [] })
  const [loading, setLoading] = useState(true)
  const [showBillingForm, setShowBillingForm] = useState(false)
  const [showCommunityForm, setShowCommunityForm] = useState(false)
  const [billingForm, setBillingForm] = useState({ provider: 'lemon_squeezy', apiKey: '', webhookSecret: '', storeId: '' })
  const [communityForm, setCommunityForm] = useState({ platform: 'circle', apiKey: '', communityId: '', communityName: '' })
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = async () => {
    try {
      const res = await fetch('/api/connections')
      if (!res.ok) throw new Error('Failed to load connections')
      const d = await res.json()
      setData(d)
    } catch {
      setError('Failed to load connections. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const addBilling = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'billing', ...billingForm }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Failed to save connection')
        return
      }
      if (json.webhookUrl) setWebhookUrl(json.webhookUrl)
      setSuccess('Billing provider connected! Copy the webhook URL below and paste it in your billing dashboard.')
      setShowBillingForm(false)
      setBillingForm({ provider: 'lemon_squeezy', apiKey: '', webhookSecret: '', storeId: '' })
      await load()
    } catch {
      setError('Network error — could not connect. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const addCommunity = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (communityForm.platform !== 'circle') {
      setError(`${communityForm.platform.charAt(0).toUpperCase() + communityForm.platform.slice(1)} integration is coming soon!`)
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'community', ...communityForm }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Failed to save connection')
        return
      }
      setSuccess('Community platform connected successfully!')
      setShowCommunityForm(false)
      setCommunityForm({ platform: 'circle', apiKey: '', communityId: '', communityName: '' })
      await load()
    } catch {
      setError('Network error — could not connect. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (id: string, type: string) => {
    if (!confirm('Remove this connection? Any rules using it will stop working.')) return
    setDeleting(id)
    try {
      const res = await fetch('/api/connections', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? 'Failed to remove connection')
        return
      }
      await load()
    } catch {
      setError('Network error — could not remove. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Connections</h1>
        <p className="text-white/40 text-sm">Connect your billing provider and community platform. Credentials are validated and encrypted.</p>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && !error && <Alert type="success" message={success} />}

      {/* Webhook URL display */}
      {webhookUrl && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <p className="text-emerald-300 text-sm font-semibold mb-2">✅ Paste this URL into your billing provider's webhook settings:</p>
          <div className="flex items-center gap-2 bg-black/30 rounded-xl px-4 py-2.5">
            <code className="text-xs text-white/70 flex-1 break-all">{webhookUrl}</code>
            <CopyButton text={webhookUrl} />
          </div>
          <p className="text-emerald-200/50 text-xs mt-2">Set the webhook to send all subscription events to this URL.</p>
        </div>
      )}

      {/* Billing Connections */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-white">Billing Providers</h2>
          <button
            onClick={() => { setShowBillingForm(!showBillingForm); setError(''); setSuccess('') }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Provider
          </button>
        </div>

        {showBillingForm && (
          <form onSubmit={addBilling} className="mb-4 p-5 bg-white/[0.03] border border-white/8 rounded-2xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] text-white/40 mb-1.5">Provider</label>
                <select
                  value={billingForm.provider}
                  onChange={e => setBillingForm(f => ({ ...f, provider: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  {BILLING_PROVIDERS.map(p => (
                    <option key={p.value} value={p.value} className="bg-[#111]">{p.emoji} {p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] text-white/40 mb-1.5">Store ID (optional)</label>
                <input
                  value={billingForm.storeId}
                  onChange={e => setBillingForm(f => ({ ...f, storeId: e.target.value }))}
                  placeholder="12345"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-white/40 mb-1.5">API Key</label>
              <input
                required value={billingForm.apiKey}
                onChange={e => setBillingForm(f => ({ ...f, apiKey: e.target.value }))}
                placeholder="ls_test_xxxxxxxxxxxx"
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50"
              />
              <p className="text-[11px] text-white/25 mt-1">Your key will be validated and encrypted before saving.</p>
            </div>
            <div>
              <label className="block text-[12px] text-white/40 mb-1.5">Webhook Signing Secret</label>
              <input
                required value={billingForm.webhookSecret}
                onChange={e => setBillingForm(f => ({ ...f, webhookSecret: e.target.value }))}
                placeholder="Your webhook signing secret"
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? 'Validating & Saving...' : 'Save Connection'}
              </button>
              <button type="button" onClick={() => setShowBillingForm(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {data.billingConnections.length === 0 && !showBillingForm ? (
          <div className="text-center py-10 text-white/20 text-sm border border-dashed border-white/8 rounded-2xl">
            No billing providers connected yet. Click "Add Provider" to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {data.billingConnections.map(c => {
              const provider = BILLING_PROVIDERS.find(p => p.value === c.provider)
              return (
                <div key={c.id} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/6 rounded-2xl">
                  <span className="text-2xl">{provider?.emoji}</span>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-white">{provider?.label}</div>
                    <div className="text-[11px] text-white/30">Connected · API key encrypted · Credentials validated</div>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">Active</span>
                  <button
                    onClick={() => remove(c.id, 'billing')}
                    disabled={deleting === c.id}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting === c.id
                      ? <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
                      : <Trash2 className="w-4 h-4 text-red-400/50 hover:text-red-400" />}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Community Connections */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-white">Community Platforms</h2>
          <button
            onClick={() => { setShowCommunityForm(!showCommunityForm); setError(''); setSuccess('') }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Platform
          </button>
        </div>

        {showCommunityForm && (
          <form onSubmit={addCommunity} className="mb-4 p-5 bg-white/[0.03] border border-white/8 rounded-2xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] text-white/40 mb-1.5">Platform</label>
                <select
                  value={communityForm.platform}
                  onChange={e => setCommunityForm(f => ({ ...f, platform: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                >
                  {COMMUNITY_PLATFORMS.map(p => (
                    <option key={p.value} value={p.value} className="bg-[#111]">
                      {p.emoji} {p.label}{p.status === 'coming_soon' ? ' (Coming Soon)' : ''}
                    </option>
                  ))}
                </select>
                {communityForm.platform !== 'circle' && (
                  <p className="text-[11px] text-amber-400/70 mt-1">⚠️ This platform is coming soon and not yet available.</p>
                )}
              </div>
              <div>
                <label className="block text-[12px] text-white/40 mb-1.5">Community Name (optional)</label>
                <input
                  value={communityForm.communityName}
                  onChange={e => setCommunityForm(f => ({ ...f, communityName: e.target.value }))}
                  placeholder="My Community"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-white/40 mb-1.5">Community ID</label>
              <input
                required value={communityForm.communityId}
                onChange={e => setCommunityForm(f => ({ ...f, communityId: e.target.value }))}
                placeholder="Find in Circle: Settings → Community → Community ID"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-[12px] text-white/40 mb-1.5">API Key</label>
              <input
                required value={communityForm.apiKey}
                onChange={e => setCommunityForm(f => ({ ...f, apiKey: e.target.value }))}
                placeholder="Your Circle API key"
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50"
              />
              <p className="text-[11px] text-white/25 mt-1">Circle: Settings → API → Generate token</p>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? 'Validating & Saving...' : 'Save Connection'}
              </button>
              <button type="button" onClick={() => setShowCommunityForm(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {data.communityConnections.length === 0 && !showCommunityForm ? (
          <div className="text-center py-10 text-white/20 text-sm border border-dashed border-white/8 rounded-2xl">
            No community platforms connected yet. Click "Add Platform" to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {data.communityConnections.map(c => {
              const platform = COMMUNITY_PLATFORMS.find(p => p.value === c.platform)
              return (
                <div key={c.id} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/6 rounded-2xl">
                  <span className="text-2xl">{platform?.emoji}</span>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-white">{c.communityName || platform?.label}</div>
                    <div className="text-[11px] text-white/30">{platform?.label} · ID: {c.communityId} · Credentials validated</div>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">Active</span>
                  <button
                    onClick={() => remove(c.id, 'community')}
                    disabled={deleting === c.id}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting === c.id
                      ? <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
                      : <Trash2 className="w-4 h-4 text-red-400/50 hover:text-red-400" />}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
