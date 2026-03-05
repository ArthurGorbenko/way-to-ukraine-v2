import { Media } from '@/components/Media'
import type { Config, Media as MediaType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import {
  Ambulance,
  BusFront,
  Camera,
  CarFront,
  DollarSign,
  Drone,
  Gem,
  Radio,
  Radar,
  SatelliteDish,
  Truck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import './achievements.css'

type AchievementsGlobal = Config['globals']['achievements']
type MediaResource = string | number | MediaType | null | undefined
const photoFallback = 'https://www.figma.com/api/mcp/asset/9cc03699-d590-4158-920e-7e7b97a95fef'

const iconMap: Record<string, LucideIcon> = {
  ambulance: Ambulance,
  antenna: SatelliteDish,
  bus: BusFront,
  diamond: Gem,
  dollar: DollarSign,
  drone: Drone,
  nightVision: Camera,
  pickup: CarFront,
  reb: Radio,
  spectrum: Radar,
  suv: CarFront,
  truck: Truck,
}

const IconGlyph = ({ iconStyle }: { iconStyle?: string | null }) => {
  if (iconStyle === 'currency') {
    return <span className="text-[44px] leading-none">₴</span>
  }

  const Icon = iconMap[iconStyle || 'diamond'] || Gem
  return <Icon className="h-10 w-10" strokeWidth={1.8} />
}

export default async function AchievementsPage() {
  const achievements = await getCachedGlobal('achievements', 2)()
  const topStats = achievements?.topStats || []
  const cards = achievements?.cards || []

  return (
    <article className="achievements-page pb-4 pt-20 lg:pb-6 lg:pt-24">
      <section className="achievements-header mx-auto w-full max-w-[1320px] px-5 py-8 text-center lg:px-8 lg:py-12">
        <h1 className="text-[30px] font-normal text-white lg:text-[35px]">
          {achievements?.pageTitle || 'Досягнення'}
        </h1>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-5 lg:px-8">
        <div className="achievements-top-grid overflow-hidden rounded-[30px]">
          {topStats.map((item, index) => (
            <article key={item.id || index} className={`top-stat top-stat-${item?.theme || 'dark'}`}>
              <div className="top-stat-icon-wrap">
                <IconGlyph iconStyle={item?.iconStyle} />
              </div>
              <p className="top-stat-value mt-4">{item?.value}</p>
              <p className="top-stat-label mt-1">{item?.caption}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-5 py-4 lg:px-8 lg:py-6">
        <div className="achievements-grid-shell rounded-[30px] p-3 lg:p-5">
          <div className="achievements-grid">
            {cards.map((card, index) => {
              if (card?.layoutType === 'photoWide') {
                return (
                  <article key={card.id || index} className="achievement-photo-card">
                    {card?.featuredImage ? (
                      <Media resource={card.featuredImage as MediaResource} imgClassName="h-full w-full object-cover" />
                    ) : (
                      <img alt="Закритий проєкт" className="h-full w-full object-cover" src={photoFallback} />
                    )}
                  </article>
                )
              }

              return (
                <article key={card.id || index} className="achievement-card">
                  <div className="icon-badge">
                    <div className={`icon-badge-shadow icon-badge-shadow-${card?.leafPosition || 'center'}`} />
                    <div className="icon-badge-face">
                      <IconGlyph iconStyle={card?.iconStyle} />
                    </div>
                  </div>
                  <p className="mt-5 text-[50px] font-bold leading-[0.8] text-[#021f42]">{card?.value}</p>
                  <p className="mt-2 text-center text-[17px] leading-tight text-[#021f42]">{card?.label}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1320px] px-5 pb-4 text-center lg:px-8 lg:pb-6">
        <Link
          href={achievements?.cta?.url || '#'}
          className="inline-flex h-[85px] w-full max-w-[428px] items-center justify-center rounded-[30px] bg-[#ffbc00] px-9 py-4 text-[27px] font-bold uppercase text-[#021f42]"
        >
          {achievements?.cta?.label || 'ЗАКРИТІ ПРОЄКТИ'}
        </Link>
      </div>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const achievements = (await getCachedGlobal('achievements', 0)()) as AchievementsGlobal
  const pageTitle = achievements?.pageTitle || 'Досягнення'

  return {
    title: `${pageTitle} | Way to Ukraine`,
    description: 'Досягнення Way to Ukraine: техніка, обладнання та підтримані підрозділи.',
  }
}
