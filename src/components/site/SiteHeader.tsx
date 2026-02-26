import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { Header as HeaderGlobal, Media as MediaType } from '@/payload-types'
import Link from 'next/link'
import type React from 'react'

type MediaResource = string | number | MediaType | null | undefined

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
          {data?.customLogo ? (
            <Media resource={data.customLogo as MediaResource} imgClassName="h-full w-full object-contain" />
          ) : (
            <svg viewBox="0 0 90 100" className="h-full w-full" aria-hidden="true">
              <path
                fill="#ffbc00"
                d="M12 10L38 24V54L24 62V38L12 32V10ZM44 28L78 10V68L56 80V50L44 56V28ZM24 70L38 62V90L12 76V46L24 52V70Z"
              />
            </svg>
          )}
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
