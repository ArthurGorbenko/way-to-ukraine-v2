import type { Config } from 'src/payload-types'
import type { PayloadLocale } from '@/i18n/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0, locale: PayloadLocale = 'uk'): Promise<Config['globals'][T]> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale: locale as unknown as 'all',
    fallbackLocale: 'uk' as unknown as null,
  })

  return global as Config['globals'][T]
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0, locale: PayloadLocale = 'uk') =>
  unstable_cache(async () => getGlobal(slug, depth, locale), [slug, locale], {
    tags: [`global_${slug}_${locale}`],
  })
