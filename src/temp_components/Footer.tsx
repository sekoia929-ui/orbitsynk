'use client'

import Image from 'next/image'
import { Twitter, Linkedin, Github } from 'lucide-react'

const footerLinks = {
  Product: ['Features', 'How It Works', 'Pricing', 'Changelog', 'Roadmap'],
  Integrations: ['Lemon Squeezy', 'Paddle', 'Circle', 'Skool', 'Stripe (Soon)'],
  Company: ['About', 'Blog', 'Careers', 'Press Kit'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'DPA'],
}

const integrationLogos = [
  { name: 'Lemon Squeezy', emoji: '🍋', color: 'from-yellow-500/20 to-lime-500/20', border: 'border-yellow-500/20' },
  { name: 'Paddle', emoji: '🏓', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/20' },
  { name: 'Circle', emoji: '⭕', color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/20' },
  { name: 'Skool', emoji: '🏫', color: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/20' },
  { name: 'Discord', emoji: '💬', color: 'from-indigo-500/20 to-blue-500/20', border: 'border-indigo-500/20', soon: true },
  { name: 'Stripe', emoji: '💳', color: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/20', soon: true },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#060606] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Integrations strip */}
        <div className="py-10 border-b border-white/5">
          <p className="text-[11px] font-medium text-white/25 uppercase tracking-widest text-center mb-6">Works with your stack</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {integrationLogos.map((logo) => (
              <div
                key={logo.name}
                className={`relative flex items-center gap-2.5 bg-gradient-to-br ${logo.color} border ${logo.border} rounded-xl px-4 py-2.5 transition-all duration-300 hover:scale-105`}
              >
                <span className="text-lg">{logo.emoji}</span>
                <span className="text-[12px] font-medium text-white/60">{logo.name}</span>
                {logo.soon && (
                  <span className="text-[9px] font-bold text-white/30 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded-full">SOON</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main footer content */}
        <div className="py-14 grid grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 mb-5 group">
              <div className="w-8 h-8 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="OrbitSynk"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[15px] font-bold tracking-tight">
                Orbit<span className="text-indigo-400">Synk</span>
              </span>
            </a>
            <p className="text-[13px] text-white/35 leading-relaxed mb-6 max-w-[220px]">
              The sync layer between payments and communities. Built for creators, by creators.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Github, href: '#', label: 'GitHub' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center text-white/35 hover:text-white hover:bg-white/8 hover:border-white/15 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-white/45 hover:text-white/80 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/20">
            © 2025 OrbitSynk Inc. All rights reserved.
          </p>
          <p className="text-[12px] text-white/15">
            Built with ♥ for community creators everywhere.
          </p>
        </div>
      </div>
    </footer>
  )
}
