import type { Config } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getRequestLocale, getRequestPayloadLocale } from '@/utilities/getRequestLocale'
import type { Metadata } from 'next'
import { ShopCard } from './ShopCard'

import './shop.css'

type ShopGlobal = Config['globals']['shop']

const photoFallback =
  'https://www.figma.com/api/mcp/asset/4e2f3dfb063c4c6bcf97b169f71ff85b21e594e7'

export default async function ShopPage() {
  const locale = await getRequestPayloadLocale()
  const shop = await getCachedGlobal('shop', 2, locale)()
  const items = shop?.items || []

  return (
    <article className="shop-page pb-12 pt-[136px] lg:pb-16 lg:pt-[136px]">
      <section className="mx-auto w-full max-w-[1400px] px-4 lg:px-7">
        <h1 className="shop-title text-center text-[30px] text-white lg:text-[35px]">
          {shop?.pageTitle || 'Крамниця'}
        </h1>

        <div className="shop-grid mt-10 lg:mt-14">
          {items.map((item, index) => (
            <ShopCard key={item.id || index} index={index} item={item} photoFallback={photoFallback} />
          ))}
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const [publicLocale, payloadLocale] = await Promise.all([getRequestLocale(), getRequestPayloadLocale()])
  const shop = (await getCachedGlobal('shop', 0, payloadLocale)()) as ShopGlobal
  const pageTitle = shop?.pageTitle || 'Крамниця'

  return {
    title: `${pageTitle} | Way to Ukraine`,
    description:
      publicLocale === 'en'
        ? 'Way to Ukraine shop: support the fund through branded contribution boxes.'
        : 'Крамниця Way to Ukraine: підтримайте фонд через брендовані благодійні бокси.',
  }
}
