import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',   // webhooks — no auth from billing providers
  '/api/waitlist(.*)',   // waitlist — public landing page form
  '/api/cron(.*)',       // cron — authenticated via CRON_SECRET header, not Clerk
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    try {
      await auth.protect()
    } catch {
      // If Clerk fails (e.g. missing keys), redirect to sign-in
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
