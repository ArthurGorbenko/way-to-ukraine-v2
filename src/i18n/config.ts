export const publicLocales = ['ua', 'en'] as const

export type PublicLocale = (typeof publicLocales)[number]
export type PayloadLocale = 'uk' | 'en'

export const defaultPublicLocale: PublicLocale = 'ua'
export const localeCookieName = 'wtu-locale'

export const publicToPayloadLocale: Record<PublicLocale, PayloadLocale> = {
  ua: 'uk',
  en: 'en',
}

export function isPublicLocale(value: string | null | undefined): value is PublicLocale {
  if (!value) return false
  return publicLocales.includes(value as PublicLocale)
}

export function toPayloadLocale(locale: PublicLocale): PayloadLocale {
  return publicToPayloadLocale[locale]
}

export function normalizeLocale(value: string | null | undefined): PublicLocale {
  return isPublicLocale(value) ? value : defaultPublicLocale
}
