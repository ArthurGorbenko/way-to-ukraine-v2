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
  donateMethods: [
    {
      label: 'Monobank',
      details: [
        { label: '2 Ecoflow Delta 2 for SOF', value: 'https://send.monobank.ua/jar/5BKt1DUbx6' },
        {
          label: 'Military truck Steyr 1291 for Engineer company of the 120-th TDF Brigade',
          value: 'https://send.monobank.ua/jar/bB9VYwZiY',
        },
        { label: 'Repair and restoration of damaged STEYR 1291', value: 'https://send.monobank.ua/jar/3dSGvocJoY' },
      ],
    },
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
      localized: true,
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
          localized: true,
          required: true,
          defaultValue: 'Збір на авто',
        },
        {
          name: 'leftOverlayTitle',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Збір на авто',
        },
        {
          name: 'unitLabel',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'для:',
        },
        {
          name: 'unitValue',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Підрозділ',
        },
        {
          name: 'directionLabel',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'напрямок:',
        },
        {
          name: 'directionValue',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Напрямок',
        },
        {
          name: 'goalLabel',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'ціль:',
        },
        {
          name: 'goalValue',
          type: 'text',
          localized: true,
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
          localized: true,
          required: true,
          defaultValue: 'ЗАДОНАТИТИ',
        },
        {
          name: 'donateUrl',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: '/projects/active/donate',
        },
        {
          name: 'donatePageTitle',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Задонатити',
        },
        {
          name: 'monoJarUrl',
          type: 'text',
          label: 'Monobank jar URL',
          admin: {
            description:
              'Supports https://api.monobank.ua/bank/jar/{id} or widget URLs with the jar query parameter.',
          },
        },
        {
          name: 'donateMethods',
          type: 'array',
          required: true,
          minRows: 1,
          defaultValue: [
            {
              label: 'Monobank',
              details: [
                { label: '2 Ecoflow Delta 2 for SOF', value: 'https://send.monobank.ua/jar/5BKt1DUbx6' },
                {
                  label: 'Military truck Steyr 1291 for Engineer company of the 120-th TDF Brigade',
                  value: 'https://send.monobank.ua/jar/bB9VYwZiY',
                },
                { label: 'Repair and restoration of damaged STEYR 1291', value: 'https://send.monobank.ua/jar/3dSGvocJoY' },
              ],
            },
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
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'actionLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'actionUrl',
              type: 'text',
              localized: true,
            },
            {
              name: 'details',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          name: 'detailsLabel',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'ДЕТАЛЬНІШЕ',
        },
        {
          name: 'detailsUrl',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: '/projects/active/details',
        },
        {
          name: 'detailsPageTitle',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Детальніше',
        },
        {
          name: 'detailsStoryHeading',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Дорогі друзі!',
        },
        {
          name: 'detailsStoryBody',
          type: 'textarea',
          localized: true,
          required: true,
          defaultValue:
            'Вкотре ми продовжуємо підтримувати Сили Оборони України, де на цей раз до нас звернулись військові з 5-ї Штурмової Бригади. Воїни 5-ї ОШБ нині героїчно тримають оборону в районі Часового Яру і потребують Robotrack для вивезення поранених та підвозу набоїв на передові позиції! Тож давайте разом надамо їм цей вкрай необхідний дрон і допоможемо нашим героям у цей нелегкий час!',
        },
        {
          name: 'detailsStoryOutro',
          type: 'text',
          localized: true,
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
