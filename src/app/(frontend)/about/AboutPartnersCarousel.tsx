'use client'

import { Media } from '@/components/Media'
import type { Config, Media as MediaType } from '@/payload-types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'

type Partner = NonNullable<Config['globals']['about']['partnersSection']['partners']>[number]
type MediaResource = string | number | MediaType | null | undefined

const photoFallback = 'https://www.figma.com/api/mcp/asset/7e3640cf-82b2-491e-ad28-9ca5fc0199ab'

function getVisibleCount(width: number) {
  if (width >= 1280) return 5
  if (width >= 1024) return 4
  if (width >= 768) return 3
  if (width >= 560) return 2
  return 1
}

export function AboutPartnersCarousel({ partners }: { partners: Partner[] }) {
  const [visibleCount, setVisibleCount] = useState(5)
  const [pageIndex, setPageIndex] = useState(0)

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(getVisibleCount(window.innerWidth))
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)

    return () => {
      window.removeEventListener('resize', updateVisibleCount)
    }
  }, [])

  const totalPages = Math.max(1, Math.ceil(partners.length / visibleCount))
  const shouldSlide = partners.length > visibleCount
  const pages = Array.from({ length: totalPages }, (_, index) =>
    partners.slice(index * visibleCount, index * visibleCount + visibleCount),
  )

  useEffect(() => {
    setPageIndex((current) => Math.min(current, totalPages - 1))
  }, [totalPages])

  const goPrev = () => {
    setPageIndex((current) => (current === 0 ? totalPages - 1 : current - 1))
  }

  const goNext = () => {
    setPageIndex((current) => (current + 1) % totalPages)
  }

  return (
    <div className={`about-partners-carousel${shouldSlide ? ' is-slideshow' : ''}`}>
      {shouldSlide ? (
        <button
          aria-label="Previous partners"
          className="about-partners-arrow about-partners-arrow-prev"
          onClick={goPrev}
          type="button"
        >
          <ChevronLeft size={34} strokeWidth={2.2} />
        </button>
      ) : null}

      <div className="about-partners-viewport">
        <div
          className="about-partners-track"
          style={
            {
              '--about-visible-count': visibleCount,
              transform: `translateX(-${pageIndex * 100}%)`,
            } as CSSProperties
          }
        >
          {pages.map((pagePartners, page) => (
            <div key={page} className="about-partners-page">
              {pagePartners.map((partner, index) => {
                const cardContent = (
                  <article className="about-partner-card">
                    <div className="about-partner-media">
                      {partner?.image ? (
                        <Media
                          fill
                          resource={partner.image as MediaResource}
                          imgClassName="about-partner-image"
                          pictureClassName="about-partner-picture"
                        />
                      ) : (
                        <img alt={partner?.name || 'Partner'} className="about-partner-image" src={photoFallback} />
                      )}
                      <div className="about-partner-overlay" />
                    </div>

                    <div className="about-partner-copy">
                      <p className="about-partner-name">{partner?.name || 'Партнер'}</p>
                      <p className="about-partner-description">
                        {partner?.description || 'Короткий опис партнера та його внеску в підтримку фонду.'}
                      </p>
                      <span className="about-partner-line" />
                    </div>
                  </article>
                )

                return (
                  <div key={partner.id || `${page}-${index}`} className="about-partner-slide">
                    {partner?.url ? (
                      <Link className="about-partner-link" href={partner.url} rel="noreferrer" target="_blank">
                        {cardContent}
                      </Link>
                    ) : (
                      cardContent
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {shouldSlide ? (
        <button
          aria-label="Next partners"
          className="about-partners-arrow about-partners-arrow-next"
          onClick={goNext}
          type="button"
        >
          <ChevronRight size={34} strokeWidth={2.2} />
        </button>
      ) : null}
    </div>
  )
}
