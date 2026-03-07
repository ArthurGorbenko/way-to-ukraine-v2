import { Media } from '@/components/Media'
import type { PublicLocale } from '@/i18n/config'
import type { Homepage as HomepageGlobal, Media as MediaType } from '@/payload-types'
import { Facebook, Instagram, Send, Twitter } from 'lucide-react'
import Link from 'next/link'
import type React from 'react'

type MediaResource = string | number | MediaType | null | undefined

interface SiteFooterProps {
  data: HomepageGlobal
  locale: PublicLocale
}

const iconMap: Record<string, React.ReactNode> = {
  facebook: <Facebook className="h-5 w-5" />,
  telegram: <Send className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ data, locale }) => {
  const footer = data.footer
  const socials = footer?.socials ?? []
  const isEn = locale === 'en'

  return (
    <footer className="relative mt-auto min-h-[300px] overflow-hidden bg-[#021f42] text-white lg:min-h-[360px]">
      <div className="absolute inset-0">
        {footer?.backgroundImage ? (
          <Media resource={footer.backgroundImage as MediaResource} fill pictureClassName="absolute inset-0" imgClassName="object-cover" />
        ) : null}
      </div>
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.58)_46%,rgba(255,255,255,0)_100%)] lg:h-32" />
      <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_100%)] blur-[6px]" />
      <div className="absolute inset-x-0 bottom-0 h-2 bg-[#ffbc00]" />

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-5 pb-8 pt-28 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-end lg:gap-8 lg:px-8 lg:pb-7 lg:pt-[258px]">
        <Link href="/" className="inline-flex h-[56px] w-[50px] items-end justify-start lg:h-[78px] lg:w-[70px]">
          <svg viewBox="0 0 90 100" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g clipPath="url(#clip0_footer_logo)">
              <path
                d="M71.7535 20.9827C69.3186 22.1404 68.4514 23.5165 68.4948 26.2272C68.6699 37.3693 68.5732 48.5181 68.5748 59.6636C68.5748 61.1025 68.5748 62.5397 68.5748 64.6616C64.7174 62.6819 61.3686 61.1736 58.2734 59.2617C57.1693 58.5787 56.0253 56.9231 56.0103 55.6993C55.8652 43.3283 55.9469 30.954 55.8935 18.5813C55.8852 16.7141 55.3082 14.8899 54.2425 13.3501L45 0L35.7575 13.3517C34.6918 14.8915 34.1148 16.7141 34.1065 18.583C34.0531 30.9556 34.1348 43.3299 33.9897 55.7009C33.9747 56.9248 32.8307 58.5803 31.7266 59.2634C28.6314 61.1752 25.2826 62.6836 21.4252 64.6633C21.4252 62.5413 21.4252 61.1025 21.4252 59.6653C21.4285 48.5198 21.3301 37.3727 21.5052 26.2288C21.5486 23.5165 20.6797 22.1404 18.2465 20.9844C12.211 18.1133 6.32398 14.9329 0 11.6846V100C11.3004 94.2015 22.3541 88.532 34.0448 82.5334L45.0017 77.3287L55.9586 82.5334C67.6493 88.5304 78.7012 94.2015 90.0033 100V11.6846C83.6777 14.9329 77.7906 18.1133 71.7535 20.9827Z"
                fill="#F8F8F8"
              />
            </g>
            <defs>
              <clipPath id="clip0_footer_logo">
                <rect width="90" height="100" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Link>

        <div className="flex flex-wrap items-end gap-2 lg:justify-center">
          {socials.map((item, index) => (
            <Link
              key={index}
              href={item?.url || '#'}
              className="inline-flex h-[37px] items-center gap-2 rounded-full border-2 border-white px-4 text-[15px] leading-none lg:w-[180px] lg:justify-center"
            >
              <span className="text-[20px] leading-none">{iconMap[item?.icon || ''] || '•'}</span>
              <span>{item?.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={footer?.requisitesUrl || 'https://way-to-ukraine.com/en/requisites'}
            className="inline-flex h-[37px] items-center rounded-full bg-white px-6 text-[19px] font-bold text-[#021f42] lg:w-[180px] lg:justify-center"
          >
            {footer?.requisitesLabel || (isEn ? 'Requisites' : 'Реквізити фонду')}
          </Link>
          <Link
            href={footer?.donateUrl || '/projects/active/donate'}
            className="inline-flex h-[37px] items-center rounded-full bg-[#ffbc00] px-6 text-[19px] font-bold text-[#021f42] lg:w-[180px] lg:justify-center"
          >
            {footer?.donateLabel || (isEn ? 'DONATE' : 'ЗАДОНАТИТИ')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
