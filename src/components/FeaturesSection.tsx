'use client'

import { motion } from 'framer-motion'
import { Zap, RefreshCw, Users, FileText, ShieldCheck, Globe, Bell, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Real-time Sync',
    description: 'Sub-2-second sync between billing events and community access. No delays, no batch jobs, no polling.',
    tag: 'Core',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/15',
  },
  {
    icon: RefreshCw,
    title: 'Failed Payment Recovery',
    description: 'Smart retry logic, dunning emails, and grace period access keep revenue from slipping through the cracks.',
    tag: 'Revenue',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/15',
  },
  {
    icon: Users,
    title: 'Membership Automation',
    description: 'Grant, revoke, pause, and resume access automatically based on subscription status. Zero manual work.',
    tag: 'Automation',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/15',
  },
  {
    icon: FileText,
    title: 'Event Logging',
    description: 'A full audit trail of every billing event, access change, and sync operation. Always know what happened and when.',
    tag: 'Observability',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/15',
  },
  {
    icon: ShieldCheck,
    title: 'Access Control',
    description: 'Precise, rule-based access management. Different plans get different access. Upgrades and downgrades handled cleanly.',
    tag: 'Control',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/15',
  },
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'One account to manage multiple billing providers and community platforms. Mix and match as your stack evolves.',
    tag: 'Scale',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/15',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get alerted on failed payments, access issues, and sync errors before your members even notice.',
    tag: 'Alerts',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/15',
  },
  {
    icon: BarChart3,
    title: 'Revenue Analytics',
    description: 'Track MRR, churn risk, and recovery rates. Understand your membership health at a glance.',
    tag: 'Analytics',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/15',
  },
]

export default function FeaturesSection() {
  return (
    <section className="relative py-28 overflow-hidden" id="features">
      <div className="absolute inset-0 grid-bg opacity-40" />
      {/* Ambient glow */}
      <div className="orb w-[500px] h-[500px] bg-indigo-600/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-tag mb-5 mx-auto w-fit">
            <Zap className="w-3 h-3" />
            Features
          </div>
          <h2 className="section-headline text-white mb-5">
            Everything you need.<br />
            <span className="gradient-text">Nothing you don't.</span>
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto font-[380]">
            Built for community creators who want reliable, automatic membership management — not another Zapier-style workflow.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="feature-card p-6 group cursor-default relative overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg.replace('bg-', 'from-').replace('/10', '/5')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <span className={`text-[10px] font-semibold tracking-wider uppercase ${feature.color} opacity-60`}>{feature.tag}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white mb-2.5 leading-tight">{feature.title}</h3>
                  <p className="text-[13px] text-white/40 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
