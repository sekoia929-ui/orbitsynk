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
    iconBg: 'bg-orange-50',
    iconColor: 'text-[#F26522]',
  },
  {
    number: '02',
    icon: Plug2,
    title: 'Connect your community platform',
    description: 'Link Circle, Skool, or Discord with a single OAuth connection. OrbitSynk gets the minimal permissions it needs — nothing more.',
    detail: 'Supported: Circle, Skool · Discord coming soon',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    number: '03',
    icon: Settings2,
    title: 'Set your automation rules',
    description: "Define exactly what happens when billing events occur. Grant access on new subscriptions. Revoke on cancellations. Retry on failures. Your rules, your logic.",
    detail: 'Grant · Revoke · Retry · Downgrade · Custom actions',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    number: '04',
    icon: Sparkles,
    title: 'OrbitSynk handles everything',
    description: "From this moment on, your membership access is fully automated. Payments succeed → access granted. Payments fail → recovery initiated. You focus on your community.",
    detail: '< 2s average sync time · 99.9% uptime SLA',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-white" id="how-it-works">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="flex items-center gap-2 mb-5 mx-auto w-fit text-[11px] font-semibold tracking-wider uppercase text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            How It Works
          </div>
          <h2 className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Set up in 5 minutes.<br />
            Runs forever on autopilot.
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Four steps to fully automated membership management. No engineering required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical connector line */}
          <div className="absolute left-[28px] lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-px bg-gray-200 hidden sm:block" />

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
                    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-7 group">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl ${step.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300`}>
                          <Icon className={`w-5 h-5 ${step.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-mono font-bold text-gray-400 tracking-wider">{step.number}</span>
                            <h3 className="text-[16px] font-semibold text-gray-900 leading-tight">{step.title}</h3>
                          </div>
                          <p className="text-[13.5px] text-gray-600 leading-relaxed mb-4">{step.description}</p>
                          <div className={`inline-flex items-center gap-2 text-[11px] font-medium ${step.iconColor} bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            {step.detail}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step node - centered on desktop */}
                  <div className="absolute left-0 sm:hidden lg:block lg:static lg:flex lg:items-center lg:justify-center lg:w-16 lg:flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mx-auto z-10">
                      <span className="text-[11px] font-bold text-gray-500">{i + 1}</span>
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
