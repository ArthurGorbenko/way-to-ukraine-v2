import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getRequestLocale, getRequestPayloadLocale } from '@/utilities/getRequestLocale'
import type { Metadata } from 'next'

import './details.css'

type MediaResource = string | number | MediaType | null | undefined

const photoFallback = 'https://www.figma.com/api/mcp/asset/cedddda1-fdfe-47d3-aef6-13255dc95b70'
const galleryFallback = [
  'http://localhost:3845/assets/a014728eb86509e352b80c461713ea37871cdbcd.png',
  'http://localhost:3845/assets/c9de5699e873fc5bddb448e20aeab97cdbdb65eb.png',
  'http://localhost:3845/assets/869ae3400bdbe02809872772575949475ec6308a.png',
  'http://localhost:3845/assets/691595e578d5a7dafee2c44b0078bb69e22e139f.png',
  'http://localhost:3845/assets/f1c7abe933bf3b77b48ca2a1d61dc1879bf35897.png',
  'http://localhost:3845/assets/d9111514d570ca164e1327c97ce8de9448d00e58.png',
] as const

export default async function ActiveProjectDetailsPage() {
  const locale = await getRequestPayloadLocale()
  const activeProjects = await getCachedGlobal('active-projects', 2, locale)()
  const project = activeProjects?.projects?.[0]
  const progress = Math.max(0, Math.min(100, Number(project?.progressPercent || 0)))
  const gallery = project?.detailsGallery || []

  return (
    <article className="details-page pb-8 pt-24 lg:pb-10 lg:pt-24">
      <section className="mx-auto w-full max-w-[1320px] px-5 lg:px-8">
        <h1 className="details-title text-center text-[30px] text-white lg:text-[35px]">
          {project?.detailsPageTitle || 'Детальніше'}
        </h1>

        <div className="details-project-row mt-10 lg:mt-14">
          <article className="details-project-media">
            {project?.image ? (
              <Media resource={project.image as MediaResource} imgClassName="details-project-image" />
            ) : (
              <img alt="Актуальний проєкт" className="details-project-image" src={photoFallback} />
            )}

            <div className="details-project-overlay" />
            <p className="details-project-overlay-title">{project?.leftOverlayTitle || 'Збір на авто'}</p>

            <div className="details-project-emblem-wrap">
              {project?.badgeImage ? (
                <Media resource={project.badgeImage as MediaResource} imgClassName="details-project-emblem" />
              ) : (
                <div className="details-project-emblem-placeholder">W</div>
              )}
            </div>
          </article>

          <section className="details-project-content">
            <h2 className="details-project-heading">{project?.cardTitle || 'Збір на авто'}</h2>

            <p className="details-project-line">
              {project?.unitLabel || 'для:'} <strong>{project?.unitValue || 'Підрозділ'}</strong>
            </p>

            <p className="details-project-line">
              {project?.directionLabel || 'напрямок:'} <strong>{project?.directionValue || 'Напрямок'}</strong>
            </p>

            <p className="details-project-goal">
              {project?.goalLabel || 'ціль:'} <strong>{project?.goalValue || '000 000 грн'}</strong>
            </p>

            <div className="details-project-progress-track">
              <div className="details-project-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </section>
        </div>

        <div className="details-story-row mt-6">
          <article className="details-story-image-wrap">
            {project?.detailsStoryImage ? (
              <Media resource={project.detailsStoryImage as MediaResource} imgClassName="details-story-image" />
            ) : project?.image ? (
              <Media resource={project.image as MediaResource} imgClassName="details-story-image" />
            ) : (
              <img alt="Ілюстрація проєкту" className="details-story-image" src={photoFallback} />
            )}
          </article>

          <section className="details-story-copy">
            <h3>{project?.detailsStoryHeading || 'Дорогі друзі!'}</h3>
            <p>{project?.detailsStoryBody || ''}</p>
            <p>{project?.detailsStoryOutro || 'Разом до перемог!'}</p>
          </section>
        </div>

        <section className="details-gallery mt-6" aria-label="Галерея проєкту">
          {gallery.length > 0
            ? gallery.map((item, index) => (
                <article key={item.id || index} className="details-gallery-item">
                  {item?.image ? (
                    <Media resource={item.image as MediaResource} imgClassName="details-gallery-image" />
                  ) : (
                    <img alt={`Фото проєкту ${index + 1}`} className="details-gallery-image" src={photoFallback} />
                  )}
                </article>
              ))
            : galleryFallback.map((src, index) => (
                <article key={index} className="details-gallery-item">
                  <img alt={`Фото проєкту ${index + 1}`} className="details-gallery-image" src={src} />
                </article>
              ))}
        </section>
      </section>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const [publicLocale, payloadLocale] = await Promise.all([getRequestLocale(), getRequestPayloadLocale()])
  const activeProjects = await getCachedGlobal('active-projects', 0, payloadLocale)()
  const pageTitle = activeProjects?.projects?.[0]?.detailsPageTitle || 'Детальніше'

  return {
    title: `${pageTitle} | Way to Ukraine`,
    description:
      publicLocale === 'en'
        ? 'Detailed page of an active Way to Ukraine project.'
        : 'Детальна сторінка актуального проєкту Way to Ukraine.',
  }
}
