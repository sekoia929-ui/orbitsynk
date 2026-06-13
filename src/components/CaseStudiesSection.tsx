'use client'

import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

const NARRATIV_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4'
const LUMINAR_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4'

function LinkIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export default function CaseStudiesSection() {
  return (
    <section
      id="how-it-works"
      className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Badge row */}
        <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold" style={{ fontSize: '11px' }}>2</span>
          </div>
          <span className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
            Featured client work
          </span>
        </div>

        {/* Heading */}
        <h2
          className="px-5 sm:px-8 lg:px-12 font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16"
          style={{
            fontSize: 'clamp(1.75rem, 7vw, 4.2rem)',
          }}
        >
          Our integrations
        </h2>

        {/* Cards grid */}
        <div className="px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">

          {/* Card 1 */}
          <div>
            {/* Video container */}
            <div
              className="relative rounded-2xl overflow-hidden bg-[#1a1d2e] group cursor-pointer"
              style={{ aspectRatio: '329/246' }}
            >
              <video
                src={NARRATIV_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Hover expand button — white pill */}
              <div className="absolute bottom-4 left-4">
                <div className="group/btn relative inline-flex items-center justify-center h-9 w-9 group-hover:w-[148px] bg-white rounded-full overflow-hidden transition-all duration-300 ease-in-out">
                  <span className="absolute left-4 text-[13px] font-medium text-gray-900 whitespace-nowrap opacity-0 group-hover/btn:opacity-100 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                    Learn more
                  </span>
                  <span className="absolute right-2 flex items-center justify-center w-5 h-5 flex-shrink-0 text-gray-900 transition-transform duration-300 group-hover:-rotate-45">
                    <LinkIcon size={14} />
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed">
              Automated membership sync for a high-growth creator community — driving record retention and zero manual access management.
            </p>
            {/* Title */}
            <p className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">
              Stripe × Circle Integration
            </p>
          </div>

          {/* Card 2 */}
          <div>
            {/* Video container */}
            <div
              className="relative rounded-2xl overflow-hidden bg-[#6b6b6b] group cursor-pointer"
              style={{ aspectRatio: '1/1' }}
            >
              <video
                src={LUMINAR_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Hover expand button — dark pill */}
              <div className="absolute bottom-4 left-4">
                <div className="group/btn relative inline-flex items-center justify-center h-9 w-9 group-hover:w-[168px] bg-gray-900 rounded-full overflow-hidden transition-all duration-300 ease-in-out">
                  <span className="absolute left-4 text-[13px] font-medium text-white whitespace-nowrap opacity-0 group-hover/btn:opacity-100 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                    View case study
                  </span>
                  <span className="absolute right-2 flex items-center justify-center w-5 h-5 flex-shrink-0 text-white transition-transform duration-300 group-hover:-rotate-45">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed">
              Transforming a manual subscription model into a fully automated membership experience with real-time access control.
            </p>
            {/* Title */}
            <p className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">
              Lemon Squeezy × Discord
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
