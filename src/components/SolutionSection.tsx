'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle2, Zap, ArrowRight, Shield } from 'lucide-react'

const features = [
  'Detects billing events in real-time',
  'Syncs memberships automatically',
  'Updates community access instantly',
  'Handles failed payment recovery',
  'Manages subscription lifecycles',
  'Logs every event for audit',
]

export default function SolutionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-28 overflow-hidden" id="solution">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="section-tag mb-5 mx-auto w-fit">
            <Zap className="w-3 h-3" />
            The Solution
          </div>
          <h2 className="section-headline text-white mb-5">
            One sync layer.<br />
            <span className="gradient-text">Everything automated.</span>
          </h2>
          <p className="text-white/45 text-lg max-w-2xl mx-auto leading-relaxed font-[380]">
            OrbitSynk sits between your billing provider and community platform, 
            automatically handling every membership lifecycle event.
          </p>
        </motion.div>

        {/* Workflow visual */}
        <div ref={ref} className="relative max-w-5xl mx-auto mb-20">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0">
            
            {/* Billing Provider */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 w-52 text-center group hover:border-white/15 transition-all duration-300 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <div className="text-[13px] font-semibold text-white/90 mb-1">Billing Provider</div>
                <div className="text-[11px] text-white/35">Lemon Squeezy · Paddle</div>
                <div className="mt-3 flex flex-wrap gap-1 justify-center">
                  {['Payment', 'Subscription', 'Refund'].map((tag) => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/15">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Arrow 1 with flow animation */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center lg:flex-1 lg:mx-2"
            >
              <div className="hidden lg:flex items-center w-full">
                <div className="h-px flex-1 bg-gradient-to-r from-orange-500/40 to-indigo-500/40 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                  />
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0 mx-1" />
              </div>
              <div className="lg:hidden flex flex-col items-center">
                <div className="w-px h-8 bg-gradient-to-b from-orange-500/40 to-indigo-500/40 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-transparent via-white/40 to-transparent"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                  />
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 rotate-90" />
              </div>
            </motion.div>

            {/* OrbitSynk Core */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="relative"
            >
              <div className="absolute -inset-2 bg-indigo-500/15 rounded-3xl blur-xl" />
              <div className="relative bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-2xl p-6 w-64 text-center shadow-2xl shadow-indigo-500/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="text-[15px] font-bold text-white mb-1">OrbitSynk</div>
                <div className="text-[11px] text-indigo-300/70 mb-4">The Sync Layer</div>
                <div className="space-y-1.5">
                  {['Detect events', 'Process rules', 'Sync access', 'Log actions'].map((step) => (
                    <div key={step} className="flex items-center gap-2 text-left">
                      <CheckCircle2 className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                      <span className="text-[11px] text-indigo-200/60">{step}</span>
                    </div>
                  ))}
                </div>
                {/* Pulse ring */}
                <div className="absolute -inset-px rounded-2xl border border-indigo-400/20 animate-pulse" />
              </div>
            </motion.div>

            {/* Arrow 2 */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="flex items-center lg:flex-1 lg:mx-2"
            >
              <div className="hidden lg:flex items-center w-full">
                <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/40 to-cyan-500/40 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut', delay: 0.5 }}
                  />
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0 mx-1" />
              </div>
              <div className="lg:hidden flex flex-col items-center">
                <div className="w-px h-8 bg-gradient-to-b from-indigo-500/40 to-cyan-500/40 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-transparent via-white/40 to-transparent"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut', delay: 0.5 }}
                  />
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 rotate-90" />
              </div>
            </motion.div>

            {/* Community Platform */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative"
            >
              <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 w-52 text-center group hover:border-white/15 transition-all duration-300 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏘️</span>
                </div>
                <div className="text-[13px] font-semibold text-white/90 mb-1">Community Platform</div>
                <div className="text-[11px] text-white/35">Circle · Skool · Discord</div>
                <div className="mt-3 flex flex-wrap gap-1 justify-center">
                  {['Access', 'Revoke', 'Sync'].map((tag) => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/15">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature list */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="flex items-center gap-2.5 mb-6">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span className="text-[15px] font-semibold text-white">What OrbitSynk handles for you</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                  </div>
                  <span className="text-[13.5px] text-white/65">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
