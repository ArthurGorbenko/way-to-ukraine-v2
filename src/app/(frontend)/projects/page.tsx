import type { Metadata } from 'next'
import { Media } from '@/components/Media'
import type { Config, Media as MediaType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import { getRequestLocale, getRequestPayloadLocale } from '@/utilities/getRequestLocale'

import './projects.css'

type ProjectsOverviewGlobal = Config['globals']['projects-overview']
type MediaResource = string | number | MediaType | null | undefined

const cardImageFallbacks = [
  'https://www.figma.com/api/mcp/asset/cedddda1-fdfe-47d3-aef6-13255dc95b70',
  'https://www.figma.com/api/mcp/asset/8dee3735-0e2d-43e3-ba7c-da2341073e8d',
] as const

export default async function ProjectsPage() {
  const locale = await getRequestPayloadLocale()
  const projectsOverview = await getCachedGlobal('projects-overview', 2, locale)()
  const cards = projectsOverview?.cards || []

  return (
    <article className="projects-page pt-24 lg:pt-24 lg:pb-24">
      <section className="mx-auto w-full max-w-[1320px] px-5 lg:px-8">
        <h1 className="projects-title text-center text-[34px] text-white lg:text-[50px]">
          {projectsOverview?.pageTitle || 'Проєкти'}
        </h1>

        <div className="projects-grid mt-10 lg:mt-14">
          {cards.map((card, index) => {
            const outlineClass =
              card?.accentSide === 'right' ? 'project-card-outline-right' : 'project-card-outline-left'
            const fallbackImage = cardImageFallbacks[index] || cardImageFallbacks[0]

            return (
              <article key={card.id || index} className="project-card">
                {card?.image ? (
                  <Media
                    resource={card.image as MediaResource}
                    imgClassName="project-card-image"
                  />
                ) : (
                  <img alt={card?.title || 'Project card'} className="project-card-image" src={fallbackImage} />
                )}
                <div className="project-card-overlay" />
                <div className={`project-card-outline ${outlineClass}`} />
                <Link href={card?.url || '/projects'} className="project-card-cta">
                  {card?.title || 'Проєкт'}
                </Link>
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
  const projectsOverview = (await getCachedGlobal('projects-overview', 0, payloadLocale)()) as ProjectsOverviewGlobal
  const pageTitle = projectsOverview?.pageTitle || (publicLocale === 'en' ? 'Projects' : 'Проєкти')

  return {
    title: `${pageTitle} | Way to Ukraine`,
    description: publicLocale === 'en'
      ? 'Way to Ukraine projects: active and completed initiatives.'
      : 'Проєкти Way to Ukraine: актуальні та закриті ініціативи фонду.',
  }
}
