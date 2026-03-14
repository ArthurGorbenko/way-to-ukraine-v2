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
        { title: 'Common W2U Box', price: '$225', frameSide: 'left' },
        { title: 'Rare W2U Box', price: '$500', frameSide: 'right' },
        { title: 'EPIC W2U Box', price: '$1000', frameSide: 'left' },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateShop],
  },
}
