'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight, Clock } from 'lucide-react'

const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Connect', href: '#connect' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileOpen(false)
    const targetId = href.replace(/.*\#/, '')
    const elem = document.getElementById(targetId)
    elem?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <>
      {/* Navbar */}
      <div className="relative z-20 max-w-[1440px] mx-auto p-2 sm:p-3">
        <nav className="bg-white rounded-full px-3 py-[5px] flex items-center justify-between shadow-sm">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href="#" onClick={(e) => handleScroll(e, '#')} className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold" style={{ fontSize: '10px', letterSpacing: '-0.03em' }}>OS</span>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Time + CTA */}
          <div className="hidden md:flex items-center gap-5">
            <span className="text-[13px] text-gray-600 hidden lg:block">
              Now accepting early access
            </span>
            <a
              href="#waitlist"
              onClick={(e) => handleScroll(e, '#waitlist')}
              id="navbar-cta"
              className="group relative inline-flex items-center gap-2 bg-gray-900 text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 overflow-hidden hover:bg-gray-800 transition-colors duration-300"
            >
              <div className="text-roll-container">
                <span>Get Early Access</span>
                <span>Get Early Access</span>
              </div>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                <ArrowRight size={12} className="text-gray-900" />
              </div>
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden bg-gray-900 text-white rounded-full p-2 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Bottom Sheet */}
        <div
          className={`absolute bottom-0 left-0 right-0 mx-3 mb-3 bg-white rounded-2xl overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            mobileOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="px-6 pt-6 pb-8">

            {/* Nav Links */}
            <div className="flex flex-col gap-1 mb-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="py-2 text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-gray-500 transition-colors duration-300 leading-tight"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#waitlist"
              onClick={(e) => handleScroll(e, '#waitlist')}
              className="group inline-flex items-center gap-2 bg-gray-900 text-white text-[14px] font-medium rounded-full pl-5 pr-2 py-2.5 overflow-hidden hover:bg-gray-800 transition-colors duration-300"
            >
              <div className="text-roll-container">
                <span>Get Early Access</span>
                <span>Get Early Access</span>
              </div>
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                <ArrowRight size={13} className="text-gray-900" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
