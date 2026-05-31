import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { DetailsGallery } from '../../../active/[slug]/details/DetailsGallery'
import type { Media as MediaType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { formatMonobankAmount, getMonobankJarSnapshot } from '@/utilities/monobankJarSnapshot'
import { getRequestLocale, getRequestPayloadLocale } from '@/utilities/getRequestLocale'
import { notFound } from 'next/navigation'
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

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function FinishedProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params
  const locale = await getRequestPayloadLocale()
  const finishedProjects = await getCachedGlobal('finished-projects', 2, locale)()
  const card = finishedProjects?.cards?.find((c) => (c.slug || c.id) === slug)
  if (!card) {
    notFound()
  }

  const gallery = card?.detailsGallery || []
  const jar = await getMonobankJarSnapshot(card?.monobankJar)
  const raisedLabel = locale === 'en' ? 'raised:' : 'зібрано:'
  const goalLabel = locale === 'en' ? 'goal:' : 'ціль:'

  return (
    <article className="details-page pb-8 pt-24 lg:pb-10 lg:pt-24">
      <section className="mx-auto w-full max-w-[1320px] px-5 lg:px-8">
        <h1 className="details-title text-center text-[30px] text-white lg:text-[35px]">
          {card?.detailsPageTitle || 'Детальніше'}
        </h1>

        <div className="details-project-row mt-10 lg:mt-14">
          <article className="details-project-media">
            {card?.image ? (
              <Media resource={card.image as MediaResource} imgClassName="details-project-image" />
            ) : (
              <img alt="Закритий проєкт" className="details-project-image" src={photoFallback} />
            )}

            <div className="details-project-overlay" />
            <p className="details-project-overlay-title">{card?.vehicle || 'STEYR 1291'}</p>

            <div className="details-project-emblem-wrap">
              {card?.badgeImage ? (
                <Media resource={card.badgeImage as MediaResource} imgClassName="details-project-emblem" />
              ) : (
                <div className="details-project-emblem-placeholder">W</div>
              )}
            </div>
          </article>

          <section className="details-project-content">
            <h2 className="details-project-heading">{card?.unit || '120 бригада, 173 батальйон'}</h2>

            <p className="details-project-line">
              {card?.unitLabel || 'для:'} <strong>{card?.unitValue || 'Підрозділ'}</strong>
            </p>

            <p className="details-project-line">
              {card?.directionLabel || 'напрямок:'} <strong>{card?.directionValue || 'Напрямок'}</strong>
            </p>

            {jar ? (
              <>
                <p className="details-project-line">
                  {goalLabel} <strong>{formatMonobankAmount(jar.displayGoal || 0, locale)}</strong>
                </p>
                <p className="details-project-line">
                  {raisedLabel} <strong>{formatMonobankAmount(jar.displayAmount || 0, locale)}</strong>
                </p>
              </>
            ) : null}
          </section>
        </div>

        <div className="details-story-row mt-6">
          <article className="details-story-image-wrap">
            {card?.detailsStoryImage ? (
              <Media resource={card.detailsStoryImage as MediaResource} imgClassName="details-story-image" />
            ) : card?.image ? (
              <Media resource={card.image as MediaResource} imgClassName="details-story-image" />
            ) : (
              <img alt="Ілюстрація проєкту" className="details-story-image" src={photoFallback} />
            )}
          </article>

          <section className="details-story-copy">
            <h3>{card?.detailsStoryHeading || 'Дорогі друзі!'}</h3>
            {card?.detailsStoryBody && (
              <RichText data={card.detailsStoryBody} enableGutter={false} enableProse={false} />
            )}
            <p>{card?.detailsStoryOutro || 'Разом до перемог!'}</p>
          </section>
        </div>

        {gallery.length > 0 && (
          <DetailsGallery
            items={gallery}
            fallbacks={galleryFallback}
            fallbackAlt="Фото проєкту"
          />
        )}
      </section>
    </article>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const [publicLocale, payloadLocale] = await Promise.all([getRequestLocale(), getRequestPayloadLocale()])
  const finishedProjects = await getCachedGlobal('finished-projects', 0, payloadLocale)()
  const card = finishedProjects?.cards?.find((c) => (c.slug || c.id) === slug)
  const pageTitle = card?.detailsPageTitle || 'Детальніше'

  return {
    title: `${pageTitle} | Way to Ukraine`,
    description:
      publicLocale === 'en'
        ? 'Detailed page of a closed Way to Ukraine project.'
        : 'Детальна сторінка закритого проєкту Way to Ukraine.',
  }
}
