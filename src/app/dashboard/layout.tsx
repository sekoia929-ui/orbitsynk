'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Plug2, Settings2, FileText, Users, Zap
} from 'lucide-react'

const navItems = [
  { label: 'Overview',    href: '/dashboard',             icon: LayoutDashboard },
  { label: 'Connections', href: '/dashboard/connections', icon: Plug2 },
  { label: 'Rules',       href: '/dashboard/rules',       icon: Settings2 },
  { label: 'Event Logs',  href: '/dashboard/logs',        icon: FileText },
  { label: 'Members',     href: '/dashboard/members',     icon: Users },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-[#080808] overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#090909]">

        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/5">
          <div className="w-7 h-7">
            <Image src="/logo.png" alt="OrbitSynk" width={28} height={28} className="object-contain" />
          </div>
          <span className="text-[14px] font-bold tracking-tight">
            Orbit<span className="text-indigo-400">Synk</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5 flex items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
                userButtonPopoverCard: 'bg-[#111] border border-white/10',
                userButtonPopoverActionButton: 'text-white/70 hover:text-white',
              }
            }}
          />
          <span className="text-[12px] text-white/30">Account</span>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
