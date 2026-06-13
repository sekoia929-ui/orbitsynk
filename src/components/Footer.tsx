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
  { name: 'Lemon Squeezy', emoji: '🍋', bg: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-200' },
  { name: 'Paddle', emoji: '🏓', bg: 'bg-blue-50 text-blue-600', border: 'border-blue-200' },
  { name: 'Circle', emoji: '⭕', bg: 'bg-purple-50 text-purple-600', border: 'border-purple-200' },
  { name: 'Skool', emoji: '🏫', bg: 'bg-orange-50 text-orange-600', border: 'border-orange-200' },
  { name: 'Discord', emoji: '💬', bg: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-200', soon: true },
  { name: 'Stripe', emoji: '💳', bg: 'bg-fuchsia-50 text-fuchsia-600', border: 'border-fuchsia-200', soon: true },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-200 overflow-hidden bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Integrations strip */}
        <div className="py-10 border-b border-gray-200">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-6">Works with your stack</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {integrationLogos.map((logo) => (
              <div
                key={logo.name}
                className={`relative flex items-center gap-2.5 ${logo.bg} border ${logo.border} rounded-xl px-4 py-2.5 transition-transform duration-300 hover:scale-105`}
              >
                <span className="text-lg">{logo.emoji}</span>
                <span className="text-[12px] font-medium text-gray-700">{logo.name}</span>
                {logo.soon && (
                  <span className="text-[9px] font-bold text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded-full">SOON</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main footer content */}
        <div className="py-14 grid grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2.5 flex-shrink-0 mb-5">
              <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold" style={{ fontSize: '10px', letterSpacing: '-0.03em' }}>OS</span>
              </div>
              <span className="text-[15px] font-bold tracking-tight text-gray-900">
                OrbitSynk
              </span>
            </a>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-6 max-w-[220px]">
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
                  className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-[11px] font-semibold text-gray-900 uppercase tracking-widest mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-gray-500 hover:text-[#F26522] transition-colors duration-200"
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
        <div className="py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-400">
            © 2026 OrbitSynk Inc. All rights reserved.
          </p>
          <p className="text-[12px] text-gray-400">
            Built with ♥ for community creators everywhere.
          </p>
        </div>
      </div>
    </footer>
  )
}
