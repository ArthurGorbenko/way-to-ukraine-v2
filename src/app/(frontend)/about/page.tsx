import type { Config } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getRequestLocale, getRequestPayloadLocale } from '@/utilities/getRequestLocale'
import type { Metadata } from 'next'
import Link from 'next/link'

import './about.css'

type AboutGlobal = Config['globals']['about']

function getEmbedUrl(youtubeUrl?: string | null) {
  if (!youtubeUrl) return ''

  try {
    const url = new URL(youtubeUrl)
    const videoId = url.searchParams.get('v')
    const start = url.searchParams.get('t')?.replace(/s$/, '')
    if (!videoId) return youtubeUrl

    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`)
    embedUrl.searchParams.set('rel', '0')
    if (start) embedUrl.searchParams.set('start', start)
    return embedUrl.toString()
  } catch {
    return youtubeUrl
  }
}

export default async function AboutPage() {
  const [locale, payloadLocale] = await Promise.all([getRequestLocale(), getRequestPayloadLocale()])
  const isEn = locale === 'en'
  const about = await getCachedGlobal('about', 0, payloadLocale)()
  const paragraphs = about?.hero?.paragraphs || []
  const embedUrl = getEmbedUrl(about?.video?.youtubeUrl)

  return (
    <article className="about-page pt-24 pb-14 lg:pt-28 lg:pb-20">
      <div className="about-shell mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-5 lg:px-8">
        <section className="about-hero-card rounded-[32px] px-6 py-8 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_320px] lg:gap-10">
            <div>
              <span className="about-eyebrow">{about?.hero?.eyebrow || 'WAY TO UKRAINE'}</span>
              <h1 className="mt-5 max-w-[12ch] text-[38px] font-semibold leading-[0.95] text-white lg:text-[72px]">
                {about?.hero?.headline || 'Hello everyone, we are from Ukraine!'}
              </h1>

              <div className="mt-6 space-y-4 text-[16px] leading-7 text-[rgba(247,244,238,0.82)] lg:mt-8 lg:max-w-[760px] lg:text-[18px]">
                {paragraphs.map((paragraph, index) => (
                  <p key={paragraph.id || index}>{paragraph.copy}</p>
                ))}
              </div>
            </div>

            <aside className="about-highlight flex flex-col justify-between rounded-[28px] p-6 lg:p-7">
              <div>
                <p className="about-highlight-label">{isEn ? 'Mission' : 'Місія'}</p>
                <p className="mt-3 text-[26px] font-semibold leading-tight text-white lg:text-[32px]">
                  {isEn
                    ? 'Fast logistics support for the Defense Forces of Ukraine.'
                    : 'Швидка логістична підтримка для Сил оборони України.'}
                </p>
              </div>

              <p className="mt-8 text-[15px] leading-6 text-[rgba(255,248,228,0.82)]">
                {isEn
                  ? 'We focus on practical transport delivery, direct coordination with units, and fast turnaround from fundraising to handoff.'
                  : 'Ми фокусуємося на практичній доставці транспорту, прямій координації з підрозділами та швидкому шляху від збору коштів до передачі.'}
              </p>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className="about-video-card rounded-[32px] p-4 lg:p-5">
            {embedUrl ? (
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="about-video-frame"
                referrerPolicy="strict-origin-when-cross-origin"
                src={embedUrl}
                title={about?.video?.title || 'Way to Ukraine interview'}
              />
            ) : null}
          </div>

          <div className="about-video-card rounded-[32px] px-6 py-7 lg:px-8 lg:py-8">
            <p className="about-eyebrow">{isEn ? 'Media' : 'Медіа'}</p>
            <h2 className="mt-5 text-[30px] font-semibold leading-tight text-white lg:text-[42px]">
              {about?.video?.title || 'Interview'}
            </h2>
            <p className="mt-4 max-w-[34ch] text-[16px] leading-7 text-[rgba(247,244,238,0.82)]">
              {isEn
                ? 'A recorded conversation about how the foundation operates, why transport matters on the front line, and how civilian support turns into concrete battlefield mobility.'
                : 'Записана розмова про те, як працює фонд, чому транспорт критично важливий на фронті і як цивільна підтримка перетворюється на реальну мобільність для підрозділів.'}
            </p>

            {about?.video?.originalVideoUrl ? (
              <Link className="about-video-link mt-8" href={about.video.originalVideoUrl} target="_blank">
                {about?.video?.originalVideoLabel || 'Original video'}
              </Link>
            ) : null}
          </div>
        </section>

      </div>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const [publicLocale, payloadLocale] = await Promise.all([getRequestLocale(), getRequestPayloadLocale()])
  const about = (await getCachedGlobal('about', 0, payloadLocale)()) as AboutGlobal
  const pageTitle = about?.pageTitle || (publicLocale === 'en' ? 'About us' : 'Про нас')

  return {
    title: `${pageTitle} | Way to Ukraine`,
    description:
      publicLocale === 'en'
        ? 'About Way to Ukraine: volunteer logistics, transport delivery, and how the foundation works.'
        : 'Про Way to Ukraine: волонтерська логістика, доставка транспорту та принципи роботи фонду.',
  }
}
