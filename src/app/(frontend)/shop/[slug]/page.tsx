import type { Config } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getRequestLocale, getRequestPayloadLocale } from '@/utilities/getRequestLocale'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShopBoxBuilder } from './ShopBoxBuilder.client'

import './shop-box.css'

type ShopItem = NonNullable<Config['globals']['shop']['items']>[number]
type ShopCatalogItem = NonNullable<Config['collections']['shop-items']>

const boxFallback = 'https://www.figma.com/api/mcp/asset/4e2f3dfb063c4c6bcf97b169f71ff85b21e594e7'

function slugifySegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getShopItemPath(item: ShopItem) {
  const configuredUrl = item?.backButtonUrl?.trim()

  if (configuredUrl && configuredUrl !== '/shop' && configuredUrl.startsWith('/shop/')) {
    return configuredUrl
  }

  return `/shop/${slugifySegment(item?.title || 'box')}`
}

function getShopItemSlug(item: ShopItem) {
  return getShopItemPath(item).split('/').filter(Boolean).at(-1) || slugifySegment(item?.title || 'box')
}

function isCatalogItem(value: NonNullable<ShopItem['selectedItems']>[number] | NonNullable<ShopItem['availableItems']>[number]): value is ShopCatalogItem {
  return typeof value === 'object' && value !== null
}

function mergeCatalogItems(currentItem: ShopItem) {
  const selectedItems = (currentItem?.selectedItems || []).filter(isCatalogItem)
  const availableItems = (currentItem?.availableItems || []).filter(isCatalogItem)
  const seen = new Set<string>()
  const allItems: ShopCatalogItem[] = []

  for (const item of [...selectedItems, ...availableItems]) {
    if (!item.id || seen.has(item.id)) continue
    seen.add(item.id)
    allItems.push(item)
  }

  return {
    allItems,
    selectedIds: selectedItems.map((item) => item.id).filter(Boolean),
  }
}

function getShopDetailCopy(locale: 'ua' | 'en') {
  if (locale === 'en') {
    return {
      selectionLabel: 'My box',
      availableLabel: 'Choose an item',
      instruction: 'Choose 5 items from the list on the right, make a screenshot of your donation, and send it to @CU4O2.',
      nextBoxHint: '(go to the next box)',
      screenshotModeLabel: 'Prepare screenshot',
      builderModeLabel: 'Back to builder',
    }
  }

  return {
    selectionLabel: 'Мій бокс',
    availableLabel: 'Оберіть айтем',
    instruction: 'Оберіть 5 айтемів серед запропонованих праворуч, зробіть скрін свого донату та надішліть його @CU4O2.',
    nextBoxHint: '(перейти у наступний бокс)',
    screenshotModeLabel: 'Підготувати скрін',
    builderModeLabel: 'Повернути конструктор',
  }
}

export default async function ShopBoxPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, payloadLocale, publicLocale] = await Promise.all([params, getRequestPayloadLocale(), getRequestLocale()])
  const shop = await getCachedGlobal('shop', 2, payloadLocale)()
  const items = shop?.items || []
  const currentIndex = items.findIndex((item) => getShopItemSlug(item) === slug)

  if (currentIndex === -1) notFound()

  const currentItem = items[currentIndex]
  const nextItem = items[(currentIndex + 1) % items.length] || currentItem
  const detailCopy = getShopDetailCopy(publicLocale)
  const { allItems, selectedIds } = mergeCatalogItems(currentItem)
  const detailEntries = allItems.map((entry, index) => ({
    id: entry.id || `${slug}-${index}`,
    text: entry.title || `${currentItem?.title || 'Box'} item ${index + 1}`,
    price: entry.price || '$0',
    description: entry.description || '',
    image: entry.image,
  }))

  return (
    <article className="shop-box-page pb-16 pt-[136px] lg:pb-24">
      <section className="mx-auto w-full max-w-[1400px] px-4 lg:px-7">
        <h1 className="shop-box-title text-center text-[30px] text-white lg:text-[35px]">{currentItem?.title || 'Shop Box'}</h1>

        <ShopBoxBuilder
          availableLabel={detailCopy.availableLabel}
          imageFallback={boxFallback}
          initialSelectedIds={selectedIds}
          instruction={detailCopy.instruction}
          items={detailEntries}
          nextBoxHint={detailCopy.nextBoxHint}
          nextBoxLabel={nextItem?.title || currentItem?.title || 'Shop box'}
          nextBoxUrl={getShopItemPath(nextItem)}
          screenshotModeLabel={detailCopy.screenshotModeLabel}
          selectionLabel={detailCopy.selectionLabel}
          title={currentItem?.title || 'Shop box'}
          builderModeLabel={detailCopy.builderModeLabel}
        />
      </section>
    </article>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, publicLocale, payloadLocale] = await Promise.all([params, getRequestLocale(), getRequestPayloadLocale()])
  const shop = await getCachedGlobal('shop', 0, payloadLocale)()
  const currentItem = shop?.items?.find((item) => getShopItemSlug(item) === slug)

  if (!currentItem) {
    return {
      title: `Shop | Way to Ukraine`,
    }
  }

  return {
    title: `${currentItem.title} | Way to Ukraine`,
    description:
      publicLocale === 'en'
        ? `Build your ${currentItem.title} and move to the next Way to Ukraine merch box.`
        : `Зберіть ${currentItem.title} та перейдіть до наступного мерч-боксу Way to Ukraine.`,
  }
}
