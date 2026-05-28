'use client'

import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { useEffect, useState } from 'react'

type MediaResource = string | number | MediaType | null | undefined

interface GalleryItem {
  id?: string | null
  image?: MediaResource
}

interface Props {
  items: GalleryItem[]
  fallbacks: readonly string[]
  fallbackAlt: string
}

export function DetailsGallery({ items, fallbacks, fallbackAlt }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const count = items.length > 0 ? items.length : fallbacks.length
  const isOpen = openIndex !== null

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i !== null ? (i + 1) % count : null))
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i !== null ? (i - 1 + count) % count : null))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, count])

  function renderThumb(index: number) {
    if (items.length > 0) {
      const item = items[index]
      return item?.image ? (
        <Media resource={item.image} imgClassName="details-gallery-image" />
      ) : (
        <img alt={`${fallbackAlt} ${index + 1}`} className="details-gallery-image" src={fallbacks[0]} />
      )
    }
    return (
      <img alt={`${fallbackAlt} ${index + 1}`} className="details-gallery-image" src={fallbacks[index]} />
    )
  }

  function renderLightboxImage(index: number) {
    if (items.length > 0) {
      const item = items[index]
      return item?.image ? (
        <Media resource={item.image} imgClassName="details-lightbox-img" htmlElement={null} />
      ) : (
        <img alt={`${fallbackAlt} ${index + 1}`} className="details-lightbox-img" src={fallbacks[0]} />
      )
    }
    return (
      <img alt={`${fallbackAlt} ${index + 1}`} className="details-lightbox-img" src={fallbacks[index]} />
    )
  }

  return (
    <>
      <section className="details-gallery mt-6" aria-label="Галерея проєкту">
        {Array.from({ length: count }, (_, i) => (
          <article key={i} className="details-gallery-item">
            <button
              className="details-gallery-btn"
              aria-label={`${fallbackAlt} ${i + 1}`}
              onClick={() => setOpenIndex(i)}
            >
              {renderThumb(i)}
            </button>
          </article>
        ))}
      </section>

      {isOpen && openIndex !== null && (
        <div
          className="details-lightbox-backdrop"
          onClick={() => setOpenIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Збільшене фото"
        >
          <button
            className="details-lightbox-close"
            aria-label="Закрити"
            onClick={() => setOpenIndex(null)}
          >
            ×
          </button>

          {count > 1 && (
            <button
              className="details-lightbox-prev"
              aria-label="Попереднє фото"
              onClick={(e) => {
                e.stopPropagation()
                setOpenIndex((i) => (i !== null ? (i - 1 + count) % count : 0))
              }}
            >
              ‹
            </button>
          )}

          <div onClick={(e) => e.stopPropagation()}>
            {renderLightboxImage(openIndex)}
          </div>

          {count > 1 && (
            <button
              className="details-lightbox-next"
              aria-label="Наступне фото"
              onClick={(e) => {
                e.stopPropagation()
                setOpenIndex((i) => (i !== null ? (i + 1) % count : 0))
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
