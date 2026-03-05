import { cookies, headers } from 'next/headers'

import { isPublicLocale, localeCookieName, type PayloadLocale, type PublicLocale, toPayloadLocale } from '@/i18n/config'

export async function getRequestLocale(): Promise<PublicLocale> {
  const requestHeaders = await headers()
  const headerLocale = requestHeaders.get('x-wtu-locale')
  if (isPublicLocale(headerLocale)) return headerLocale

  const cookieStore = await cookies()
  const value = cookieStore.get(localeCookieName)?.value
  return value === 'en' ? 'en' : 'ua'
}

export async function getRequestPayloadLocale(): Promise<PayloadLocale> {
  const locale = await getRequestLocale()
  return toPayloadLocale(locale)
}
