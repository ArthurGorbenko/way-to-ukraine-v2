import { HomeCardGrid } from '@/components/home/HomeCardGrid'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeIntro } from '@/components/home/HomeIntro'
import { HomeStats } from '@/components/home/HomeStats'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Metadata } from 'next'

import './home.css'

export default async function HomePage() {
  const homepage = await getCachedGlobal('homepage', 2)()

  return (
    <article className="home-page bg-white pb-10">
      <HomeHero data={homepage.hero || {}} />
      <HomeIntro data={homepage.intro || {}} />
      <HomeCardGrid cards={homepage.cards || []} />
      <HomeStats stats={homepage.stats || {}} />
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Way to Ukraine',
  description: 'Way to Ukraine — волонтерський фонд середнього масштабу, який працює на благо СОУ.',
}
