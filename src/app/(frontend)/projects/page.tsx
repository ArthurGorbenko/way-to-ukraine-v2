import type { Metadata } from 'next'
import Link from 'next/link'
import { getRequestLocale } from '@/utilities/getRequestLocale'

import './projects.css'

const activeProjectImage =
  'https://www.figma.com/api/mcp/asset/cedddda1-fdfe-47d3-aef6-13255dc95b70'
const closedProjectImage =
  'https://www.figma.com/api/mcp/asset/8dee3735-0e2d-43e3-ba7c-da2341073e8d'

export default async function ProjectsPage() {
  const locale = await getRequestLocale()
  const isEn = locale === 'en'

  return (
    <article className="projects-page pt-24 lg:pt-24 lg:pb-24">
      <section className="mx-auto w-full max-w-[1320px] px-5 lg:px-8">
        <h1 className="projects-title text-center text-[34px] text-white lg:text-[50px]">
          {isEn ? 'Projects' : 'Проєкти'}
        </h1>

        <div className="projects-grid mt-10 lg:mt-14">
          <article className="project-card">
            <img alt={isEn ? 'Active projects' : 'Актуальні проєкти'} className="project-card-image" src={activeProjectImage} />
            <div className="project-card-overlay" />
            <div className="project-card-outline project-card-outline-left" />
            <Link href="/projects/active" className="project-card-cta">
              {isEn ? 'Active projects' : 'Актуальні проєкти'}
            </Link>
          </article>

          <article className="project-card">
            <img alt={isEn ? 'Closed projects' : 'Закриті проєкти'} className="project-card-image" src={closedProjectImage} />
            <div className="project-card-overlay" />
            <div className="project-card-outline project-card-outline-right" />
            <Link href="/projects/finished" className="project-card-cta">
              {isEn ? 'Closed projects' : 'Закриті проєкти'}
            </Link>
          </article>
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const isEn = locale === 'en'

  return {
    title: `${isEn ? 'Projects' : 'Проєкти'} | Way to Ukraine`,
    description: isEn
      ? 'Way to Ukraine projects: active and completed initiatives.'
      : 'Проєкти Way to Ukraine: актуальні та закриті ініціативи фонду.',
  }
}
