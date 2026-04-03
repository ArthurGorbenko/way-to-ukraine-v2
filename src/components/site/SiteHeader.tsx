'use client'

import { CMSLink } from '@/components/Link'
import { type PublicLocale } from '@/i18n/config'
import type { Header as HeaderGlobal } from '@/payload-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type React from 'react'
import { useEffect, useId, useState } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher.client'

type HeaderLink = NonNullable<HeaderGlobal['navItems']>[number]['link']

type SiteHeaderProps = {
  data: HeaderGlobal
  locale: PublicLocale
}

const BurgerButton = ({
  expanded,
  controls,
  onClick,
}: {
  expanded: boolean
  controls: string
  onClick: () => void
}) => {
  return (
    <button
      aria-controls={controls}
      aria-expanded={expanded}
      aria-label={expanded ? 'Close menu' : 'Open menu'}
      className="flex h-8 w-8 items-center justify-center lg:hidden"
      type="button"
      onClick={onClick}
    >
      <span className="relative h-[14px] w-4">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="absolute left-0 h-[2px] w-4 rounded-full bg-white transition-transform duration-200"
            style={{ top: `${index * 6}px` }}
          />
        ))}
      </span>
    </button>
  )
}

const MobileMenu: React.FC<{
  controls: string
  isOpen: boolean
  locale: PublicLocale
  navItems: HeaderLink[]
  onNavigate: () => void
}> = ({ controls, isOpen, locale, navItems, onNavigate }) => {
  return (
    <div
      id={controls}
      className={`pointer-events-auto border-t border-white/20 bg-[#021f42] text-white lg:hidden ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-[1fr_auto] gap-x-5 gap-y-4 px-5 py-3">
        <nav
          className="flex flex-wrap items-center gap-x-4 gap-y-3 text-[10px] leading-none font-normal"
          onClick={onNavigate}
        >
          {navItems.map((link, index) => (
            <CMSLink
              key={`${link.url || link.label || 'nav'}-${index}`}
              {...link}
              className="leading-none text-white transition-opacity hover:opacity-75"
            />
          ))}
        </nav>

        <div onClick={onNavigate}>
          <LanguageSwitcher
            className="flex flex-col gap-[6px]"
            dotClassName="h-4 w-4 text-[8px]"
            locale={locale}
          />
        </div>
      </div>
    </div>
  )
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ data, locale }) => {
  const navItems = (data?.navItems ?? [])
    .map((item) => item?.link as HeaderLink | undefined)
    .filter((item): item is HeaderLink => Boolean(item))
  const isEn = locale === 'en'
  const pathname = usePathname()
  const controls = useId()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const donateHref = data?.donateUrl || '/projects/active/donate'
  const donateLabel = data?.donateLabel || (isEn ? 'DONATE' : 'ЗАДОНАТИТИ')

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 bg-gradient-to-b from-[#021f42] via-[#021f42]/70 to-transparent">
      <div className="pointer-events-auto mx-auto flex w-full max-w-[1320px] items-center justify-between gap-5 px-5 py-4 lg:px-8 lg:py-9">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="inline-flex h-[43px] w-[36px] items-center justify-center lg:h-[64px] lg:w-[58px]">
            <svg viewBox="0 0 58 65" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <g clipPath="url(#clip0_header_logo)">
                <path
                  d="M45.96 13.55C44.4 14.3 43.85 15.19 43.87 16.94C43.98 24.14 43.92 31.34 43.92 38.54C43.92 39.47 43.92 40.4 43.92 41.77C41.45 40.49 39.3 39.52 37.32 38.28C36.61 37.84 35.88 36.77 35.87 35.98C35.78 27.99 35.84 19.99 35.8 12C35.79 10.79 35.43 9.62 34.74 8.62L28.82 0L22.9 8.62C22.22 9.61 21.85 10.79 21.84 12C21.81 19.99 21.86 27.98 21.77 35.97C21.76 36.76 21.03 37.83 20.32 38.27C18.34 39.51 16.19 40.48 13.72 41.76C13.72 40.39 13.72 39.46 13.72 38.53C13.72 31.33 13.66 24.13 13.77 16.93C13.8 15.18 13.24 14.29 11.68 13.54C7.82 11.7 4.05 9.64 0 7.55V64.59C7.24 60.84 14.32 57.18 21.81 53.31L28.83 49.95L35.85 53.31C43.34 57.18 50.42 60.85 57.66 64.59V7.55C53.6 9.64 49.83 11.7 45.96 13.55Z"
                  fill="#FFBC00"
                />
              </g>
              <defs>
                <clipPath id="clip0_header_logo">
                  <rect width="57.65" height="64.59" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>

          <span className="text-[7px] leading-[1.2] font-normal text-white lg:hidden">
            <span className="block">WAY TO</span>
            <span className="block">UKRAINE</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-[19px] font-normal text-white lg:flex">
          {navItems.map((link, index) => (
            <CMSLink key={`${link.url || link.label || 'desktop'}-${index}`} {...link} className="leading-none" />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex lg:gap-4">
          <Link
            href={donateHref}
            className="inline-flex h-[37px] items-center justify-center rounded-full bg-[#ffbc00] px-5 text-[11px] font-bold text-[#021f42] lg:w-[180px] lg:text-[19px]"
          >
            {donateLabel}
          </Link>

          <LanguageSwitcher locale={locale} />
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 lg:hidden">
          <Link
            href={donateHref}
            className="inline-flex h-[20px] items-center justify-center rounded-[30px] bg-[#ffbc00] px-4 text-[10px] font-bold leading-none text-[#021f42]"
          >
            {donateLabel}
          </Link>

          <BurgerButton
            controls={controls}
            expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          />
        </div>
      </div>

      <MobileMenu
        controls={controls}
        isOpen={isMobileMenuOpen}
        locale={locale}
        navItems={navItems}
        onNavigate={() => setIsMobileMenuOpen(false)}
      />
    </header>
  )
}
