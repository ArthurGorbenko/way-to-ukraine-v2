import { Media } from '@/components/Media'
import type { Config, Media as MediaType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getRequestLocale, getRequestPayloadLocale } from '@/utilities/getRequestLocale'
import type { Metadata } from 'next'

import './shop.css'

type ShopGlobal = Config['globals']['shop']
type MediaResource = string | number | MediaType | null | undefined

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
          {items.map((item, index) => {
            const frameClass = item?.frameSide === 'right' ? 'shop-frame-right' : 'shop-frame-left'

            return (
              <article key={item.id || index} className="shop-card">
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
              </article>
            )
          })}
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
