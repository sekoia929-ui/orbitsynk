'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'

interface EventLog {
  id: string
  eventType: string
  actionResult: string
  actionTaken: string
  memberEmail: string
  memberName: string
  billingProvider: string
  errorMessage: string
  processedAt: string
}

const resultBadge = (result: string) => {
  if (result === 'success') return (
    <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
      <CheckCircle2 className="w-3 h-3" /> success
    </span>
  )
  if (result === 'failed') return (
    <span className="flex items-center gap-1.5 text-[11px] font-medium text-red-400 bg-red-400/10 border border-red-400/20 px-2.5 py-1 rounded-full">
      <XCircle className="w-3 h-3" /> failed
    </span>
  )
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
      <AlertCircle className="w-3 h-3" /> skipped
    </span>
  )
}

const EVENT_COLORS: Record<string, string> = {
  'subscription.created':   'text-emerald-300 bg-emerald-500/10 border-emerald-500/15',
  'subscription.cancelled': 'text-red-300 bg-red-500/10 border-red-500/15',
  'payment.success':        'text-cyan-300 bg-cyan-500/10 border-cyan-500/15',
  'payment.failed':         'text-amber-300 bg-amber-500/10 border-amber-500/15',
}

export default function LogsPage() {
  const [logs, setLogs] = useState<EventLog[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const limit = 50

  const load = (p: number) => {
    setLoading(true)
    fetch(`/api/logs?page=${p}`)
      .then(r => r.json())
      .then(data => {
        setLogs(data.logs || [])
        setTotal(data.total || 0)
        setLoading(false)
      })
  }

  useEffect(() => { load(page) }, [page])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Event Logs</h1>
        <p className="text-white/40 text-sm">{total.toLocaleString()} events total · Full audit trail of every sync operation.</p>
      </div>

      <div className="bg-white/[0.02] border border-white/6 rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-[11px] font-semibold text-white/25 uppercase tracking-wider">
          <div className="col-span-1">Status</div>
          <div className="col-span-3">Member</div>
          <div className="col-span-2">Event</div>
          <div className="col-span-2">Action</div>
          <div className="col-span-2">Provider</div>
          <div className="col-span-2">Time</div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-white/20 text-sm">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-white/20 text-sm">
            No events yet. Events appear here when webhooks are received.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {logs.map(log => (
              <div key={log.id} className="grid grid-cols-12 gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors items-center">
                <div className="col-span-1">{resultBadge(log.actionResult)}</div>
                <div className="col-span-3 min-w-0">
                  <div className="text-[13px] text-white/80 truncate">{log.memberEmail}</div>
                  {log.memberName && <div className="text-[11px] text-white/30">{log.memberName}</div>}
                  {log.errorMessage && (
                    <div className="text-[10px] text-red-400/70 truncate mt-0.5">{log.errorMessage}</div>
                  )}
                </div>
                <div className="col-span-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${EVENT_COLORS[log.eventType] || 'text-white/40 bg-white/5 border-white/10'}`}>
                    {log.eventType}
                  </span>
                </div>
                <div className="col-span-2 text-[12px] text-white/45">
                  {log.actionTaken || '—'}
                </div>
                <div className="col-span-2 text-[12px] text-white/35">
                  {log.billingProvider?.replace('_', ' ')}
                </div>
                <div className="col-span-2 text-[11px] text-white/25 font-mono">
                  {new Date(log.processedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
            <span className="text-[12px] text-white/25">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white/60" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
