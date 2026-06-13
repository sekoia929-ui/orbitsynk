'use client'

import { motion } from 'framer-motion'

const integrations = [
  { name: 'Lemon Squeezy', emoji: '🍋' },
  { name: 'Paddle', emoji: '🏓' },
  { name: 'Circle', emoji: '⭕' },
  { name: 'Skool', emoji: '🏫' },
  { name: 'Discord', emoji: '💬' },
  { name: 'Stripe', emoji: '💳' },
  { name: 'Memberspace', emoji: '🔑' },
  { name: 'Kajabi', emoji: '🎯' },
]

export default function IntegrationTicker() {
  const doubled = [...integrations, ...integrations]

  return (
    <div className="relative py-12 overflow-hidden border-y border-gray-200 bg-[#EFEFEF]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#EFEFEF] via-transparent to-[#EFEFEF] z-10 pointer-events-none" />
      
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] text-center mb-6">
        Integrating with your existing tools
      </p>

      <div className="flex overflow-hidden">
        <motion.div
          className="flex gap-6 flex-nowrap"
          animate={{ x: [0, `-${50}%`] }}
          transition={{
            x: {
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
              repeatType: 'loop',
            },
          }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-3 flex-shrink-0 transition-colors duration-200"
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-[13px] font-medium text-gray-600 whitespace-nowrap">{item.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
