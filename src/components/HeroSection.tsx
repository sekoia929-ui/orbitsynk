'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, CheckCircle2, XCircle, AlertCircle, RefreshCw, Users, TrendingUp } from 'lucide-react'

const events = [
  { type: 'success', label: 'Payment Succeeded', user: 'alex@example.com', plan: 'Growth', time: '2s ago', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { type: 'access', label: 'Access Granted', user: 'alex@example.com', community: 'Pro Circle', time: '2s ago', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
  { type: 'failed', label: 'Payment Failed', user: 'sara@example.com', plan: 'Starter', time: '1m ago', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  { type: 'recovery', label: 'Recovery Initiated', user: 'sara@example.com', action: 'Retry in 24h', time: '1m ago', icon: RefreshCw, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { type: 'sync', label: 'Membership Synced', user: 'john@example.com', plan: 'Pro', time: '3m ago', icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-100" />
      
      {/* Glowing orbs */}
      <div className="orb w-[600px] h-[600px] bg-indigo-600/15 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="orb w-[400px] h-[400px] bg-violet-600/10 top-1/3 right-1/4 pointer-events-none" style={{ animationDelay: '3s' }} />
      <div className="orb w-[300px] h-[300px] bg-blue-600/10 bottom-1/3 left-1/4 pointer-events-none" style={{ animationDelay: '5s' }} />
      
      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <a href="#waitlist" className="group inline-flex items-center gap-2.5 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 hover:border-indigo-500/30 rounded-full px-5 py-2.5 transition-all duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 relative">
              <span className="absolute inset-0 rounded-full bg-indigo-400 ping-slow" />
            </span>
            <span className="text-[13px] font-medium text-indigo-300">Now accepting early access applications</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto mb-6"
        >
          <h1 className="hero-headline mb-0">
            <span className="text-white">Automate membership access</span>
            <br />
            <span className="gradient-text">from subscription payments.</span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-center text-white/50 text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-[380]"
        >
          OrbitSynk keeps your billing and community perfectly in sync — automatically.
          Grant access when payments succeed, remove it when they fail.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#waitlist"
            id="hero-cta-primary"
            className="relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[15px] font-semibold text-white overflow-hidden group shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Get Early Access</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#demo"
            id="hero-cta-demo"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[15px] font-medium text-white/70 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
          >
            <Play className="w-4 h-4" />
            Book a Demo
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-16 text-sm"
        >
          {[
            { value: '< 2s', label: 'Sync time' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '0', label: 'Code required' },
            { value: '5 min', label: 'Setup time' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="font-semibold text-white">{stat.value}</span>
              <span className="text-white/35">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
          
          {/* Dashboard container */}
          <div className="relative bg-[#0d0d0d] border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
            {/* Dashboard header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-[#0a0a0a]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 max-w-[280px] mx-auto">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-white/40 font-mono">app.orbitsynk.com/dashboard</span>
                </div>
              </div>
            </div>

            {/* Dashboard body */}
            <div className="p-6">
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Active Members', value: '2,847', change: '+12%', up: true },
                  { label: 'Revenue Synced', value: '$48.2K', change: '+8.3%', up: true },
                  { label: 'Failed Recovered', value: '94%', change: '+2.1%', up: true },
                  { label: 'Access Events', value: '18.4K', change: '+24%', up: true },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                    <div className="text-[11px] text-white/40 mb-1.5 font-medium">{stat.label}</div>
                    <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-[11px] text-emerald-400 font-medium">{stat.change} this month</div>
                  </div>
                ))}
              </div>

              {/* Events feed */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-white/80">Live Event Stream</span>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 relative">
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                    </span>
                    Live
                  </span>
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2.5"
                >
                  {events.map((event, i) => {
                    const Icon = event.icon
                    return (
                      <motion.div
                        key={i}
                        variants={itemVariants}
                        className={`flex items-center gap-3 p-3 rounded-lg ${event.bg} border ${event.border}`}
                      >
                        <Icon className={`w-4 h-4 ${event.color} flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <span className={`text-[12px] font-semibold ${event.color}`}>{event.label}</span>
                          <span className="text-[12px] text-white/40 ml-2">{event.user}</span>
                        </div>
                        <span className="text-[11px] text-white/25 flex-shrink-0 font-mono">{event.time}</span>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
