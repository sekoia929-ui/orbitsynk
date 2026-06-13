'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

const SMALL_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85'
const LARGE_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85'

export default function AboutSection() {
  return (
    <section
      id="product"
      className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Badge row */}
        <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold" style={{ fontSize: '11px' }}>1</span>
          </div>
          <span className="text-[12px] sm:text-[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
            Introducing OrbitSynk
          </span>
        </div>

        {/* Heading */}
        <h2
          className="px-5 sm:px-8 lg:px-12 font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-28"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 3.2rem)' }}
        >
          Strategy-led automation, delivering<br />
          results for membership communities.
        </h2>

        {/* Mobile / Tablet layout (lg:hidden) */}
        <div className="lg:hidden px-5 sm:px-8">
          <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-900 mb-6">
            Through seamless integrations and real-time sync, we help growing
            communities realize their full revenue potential — automatically.
          </p>
          <a
            href="#waitlist"
            className="group inline-flex items-center gap-2 text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 pr-2 py-2 mb-10 transition-colors duration-300"
            style={{ background: '#F26522' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e05a1a')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F26522')}
          >
            <div className="text-roll-container">
              <span>About OrbitSynk</span>
              <span>About OrbitSynk</span>
            </div>
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
              <ArrowRight size={13} style={{ color: '#F26522' }} />
            </div>
          </a>

          {/* Stacked images */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            <div className="sm:w-[45%] relative" style={{ aspectRatio: '438/346' }}>
              <img
                src={SMALL_IMAGE}
                alt="OrbitSynk dashboard"
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
            <div className="sm:w-[55%] relative" style={{ aspectRatio: '900/600' }}>
              <img
                src={LARGE_IMAGE}
                alt="OrbitSynk integrations"
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:grid px-5 sm:px-8 lg:px-12 items-end gap-6 xl:gap-8" style={{ gridTemplateColumns: '26% 1fr 48%' }}>
          {/* Left: small image */}
          <div className="self-end" style={{ aspectRatio: '438/346', position: 'relative' }}>
            <img
              src={SMALL_IMAGE}
              alt="OrbitSynk dashboard"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Center: text + CTA */}
          <div className="self-start flex flex-col items-end">
            <p className="text-[16px] sm:text-[18px] leading-[1.65] font-medium text-gray-900 mb-6 whitespace-nowrap text-right">
              Through seamless integrations<br />
              and real-time sync, we help<br />
              growing communities realize<br />
              their full revenue potential.
            </p>
            <a
              href="#waitlist"
              className="group inline-flex items-center gap-2 text-white text-[14px] font-medium rounded-full pl-6 pr-2 py-2 transition-colors duration-300"
              style={{ background: '#F26522' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e05a1a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#F26522')}
            >
              <div className="text-roll-container">
                <span>About OrbitSynk</span>
                <span>About OrbitSynk</span>
              </div>
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                <ArrowRight size={13} style={{ color: '#F26522' }} />
              </div>
            </a>
          </div>

          {/* Right: large image */}
          <div className="self-end" style={{ aspectRatio: '3/2', position: 'relative' }}>
            <img
              src={LARGE_IMAGE}
              alt="OrbitSynk integrations"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
