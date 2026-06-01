'use client'

import { useEffect, useState } from 'react'
import { Users, Zap, FileText, TrendingUp, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface Stats {
  totalMembers: number
  activeRules: number
  totalEvents: number
  successRate: number
  recentLogs: EventLog[]
}

interface EventLog {
  id: string
  eventType: string
  actionResult: string
  memberEmail: string
  billingProvider: string
  actionTaken: string
  processedAt: string
}

const statCards = [
  { key: 'totalMembers', label: 'Active Members',  icon: Users,       color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/15' },
  { key: 'activeRules',  label: 'Active Rules',    icon: Zap,         color: 'text-indigo-400',  bg: 'bg-indigo-400/10',  border: 'border-indigo-400/15' },
  { key: 'totalEvents',  label: 'Events Processed',icon: FileText,    color: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/15' },
  { key: 'successRate',  label: 'Success Rate',    icon: TrendingUp,  color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/15', suffix: '%' },
]

function resultIcon(result: string) {
  if (result === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
  if (result === 'failed')  return <XCircle      className="w-3.5 h-3.5 text-red-400" />
  return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Overview</h1>
        <p className="text-white/40 text-sm">Your membership sync at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ key, label, icon: Icon, color, bg, border, suffix }) => (
          <div key={key} className={`bg-white/[0.02] border ${border} rounded-2xl p-5`}>
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} size={18} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {loading ? '—' : `${(stats as any)?.[key] ?? 0}${suffix || ''}`}
            </div>
            <div className="text-[12px] text-white/35">{label}</div>
          </div>
        ))}
      </div>

      {/* Live Event Feed */}
      <div className="bg-white/[0.02] border border-white/6 rounded-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-[14px] font-semibold text-white">Recent Events</h2>
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-white/25 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            Loading events...
          </div>
        ) : stats?.recentLogs?.length === 0 ? (
          <div className="text-center py-16 text-white/20 text-sm">
            No events yet. Events will appear here as billing webhooks come in.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {stats?.recentLogs?.map((log) => (
              <div key={log.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex-shrink-0">{resultIcon(log.actionResult)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-white/80 truncate">{log.memberEmail}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/15 flex-shrink-0">
                      {log.eventType}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/30 mt-0.5">
                    {log.actionTaken || 'no action'} · via {log.billingProvider?.replace('_', ' ')}
                  </div>
                </div>
                <div className="text-[11px] text-white/20 flex-shrink-0 font-mono">
                  {new Date(log.processedAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
