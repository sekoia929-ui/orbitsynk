import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — OrbitSynk',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center grid-bg">
      <div className="orb w-96 h-96 bg-indigo-600/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none fixed" />
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  )
}
