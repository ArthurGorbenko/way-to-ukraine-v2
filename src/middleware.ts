import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { defaultPublicLocale, isPublicLocale, localeCookieName } from '@/i18n/config'

const EXCLUDED_PREFIXES = ['/api', '/admin', '/_next', '/next', '/assets', '/media']
const EXCLUDED_FILES = ['/favicon.ico', '/favicon.svg', '/robots.txt', '/sitemap.xml']

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (EXCLUDED_FILES.includes(pathname) || EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  const [, maybeLocale, ...rest] = pathname.split('/')
  const cookieLocale = req.cookies.get(localeCookieName)?.value
  const fallbackLocale = isPublicLocale(cookieLocale) ? cookieLocale : defaultPublicLocale

  if (pathname === '/') {
    const redirectURL = req.nextUrl.clone()
    redirectURL.pathname = `/${fallbackLocale}`
    return NextResponse.redirect(redirectURL)
  }

  if (isPublicLocale(maybeLocale)) {
    const rewrittenURL = req.nextUrl.clone()
    rewrittenURL.pathname = `/${rest.join('/')}` || '/'
    rewrittenURL.search = search

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-wtu-locale', maybeLocale)

    const response = NextResponse.rewrite(rewrittenURL, {
      request: {
        headers: requestHeaders,
      },
    })
    response.cookies.set(localeCookieName, maybeLocale, { path: '/' })
    return response
  }

  const redirectURL = req.nextUrl.clone()
  redirectURL.pathname = `/${fallbackLocale}${pathname}`
  return NextResponse.redirect(redirectURL)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
}
