'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Zap, X, ArrowRight } from 'lucide-react'

type PlanId = 'starter' | 'growth' | 'pro'

const plans: Array<{
  id: PlanId
  name: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  features: string[]
  cta: string
  popular?: boolean
  highlight?: string
}> = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 19,
    yearlyPrice: 15,
    description: 'Perfect for solo creators just getting started with automated memberships.',
    features: [
      '1 billing provider connection',
      '1 community platform connection',
      'Up to 500 active members',
      'Real-time sync',
      'Failed payment recovery',
      'Event log (30 days)',
      'Email support',
    ],
    cta: 'Get Started',
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: 'For growing communities that need more connections and advanced automation.',
    features: [
      '2 billing provider connections',
      '3 community platform connections',
      'Up to 5,000 active members',
      'Real-time sync',
      'Advanced dunning & recovery',
      'Event log (90 days)',
      'Custom automation rules',
      'Analytics dashboard',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: true,
    highlight: 'Most Popular',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 129,
    yearlyPrice: 99,
    description: 'For high-volume communities and businesses with enterprise requirements.',
    features: [
      'Unlimited billing connections',
      'Unlimited community connections',
      'Unlimited active members',
      'Real-time sync',
      'Advanced dunning & recovery',
      'Event log (1 year)',
      'Custom automation rules',
      'Advanced analytics & exports',
      'Webhook API access',
      'Dedicated Slack support',
      'SLA guarantee',
    ],
    cta: 'Get Started',
  },
]

const notIncluded: Record<PlanId, string[]> = {
  starter: ['Multiple connections', 'Custom rules', 'API access'],
  growth: ['Unlimited members', 'API access', 'Dedicated support'],
  pro: [],
}

export default function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#F5F5F5]" id="pricing">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center gap-2 mb-5 mx-auto w-fit text-[11px] font-semibold tracking-wider uppercase text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            Pricing
          </div>
          <h2 className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Simple, transparent pricing.<br />
            Pay as you grow.
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
            No per-member fees. No hidden costs. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-2 bg-gray-200/50 border border-gray-200 rounded-xl p-1">
            {(['monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setBilling(period)}
                className={`px-5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  billing === period
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {period === 'monthly' ? 'Monthly' : 'Yearly'}
                {period === 'yearly' && (
                  <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
            const notInc = notIncluded[plan.id]

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl p-7 flex flex-col bg-white border ${
                  plan.popular
                    ? 'border-orange-500 shadow-lg'
                    : 'border-gray-200 shadow-sm'
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 bg-[#F26522] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {plan.highlight}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-extrabold text-gray-900 tracking-tight">${price}</span>
                    <span className="text-[13px] text-gray-500 mb-1.5">/mo</span>
                  </div>
                  {billing === 'yearly' && (
                    <p className="text-[12px] text-gray-400 mt-1">Billed ${price * 12}/year</p>
                  )}
                </div>

                {/* CTA */}
                <a
                  href="#waitlist"
                  id={`pricing-${plan.id}-cta`}
                  className={`group relative inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-[14px] font-medium transition-colors duration-300 mb-7 ${
                    plan.popular
                      ? 'bg-[#F26522] text-white hover:bg-[#e05a1a]'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-roll-container">
                    <span>{plan.cta}</span>
                    <span>{plan.cta}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 ${
                    plan.popular ? 'bg-white text-[#F26522]' : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    <ArrowRight size={14} />
                  </div>
                </a>

                {/* Features */}
                <div className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[13px] text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {notInc.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 opacity-50">
                      <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[13px] text-gray-400 line-through">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-sm text-gray-400 mt-10"
        >
          All plans include a 14-day free trial. No credit card required to start.
        </motion.p>
      </div>
    </section>
  )
}
