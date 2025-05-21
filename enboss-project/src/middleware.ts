import { NextRequest, NextResponse } from 'next/server'
import { languages, defaultLanguage } from '@/lib/i18n/settings'

export function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname
  
  // Check if the pathname already has a locale
  const hasLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  if (hasLocale) return
  
  // Get the preferred locale from the request headers
  const acceptLanguage = request.headers.get('accept-language')
  const preferredLocale = acceptLanguage?.split(',')[0].split('-')[0]
  
  // Use the preferred locale if it's supported, otherwise use the default
  const locale = languages.includes(preferredLocale || '') ? preferredLocale : defaultLanguage
  
  // For the root path, redirect to /locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }
  
  // For other paths, redirect to /locale/path
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  )
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\..*).*)',
  ],
}