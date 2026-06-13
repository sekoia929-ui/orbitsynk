'use client'

import dynamic from 'next/dynamic'
import { ArrowRight } from 'lucide-react'

// Dynamically import shaders (WebGL — no SSR)
const ShaderCanvas = dynamic(() => import('./ShaderCanvas'), { ssr: false })

// Starburst SVG partner badge icon (per spec)
function StarburstIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
    </svg>
  )
}

export default function HeroSection() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace(/.*\#/, '')
    const elem = document.getElementById(targetId)
    elem?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: '#EFEFEF' }}
    >
      {/* Shader overlay — absolute, inset-0, z-10, pointer-events-none */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <ShaderCanvas />
      </div>

      {/* Spacer pushes content to bottom */}
      <div className="flex-1" />

      {/* Hero Content — z-20, pinned to bottom */}
      <div className="relative z-20 max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
        {/* Small label */}
        <p className="text-[13px] sm:text-[14px] text-gray-900 tracking-wide mb-5 sm:mb-8">
          OrbitSynk
        </p>

        {/* Headline */}
        <h1
          className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-8 sm:mb-12"
          style={{
            fontSize: 'clamp(1.75rem, 7vw, 4.2rem)',
          }}
        >
          We automate membership access
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          for communities ready to
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          scale without the manual work.
        </h1>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          {/* Orange primary button */}
          <a
            href="#waitlist"
            onClick={(e) => handleScroll(e, '#waitlist')}
            id="hero-cta-primary"
            className="group inline-flex items-center gap-2 text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 transition-colors duration-300"
            style={{ background: '#F26522' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e05a1a')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F26522')}
          >
            <div className="text-roll-container">
              <span>Get Early Access</span>
              <span>Get Early Access</span>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
              <ArrowRight size={13} style={{ color: '#F26522' }} />
            </div>
          </a>

          {/* Certified Partner badge */}
          <div
            className="inline-flex items-center gap-2.5 bg-white rounded-[4px] px-3 py-2 transition-shadow duration-300"
            style={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
          >
            <StarburstIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E8704E]" />
            <span className="text-[13px] sm:text-[14px] font-medium text-gray-900">
              Trusted Platform
            </span>
            <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded font-medium">
              Beta
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
