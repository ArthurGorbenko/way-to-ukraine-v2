import { Media } from '@/components/Media'
import type { Config, Media as MediaType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getRequestLocale, getRequestPayloadLocale } from '@/utilities/getRequestLocale'
import type { Metadata } from 'next'
import Link from 'next/link'

import './active-projects.css'

type ActiveProjectsGlobal = Config['globals']['active-projects']
type MediaResource = string | number | MediaType | null | undefined

const photoFallback =
  'https://www.figma.com/api/mcp/asset/cedddda1-fdfe-47d3-aef6-13255dc95b70'

export default async function ActiveProjectsPage() {
  const locale = await getRequestPayloadLocale()
  const activeProjects = await getCachedGlobal('active-projects', 2, locale)()
  const projects = activeProjects?.projects || []

  return (
    <article className="active-projects-page pb-2 pt-24 lg:pb-0 lg:pt-24">
      <section className="mx-auto w-full max-w-[1320px] px-5 lg:px-8">
        <h1 className="active-projects-title text-center text-[30px] text-white lg:text-[35px]">
          {activeProjects?.pageTitle || 'Актуальні проєкти'}
        </h1>

        <div className="active-projects-list mt-10 lg:mt-12">
          {projects.map((project, index) => {
            const progress = Math.max(0, Math.min(100, Number(project?.progressPercent || 0)))
            const donateHref =
              project?.donateUrl && project.donateUrl !== '#' ? project.donateUrl : '/projects/active/donate'
            const detailsHref =
              project?.detailsUrl && project.detailsUrl !== '#' ? project.detailsUrl : '/projects/active/details'

            return (
              <article key={project.id || index} className="active-project-row">
                <div className="active-project-media">
                  {project?.image ? (
                    <Media resource={project.image as MediaResource} imgClassName="active-project-image" />
                  ) : (
                    <img alt="Актуальний проєкт" className="active-project-image" src={photoFallback} />
                  )}

                  <div className="active-project-image-overlay" />
                  <p className="active-project-image-title">{project?.leftOverlayTitle || 'Збір на авто'}</p>

                  <div className="active-project-emblem-wrap">
                    {project?.badgeImage ? (
                      <Media resource={project.badgeImage as MediaResource} imgClassName="active-project-emblem" />
                    ) : (
                      <div className="active-project-emblem-placeholder">W</div>
                    )}
                  </div>
                </div>

                <div className="active-project-content">
                  <h2 className="active-project-heading">{project?.cardTitle || 'Збір на авто'}</h2>

                  <p className="active-project-line">
                    <span>{project?.unitLabel || 'для:'}</span>{' '}
                    <strong>{project?.unitValue || 'Підрозділ'}</strong>
                  </p>

                  <p className="active-project-line">
                    <span>{project?.directionLabel || 'напрямок:'}</span>{' '}
                    <strong>{project?.directionValue || 'Напрямок'}</strong>
                  </p>

                  <p className="active-project-goal">
                    <span>{project?.goalLabel || 'ціль:'}</span> {project?.goalValue || '000 000 грн'}
                  </p>

                  <div className="active-project-progress-track">
                    <div className="active-project-progress-fill" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="active-project-actions">
                    <Link
                      className="active-project-btn active-project-btn-donate"
                      href={donateHref}
                    >
                      {project?.donateLabel || 'ЗАДОНАТИТИ'}
                    </Link>
                    <Link
                      className="active-project-btn active-project-btn-details"
                      href={detailsHref}
                    >
                      {project?.detailsLabel || 'ДЕТАЛЬНІШЕ'}
                    </Link>
                  </div>
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
  const activeProjects = (await getCachedGlobal('active-projects', 0, payloadLocale)()) as ActiveProjectsGlobal
  const pageTitle = activeProjects?.pageTitle || 'Актуальні проєкти'

  return {
    title: `${pageTitle} | Way to Ukraine`,
    description:
      publicLocale === 'en'
        ? 'Way to Ukraine active projects: current fundraising and active initiatives.'
        : 'Актуальні проєкти Way to Ukraine: поточні збори та активні ініціативи.',
  }
}
