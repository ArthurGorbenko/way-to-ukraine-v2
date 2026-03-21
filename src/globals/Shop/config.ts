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
          name: 'selectedItems',
          type: 'relationship',
          relationTo: 'shop-items',
          hasMany: true,
          required: true,
        },
        {
          name: 'availableItems',
          type: 'relationship',
          relationTo: 'shop-items',
          hasMany: true,
          required: true,
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
          selectedItems: [],
          availableItems: [],
          backButtonLabel: 'ДІЗНАТИСЯ БІЛЬШЕ',
          backButtonUrl: '/shop/common-w2u-box',
          frameSide: 'left',
        },
        {
          title: 'Rare W2U Box',
          price: '$500',
          backTitle: '5 предметів зі списку:',
          selectedItems: [],
          availableItems: [],
          backButtonLabel: 'ДІЗНАТИСЯ БІЛЬШЕ',
          backButtonUrl: '/shop/rare-w2u-box',
          frameSide: 'right',
        },
        {
          title: 'EPIC W2U Box',
          price: '$1000',
          backTitle: '5 предметів зі списку:',
          selectedItems: [],
          availableItems: [],
          backButtonLabel: 'ДІЗНАТИСЯ БІЛЬШЕ',
          backButtonUrl: '/shop/epic-w2u-box',
          frameSide: 'left',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateShop],
  },
}
