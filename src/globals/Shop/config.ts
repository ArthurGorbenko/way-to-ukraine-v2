import type { GlobalConfig } from 'payload'

import { revalidateShop } from './hooks/revalidateShop'

export const Shop: GlobalConfig = {
  slug: 'shop',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Крамниця',
    },
    {
      name: 'items',
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
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'price',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'backTitle',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: '5 предметів зі списку:',
        },
        {
          name: 'backItems',
          type: 'array',
          localized: true,
          required: true,
          minRows: 1,
          maxRows: 8,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
          defaultValue: [
            { text: 'Перший предмет' },
            { text: 'Другий предмет' },
            { text: 'Третій предмет' },
          ],
        },
        {
          name: 'backButtonLabel',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'ДІЗНАТИСЯ БІЛЬШЕ',
        },
        {
          name: 'backButtonUrl',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: '/shop',
        },
        {
          name: 'frameSide',
          type: 'select',
          required: true,
          defaultValue: 'left',
          options: [
            { label: 'Left Frame', value: 'left' },
            { label: 'Right Frame', value: 'right' },
          ],
        },
      ],
      defaultValue: [
        {
          title: 'Common W2U Box',
          price: '$225',
          backTitle: '5 предметів зі списку:',
          backItems: [{ text: 'Перший предмет' }, { text: 'Другий предмет' }, { text: 'Третій предмет' }],
          backButtonLabel: 'ДІЗНАТИСЯ БІЛЬШЕ',
          backButtonUrl: '/shop',
          frameSide: 'left',
        },
        {
          title: 'Rare W2U Box',
          price: '$500',
          backTitle: '5 предметів зі списку:',
          backItems: [{ text: 'Перший предмет' }, { text: 'Другий предмет' }, { text: 'Третій предмет' }],
          backButtonLabel: 'ДІЗНАТИСЯ БІЛЬШЕ',
          backButtonUrl: '/shop',
          frameSide: 'right',
        },
        {
          title: 'EPIC W2U Box',
          price: '$1000',
          backTitle: '5 предметів зі списку:',
          backItems: [{ text: 'Перший предмет' }, { text: 'Другий предмет' }, { text: 'Третій предмет' }],
          backButtonLabel: 'ДІЗНАТИСЯ БІЛЬШЕ',
          backButtonUrl: '/shop',
          frameSide: 'left',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateShop],
  },
}
