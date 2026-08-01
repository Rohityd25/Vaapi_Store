import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Retrieve NextAuth session token cookie
  const sessionToken =
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value ||
    req.cookies.get('authjs.session-token')?.value

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login?callbackUrl=/admin', req.url))
    }
  }

  // Protect /account routes — must be logged in
  if (pathname.startsWith('/account')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
