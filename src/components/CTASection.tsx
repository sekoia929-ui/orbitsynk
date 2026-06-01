'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, CheckCircle2, Zap } from 'lucide-react'

export default function CTASection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'cta' }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong')
        setStatus('error')
        return
      }

      setStatus('success')
      setEmail('')
    } catch {
      setErrorMsg('Network error — please try again')
      setStatus('error')
    }
  }

  return (
    <section className="relative py-28 overflow-hidden" id="waitlist">
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Strong glow center */}
      <div className="orb w-[800px] h-[800px] bg-indigo-600/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="orb w-[400px] h-[400px] bg-violet-600/10 top-1/2 left-1/3 pointer-events-none" style={{ animationDelay: '3s' }} />
      
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          {/* Tag */}
          <div className="section-tag mb-8 mx-auto w-fit">
            <Zap className="w-3 h-3" />
            Join the Waitlist
          </div>

          {/* Headline */}
          <h2 className="hero-headline text-white mb-6">
            Stop managing memberships<br />
            <span className="gradient-text">manually.</span>
          </h2>

          {/* Subtext */}
          <p className="text-white/45 text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-[380]">
            OrbitSynk automates the entire payment-to-access workflow so your community runs itself.
            Join hundreds of creators on the waitlist.
          </p>

          {/* Email form */}
          <div className="max-w-lg mx-auto mb-8">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 py-4 px-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">You're on the list! We'll be in touch soon.</span>
              </motion.div>
            ) : status === 'error' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 py-3 px-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <span className="text-red-300 text-sm">{errorMsg}</span>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 bg-white/[0.05] border border-white/10 hover:border-white/15 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 text-white placeholder:text-white/25 rounded-xl px-5 py-3.5 text-[14px] transition-all duration-200"
                  required
                />
                <button
                  type="submit"
                  id="waitlist-submit"
                  disabled={status === 'loading'}
                  className="relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-semibold text-white overflow-hidden flex-shrink-0 disabled:opacity-70 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600" />
                  <span className="relative z-10 flex items-center gap-2">
                    {status === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Get Early Access
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-white/25">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/60" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/60" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/60" />
              Cancel anytime
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
