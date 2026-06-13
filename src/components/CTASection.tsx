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
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#EFEFEF]" id="waitlist">
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-200" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          {/* Tag */}
          <div className="flex items-center gap-2 mb-8 mx-auto w-fit text-[11px] font-semibold tracking-wider uppercase text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            Join the Waitlist
          </div>

          {/* Headline */}
          <h2 className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            Stop managing memberships<br />
            manually.
          </h2>

          {/* Subtext */}
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            OrbitSynk automates the entire payment-to-access workflow so your community runs itself.
            Join hundreds of creators on the waitlist.
          </p>

          {/* Email form */}
          <div className="max-w-lg mx-auto mb-8">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 py-4 px-6 bg-emerald-50 border border-emerald-200 rounded-2xl"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">You're on the list! We'll be in touch soon.</span>
              </motion.div>
            ) : status === 'error' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 py-3 px-6 bg-red-50 border border-red-200 rounded-2xl">
                  <span className="text-red-700 text-sm">{errorMsg}</span>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
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
                  className="flex-1 bg-white border border-gray-300 hover:border-gray-400 focus:border-[#F26522] focus:outline-none focus:ring-1 focus:ring-[#F26522] text-gray-900 placeholder:text-gray-400 rounded-full px-6 py-3.5 text-[14px] transition-all duration-200 shadow-sm"
                  required
                />
                <button
                  type="submit"
                  id="waitlist-submit"
                  disabled={status === 'loading'}
                  className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[14px] font-semibold text-white overflow-hidden flex-shrink-0 disabled:opacity-70 transition-all duration-300 shadow-sm bg-[#F26522] hover:bg-[#e05a1a]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {status === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <div className="text-roll-container">
                          <span>Get Early Access</span>
                          <span>Get Early Access</span>
                        </div>
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                          <ArrowRight size={12} style={{ color: '#F26522' }} />
                        </div>
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Cancel anytime
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
