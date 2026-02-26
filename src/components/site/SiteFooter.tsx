import { Media } from '@/components/Media'
import type { Homepage as HomepageGlobal, Media as MediaType } from '@/payload-types'
import { Instagram, Send, Twitter } from 'lucide-react'
import Link from 'next/link'
import type React from 'react'

type MediaResource = string | number | MediaType | null | undefined

interface SiteFooterProps {
  data: HomepageGlobal
}

const iconMap: Record<string, React.ReactNode> = {
  telegram: <Send className="h-3 w-3" />,
  instagram: <Instagram className="h-3 w-3" />,
  twitter: <Twitter className="h-3 w-3" />,
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ data }) => {
  const footer = data.footer
  const socials = footer?.socials ?? []

  return (
    <footer className="relative mt-auto min-h-[260px] overflow-hidden bg-[#021f42] text-white lg:min-h-[340px]">
      <div className="absolute inset-0 opacity-85">
        {footer?.backgroundImage ? (
          <Media resource={footer.backgroundImage as MediaResource} imgClassName="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f3f4f6] via-white/75 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/50 to-transparent blur-sm" />
      <div className="absolute inset-x-0 bottom-0 h-3 bg-[#ffbc00]" />

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-5 pb-14 pt-32 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-end lg:gap-8 lg:px-8 lg:pb-16 lg:pt-44">
        <Link href="/" className="inline-flex h-[56px] w-[56px] items-end justify-start text-[#ffbc00] lg:h-[78px] lg:w-[78px]">
          {footer?.logoImage ? (
            <Media resource={footer.logoImage as MediaResource} imgClassName="h-full w-full object-contain" />
          ) : (
            <svg viewBox="0 0 90 100" className="h-full w-full" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 10L38 24V54L24 62V38L12 32V10ZM44 28L78 10V68L56 80V50L44 56V28ZM24 70L38 62V90L12 76V46L24 52V70Z"
              />
            </svg>
          )}
        </Link>

        <div className="flex flex-wrap items-end gap-2 lg:justify-center">
          {socials.map((item, index) => (
            <Link
              key={index}
              href={item?.url || '#'}
              className="inline-flex items-center gap-2 rounded-full border border-white px-5 py-2 text-sm leading-none"
            >
              <span className="text-[10px]">{iconMap[item?.icon || ''] || '•'}</span>
              <span>{item?.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={footer?.requisitesUrl || '#'}
            className="rounded-full bg-white px-6 py-2 text-sm font-bold text-[#021f42]"
          >
            {footer?.requisitesLabel || 'РЕКВІЗИТИ'}
          </Link>
          <Link
            href={footer?.donateUrl || '#'}
            className="rounded-full bg-[#ffbc00] px-6 py-2 text-sm font-bold text-[#021f42]"
          >
            {footer?.donateLabel || 'ЗАДОНАТИТИ'}
          </Link>
        </div>
      </div>
    </footer>
  )
}
