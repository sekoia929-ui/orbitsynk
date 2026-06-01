'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Zap, ArrowRight } from 'lucide-react'

interface Rule {
  id: string
  name: string
  triggerEvent: string
  actionType: string
  gracePeriodDays: number
  isActive: boolean
  billingConnection: { provider: string }
  communityConnection: { platform: string; communityName: string }
}

interface Connection { id: string; provider?: string; platform?: string; communityName?: string }

const EVENTS = [
  { value: 'subscription.created',   label: 'Subscription Created',   color: 'text-emerald-400' },
  { value: 'subscription.cancelled', label: 'Subscription Cancelled', color: 'text-red-400' },
  { value: 'payment.success',        label: 'Payment Succeeded',      color: 'text-emerald-400' },
  { value: 'payment.failed',         label: 'Payment Failed',         color: 'text-amber-400' },
]

const ACTIONS = [
  { value: 'grant_access',  label: '✅ Grant Access' },
  { value: 'revoke_access', label: '🚫 Revoke Access' },
]

const EVENT_EMOJI: Record<string, string> = {
  'subscription.created':   '🟢',
  'subscription.cancelled': '🔴',
  'payment.success':        '💚',
  'payment.failed':         '🟡',
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [billingConnections, setBillingConnections] = useState<Connection[]>([])
  const [communityConnections, setCommunityConnections] = useState<Connection[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', billingConnectionId: '', communityConnectionId: '',
    triggerEvent: 'subscription.created', actionType: 'grant_access', gracePeriodDays: 0,
  })
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    const [rulesRes, connRes] = await Promise.all([
      fetch('/api/rules').then(r => r.json()),
      fetch('/api/connections').then(r => r.json()),
    ])
    setRules(Array.isArray(rulesRes) ? rulesRes : [])
    setBillingConnections(connRes.billing || [])
    setCommunityConnections(connRes.community || [])
  }

  useEffect(() => { load() }, [])

  const addRule = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await fetch('/api/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSubmitting(false)
    setShowForm(false)
    setForm({ name: '', billingConnectionId: '', communityConnectionId: '',
      triggerEvent: 'subscription.created', actionType: 'grant_access', gracePeriodDays: 0 })
    load()
  }

  const toggleRule = async (id: string, isActive: boolean) => {
    await fetch('/api/rules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive: !isActive }),
    })
    load()
  }

  const deleteRule = async (id: string) => {
    if (!confirm('Delete this rule?')) return
    await fetch('/api/rules', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Automation Rules</h1>
          <p className="text-white/40 text-sm">Define what happens when billing events occur.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Rule
        </button>
      </div>

      {/* New Rule Form */}
      {showForm && (
        <form onSubmit={addRule} className="mb-6 p-6 bg-white/[0.03] border border-indigo-500/20 rounded-2xl space-y-5">
          <h3 className="text-[14px] font-semibold text-white">Create Automation Rule</h3>

          <div>
            <label className="block text-[12px] text-white/40 mb-1.5">Rule Name</label>
            <input
              required value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Grant Circle access on new subscription"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-white/40 mb-1.5">When this billing event occurs</label>
              <select
                value={form.triggerEvent}
                onChange={e => setForm(f => ({ ...f, triggerEvent: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              >
                {EVENTS.map(ev => (
                  <option key={ev.value} value={ev.value} className="bg-[#111]">
                    {EVENT_EMOJI[ev.value]} {ev.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-white/40 mb-1.5">Do this action</label>
              <select
                value={form.actionType}
                onChange={e => setForm(f => ({ ...f, actionType: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              >
                {ACTIONS.map(a => (
                  <option key={a.value} value={a.value} className="bg-[#111]">{a.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-white/40 mb-1.5">Billing Provider</label>
              <select
                required value={form.billingConnectionId}
                onChange={e => setForm(f => ({ ...f, billingConnectionId: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              >
                <option value="" className="bg-[#111]">Select provider...</option>
                {billingConnections.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#111]">{c.provider}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-white/40 mb-1.5">Community Platform</label>
              <select
                required value={form.communityConnectionId}
                onChange={e => setForm(f => ({ ...f, communityConnectionId: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              >
                <option value="" className="bg-[#111]">Select platform...</option>
                {communityConnections.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#111]">{c.communityName || c.platform}</option>
                ))}
              </select>
            </div>
          </div>

          {form.actionType === 'revoke_access' && (
            <div>
              <label className="block text-[12px] text-white/40 mb-1.5">
                Grace Period (days before revoking — 0 = immediate)
              </label>
              <input
                type="number" min="0" max="30"
                value={form.gracePeriodDays}
                onChange={e => setForm(f => ({ ...f, gracePeriodDays: parseInt(e.target.value) || 0 }))}
                className="w-32 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Rule'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Rules List */}
      {rules.length === 0 ? (
        <div className="text-center py-16 text-white/20 text-sm border border-dashed border-white/8 rounded-2xl">
          No rules yet. Create your first automation rule above.
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map(rule => (
            <div key={rule.id} className={`p-5 rounded-2xl border transition-all ${
              rule.isActive
                ? 'bg-white/[0.02] border-white/8'
                : 'bg-white/[0.01] border-white/4 opacity-50'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[13px] font-semibold text-white">{rule.name}</span>
                    {rule.isActive
                      ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">Active</span>
                      : <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/8">Paused</span>
                    }
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[12px] px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/15">
                      {EVENT_EMOJI[rule.triggerEvent]} {rule.triggerEvent}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/20" />
                    <span className="text-[12px] px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/15">
                      {rule.actionType === 'grant_access' ? '✅' : '🚫'} {rule.actionType.replace('_', ' ')}
                    </span>
                    {rule.gracePeriodDays > 0 && (
                      <span className="text-[11px] text-white/30">after {rule.gracePeriodDays}d grace</span>
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-white/25">
                    {rule.billingConnection?.provider} → {rule.communityConnection?.communityName || rule.communityConnection?.platform}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleRule(rule.id, rule.isActive)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    {rule.isActive
                      ? <ToggleRight className="w-5 h-5 text-indigo-400" />
                      : <ToggleLeft className="w-5 h-5 text-white/30" />}
                  </button>
                  <button onClick={() => deleteRule(rule.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400/50 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
