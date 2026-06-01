'use client'

import { motion } from 'framer-motion'
import { Plug2, Settings2, Zap, Sparkles } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Plug2,
    title: 'Connect your billing provider',
    description: 'Securely link your Lemon Squeezy or Paddle account in under 60 seconds. No code. No webhooks to configure. We handle it all.',
    detail: 'Supported: Lemon Squeezy, Paddle · Stripe coming soon',
    color: 'from-orange-500/20 to-amber-500/20',
    borderColor: 'border-orange-500/20',
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-500/10',
  },
  {
    number: '02',
    icon: Plug2,
    title: 'Connect your community platform',
    description: 'Link Circle, Skool, or Discord with a single OAuth connection. OrbitSynk gets the minimal permissions it needs — nothing more.',
    detail: 'Supported: Circle, Skool · Discord coming soon',
    color: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
  },
  {
    number: '03',
    icon: Settings2,
    title: 'Set your automation rules',
    description: "Define exactly what happens when billing events occur. Grant access on new subscriptions. Revoke on cancellations. Retry on failures. Your rules, your logic.",
    detail: 'Grant · Revoke · Retry · Downgrade · Custom actions',
    color: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/20',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10',
  },
  {
    number: '04',
    icon: Sparkles,
    title: 'OrbitSynk handles everything',
    description: "From this moment on, your membership access is fully automated. Payments succeed → access granted. Payments fail → recovery initiated. You focus on your community.",
    detail: '< 2s average sync time · 99.9% uptime SLA',
    color: 'from-indigo-500/20 to-violet-500/20',
    borderColor: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="relative py-28 overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="section-tag mb-5 mx-auto w-fit">
            <Zap className="w-3 h-3" />
            How It Works
          </div>
          <h2 className="section-headline text-white mb-5">
            Set up in 5 minutes.<br />
            <span className="gradient-text">Runs forever on autopilot.</span>
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto font-[380]">
            Four steps to fully automated membership management. No engineering required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical connector line */}
          <div className="absolute left-[28px] lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden sm:block" />

          <div className="space-y-12">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isEven = i % 2 === 0

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`relative flex flex-col sm:flex-row gap-6 lg:gap-0 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'lg:pr-16' : 'lg:pl-16'} pl-14 sm:pl-0`}>
                    <div className={`feature-card p-7 group ${isEven ? 'lg:ml-0' : 'lg:ml-0'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl ${step.iconBg} border ${step.borderColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-5 h-5 ${step.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-mono font-bold text-white/20 tracking-wider">{step.number}</span>
                            <h3 className="text-[16px] font-semibold text-white leading-tight">{step.title}</h3>
                          </div>
                          <p className="text-[13.5px] text-white/45 leading-relaxed mb-4">{step.description}</p>
                          <div className={`inline-flex items-center gap-2 text-[11px] font-medium ${step.iconColor} bg-white/[0.03] border ${step.borderColor} rounded-lg px-3 py-1.5`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            {step.detail}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step node - centered on desktop */}
                  <div className="absolute left-0 sm:hidden lg:block lg:static lg:flex lg:items-center lg:justify-center lg:w-16 lg:flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.color} border ${step.borderColor} flex items-center justify-center shadow-lg mx-auto`}>
                      <span className="text-[11px] font-bold text-white/80">{i + 1}</span>
                    </div>
                  </div>

                  {/* Empty space on the other side */}
                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
