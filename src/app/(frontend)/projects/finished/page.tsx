import { Media } from '@/components/Media'
import type { Config, Media as MediaType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getRequestLocale, getRequestPayloadLocale } from '@/utilities/getRequestLocale'
import type { Metadata } from 'next'

import './finished-projects.css'

type FinishedProjectsGlobal = Config['globals']['finished-projects']
type MediaResource = string | number | MediaType | null | undefined

const photoFallback =
  'https://www.figma.com/api/mcp/asset/7e3640cf-82b2-491e-ad28-9ca5fc0199ab'

export default async function FinishedProjectsPage() {
  const locale = await getRequestPayloadLocale()
  const finishedProjects = await getCachedGlobal('finished-projects', 2, locale)()
  const cards = finishedProjects?.cards || []

  return (
    <article className="finished-projects-page pb-12 pt-24 lg:pb-16 lg:pt-24">
      <section className="mx-auto w-full max-w-[1400px] px-4 lg:px-7">
        <h1 className="finished-projects-title text-center text-[30px] text-white lg:text-[35px]">
          {finishedProjects?.pageTitle || 'Закриті проєкти'}
        </h1>

        <div className="finished-projects-grid mt-10 lg:mt-14">
          {cards.map((card, index) => {
            const cornerClass = card?.cornerStyle === 'right' ? 'project-corner-right' : 'project-corner-left'

            return (
              <article key={card.id || index} className="finished-project-card">
                {card?.image ? (
                  <Media resource={card.image as MediaResource} imgClassName="finished-project-image" />
                ) : (
                  <img alt="Закритий проєкт" className="finished-project-image" src={photoFallback} />
                )}

                <div className="finished-project-overlay" />
                <div className={`project-corner ${cornerClass}`} />

                <div className="project-meta-wrap">
                  <p className="project-unit">{card?.unit || '120 бригада, 173 батальйон'}</p>
                  <p className="project-vehicle">{card?.vehicle || 'STEYR 1291'}</p>
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
  const finishedProjects = (await getCachedGlobal('finished-projects', 0, payloadLocale)()) as FinishedProjectsGlobal
  const pageTitle = finishedProjects?.pageTitle || 'Закриті проєкти'

  return {
    title: `${pageTitle} | Way to Ukraine`,
    description:
      publicLocale === 'en'
        ? 'Way to Ukraine closed projects: completed fundraisers and delivered support.'
        : 'Закриті проєкти Way to Ukraine: завершені збори та реалізовані поставки.',
  }
}
