import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/profile(.*)',
  '/admin(.*)',
  '/events/submit(.*)',
  '/board/new(.*)',
  '/directory/submit(.*)',
  '/devotional/submit(.*)',
  '/api/events(.*)',
  '/api/board(.*)',
  '/api/directory(.*)',
  '/api/devotional(.*)',
  '/api/newsletter/unsubscribe(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
