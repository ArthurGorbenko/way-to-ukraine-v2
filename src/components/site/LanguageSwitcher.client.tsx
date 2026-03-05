'use client'

import { defaultPublicLocale, type PublicLocale } from '@/i18n/config'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

const LanguageDot = ({ label, active }: { label: string; active: boolean }) => {
  return (
    <span
      className={`grid h-[23px] w-[23px] place-items-center rounded-full text-[10px] font-bold ${
        active ? 'bg-[#ffbc00] text-[#021f42]' : 'bg-white text-[#021f42]'
      }`}
    >
      {label}
    </span>
  )
}

function getLocalizedHref(target: PublicLocale, pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  const first = parts[0]

  if (first === 'ua' || first === 'en') {
    parts[0] = target
    return '/' + parts.join('/')
  }

  if (pathname === '/') return `/${target}`
  return `/${target}${pathname}`
}

export function LanguageSwitcher({ locale }: { locale: PublicLocale }) {
  const pathname = usePathname()

  const { uaHref, enHref } = useMemo(() => {
    const safePath = pathname || '/'
    return {
      uaHref: getLocalizedHref('ua', safePath),
      enHref: getLocalizedHref('en', safePath),
    }
  }, [pathname])

  const activeLocale = locale || defaultPublicLocale

  return (
    <div className="hidden flex-col gap-[6px] lg:flex">
      <a href={uaHref} aria-current={activeLocale === 'ua' ? 'page' : undefined}>
        <LanguageDot active={activeLocale === 'ua'} label="UA" />
      </a>
      <a href={enHref} aria-current={activeLocale === 'en' ? 'page' : undefined}>
        <LanguageDot active={activeLocale === 'en'} label="EN" />
      </a>
    </div>
  )
}
