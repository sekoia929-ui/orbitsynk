'use client'

import { useState, useEffect } from 'react'
import { Users, CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react'

interface Member {
  id: string
  email: string
  memberName: string
  subscriptionStatus: string
  accessStatus: string
  gracePeriodEndsAt: string | null
  updatedAt: string
}

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; class: string; icon: any }> = {
    granted:      { label: 'Access Granted',  class: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 },
    revoked:      { label: 'Revoked',         class: 'text-red-400 bg-red-400/10 border-red-400/20',           icon: XCircle },
    grace_period: { label: 'Grace Period',    class: 'text-amber-400 bg-amber-400/10 border-amber-400/20',     icon: Clock },
  }
  const s = map[status] || { label: status, class: 'text-white/40 bg-white/5 border-white/10', icon: RefreshCw }
  const Icon = s.icon
  return (
    <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${s.class}`}>
      <Icon className="w-3 h-3" /> {s.label}
    </span>
  )
}

const subStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    active:    'text-emerald-400',
    cancelled: 'text-red-400',
    past_due:  'text-amber-400',
    paused:    'text-blue-400',
  }
  return <span className={`text-[11px] ${map[status] || 'text-white/30'}`}>{status || '—'}</span>
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/members')
      .then(r => r.json())
      .then(data => { setMembers(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Members</h1>
        <p className="text-white/40 text-sm">
          {members.length} member{members.length !== 1 ? 's' : ''} tracked · Real-time sync state for every subscriber.
        </p>
      </div>

      <div className="bg-white/[0.02] border border-white/6 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-[11px] font-semibold text-white/25 uppercase tracking-wider">
          <div className="col-span-4">Member</div>
          <div className="col-span-2">Subscription</div>
          <div className="col-span-3">Access Status</div>
          <div className="col-span-3">Last Updated</div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-white/20 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading members...
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/20 text-sm">No members synced yet.</p>
            <p className="text-white/10 text-xs mt-1">Members appear here after the first billing event is processed.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {members.map(member => (
              <div key={member.id} className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors items-center">
                <div className="col-span-4 min-w-0">
                  <div className="text-[13px] font-medium text-white/80 truncate">{member.email}</div>
                  {member.memberName && (
                    <div className="text-[11px] text-white/30">{member.memberName}</div>
                  )}
                </div>
                <div className="col-span-2">
                  {subStatusBadge(member.subscriptionStatus)}
                </div>
                <div className="col-span-3">
                  {statusBadge(member.accessStatus)}
                  {member.gracePeriodEndsAt && (
                    <div className="text-[10px] text-amber-400/50 mt-1">
                      Expires {new Date(member.gracePeriodEndsAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="col-span-3 text-[11px] text-white/25 font-mono">
                  {new Date(member.updatedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
