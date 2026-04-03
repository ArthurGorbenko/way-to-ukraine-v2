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
  'monobank-jars',
  'pages',
  'posts',
  'shop-items',
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

  payload.logger.info(`— Seeding shop items...`)

  const [
    ukCommonSticker,
    ukCommonPatch,
    ukCommonPostcard,
    ukRareBracelet,
    ukRareTote,
    ukEpicShirt,
    ukEpicSurprise,
  ] = await Promise.all([
    payload.create({
      collection: 'shop-items',
      locale: 'uk',
      context: { disableRevalidate: true },
      data: {
        title: 'Наліпки фонду',
        price: '$20',
        description: 'Мерчовий айтем Way to Ukraine. Натисніть, щоб перемістити його між вашим боксом і доступним списком.',
        image: image1Doc.id,
      },
    }),
    payload.create({
      collection: 'shop-items',
      locale: 'uk',
      context: { disableRevalidate: true },
      data: {
        title: 'Патч Way to Ukraine',
        price: '$35',
        description: 'Текстильний патч із символікою фонду для вашого боксу.',
        image: image2Doc.id,
      },
    }),
    payload.create({
      collection: 'shop-items',
      locale: 'uk',
      context: { disableRevalidate: true },
      data: {
        title: 'Листівка',
        price: '$15',
        description: 'Пам’ятна листівка від Way to Ukraine.',
        image: image3Doc.id,
      },
    }),
    payload.create({
      collection: 'shop-items',
      locale: 'uk',
      context: { disableRevalidate: true },
      data: {
        title: 'Браслет',
        price: '$25',
        description: 'Фірмовий браслет фонду у кольорах Way to Ukraine.',
        image: image1Doc.id,
      },
    }),
    payload.create({
      collection: 'shop-items',
      locale: 'uk',
      context: { disableRevalidate: true },
      data: {
        title: 'Шопер',
        price: '$40',
        description: 'Місткий шопер із брендингом фонду для щоденного використання.',
        image: image2Doc.id,
      },
    }),
    payload.create({
      collection: 'shop-items',
      locale: 'uk',
      context: { disableRevalidate: true },
      data: {
        title: 'Футболка',
        price: '$55',
        description: 'Базова футболка з брендингом Way to Ukraine.',
        image: image3Doc.id,
      },
    }),
    payload.create({
      collection: 'shop-items',
      locale: 'uk',
      context: { disableRevalidate: true },
      data: {
        title: 'Сюрприз від фонду',
        price: '$65',
        description: 'Спеціальний бонусний айтем від команди фонду.',
        image: image1Doc.id,
      },
    }),
  ])

  await Promise.all([
    payload.update({
      collection: 'shop-items',
      id: ukCommonSticker.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: { title: 'Foundation stickers', price: '$20', description: 'Way to Ukraine merch item. Tap to move it between your box and the available list.' },
    }),
    payload.update({
      collection: 'shop-items',
      id: ukCommonPatch.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: { title: 'Way to Ukraine patch', price: '$35', description: 'Textile patch with the foundation branding for your box.' },
    }),
    payload.update({
      collection: 'shop-items',
      id: ukCommonPostcard.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: { title: 'Postcard', price: '$15', description: 'Collectible postcard from Way to Ukraine.' },
    }),
    payload.update({
      collection: 'shop-items',
      id: ukRareBracelet.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: { title: 'Bracelet', price: '$25', description: 'Foundation bracelet in Way to Ukraine colors.' },
    }),
    payload.update({
      collection: 'shop-items',
      id: ukRareTote.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: { title: 'Tote bag', price: '$40', description: 'Roomy tote bag with foundation branding for daily use.' },
    }),
    payload.update({
      collection: 'shop-items',
      id: ukEpicShirt.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: { title: 'T-shirt', price: '$55', description: 'Basic T-shirt with Way to Ukraine branding.' },
    }),
    payload.update({
      collection: 'shop-items',
      id: ukEpicSurprise.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: { title: 'Foundation surprise', price: '$65', description: 'Special bonus item from the foundation team.' },
    }),
  ])

  payload.logger.info(`— Seeding Monobank jars...`)

  const [steyrRepairJar, steyrTruckJar] = await Promise.all([
    payload.create({
      collection: 'monobank-jars',
      context: { disableRevalidate: true },
      data: {
        jarUrl: 'https://send.monobank.ua/jar/3dSGvocJoY',
        clientId: '3dSGvocJoY',
        extJarId: '3dSGvocJoY',
        title: 'Відновлення вантажівки STEYR 1291',
        description:
          'Ця вантажівка була передана нами у 25-й ОШБ навесні цього року, після чого була уражена в зоні бойових дій. Наша задача - відновити її та повернути в руки 25-го ОШБ',
        amountMinor: 0,
        goalMinor: 0,
        displayAmount: 0,
        displayGoal: 0,
        progressPercent: 0,
        lastFetchStatus: 'pending',
        lastResolveStatus: 'pending',
      },
    }),
    payload.create({
      collection: 'monobank-jars',
      context: { disableRevalidate: true },
      data: {
        jarUrl: 'https://send.monobank.ua/jar/bB9VYwZiY',
        clientId: 'bB9VYwZiY',
        extJarId: 'bB9VYwZiY',
        title: 'Військова вантажівка STEYR 1291',
        description: '« 120 бригада ТРО, інженерна рота »',
        amountMinor: 0,
        goalMinor: 0,
        displayAmount: 0,
        displayGoal: 0,
        progressPercent: 0,
        lastFetchStatus: 'pending',
        lastResolveStatus: 'pending',
      },
    }),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  await payload.create({
    collection: 'posts',
    depth: 0,
    req,
    context: {
      disableRevalidate: true,
      disableSearchSync: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  await payload.create({
    collection: 'posts',
    depth: 0,
    req,
    context: {
      disableRevalidate: true,
      disableSearchSync: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  await payload.create({
    collection: 'posts',
    depth: 0,
    req,
    context: {
      disableRevalidate: true,
      disableSearchSync: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
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
      locale: 'uk' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        donateLabel: 'ЗАДОНАТИТИ',
        donateUrl: '/projects/active/donate',
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
              url: '/about',
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
              url: '/#reporting',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Крамниця',
              url: '/shop',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'FAQ',
              url: '/#faq',
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
      locale: 'uk' as unknown as 'all',
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
          currentCollectionDonateUrl: '/projects/active/donate',
        },
        intro: {
          headline: 'Всім привіт, ми з України!',
          description:
            'Way to Ukraine — це волонтерський фонд середнього масштабу, який працює на благо СОУ',
        },
        cards: [
          { title: 'проєкти', href: '/projects', image: image1Doc.id },
          { title: 'про нас', href: '/about', image: image2Doc.id },
          { title: 'досягнення', href: '/achievements', image: image3Doc.id },
          { title: 'звітність', href: '/#reporting', image: image2Doc.id },
          { title: 'крамниця', href: '/shop', image: image3Doc.id },
          { title: 'faq', href: '/#faq', image: image1Doc.id },
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
          requisitesUrl: 'https://way-to-ukraine.com/en/requisites',
          donateLabel: 'ЗАДОНАТИТИ',
          donateUrl: '/projects/active/donate',
          socials: [
            { icon: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/groups/way.to.ukraine' },
            { icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/way.to.ua' },
            { icon: 'twitter', label: 'Twitter', url: 'https://x.com/Way_to_UA' },
          ],
        },
      },
    }),
    payload.updateGlobal({
      slug: 'about',
      locale: 'uk' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'Про нас',
        featuredMember: {
          image: imageHomeDoc.id,
          name: 'Ім’я Прізвище',
          role: 'Посада у фонді',
          bio: 'Деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі. Деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі. Деталі, деталі, деталі, деталі, деталі.',
          telegramUrl: 'https://t.me/way_to_ua',
          twitterUrl: 'https://x.com/Way_to_UA',
        },
        teamSection: {
          members: [
            {
              image: imageHomeDoc.id,
              name: 'Ім’я Прізвище',
              role: 'Посада у фонді',
              bio: 'Деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі. Деталі, деталі, деталі, деталі, деталі.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image1Doc.id,
              name: 'Ім’я Прізвище',
              role: 'Посада у фонді',
              bio: 'Деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі. Деталі, деталі, деталі, деталі, деталі.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image2Doc.id,
              name: 'Ім’я Прізвище',
              role: 'Посада у фонді',
              bio: 'Деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі. Деталі, деталі, деталі, деталі, деталі.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image3Doc.id,
              name: 'Ім’я Прізвище',
              role: 'Посада у фонді',
              bio: 'Деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі. Деталі, деталі, деталі, деталі, деталі.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image1Doc.id,
              name: 'Ім’я Прізвище',
              role: 'Посада у фонді',
              bio: 'Деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі. Деталі, деталі, деталі, деталі, деталі.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: imageHomeDoc.id,
              name: 'Ім’я Прізвище',
              role: 'Посада у фонді',
              bio: 'Деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі. Деталі, деталі, деталі, деталі, деталі.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image2Doc.id,
              name: 'Ім’я Прізвище',
              role: 'Посада у фонді',
              bio: 'Деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі. Деталі, деталі, деталі, деталі, деталі.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image3Doc.id,
              name: 'Ім’я Прізвище',
              role: 'Посада у фонді',
              bio: 'Деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі, деталі. Деталі, деталі, деталі, деталі, деталі.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
          ],
        },
        partnersSection: {
          title: 'Наші партнери',
          partners: [
            {
              image: image1Doc.id,
              name: 'В.Е.С. ГРУП',
              description:
                'Постачальник обладнання відомих європейських виробників у сфері вентиляції, опалення, електротехніки та освітлення.',
              url: 'https://way-to-ukraine.com',
            },
            {
              image: image2Doc.id,
              name: 'В.Е.С. ГРУП',
              description:
                'Постачальник обладнання відомих європейських виробників у сфері вентиляції, опалення, електротехніки та освітлення.',
              url: 'https://way-to-ukraine.com',
            },
            {
              image: image3Doc.id,
              name: 'В.Е.С. ГРУП',
              description:
                'Постачальник обладнання відомих європейських виробників у сфері вентиляції, опалення, електротехніки та освітлення.',
              url: 'https://way-to-ukraine.com',
            },
            {
              image: image2Doc.id,
              name: 'В.Е.С. ГРУП',
              description:
                'Постачальник обладнання відомих європейських виробників у сфері вентиляції, опалення, електротехніки та освітлення.',
              url: 'https://way-to-ukraine.com',
            },
            {
              image: image1Doc.id,
              name: 'В.Е.С. ГРУП',
              description:
                'Постачальник обладнання відомих європейських виробників у сфері вентиляції, опалення, електротехніки та освітлення.',
              url: 'https://way-to-ukraine.com',
            },
          ],
        },
        storySection: {
          lead: 'Way to Ukraine — це волонтерський фонд середнього масштабу, який працює на благо СОУ',
          paragraphs: [
            {
              copy:
                'У цей нелегкий час вкрай важливо об’єднатися заради спільної мети — НАШОЇ ПЕРЕМОГИ!!! Кожен з нас намагається бути корисним для Батьківщини та робити все, що в наших силах, і ми з друзями не виключення. Нашими силами було організовано благодійний фонд, в який входить група волонтерів, які вже мали досвід в закупці та перевезенні автомобілів для потреб Збройних сил України.',
            },
            {
              copy:
                'Для якісного підтримання боєздатності підрозділів Збройних сил України під час активних бойових дій виникає необхідність у швидкому транспортуванні амуніції, продуктів харчування, а також у перевезенні особового складу. Так як зараз ведеться активна фаза війни, катастрофічно не вистачає транспорту для вище зазначених цілей, тому виникла потреба у звичайних надійних машинах, з високою прохідністю бездоріжжям.',
            },
            {
              copy:
                'Що ми пропонуємо? Головна мета фонду доставити автомобіль підрозділам, які мають гостру потребу у транспорті. Тому, поспілкувавшись з військовими, ми маємо контакти людей, які відповідають за підрозділи, де ці машини необхідні.',
            },
            {
              copy:
                'Чим Ви можете нам допомогти? Якщо у вас є можливість — то можете робити ваші внески. Також ми будемо вдячні за розповсюдження інформації про наш фонд.',
            },
          ],
        },
      },
    }),
    payload.updateGlobal({
      slug: 'achievements',
      locale: 'uk' as unknown as 'all',
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
          { layoutType: 'stat', value: '16', label: 'Пікапів', iconStyle: 'pickup', leafPosition: 'center' },
          { layoutType: 'stat', value: '4', label: 'Бусів', iconStyle: 'bus', leafPosition: 'center' },
          { layoutType: 'stat', value: '3', label: 'Позашляховиків', iconStyle: 'suv', leafPosition: 'right' },
          { layoutType: 'stat', value: '2', label: 'Військових вантажівок', iconStyle: 'truck', leafPosition: 'upright' },
          {
            layoutType: 'stat',
            value: '1',
            label: 'Приладів нічного бачення',
            iconStyle: 'nightVision',
            leafPosition: 'left',
          },
          { layoutType: 'stat', value: '2', label: 'Антен', iconStyle: 'antenna', leafPosition: 'center' },
          { layoutType: 'stat', value: '1', label: 'Дронів', iconStyle: 'drone', leafPosition: 'right' },
          { layoutType: 'stat', value: '1', label: 'Засобів РЕБ', iconStyle: 'reb', leafPosition: 'left' },
          {
            layoutType: 'stat',
            value: '1',
            label: 'Карет швидкої допомоги',
            iconStyle: 'ambulance',
            leafPosition: 'upright',
          },
          { layoutType: 'photoWide', featuredImage: image3Doc.id },
          { layoutType: 'stat', value: '2', label: 'Аналізаторів спектру', iconStyle: 'spectrum', leafPosition: 'right' },
        ],
        cta: {
          label: 'ЗАКРИТІ ПРОЄКТИ',
          url: '/projects/finished',
        },
      },
    }),
    payload.updateGlobal({
      slug: 'projects-overview',
      locale: 'uk' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'Проєкти',
        cards: [
          {
            image: image1Doc.id,
            title: 'Актуальні проєкти',
            url: '/projects/active',
            accentSide: 'left',
          },
          {
            image: image2Doc.id,
            title: 'Закриті проєкти',
            url: '/projects/finished',
            accentSide: 'right',
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'finished-projects',
      locale: 'uk' as unknown as 'all',
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
    payload.updateGlobal({
      slug: 'shop',
      locale: 'uk' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'Крамниця',
        items: [
          {
            image: image1Doc.id,
            title: 'Common W2U Box',
            price: '$225',
            backTitle: '5 предметів зі списку:',
            selectedItems: [ukCommonSticker.id, ukCommonPatch.id],
            availableItems: [ukCommonPostcard.id, ukRareBracelet.id, ukRareTote.id],
            backButtonLabel: 'ДІЗНАТИСЯ БІЛЬШЕ',
            backButtonUrl: '/shop/common-w2u-box',
            frameSide: 'left',
          },
          {
            image: image2Doc.id,
            title: 'Rare W2U Box',
            price: '$500',
            backTitle: '4 предмети зі списку:',
            selectedItems: [ukCommonPatch.id, ukRareBracelet.id],
            availableItems: [ukCommonSticker.id, ukCommonPostcard.id, ukRareTote.id, ukEpicShirt.id],
            backButtonLabel: 'ДІЗНАТИСЯ БІЛЬШЕ',
            backButtonUrl: '/shop/rare-w2u-box',
            frameSide: 'right',
          },
          {
            image: image3Doc.id,
            title: 'EPIC W2U Box',
            price: '$1000',
            backTitle: '6 предметів зі списку:',
            selectedItems: [ukEpicShirt.id, ukEpicSurprise.id],
            availableItems: [ukCommonSticker.id, ukCommonPatch.id, ukCommonPostcard.id, ukRareTote.id],
            backButtonLabel: 'ДІЗНАТИСЯ БІЛЬШЕ',
            backButtonUrl: '/shop/epic-w2u-box',
            frameSide: 'left',
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'active-projects',
      locale: 'uk' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'Актуальні проєкти',
        donateMethods: [
          {
            label: 'UniversalBank',
            details: [
              { label: 'IBAN (EUR)', value: 'UA493220010000026006080001211' },
              { label: 'IBAN (USD)', value: 'UA313220010000026007080001210' },
              { label: 'IBAN (CHF)', value: 'UA063220010000026003080001214' },
              { label: 'IBAN (UAH)', value: 'UA583220010000026007080001209' },
              { label: 'Bank', value: 'JSK UNIVERSAL BANK' },
              { label: 'Receiver', value: 'CO CF WAY TO UKRAINE' },
            ],
          },
          {
            label: 'Crypto',
            details: [
              { label: 'BTC', value: '1PgLvcGNwerzKwtDSdvvgPLCgXDYfy8YZW' },
              { label: 'ETH (ERC20)', value: '0x6f69c7fc26f885934d48d0285fb8c1a992e4a2da' },
              { label: 'USDT (TRC20)', value: 'TW8nrwBuTWogBZN9kzChJ3fjg6FFmC5qaC' },
            ],
          },
          {
            label: 'Інше',
            details: [{ label: 'PayPal', value: 'waytoukr@gmail.com' }],
          },
        ],
        projects: [
          {
            image: image1Doc.id,
            badgeImage: image3Doc.id,
            cardTitle: 'Збір на авто',
            leftOverlayTitle: 'Збір на авто',
            unitLabel: 'для:',
            unitValue: 'Підрозділ',
            directionLabel: 'напрямок:',
            directionValue: 'Напрямок',
            goalLabel: 'ціль:',
            goalValue: '000 000 грн',
            progressPercent: 0,
            donateLabel: 'ЗАДОНАТИТИ',
            donateUrl: '/projects/active/donate',
            donatePageTitle: 'Задонатити',
            monobankJar: steyrRepairJar.id,
            detailsLabel: 'ДЕТАЛЬНІШЕ',
            detailsUrl: '/projects/active/details',
            detailsPageTitle: 'Детальніше',
            detailsStoryHeading: 'Дорогі друзі!',
            detailsStoryBody:
              'Вкотре ми продовжуємо підтримувати Сили Оборони України, де на цей раз до нас звернулись військові з 5-ї Штурмової Бригади. Воїни 5-ї ОШБ нині героїчно тримають оборону в районі Часового Яру і потребують Robotrack для вивезення поранених та підвозу набоїв на передові позиції! Тож давайте разом надамо їм цей вкрай необхідний дрон і допоможемо нашим героям у цей нелегкий час!',
            detailsStoryOutro: 'Разом до перемог!',
            detailsStoryImage: image1Doc.id,
            detailsGallery: [
              { image: image1Doc.id },
              { image: image2Doc.id },
              { image: image3Doc.id },
              { image: image1Doc.id },
              { image: image2Doc.id },
              { image: image3Doc.id },
            ],
          },
          {
            image: image2Doc.id,
            badgeImage: image3Doc.id,
            cardTitle: 'Збір на авто',
            leftOverlayTitle: 'Збір на авто',
            unitLabel: 'для:',
            unitValue: 'Підрозділ',
            directionLabel: 'напрямок:',
            directionValue: 'Напрямок',
            goalLabel: 'ціль:',
            goalValue: '000 000 грн',
            progressPercent: 0,
            donateLabel: 'ЗАДОНАТИТИ',
            donateUrl: '/projects/active/donate',
            donatePageTitle: 'Задонатити',
            monobankJar: steyrTruckJar.id,
            detailsLabel: 'ДЕТАЛЬНІШЕ',
            detailsUrl: '/projects/active/details',
            detailsPageTitle: 'Детальніше',
            detailsStoryHeading: 'Дорогі друзі!',
            detailsStoryBody:
              'Вкотре ми продовжуємо підтримувати Сили Оборони України, де на цей раз до нас звернулись військові з 5-ї Штурмової Бригади. Воїни 5-ї ОШБ нині героїчно тримають оборону в районі Часового Яру і потребують Robotrack для вивезення поранених та підвозу набоїв на передові позиції! Тож давайте разом надамо їм цей вкрай необхідний дрон і допоможемо нашим героям у цей нелегкий час!',
            detailsStoryOutro: 'Разом до перемог!',
            detailsStoryImage: image2Doc.id,
            detailsGallery: [
              { image: image2Doc.id },
              { image: image1Doc.id },
              { image: image3Doc.id },
              { image: image2Doc.id },
              { image: image1Doc.id },
              { image: image3Doc.id },
            ],
          },
        ],
      },
    }),
  ])

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      locale: 'en' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        donateLabel: 'DONATE',
        donateUrl: '/projects/active/donate',
        navItems: [
          { link: { type: 'custom', label: 'Projects', url: '/projects' } },
          { link: { type: 'custom', label: 'About', url: '/about' } },
          { link: { type: 'custom', label: 'Achievements', url: '/achievements' } },
          { link: { type: 'custom', label: 'Reporting', url: '/#reporting' } },
          { link: { type: 'custom', label: 'Shop', url: '/shop' } },
          { link: { type: 'custom', label: 'FAQ', url: '/#faq' } },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'homepage',
      locale: 'en' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        hero: {
          titleLine1: 'WAY TO',
          titleLine2: 'UKRAINE',
          currentCollectionTitle: 'CURRENT FUNDRAISER',
          currentCollectionSubtitle: 'Pickup truck fundraiser',
          currentCollectionDescription: 'for 1st Assault Battalion "Da Vinci Wolves"',
          currentCollectionDonateLabel: 'DONATE',
          currentCollectionDonateUrl: '/projects/active/donate',
        },
        intro: {
          headline: 'Hello, we are from Ukraine!',
          description: 'Way to Ukraine is a mid-scale volunteer foundation supporting the Defense Forces of Ukraine.',
        },
        cards: [
          { title: 'projects', href: '/projects', image: image1Doc.id },
          { title: 'about', href: '/about', image: image2Doc.id },
          { title: 'achievements', href: '/achievements', image: image3Doc.id },
          { title: 'reporting', href: '/#reporting', image: image2Doc.id },
          { title: 'shop', href: '/shop', image: image3Doc.id },
          { title: 'faq', href: '/#faq', image: image1Doc.id },
        ],
        stats: {
          left: {
            value: '7 820 086 UAH',
            caption: 'Total raised by the foundation',
          },
          right: {
            value: '15 brigades',
            caption: 'Units supported by us',
          },
        },
        footer: {
          requisitesLabel: 'REQUISITES',
          requisitesUrl: 'https://way-to-ukraine.com/en/requisites',
          donateLabel: 'DONATE',
          donateUrl: '/projects/active/donate',
          socials: [
            { icon: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/groups/way.to.ukraine' },
            { icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/way.to.ua' },
            { icon: 'twitter', label: 'Twitter', url: 'https://x.com/Way_to_UA' },
          ],
        },
      },
    }),
    payload.updateGlobal({
      slug: 'shop',
      locale: 'en' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'Shop',
        items: [
          {
            image: image1Doc.id,
            title: 'Common W2U Box',
            price: '$225',
            backTitle: '5 items from the list:',
            selectedItems: [ukCommonSticker.id, ukCommonPatch.id],
            availableItems: [ukCommonPostcard.id, ukRareBracelet.id, ukRareTote.id],
            backButtonLabel: 'LEARN MORE',
            backButtonUrl: '/shop/common-w2u-box',
            frameSide: 'left',
          },
          {
            image: image2Doc.id,
            title: 'Rare W2U Box',
            price: '$500',
            backTitle: '4 items from the list:',
            selectedItems: [ukCommonPatch.id, ukRareBracelet.id],
            availableItems: [ukCommonSticker.id, ukCommonPostcard.id, ukRareTote.id, ukEpicShirt.id],
            backButtonLabel: 'LEARN MORE',
            backButtonUrl: '/shop/rare-w2u-box',
            frameSide: 'right',
          },
          {
            image: image3Doc.id,
            title: 'EPIC W2U Box',
            price: '$1000',
            backTitle: '6 items from the list:',
            selectedItems: [ukEpicShirt.id, ukEpicSurprise.id],
            availableItems: [ukCommonSticker.id, ukCommonPatch.id, ukCommonPostcard.id, ukRareTote.id],
            backButtonLabel: 'LEARN MORE',
            backButtonUrl: '/shop/epic-w2u-box',
            frameSide: 'left',
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'about',
      locale: 'en' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'About us',
        featuredMember: {
          image: imageHomeDoc.id,
          name: 'Name Surname',
          role: 'Foundation role',
          bio: 'Details, details, details, details, details, details, details, details, details. Details, details, details, details, details, details, details, details, details. Details, details, details, details, details.',
          telegramUrl: 'https://t.me/way_to_ua',
          twitterUrl: 'https://x.com/Way_to_UA',
        },
        teamSection: {
          members: [
            {
              image: imageHomeDoc.id,
              name: 'Name Surname',
              role: 'Foundation role',
              bio: 'Details, details, details, details, details, details, details, details, details. Details, details, details, details, details.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image1Doc.id,
              name: 'Name Surname',
              role: 'Foundation role',
              bio: 'Details, details, details, details, details, details, details, details, details. Details, details, details, details, details.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image2Doc.id,
              name: 'Name Surname',
              role: 'Foundation role',
              bio: 'Details, details, details, details, details, details, details, details, details. Details, details, details, details, details.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image3Doc.id,
              name: 'Name Surname',
              role: 'Foundation role',
              bio: 'Details, details, details, details, details, details, details, details, details. Details, details, details, details, details.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image1Doc.id,
              name: 'Name Surname',
              role: 'Foundation role',
              bio: 'Details, details, details, details, details, details, details, details, details. Details, details, details, details, details.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: imageHomeDoc.id,
              name: 'Name Surname',
              role: 'Foundation role',
              bio: 'Details, details, details, details, details, details, details, details, details. Details, details, details, details, details.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image2Doc.id,
              name: 'Name Surname',
              role: 'Foundation role',
              bio: 'Details, details, details, details, details, details, details, details, details. Details, details, details, details, details.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
            {
              image: image3Doc.id,
              name: 'Name Surname',
              role: 'Foundation role',
              bio: 'Details, details, details, details, details, details, details, details, details. Details, details, details, details, details.',
              telegramUrl: 'https://t.me/way_to_ua',
              twitterUrl: 'https://x.com/Way_to_UA',
            },
          ],
        },
        partnersSection: {
          title: 'Our partners',
          partners: [
            {
              image: image1Doc.id,
              name: 'V.E.S. GROUP',
              description:
                'Supplier of equipment from leading European manufacturers in ventilation, heating, electrical engineering, and lighting.',
              url: 'https://way-to-ukraine.com/en',
            },
            {
              image: image2Doc.id,
              name: 'V.E.S. GROUP',
              description:
                'Supplier of equipment from leading European manufacturers in ventilation, heating, electrical engineering, and lighting.',
              url: 'https://way-to-ukraine.com/en',
            },
            {
              image: image3Doc.id,
              name: 'V.E.S. GROUP',
              description:
                'Supplier of equipment from leading European manufacturers in ventilation, heating, electrical engineering, and lighting.',
              url: 'https://way-to-ukraine.com/en',
            },
            {
              image: image2Doc.id,
              name: 'V.E.S. GROUP',
              description:
                'Supplier of equipment from leading European manufacturers in ventilation, heating, electrical engineering, and lighting.',
              url: 'https://way-to-ukraine.com/en',
            },
            {
              image: image1Doc.id,
              name: 'V.E.S. GROUP',
              description:
                'Supplier of equipment from leading European manufacturers in ventilation, heating, electrical engineering, and lighting.',
              url: 'https://way-to-ukraine.com/en',
            },
          ],
        },
        storySection: {
          lead: 'Way to Ukraine is a mid-scale volunteer foundation working for the benefit of the Defense Forces of Ukraine',
          paragraphs: [
            {
              copy:
                'In this difficult time, it is extremely important to unite for the sake of a common goal, our victory. Each of us tries to be useful for our homeland and do everything within our power. Together with friends, we organized a charitable foundation that includes volunteers with prior experience in purchasing and delivering vehicles for the Armed Forces of Ukraine.',
            },
            {
              copy:
                'To maintain the combat capability of Ukrainian units during active hostilities, there is a constant need for fast transportation of ammunition, food, and personnel. Because the active phase of the war continues, there is a severe shortage of transport for these purposes, so the need for reliable high-clearance vehicles remains critical.',
            },
            {
              copy:
                'What do we offer? The main goal of the foundation is to deliver a vehicle to units that urgently need transportation. After direct communication with the military, we have contacts with the people responsible for the units where these vehicles are needed most.',
            },
            {
              copy:
                'How can you help us? If you have the opportunity, you can make a contribution. We are also grateful when people share information about our foundation and our work.',
            },
          ],
        },
      },
    }),
    payload.updateGlobal({
      slug: 'achievements',
      locale: 'en' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'Achievements',
        topStats: [
          { value: '7 820 086 UAH', caption: 'Total raised by the foundation', theme: 'dark', iconStyle: 'currency' },
          { value: '000 000 USD', caption: 'Total raised by the foundation', theme: 'accent', iconStyle: 'dollar' },
          { value: '14 brigades', caption: 'Units supported by us', theme: 'blue', iconStyle: 'diamond' },
        ],
        cards: [
          { layoutType: 'stat', value: '16', label: 'Pickup trucks', iconStyle: 'pickup', leafPosition: 'center' },
          { layoutType: 'stat', value: '4', label: 'Vans', iconStyle: 'bus', leafPosition: 'center' },
          { layoutType: 'stat', value: '3', label: 'SUVs', iconStyle: 'suv', leafPosition: 'right' },
          { layoutType: 'stat', value: '2', label: 'Military trucks', iconStyle: 'truck', leafPosition: 'upright' },
          { layoutType: 'stat', value: '1', label: 'Night vision devices', iconStyle: 'nightVision', leafPosition: 'left' },
          { layoutType: 'stat', value: '2', label: 'Antennas', iconStyle: 'antenna', leafPosition: 'center' },
          { layoutType: 'stat', value: '1', label: 'Drones', iconStyle: 'drone', leafPosition: 'right' },
          { layoutType: 'stat', value: '1', label: 'EW systems', iconStyle: 'reb', leafPosition: 'left' },
          { layoutType: 'stat', value: '1', label: 'Ambulances', iconStyle: 'ambulance', leafPosition: 'upright' },
          { layoutType: 'photoWide', featuredImage: image3Doc.id },
          { layoutType: 'stat', value: '2', label: 'Spectrum analyzers', iconStyle: 'spectrum', leafPosition: 'right' },
        ],
        cta: {
          label: 'CLOSED PROJECTS',
          url: '/projects/finished',
        },
      },
    }),
    payload.updateGlobal({
      slug: 'projects-overview',
      locale: 'en' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'Projects',
        cards: [
          {
            image: image1Doc.id,
            title: 'Active projects',
            url: '/projects/active',
            accentSide: 'left',
          },
          {
            image: image2Doc.id,
            title: 'Closed projects',
            url: '/projects/finished',
            accentSide: 'right',
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'finished-projects',
      locale: 'en' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'Closed Projects',
        cards: [
          { image: image1Doc.id, unit: '120th Brigade, 173rd Battalion', vehicle: 'STEYR 1291', cornerStyle: 'left' },
          { image: image2Doc.id, unit: '120th Brigade, 173rd Battalion', vehicle: 'STEYR 1291', cornerStyle: 'right' },
          { image: image3Doc.id, unit: '120th Brigade, 173rd Battalion', vehicle: 'STEYR 1291', cornerStyle: 'left' },
          { image: image2Doc.id, unit: '120th Brigade, 173rd Battalion', vehicle: 'STEYR 1291', cornerStyle: 'right' },
          { image: image3Doc.id, unit: '120th Brigade, 173rd Battalion', vehicle: 'STEYR 1291', cornerStyle: 'left' },
          { image: image1Doc.id, unit: '120th Brigade, 173rd Battalion', vehicle: 'STEYR 1291', cornerStyle: 'right' },
          { image: image3Doc.id, unit: '120th Brigade, 173rd Battalion', vehicle: 'STEYR 1291', cornerStyle: 'left' },
          { image: image1Doc.id, unit: '120th Brigade, 173rd Battalion', vehicle: 'STEYR 1291', cornerStyle: 'right' },
          { image: image2Doc.id, unit: '120th Brigade, 173rd Battalion', vehicle: 'STEYR 1291', cornerStyle: 'left' },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'active-projects',
      locale: 'en' as unknown as 'all',
      context: {
        disableRevalidate: true,
      },
      data: {
        pageTitle: 'Active Projects',
        donateMethods: [
          {
            label: 'UniversalBank',
            details: [
              { label: 'IBAN (EUR)', value: 'UA493220010000026006080001211' },
              { label: 'IBAN (USD)', value: 'UA313220010000026007080001210' },
              { label: 'IBAN (CHF)', value: 'UA063220010000026003080001214' },
              { label: 'IBAN (UAH)', value: 'UA583220010000026007080001209' },
              { label: 'Bank', value: 'JSK UNIVERSAL BANK' },
              { label: 'Receiver', value: 'CO CF WAY TO UKRAINE' },
            ],
          },
          {
            label: 'Crypto',
            details: [
              { label: 'BTC', value: '1PgLvcGNwerzKwtDSdvvgPLCgXDYfy8YZW' },
              { label: 'ETH (ERC20)', value: '0x6f69c7fc26f885934d48d0285fb8c1a992e4a2da' },
              { label: 'USDT (TRC20)', value: 'TW8nrwBuTWogBZN9kzChJ3fjg6FFmC5qaC' },
            ],
          },
          { label: 'Other', details: [{ label: 'PayPal', value: 'waytoukr@gmail.com' }] },
        ],
        projects: [
          {
            image: image1Doc.id,
            badgeImage: image3Doc.id,
            cardTitle: 'Vehicle fundraiser',
            leftOverlayTitle: 'Vehicle fundraiser',
            unitLabel: 'for:',
            unitValue: 'Unit',
            directionLabel: 'direction:',
            directionValue: 'Direction',
            goalLabel: 'goal:',
            goalValue: '000 000 UAH',
            progressPercent: 0,
            donateLabel: 'DONATE',
            donateUrl: '/projects/active/donate',
            donatePageTitle: 'Donate',
            monobankJar: steyrRepairJar.id,
            detailsLabel: 'DETAILS',
            detailsUrl: '/projects/active/details',
            detailsPageTitle: 'Details',
            detailsStoryHeading: 'Dear friends!',
            detailsStoryBody:
              'We continue supporting the Defense Forces of Ukraine. This time, fighters from the 5th Assault Brigade asked us for help. They are defending near Chasiv Yar and need a Robotrack drone platform for evacuation and ammunition supply.',
            detailsStoryOutro: 'Together to victory!',
            detailsStoryImage: image1Doc.id,
            detailsGallery: [
              { image: image1Doc.id },
              { image: image2Doc.id },
              { image: image3Doc.id },
              { image: image1Doc.id },
              { image: image2Doc.id },
              { image: image3Doc.id },
            ],
          },
          {
            image: image2Doc.id,
            badgeImage: image3Doc.id,
            cardTitle: 'Vehicle fundraiser',
            leftOverlayTitle: 'Vehicle fundraiser',
            unitLabel: 'for:',
            unitValue: 'Unit',
            directionLabel: 'direction:',
            directionValue: 'Direction',
            goalLabel: 'goal:',
            goalValue: '000 000 UAH',
            progressPercent: 0,
            donateLabel: 'DONATE',
            donateUrl: '/projects/active/donate',
            donatePageTitle: 'Donate',
            monobankJar: steyrTruckJar.id,
            detailsLabel: 'DETAILS',
            detailsUrl: '/projects/active/details',
            detailsPageTitle: 'Details',
            detailsStoryHeading: 'Dear friends!',
            detailsStoryBody:
              'We continue supporting the Defense Forces of Ukraine. This time, fighters from the 5th Assault Brigade asked us for help. They are defending near Chasiv Yar and need a Robotrack drone platform for evacuation and ammunition supply.',
            detailsStoryOutro: 'Together to victory!',
            detailsStoryImage: image2Doc.id,
            detailsGallery: [
              { image: image2Doc.id },
              { image: image1Doc.id },
              { image: image3Doc.id },
              { image: image2Doc.id },
              { image: image1Doc.id },
              { image: image3Doc.id },
            ],
          },
        ],
      },
    }),
  ])

  // Localized fields inside arrays can be lost when another locale rewrites rows with new IDs.
  // Re-apply Ukrainian achievements labels against the current row IDs to keep both `uk` and `en`.
  const achievementsEN = await payload.findGlobal({
    slug: 'achievements',
    locale: 'en' as unknown as 'all',
    depth: 0,
    req,
  })

  const ukTopStats = [
    { value: '7 820 086 гривень', caption: 'Усього зібрано фондом' },
    { value: '000 000 доларів', caption: 'Усього зібрано фондом' },
    { value: '14 бригад', caption: 'Кількість підрозділів, яким ми допомогли' },
  ]

  const ukCards = [
    { value: '16', label: 'Пікапів' },
    { value: '4', label: 'Бусів' },
    { value: '3', label: 'Позашляховиків' },
    { value: '2', label: 'Військових вантажівок' },
    { value: '1', label: 'Приладів нічного бачення' },
    { value: '2', label: 'Антен' },
    { value: '1', label: 'Дронів' },
    { value: '1', label: 'Засобів РЕБ' },
    { value: '1', label: 'Карет швидкої допомоги' },
    { value: '', label: '' },
    { value: '2', label: 'Аналізаторів спектру' },
  ]

  await payload.updateGlobal({
    slug: 'achievements',
    locale: 'uk' as unknown as 'all',
    req,
    context: {
      disableRevalidate: true,
    },
    data: {
      pageTitle: 'Досягнення',
      topStats: (achievementsEN.topStats || []).map((item, index) => ({
        id: item.id,
        value: ukTopStats[index]?.value || '',
        caption: ukTopStats[index]?.caption || '',
        theme: item.theme,
        iconStyle: item.iconStyle,
      })),
      cards: (achievementsEN.cards || []).map((item, index) => ({
        id: item.id,
        layoutType: item.layoutType,
        value: item.layoutType === 'photoWide' ? undefined : ukCards[index]?.value || '',
        label: item.layoutType === 'photoWide' ? undefined : ukCards[index]?.label || '',
        iconStyle: item.iconStyle,
        leafPosition: item.leafPosition,
        featuredImage: item.featuredImage,
      })),
      cta: {
        label: 'ЗАКРИТІ ПРОЄКТИ',
        url: '/projects/finished',
      },
    },
  })

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
