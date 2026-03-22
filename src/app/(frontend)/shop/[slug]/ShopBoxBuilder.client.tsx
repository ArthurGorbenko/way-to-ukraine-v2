'use client'

import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import Link from 'next/link'
import type { RefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

type MediaResource = string | number | MediaType | null | undefined

type ShopDetailEntry = {
  id: string
  text: string
  price: string
  description: string
  image?: MediaResource
}

type ShopBoxBuilderProps = {
  title: string
  imageFallback: string
  items: ShopDetailEntry[]
  initialSelectedIds: string[]
  selectionLabel: string
  availableLabel: string
  instruction: string
  nextBoxLabel: string
  nextBoxHint: string
  nextBoxUrl: string
  screenshotModeLabel: string
  builderModeLabel: string
}

export function ShopBoxBuilder({
  title,
  imageFallback,
  items,
  initialSelectedIds,
  selectionLabel,
  availableLabel,
  instruction,
  nextBoxLabel,
  nextBoxHint,
  nextBoxUrl,
  screenshotModeLabel,
  builderModeLabel,
}: ShopBoxBuilderProps) {
  const maxSelection = items.length
  const selectedDefaults = useMemo(() => initialSelectedIds, [initialSelectedIds])
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedDefaults)
  const [isScreenshotMode, setIsScreenshotMode] = useState(false)
  const selectedListRef = useRef<HTMLDivElement>(null)
  const availableListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedIds(selectedDefaults)
  }, [selectedDefaults])

  const selectedItems = items.filter((item) => selectedIds.includes(item.id))
  const availableItems = items.filter((item) => !selectedIds.includes(item.id))

  const toggleItem = (entryId: string) => {
    setSelectedIds((current) => {
      if (current.includes(entryId)) {
        return current.filter((id) => id !== entryId)
      }

      if (current.length >= maxSelection) {
        return current
      }

      return [...current, entryId]
    })
  }

  const scrollListByPanel = (listRef: RefObject<HTMLDivElement | null>) => {
    const list = listRef.current

    if (!list) return

    const remainingScroll = list.scrollHeight - list.clientHeight - list.scrollTop
    const scrollStep = Math.max(list.clientHeight * 0.72, 160)

    if (remainingScroll <= 8) {
      list.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    list.scrollBy({ top: scrollStep, behavior: 'smooth' })
  }

  return (
    <section className={`shop-box-builder ${isScreenshotMode ? 'shop-box-builder-capture' : ''}`}>
      <div className="shop-box-builder-tools">
        <button
          type="button"
          className="shop-box-mode-toggle"
          onClick={() => setIsScreenshotMode((current) => !current)}
        >
          {isScreenshotMode ? builderModeLabel : screenshotModeLabel}
        </button>
      </div>

      <div className="shop-box-columns">
        <section className="shop-box-panel shop-box-panel-selected">
          <div className="shop-box-pill shop-box-pill-selected">{selectionLabel}</div>

          <div
            ref={selectedListRef}
            className={`shop-box-cards ${selectedItems.length === 0 ? 'shop-box-cards-empty' : ''}`}
          >
            {selectedItems.length > 0 ? (
              selectedItems.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className="shop-box-item-card"
                  onClick={() => toggleItem(entry.id)}
                  aria-label={`${entry.text}. Remove from ${title}`}
                >
                  <div className="shop-box-item-thumb">
                    {entry.image ? (
                      <Media alt={entry.text} resource={entry.image} imgClassName="shop-box-item-thumb-image" />
                    ) : (
                      <img alt={entry.text} className="shop-box-item-thumb-image" src={imageFallback} />
                    )}
                  </div>

                  <div className="shop-box-item-copy">
                    <p className="shop-box-item-title">
                      {entry.text}. <span className="shop-box-item-price">{entry.price}</span>
                    </p>
                    <p className="shop-box-item-description">{entry.description}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="shop-box-empty-placeholder" aria-hidden="true" />
            )}
          </div>

          <button
            type="button"
            className="shop-box-panel-arrow"
            onClick={() => scrollListByPanel(selectedListRef)}
            aria-label={`Scroll ${selectionLabel} list`}
          />
        </section>

        <div className="shop-box-center-arrow" aria-hidden="true">
          ←
        </div>

        <section className="shop-box-panel shop-box-panel-available">
          <div className="shop-box-pill shop-box-pill-available">{availableLabel}</div>

          <div ref={availableListRef} className="shop-box-cards">
            {availableItems.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="shop-box-item-card"
                onClick={() => toggleItem(entry.id)}
                aria-label={`${entry.text}. Add to ${title}`}
              >
                <div className="shop-box-item-thumb">
                  {entry.image ? (
                    <Media alt={entry.text} resource={entry.image} imgClassName="shop-box-item-thumb-image" />
                  ) : (
                    <img alt={entry.text} className="shop-box-item-thumb-image" src={imageFallback} />
                  )}
                </div>

                <div className="shop-box-item-copy">
                  <p className="shop-box-item-title">
                    {entry.text}. <span className="shop-box-item-price">{entry.price}</span>
                  </p>
                  <p className="shop-box-item-description">{entry.description}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="shop-box-panel-arrow"
            onClick={() => scrollListByPanel(availableListRef)}
            aria-label={`Scroll ${availableLabel} list`}
          />
        </section>
      </div>

      <div className="shop-box-footer-row">
        <p className="shop-box-instruction">{instruction}</p>

        <div className="shop-box-next-wrap">
          <Link href={nextBoxUrl} className="shop-box-next-link">
            {nextBoxLabel}
          </Link>
          <p className="shop-box-next-hint">{nextBoxHint}</p>
        </div>
      </div>
    </section>
  )
}
