import { CMSLink } from '@/components/Link'
import type { Header as HeaderGlobal } from '@/payload-types'
import Link from 'next/link'
import type React from 'react'

type HeaderLink = NonNullable<HeaderGlobal['navItems']>[number]['link']

type SiteHeaderProps = {
  data: HeaderGlobal
}

const LanguageDot = ({ label, active }: { label: string; active: boolean }) => {
  return (
    <div
      className={`grid h-6 w-6 place-items-center rounded-full text-[9px] font-bold ${
        active ? 'bg-[#ffbc00] text-[#021f42]' : 'bg-white text-[#021f42]'
      }`}
    >
      {label}
    </div>
  )
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ data }) => {
  const navItems = data?.navItems ?? []

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 bg-gradient-to-b from-[#021f42]/95 via-[#021f42]/60 to-transparent">
      <div className="pointer-events-auto mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 px-5 py-5 lg:px-8">
        <Link href="/" className="inline-flex h-[56px] w-[56px] items-center justify-center">
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
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white lg:flex">
          {navItems.map((item, index) => {
            const link = item?.link as HeaderLink | undefined
            if (!link) return null

            return <CMSLink key={index} {...link} className="uppercase tracking-[0.02em]" />
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={data?.donateUrl || '#'}
            className="rounded-full bg-[#ffbc00] px-4 py-2 text-xs font-extrabold text-[#021f42] lg:px-5"
          >
            {data?.donateLabel || 'ЗАДОНАТИТИ'}
          </Link>

          <div className="hidden flex-col gap-1 lg:flex">
            <LanguageDot active label="UA" />
            <LanguageDot active={false} label="EN" />
          </div>
        </div>
      </div>
    </header>
  )
}
