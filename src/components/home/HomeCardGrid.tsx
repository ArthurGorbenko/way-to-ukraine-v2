import { Media } from '@/components/Media'
import type { Homepage as HomepageGlobal, Media as MediaType } from '@/payload-types'
import Link from 'next/link'
import type React from 'react'

type MediaResource = string | number | MediaType | null | undefined

type HomeCard = NonNullable<HomepageGlobal['cards']>[number]

interface HomeCardGridProps {
  cards?: HomeCard[] | null
}

const toSectionId = (href?: string | null, index?: number) => {
  if (!href) return `section-${index ?? 0}`
  if (href.startsWith('#')) return href.slice(1)
  return `section-${index ?? 0}`
}

export const HomeCardGrid: React.FC<HomeCardGridProps> = ({ cards }) => {
  return (
    <section className="mx-auto w-full max-w-[1320px] px-5 pb-8 lg:px-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(cards || []).map((card, index) => {
          const sectionId = toSectionId(card?.href, index)
          return (
            <article
              key={index}
              id={sectionId}
              className="group relative min-h-[260px] overflow-hidden rounded-[36px] lg:min-h-[420px]"
            >
              <div className="absolute inset-0">
                {card?.image ? (
                  <Media resource={card.image as MediaResource} fill pictureClassName="absolute inset-0" imgClassName="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : null}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="relative flex h-full items-end justify-center p-6 text-center">
                <Link
                  href={card?.href || '#'}
                  className="inline-flex flex-col items-center text-xl font-medium text-white lg:text-[28px]"
                >
                  <span>{card?.title}</span>
                  <span className="mt-2 h-[2px] w-20 bg-white/90 lg:w-24" />
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
