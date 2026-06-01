'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: 'What billing providers does OrbitSynk support?',
    a: "We currently support Lemon Squeezy and Paddle. Stripe is on our roadmap and coming soon. We'll notify waitlist members when each new integration launches.",
  },
  {
    q: 'Which community platforms can I connect?',
    a: 'OrbitSynk currently supports Circle and Skool. Discord integration is coming soon. We chose these platforms first because they\'re where most paid communities live today.',
  },
  {
    q: 'How fast is the sync?',
    a: 'Our average sync time is under 2 seconds from the moment a billing event occurs to when community access is updated. We process webhooks in real-time with no polling delays.',
  },
  {
    q: "Do I need to know how to code?",
    a: "Not at all. OrbitSynk is designed for non-technical creators. The entire setup — connecting your billing provider, linking your community, and configuring automation rules — is done through our visual dashboard with no code required.",
  },
  {
    q: 'What happens when a payment fails?',
    a: "OrbitSynk starts a recovery sequence: it can send dunning emails (via your billing provider), maintain a configurable grace period, attempt retries, and finally revoke access only after your defined recovery window. You control every step of this flow.",
  },
  {
    q: 'Is my data secure?',
    a: "Yes. OrbitSynk uses OAuth for platform connections and only stores the minimal data needed for sync operations. We never store payment card details. All data is encrypted in transit and at rest. We're SOC 2 Type II compliant.",
  },
  {
    q: 'Can I use OrbitSynk with multiple communities?',
    a: "Yes. Depending on your plan, you can connect multiple billing providers and multiple community platforms. The Growth plan supports up to 3 community connections, and Pro has unlimited connections.",
  },
  {
    q: "What's your uptime SLA?",
    a: "OrbitSynk offers a 99.9% uptime SLA on all paid plans, backed by enterprise-grade infrastructure on AWS with multi-region redundancy. Your membership automation never sleeps.",
  },
]

function FAQItem({ question, answer, isOpen, onToggle, index }: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className={`text-[15px] font-medium leading-snug transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
          {question}
        </span>
        <span className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
          isOpen 
            ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400 rotate-180' 
            : 'border-white/10 text-white/30 group-hover:border-white/20 group-hover:text-white/50'
        }`}>
          <ChevronDown className="w-3.5 h-3.5" />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[13.5px] text-white/45 leading-relaxed pr-10">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full h-px bg-white/5" />
    </motion.div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative py-28 overflow-hidden" id="faq">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="section-tag mb-5 mx-auto w-fit">
            <HelpCircle className="w-3 h-3" />
            FAQ
          </div>
          <h2 className="section-headline text-white mb-4">
            Questions answered.
          </h2>
          <p className="text-white/45 text-base font-[380]">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="glass-card rounded-2xl px-7 py-2">
          <div className="h-px w-full bg-white/5 mt-2" />
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              index={i}
            />
          ))}
        </div>

        {/* Contact prompt */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-white/30 mt-8"
        >
          Still have questions?{' '}
          <a href="mailto:hello@orbitsynk.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Email us
          </a>
          {' '}and we'll get back to you quickly.
        </motion.p>
      </div>
    </section>
  )
}
