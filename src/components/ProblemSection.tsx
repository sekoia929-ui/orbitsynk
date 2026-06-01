'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, GitFork, Zap, DollarSign, Users, Layers } from 'lucide-react'

const problems = [
  {
    icon: Users,
    title: 'Manual member management',
    description: 'Manually adding and removing members from your community as subscriptions change is a full-time job — and you always fall behind.',
  },
  {
    icon: DollarSign,
    title: 'Failed payments kill revenue',
    description: 'When payments fail, you lose revenue and members get ghost access. No automated recovery means money left on the table.',
  },
  {
    icon: AlertTriangle,
    title: 'Access leaks everywhere',
    description: 'Canceled subscribers quietly retain access for weeks. Your paying members are subsidizing free riders.',
  },
  {
    icon: GitFork,
    title: 'Zapier breaks at scale',
    description: "You've duct-taped Zapier workflows together, but they're brittle, delayed, and fall apart the moment edge cases appear.",
  },
  {
    icon: Layers,
    title: 'Subscription chaos',
    description: "Upgrades, downgrades, pauses, trials — your billing events don't match your community access states. Data is everywhere.",
  },
  {
    icon: Zap,
    title: 'No real-time sync',
    description: "Your billing provider and community platform don't talk. Events get lost. Members are confused about their access.",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}

export default function ProblemSection() {
  return (
    <section className="relative py-28 overflow-hidden" id="problem">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-tag mb-5 mx-auto w-fit">
            <AlertTriangle className="w-3 h-3" />
            The Problem
          </div>
          <h2 className="section-headline text-white mb-5">
            Managing memberships manually<br />
            <span className="gradient-text">is draining your growth.</span>
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto leading-relaxed font-[380]">
            Every hour spent on member management is an hour not spent building your community.
          </p>
        </motion.div>

        {/* Problem cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {problems.map((problem, i) => {
            const Icon = problem.icon
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                className="feature-card p-6 group cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/15 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white mb-2 leading-tight">{problem.title}</h3>
                    <p className="text-[13.5px] text-white/40 leading-relaxed">{problem.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-white/30 text-sm">
            Sound familiar? You're not alone. Thousands of community creators deal with this every day.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
