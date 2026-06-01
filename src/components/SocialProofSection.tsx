'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Marcus Chen',
    role: 'Founder, Growth Academy',
    avatar: 'MC',
    avatarGradient: 'from-violet-500 to-indigo-600',
    content: "I was manually adding and removing 200+ members every month. OrbitSynk completely eliminated that. The moment someone pays, they're in. The moment they cancel, they're out. It just works.",
    metric: '200+ hours saved per year',
    stars: 5,
  },
  {
    name: 'Sarah Okafor',
    role: 'Community Lead, Creator Collective',
    avatar: 'SO',
    avatarGradient: 'from-pink-500 to-rose-600',
    content: "We had a serious problem with failed payment ghost members. OrbitSynk's recovery flow caught 94% of churned subscribers. It basically paid for itself in the first week.",
    metric: '$12,400 recovered in 30 days',
    stars: 5,
  },
  {
    name: 'James Whitfield',
    role: 'CEO, Mastermind Pro',
    avatar: 'JW',
    avatarGradient: 'from-amber-500 to-orange-600',
    content: "I tried building this with Zapier. It broke constantly. OrbitSynk is built exactly for this use case. The sync is near-instant and I've had zero issues in 3 months.",
    metric: '0 sync errors in 90 days',
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Founder, Wellness Circle',
    avatar: 'PS',
    avatarGradient: 'from-emerald-500 to-teal-600',
    content: "Setting up OrbitSynk took me 8 minutes. Eight. Minutes. Now my 1,200 member community runs itself from a billing perspective. That's genuinely life-changing.",
    metric: '1,200 members synced automatically',
    stars: 5,
  },
  {
    name: 'David Laurent',
    role: 'Course Creator, Trading Insiders',
    avatar: 'DL',
    avatarGradient: 'from-blue-500 to-cyan-600',
    content: "The event log alone is worth it. I can see exactly what happened for any member — when they subscribed, when a payment failed, when we recovered. Full transparency.",
    metric: 'Full audit trail for 850+ members',
    stars: 5,
  },
  {
    name: 'Aisha Johnson',
    role: 'Coach, Elevated Entrepreneurs',
    avatar: 'AJ',
    avatarGradient: 'from-purple-500 to-violet-600',
    content: "My previous setup had a 48-hour delay between someone paying and getting community access. People were emailing me constantly. OrbitSynk made it instant. No more support tickets.",
    metric: 'Access now granted in < 2 seconds',
    stars: 5,
  },
]

const metrics = [
  { value: '2,400+', label: 'Communities automated' },
  { value: '$2.8M+', label: 'Revenue recovered' },
  { value: '99.9%', label: 'Sync reliability' },
  { value: '< 2s', label: 'Average sync time' },
]

export default function SocialProofSection() {
  return (
    <section className="relative py-28 overflow-hidden" id="social-proof">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="orb w-[500px] h-[500px] bg-violet-600/8 top-1/2 left-1/4 pointer-events-none" />

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
            <Star className="w-3 h-3" />
            Social Proof
          </div>
          <h2 className="section-headline text-white mb-5">
            Creators trust OrbitSynk<br />
            <span className="gradient-text">to run their memberships.</span>
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto font-[380]">
            Join hundreds of community creators who've eliminated manual membership management.
          </p>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          {metrics.map((metric, i) => (
            <div
              key={i}
              className="text-center p-6 glass-card rounded-2xl"
            >
              <div className="stat-number gradient-text-blue mb-1">{metric.value}</div>
              <div className="text-sm text-white/40">{metric.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="feature-card p-6 group cursor-default"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.stars)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote icon */}
              <Quote className="w-6 h-6 text-white/10 mb-3" />

              {/* Content */}
              <p className="text-[13.5px] text-white/60 leading-relaxed mb-5 font-[380]">
                "{testimonial.content}"
              </p>

              {/* Metric */}
              <div className="bg-indigo-500/10 border border-indigo-500/15 rounded-lg px-3 py-2 mb-5">
                <span className="text-[12px] font-semibold text-indigo-300">✦ {testimonial.metric}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${testimonial.avatarGradient} flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">{testimonial.name}</div>
                  <div className="text-[11px] text-white/40">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
