'use client'

import { motion } from 'framer-motion'
import { Zap, RefreshCw, Users, FileText, ShieldCheck, Globe, Bell, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Real-time Sync',
    description: 'Sub-2-second sync between billing events and community access. No delays, no batch jobs, no polling.',
    tag: 'Core',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
  {
    icon: RefreshCw,
    title: 'Failed Payment Recovery',
    description: 'Smart retry logic, dunning emails, and grace period access keep revenue from slipping through the cracks.',
    tag: 'Revenue',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: Users,
    title: 'Membership Automation',
    description: 'Grant, revoke, pause, and resume access automatically based on subscription status. Zero manual work.',
    tag: 'Automation',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
  },
  {
    icon: FileText,
    title: 'Event Logging',
    description: 'A full audit trail of every billing event, access change, and sync operation. Always know what happened and when.',
    tag: 'Observability',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    icon: ShieldCheck,
    title: 'Access Control',
    description: 'Precise, rule-based access management. Different plans get different access. Upgrades and downgrades handled cleanly.',
    tag: 'Control',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'One account to manage multiple billing providers and community platforms. Mix and match as your stack evolves.',
    tag: 'Scale',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get alerted on failed payments, access issues, and sync errors before your members even notice.',
    tag: 'Alerts',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    icon: BarChart3,
    title: 'Revenue Analytics',
    description: 'Track MRR, churn risk, and recovery rates. Understand your membership health at a glance.',
    tag: 'Analytics',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
]

export default function FeaturesSection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#F5F5F5]" id="features">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center gap-2 mb-5 mx-auto w-fit text-[11px] font-semibold tracking-wider uppercase text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            Features
          </div>
          <h2 className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Everything you need.<br />
            Nothing you don't.
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Built for community creators who want reliable, automatic membership management — not another Zapier-style workflow.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <span className={`text-[10px] font-semibold tracking-wider uppercase ${feature.color}`}>{feature.tag}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-2.5 leading-tight">{feature.title}</h3>
                  <p className="text-[13px] text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
