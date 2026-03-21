import { AboutPartnersCarousel } from './AboutPartnersCarousel'
import { Media } from '@/components/Media'
import type { Config, Media as MediaType } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getRequestLocale, getRequestPayloadLocale } from '@/utilities/getRequestLocale'
import { Send, X } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import './about.css'

type AboutGlobal = Config['globals']['about']
type MediaResource = string | number | MediaType | null | undefined

const photoFallback = 'https://www.figma.com/api/mcp/asset/7e3640cf-82b2-491e-ad28-9ca5fc0199ab'

type SocialLinks = {
  telegramUrl?: string | null
  twitterUrl?: string | null
}

function SocialButtons({ telegramUrl, twitterUrl }: SocialLinks) {
  const items = [
    telegramUrl
      ? {
          href: telegramUrl,
          label: 'Telegram',
          icon: <Send size={18} strokeWidth={2.2} />,
        }
      : null,
    twitterUrl
      ? {
          href: twitterUrl,
          label: 'X',
          icon: <X size={18} strokeWidth={2.2} />,
        }
      : null,
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode }[]

  if (!items.length) return null

  return (
    <div className="about-socials">
      {items.map((item) => (
        <Link
          key={item.label}
          aria-label={item.label}
          className="about-social-button"
          href={item.href}
          rel="noreferrer"
          target="_blank"
        >
          {item.icon}
        </Link>
      ))}
    </div>
  )
}

function MemberPhoto({ image, alt, priority = false }: { image?: MediaResource; alt: string; priority?: boolean }) {
  if (image) {
    return (
      <Media
        fill
        priority={priority}
        resource={image}
        imgClassName="about-member-photo"
        pictureClassName="about-member-photo-picture"
      />
    )
  }

  return <img alt={alt} className="about-member-photo" src={photoFallback} />
}

export default async function AboutPage() {
  const payloadLocale = await getRequestPayloadLocale()
  const about = await getCachedGlobal('about', 2, payloadLocale)()
  const featuredMember = about?.featuredMember
  const teamMembers = about?.teamSection?.members || []
  const partners = about?.partnersSection?.partners || []
  const storyParagraphs = about?.storySection?.paragraphs || []

  return (
    <article className="about-page pb-12 pt-20 lg:pb-16 lg:pt-24">
      <section className="about-shell mx-auto w-full max-w-[1380px] px-4 lg:px-7">
        <header className="about-header">
          <h1 className="about-page-title">{about?.pageTitle || 'Про нас'}</h1>
        </header>

        <section className="about-featured-card">
          <div className="about-featured-photo-wrap">
            <div className="about-member-ring">
              <div className="about-member-photo-shell">
                <MemberPhoto
                  image={featuredMember?.image as MediaResource}
                  alt={featuredMember?.name || 'Team member'}
                  priority
                />
              </div>
            </div>
          </div>

          <div className="about-featured-content">
            <div className="about-name-pill">{featuredMember?.name || 'Ім’я Прізвище'}</div>
            <SocialButtons telegramUrl={featuredMember?.telegramUrl} twitterUrl={featuredMember?.twitterUrl} />
            <p className="about-role">{featuredMember?.role || 'Посада у фонді'}</p>
            <p className="about-bio">{featuredMember?.bio || 'Короткий опис учасника команди та його або її ролі у фонді.'}</p>
          </div>
        </section>

        <section className="about-team-grid" aria-label="Team">
          {teamMembers.map((member, index) => (
            <article key={member.id || index} className="about-team-card">
              <div className="about-member-ring about-member-ring-grid">
                <div className="about-member-photo-shell">
                  <MemberPhoto image={member.image as MediaResource} alt={member?.name || 'Team member'} />
                </div>
              </div>

              <div className="about-name-pill about-name-pill-grid">{member?.name || 'Ім’я Прізвище'}</div>
              <p className="about-role about-role-grid">{member?.role || 'Посада у фонді'}</p>
              <p className="about-bio about-bio-grid">
                {member?.bio || 'Короткий опис учасника команди та його або її ролі у фонді.'}
              </p>
              <SocialButtons telegramUrl={member?.telegramUrl} twitterUrl={member?.twitterUrl} />
            </article>
          ))}
        </section>

        <section className="about-partners-section">
          <h2 className="about-section-title">{about?.partnersSection?.title || 'Наші партнери'}</h2>
          <AboutPartnersCarousel partners={partners} />
        </section>

        <section className="about-story-section">
          <p className="about-story-lead">
            {about?.storySection?.lead ||
              'Way to Ukraine — це волонтерський фонд середнього масштабу, який працює на благо СОУ'}
          </p>

          <div className="about-story-copy">
            {storyParagraphs.map((paragraph, index) => (
              <p key={paragraph.id || index}>{paragraph.copy}</p>
            ))}
          </div>
        </section>
      </section>
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
        ? 'About Way to Ukraine: the core team, partner network, and how the foundation supports Ukraine.'
        : 'Про Way to Ukraine: команда фонду, партнерська мережа та як фонд підтримує Україну.',
  }
}
