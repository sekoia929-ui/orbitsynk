import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'OrbitSynk — Automate Membership Access from Subscriptions',
  description: 'OrbitSynk automatically syncs your billing provider with your community platform. Grant access when payments succeed, remove it when they fail.',
  keywords: 'membership automation, subscription sync, community access, billing integration',
  openGraph: {
    title: 'OrbitSynk — The Sync Layer Between Payments and Communities',
    description: 'Automate membership access from subscription payments. Connect billing providers with community platforms.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#EFEFEF] text-gray-900 antialiased overflow-x-hidden">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
