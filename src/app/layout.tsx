import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'OrbitSynk — Automate Membership Access from Subscriptions',
  description: 'OrbitSynk automatically syncs your billing provider with your community platform. Grant access when payments succeed, remove it when they fail. The sync layer between payments and communities.',
  keywords: 'membership automation, subscription sync, community access, billing integration, Lemon Squeezy, Circle, Discord, Skool',
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
      <html lang="en" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </head>
        <body className="bg-[#080808] text-white antialiased overflow-x-hidden">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

