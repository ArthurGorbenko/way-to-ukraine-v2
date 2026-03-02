import type { GlobalConfig } from 'payload'

import { revalidateActiveProjects } from './hooks/revalidateActiveProjects'

const defaultProjects = Array.from({ length: 2 }, () => ({
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
  donateMethods: [{ label: 'Monobank' }, { label: 'UniversalBank' }, { label: 'Crypto' }, { label: 'Інше' }],
  detailsLabel: 'ДЕТАЛЬНІШЕ',
  detailsUrl: '/projects/active/details',
  detailsPageTitle: 'Детальніше',
  detailsStoryHeading: 'Дорогі друзі!',
  detailsStoryBody:
    'Вкотре ми продовжуємо підтримувати Сили Оборони України, де на цей раз до нас звернулись військові з 5-ї Штурмової Бригади. Воїни 5-ї ОШБ нині героїчно тримають оборону в районі Часового Яру і потребують Robotrack для вивезення поранених та підвозу набоїв на передові позиції! Тож давайте разом надамо їм цей вкрай необхідний дрон і допоможемо нашим героям у цей нелегкий час!',
  detailsStoryOutro: 'Разом до перемог!',
}))

export const ActiveProjects: GlobalConfig = {
  slug: 'active-projects',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      required: true,
      defaultValue: 'Актуальні проєкти',
    },
    {
      name: 'projects',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'badgeImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'cardTitle',
          type: 'text',
          required: true,
          defaultValue: 'Збір на авто',
        },
        {
          name: 'leftOverlayTitle',
          type: 'text',
          required: true,
          defaultValue: 'Збір на авто',
        },
        {
          name: 'unitLabel',
          type: 'text',
          required: true,
          defaultValue: 'для:',
        },
        {
          name: 'unitValue',
          type: 'text',
          required: true,
          defaultValue: 'Підрозділ',
        },
        {
          name: 'directionLabel',
          type: 'text',
          required: true,
          defaultValue: 'напрямок:',
        },
        {
          name: 'directionValue',
          type: 'text',
          required: true,
          defaultValue: 'Напрямок',
        },
        {
          name: 'goalLabel',
          type: 'text',
          required: true,
          defaultValue: 'ціль:',
        },
        {
          name: 'goalValue',
          type: 'text',
          required: true,
          defaultValue: '000 000 грн',
        },
        {
          name: 'progressPercent',
          type: 'number',
          required: true,
          min: 0,
          max: 100,
          defaultValue: 0,
        },
        {
          name: 'donateLabel',
          type: 'text',
          required: true,
          defaultValue: 'ЗАДОНАТИТИ',
        },
        {
          name: 'donateUrl',
          type: 'text',
          required: true,
          defaultValue: '/projects/active/donate',
        },
        {
          name: 'donatePageTitle',
          type: 'text',
          required: true,
          defaultValue: 'Задонатити',
        },
        {
          name: 'donateMethods',
          type: 'array',
          required: true,
          minRows: 1,
          defaultValue: [{ label: 'Monobank' }, { label: 'UniversalBank' }, { label: 'Crypto' }, { label: 'Інше' }],
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'detailsLabel',
          type: 'text',
          required: true,
          defaultValue: 'ДЕТАЛЬНІШЕ',
        },
        {
          name: 'detailsUrl',
          type: 'text',
          required: true,
          defaultValue: '/projects/active/details',
        },
        {
          name: 'detailsPageTitle',
          type: 'text',
          required: true,
          defaultValue: 'Детальніше',
        },
        {
          name: 'detailsStoryHeading',
          type: 'text',
          required: true,
          defaultValue: 'Дорогі друзі!',
        },
        {
          name: 'detailsStoryBody',
          type: 'textarea',
          required: true,
          defaultValue:
            'Вкотре ми продовжуємо підтримувати Сили Оборони України, де на цей раз до нас звернулись військові з 5-ї Штурмової Бригади. Воїни 5-ї ОШБ нині героїчно тримають оборону в районі Часового Яру і потребують Robotrack для вивезення поранених та підвозу набоїв на передові позиції! Тож давайте разом надамо їм цей вкрай необхідний дрон і допоможемо нашим героям у цей нелегкий час!',
        },
        {
          name: 'detailsStoryOutro',
          type: 'text',
          required: true,
          defaultValue: 'Разом до перемог!',
        },
        {
          name: 'detailsStoryImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'detailsGallery',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
      defaultValue: defaultProjects,
    },
  ],
  hooks: {
    afterChange: [revalidateActiveProjects],
  },
}
