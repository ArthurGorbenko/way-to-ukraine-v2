import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Metadata } from 'next'
import { DonateMethods } from './DonateMethods.client'

import './donate.css'

type MediaResource = string | number | MediaType | null | undefined

const photoFallback = 'https://www.figma.com/api/mcp/asset/cedddda1-fdfe-47d3-aef6-13255dc95b70'

export default async function ActiveProjectDonatePage() {
  const activeProjects = await getCachedGlobal('active-projects', 2)()
  const project = activeProjects?.projects?.[0]
  const progress = Math.max(0, Math.min(100, Number(project?.progressPercent || 0)))
  const paymentMethods = project?.donateMethods || []

  return (
    <article className="donate-page pb-10 pt-30 lg:pb-30 lg:pt-24">
      <section className="mx-auto w-full max-w-[1320px] px-5 lg:px-8">
        <h1 className="donate-title text-center text-[30px] text-white lg:text-[35px]">
          {project?.donatePageTitle || 'Задонатити'}
        </h1>

        <div className="donate-project-row mt-10 lg:mt-14">
          <article className="donate-project-media">
            {project?.image ? (
              <Media
                resource={project.image as MediaResource}
                imgClassName="donate-project-image"
              />
            ) : (
              <img alt="Актуальний проєкт" className="donate-project-image" src={photoFallback} />
            )}

            <div className="donate-project-overlay" />
            <p className="donate-project-overlay-title">
              {project?.leftOverlayTitle || 'Збір на авто'}
            </p>

            <div className="donate-project-emblem-wrap">
              {project?.badgeImage ? (
                <Media
                  resource={project.badgeImage as MediaResource}
                  imgClassName="donate-project-emblem"
                />
              ) : (
                <div className="donate-project-emblem-placeholder">W</div>
              )}
            </div>
          </article>

          <section className="donate-project-content">
            <h2 className="donate-project-heading">{project?.cardTitle || 'Збір на авто'}</h2>

            <p className="donate-project-line">
              {project?.unitLabel || 'для:'} <strong>{project?.unitValue || 'Підрозділ'}</strong>
            </p>

            <p className="donate-project-line">
              {project?.directionLabel || 'напрямок:'}{' '}
              <strong>{project?.directionValue || 'Напрямок'}</strong>
            </p>

            <p className="donate-project-goal">
              {project?.goalLabel || 'ціль:'} <strong>{project?.goalValue || '000 000 грн'}</strong>
            </p>

            <div className="donate-project-progress-track">
              <div className="donate-project-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </section>
        </div>

        <DonateMethods methods={paymentMethods} />
      </section>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const activeProjects = await getCachedGlobal('active-projects', 0)()
  const pageTitle = activeProjects?.projects?.[0]?.donatePageTitle || 'Задонатити'

  return {
    title: `${pageTitle} | Way to Ukraine`,
    description: 'Сторінка донату для актуального проєкту Way to Ukraine.',
  }
}
