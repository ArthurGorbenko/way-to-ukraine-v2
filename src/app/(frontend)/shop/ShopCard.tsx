'use client'

import { Media } from '@/components/Media'
import type { Config, Media as MediaType, ShopItem as ShopCatalogItem } from '@/payload-types'
import Link from 'next/link'
import type { KeyboardEvent } from 'react'
import { useState } from 'react'

type ShopItem = NonNullable<Config['globals']['shop']['items']>[number]
type MediaResource = string | number | MediaType | null | undefined

type ShopCardProps = {
  item: ShopItem
  index: number
  photoFallback: string
}

const defaultBackItems = ['First item', 'Second item', 'Third item']

function isShopItemDoc(
  value: NonNullable<ShopItem['availableItems']>[number] | NonNullable<ShopItem['selectedItems']>[number],
): value is ShopCatalogItem {
  return typeof value === 'object' && value !== null
}

function slugifySegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ShopCard({ item, index, photoFallback }: ShopCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const frameClass = item?.frameSide === 'right' ? 'shop-frame-right' : 'shop-frame-left'
  const relationshipItems = (item?.selectedItems || [])
    .filter(isShopItemDoc)
    .map((entry) => entry?.title)
    .filter(Boolean)
  const backItems = relationshipItems || []
  const resolvedBackItems = backItems.length > 0 ? backItems : defaultBackItems
  const buttonUrl =
    item?.backButtonUrl && item.backButtonUrl !== '/shop' ? item.backButtonUrl : `/shop/${slugifySegment(item?.title || 'box')}`
  const isExternalUrl = /^https?:\/\//.test(buttonUrl)

  const toggleFlip = () => {
    setIsFlipped((current) => !current)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleFlip()
    }
  }

  return (
    <article
      className={`shop-card-scene ${isFlipped ? 'is-flipped' : ''}`}
      onClick={toggleFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={item?.title ? `Toggle details for ${item.title}` : `Toggle details for shop item ${index + 1}`}
      aria-pressed={isFlipped}
    >
      <div className="shop-card-inner">
        <div className="shop-card shop-card-face shop-card-front">
          {item?.image ? (
            <Media resource={item.image as MediaResource} imgClassName="shop-card-image" />
          ) : (
            <img alt={item?.title || 'Shop item'} className="shop-card-image" src={photoFallback} />
          )}

          <div className="shop-card-overlay" />
          <div className={`shop-card-frame ${frameClass}`} />

          <div className="shop-card-content">
            <p className="shop-card-title">{item?.title || 'Common W2U Box'}</p>
            <p className="shop-card-price">{item?.price || '$225'}</p>
          </div>
        </div>

        <div className="shop-card shop-card-face shop-card-back">
          <div className="shop-card-back-gradient" />

          {item?.image ? (
            <Media resource={item.image as MediaResource} imgClassName="shop-card-back-image" />
          ) : (
            <img alt="" aria-hidden="true" className="shop-card-back-image" src={photoFallback} />
          )}

          <div className="shop-card-back-shade" />

          <div className="shop-card-back-content">
            <p className="shop-card-back-title">{item?.backTitle || '5 items from the list:'}</p>

            <ul className="shop-card-back-list">
              {resolvedBackItems.map((entry, entryIndex) => (
                <li key={`${entry}-${entryIndex}`} className="shop-card-back-list-item">
                  {entry}
                </li>
              ))}
            </ul>

            <div className="shop-card-back-action">
              <span className="shop-card-back-action-frame" aria-hidden="true" />
              {isExternalUrl ? (
                <a
                  className="shop-card-back-button"
                  href={buttonUrl}
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item?.backButtonLabel || 'LEARN MORE'}
                </a>
              ) : (
                <Link
                  className="shop-card-back-button"
                  href={buttonUrl}
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                >
                  {item?.backButtonLabel || 'LEARN MORE'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
