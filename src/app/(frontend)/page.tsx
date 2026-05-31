import { HomeCardGrid } from '@/components/home/HomeCardGrid'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeIntro } from '@/components/home/HomeIntro'
import { HomeStats } from '@/components/home/HomeStats'
import { calculateFundraisingTotals, formatFoundationRaisedAmount } from '@/utilities/fundraisingTotals'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getRequestLocale, getRequestPayloadLocale } from '@/utilities/getRequestLocale'
import type { Metadata } from 'next'

import './home.css'

export default async function HomePage() {
  const locale = await getRequestPayloadLocale()
  const [homepage, activeProjects, finishedProjects] = await Promise.all([
    getCachedGlobal('homepage', 2, locale)(),
    getCachedGlobal('active-projects', 2, locale)(),
    getCachedGlobal('finished-projects', 2, locale)(),
  ])
  const fundraisingTotals = await calculateFundraisingTotals(activeProjects?.projects || [], finishedProjects?.cards || [])
  const stats = {
    ...(homepage.stats || {}),
    left: {
      ...(homepage.stats?.left || {}),
      value: formatFoundationRaisedAmount(fundraisingTotals.displayAmount, locale),
    },
  }

  return (
    <article className="home-page bg-white pb-10">
      <HomeHero data={homepage.hero || {}} />
      <HomeIntro data={homepage.intro || {}} />
      <HomeCardGrid cards={homepage.cards || []} />
      <HomeStats stats={stats} />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()

  return {
    title: 'Way to Ukraine',
    description:
      locale === 'en'
        ? 'Way to Ukraine is a volunteer foundation supporting the Defense Forces of Ukraine.'
        : 'Way to Ukraine — волонтерський фонд середнього масштабу, який працює на благо СОУ.',
  }
}
