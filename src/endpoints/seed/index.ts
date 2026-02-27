import type { CollectionSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]

const globals = ['header', 'footer'] as const

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    context: {
      disableRevalidate: true,
    },
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    context: {
      disableRevalidate: true,
    },
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    context: {
      disableRevalidate: true,
    },
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      context: {
        disableRevalidate: true,
      },
      data: {
        donateLabel: 'ЗАДОНАТИТИ',
        donateUrl: '#',
        languageSwitcherMode: 'visualOnly',
        logoVariant: 'yellow',
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Проєкти',
              url: '/projects',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Про нас',
              url: '#about',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Досягнення',
              url: '/achievements',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Звітність',
              url: '#reporting',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Крамниця',
              url: '#shop',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'FAQ',
              url: '#faq',
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      context: {
        disableRevalidate: true,
      },
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Source Code',
              newTab: true,
              url: 'https://github.com/payloadcms/payload/tree/main/templates/website',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Payload',
              newTab: true,
              url: 'https://payloadcms.com/',
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'homepage',
      context: {
        disableRevalidate: true,
      },
      data: {
        hero: {
          backgroundImage: imageHomeDoc.id,
          titleLine1: 'WAY TO',
          titleLine2: 'UKRAINE',
          currentCollectionTitle: 'ПОТОЧНИЙ ЗБІР',
          currentCollectionSubtitle: 'Збір на пікап',
          currentCollectionDescription: 'для 1 ОШБ «Вовки да Вінчі»',
          currentCollectionDonateLabel: 'ЗАДОНАТИТИ',
          currentCollectionDonateUrl: '#',
        },
        intro: {
          headline: 'Всім привіт, ми з України!',
          description:
            'Way to Ukraine — це волонтерський фонд середнього масштабу, який працює на благо СОУ',
        },
        cards: [
          { title: 'проєкти', href: '/projects', image: image1Doc.id },
          { title: 'про нас', href: '#about', image: image2Doc.id },
          { title: 'досягнення', href: '/achievements', image: image3Doc.id },
          { title: 'звітність', href: '#reporting', image: image2Doc.id },
          { title: 'крамниця', href: '#shop', image: image3Doc.id },
          { title: 'faq', href: '#faq', image: image1Doc.id },
        ],
        stats: {
          left: {
            iconStyle: 'currency',
            value: '7 820 086 гривень',
            caption: 'Усього зібрано фондом',
          },
          right: {
            iconStyle: 'diamond',
            value: '15 бригад',
            caption: 'Кількість підрозділів, яким ми допомогли',
          },
        },
        footer: {
          backgroundImage: imageHomeDoc.id,
          requisitesLabel: 'РЕКВІЗИТИ',
          requisitesUrl: '#',
          donateLabel: 'ЗАДОНАТИТИ',
          donateUrl: '#',
          socials: [
            { icon: 'telegram', label: 'Telegram', url: '#' },
            { icon: 'instagram', label: 'Instagram', url: '#' },
            { icon: 'twitter', label: 'Twitter', url: '#' },
          ],
        },
      },
    }),
    payload.updateGlobal({
      slug: 'achievements',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'Досягнення',
        topStats: [
          {
            value: '7 820 086 гривень',
            caption: 'Усього зібрано фондом',
            theme: 'dark',
            iconStyle: 'currency',
          },
          {
            value: '000 000 доларів',
            caption: 'Усього зібрано фондом',
            theme: 'accent',
            iconStyle: 'dollar',
          },
          {
            value: '14 бригад',
            caption: 'Кількість підрозділів, яким ми допомогли',
            theme: 'blue',
            iconStyle: 'diamond',
          },
        ],
        cards: [
          { layoutType: 'stat', value: '16', label: 'Пікапів', iconStyle: 'pickup' },
          { layoutType: 'stat', value: '4', label: 'Бусів', iconStyle: 'bus' },
          { layoutType: 'stat', value: '3', label: 'Позашляховиків', iconStyle: 'suv' },
          { layoutType: 'stat', value: '2', label: 'Військових вантажівок', iconStyle: 'truck' },
          { layoutType: 'stat', value: '1', label: 'Приладів нічного бачення', iconStyle: 'nightVision' },
          { layoutType: 'stat', value: '2', label: 'Антен', iconStyle: 'antenna' },
          { layoutType: 'stat', value: '1', label: 'Дронів', iconStyle: 'drone' },
          { layoutType: 'stat', value: '1', label: 'Засобів РЕБ', iconStyle: 'reb' },
          { layoutType: 'stat', value: '1', label: 'Карет швидкої допомоги', iconStyle: 'ambulance' },
          { layoutType: 'photoWide', featuredImage: image3Doc.id },
          { layoutType: 'stat', value: '2', label: 'Аналізаторів спектру', iconStyle: 'spectrum' },
        ],
        cta: {
          label: 'ЗАКРИТІ ПРОЄКТИ',
          url: '/projects/finished',
        },
      },
    }),
    payload.updateGlobal({
      slug: 'finished-projects',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'Закриті проєкти',
        cards: [
          { image: image1Doc.id, unit: '120 бригада, 173 батальйон', vehicle: 'STEYR 1291', cornerStyle: 'left' },
          { image: image2Doc.id, unit: '120 бригада, 173 батальйон', vehicle: 'STEYR 1291', cornerStyle: 'right' },
          { image: image3Doc.id, unit: '120 бригада, 173 батальйон', vehicle: 'STEYR 1291', cornerStyle: 'left' },
          { image: image2Doc.id, unit: '120 бригада, 173 батальйон', vehicle: 'STEYR 1291', cornerStyle: 'right' },
          { image: image3Doc.id, unit: '120 бригада, 173 батальйон', vehicle: 'STEYR 1291', cornerStyle: 'left' },
          { image: image1Doc.id, unit: '120 бригада, 173 батальйон', vehicle: 'STEYR 1291', cornerStyle: 'right' },
          { image: image3Doc.id, unit: '120 бригада, 173 батальйон', vehicle: 'STEYR 1291', cornerStyle: 'left' },
          { image: image1Doc.id, unit: '120 бригада, 173 батальйон', vehicle: 'STEYR 1291', cornerStyle: 'right' },
          { image: image2Doc.id, unit: '120 бригада, 173 батальйон', vehicle: 'STEYR 1291', cornerStyle: 'left' },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
