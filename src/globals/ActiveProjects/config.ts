import type { Field, GlobalConfig } from 'payload'
import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { revalidateActiveProjects } from './hooks/revalidateActiveProjects'
import { generateSlug } from './hooks/generateSlug'

const sharedDonateMethodsDefault = [
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
] as const

const donateMethodFields: Field[] = [
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
]

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
  detailsLabel: 'ДЕТАЛЬНІШЕ',
  detailsUrl: '/projects/active/details',
  detailsPageTitle: 'Детальніше',
  detailsStoryHeading: 'Дорогі друзі!',
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
      name: 'donateMethods',
      type: 'array',
      required: true,
      minRows: 1,
      defaultValue: sharedDonateMethodsDefault,
      fields: donateMethodFields,
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
          localized: true,
        },
        {
          name: 'badgeImage',
          type: 'upload',
          relationTo: 'media',
          localized: true,
        },
        {
          name: 'cardTitle',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Збір на авто',
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          admin: {
            hidden: true,
            readOnly: true,
          },
          hooks: {
            beforeValidate: [generateSlug],
          },
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
          name: 'monobankJar',
          type: 'relationship',
          relationTo: 'monobank-jars',
          label: 'Monobank jar',
          admin: {
            description: 'Select the Monobank jar record used to render fundraising progress for this project.',
          },
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
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
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
          localized: true,
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
