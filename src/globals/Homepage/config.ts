import type { GlobalConfig } from 'payload'

import { revalidateHomepage } from './hooks/revalidateHomepage'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'titleLine1',
          type: 'text',
          required: true,
          defaultValue: 'WAY TO',
        },
        {
          name: 'titleLine2',
          type: 'text',
          required: true,
          defaultValue: 'UKRAINE',
        },
        {
          name: 'currentCollectionTitle',
          type: 'text',
          required: true,
          defaultValue: 'ПОТОЧНИЙ ЗБІР',
        },
        {
          name: 'currentCollectionSubtitle',
          type: 'text',
          required: true,
          defaultValue: 'Збір на пікап',
        },
        {
          name: 'currentCollectionDescription',
          type: 'text',
          required: true,
          defaultValue: 'для 1 ОШБ «Вовки да Вінчі»',
        },
        {
          name: 'currentCollectionDonateLabel',
          type: 'text',
          required: true,
          defaultValue: 'ЗАДОНАТИТИ',
        },
        {
          name: 'currentCollectionDonateUrl',
          type: 'text',
          required: true,
          defaultValue: '/projects/active/donate',
        },
      ],
    },
    {
      name: 'intro',
      type: 'group',
      fields: [
        {
          name: 'headline',
          type: 'text',
          required: true,
          defaultValue: 'Всім привіт, ми з України!',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          defaultValue:
            'Way to Ukraine — це волонтерський фонд середнього масштабу, який працює на благо СОУ',
        },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 6,
      maxRows: 6,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        {
          name: 'left',
          type: 'group',
          fields: [
            {
              name: 'iconStyle',
              type: 'select',
              required: true,
              defaultValue: 'currency',
              options: [
                { label: 'Currency', value: 'currency' },
                { label: 'Custom', value: 'custom' },
              ],
            },
            {
              name: 'customIcon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (_, siblingData) => siblingData?.iconStyle === 'custom',
              },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              defaultValue: '7 820 086 гривень',
            },
            {
              name: 'caption',
              type: 'text',
              required: true,
              defaultValue: 'Усього зібрано фондом',
            },
          ],
        },
        {
          name: 'right',
          type: 'group',
          fields: [
            {
              name: 'iconStyle',
              type: 'select',
              required: true,
              defaultValue: 'diamond',
              options: [
                { label: 'Diamond', value: 'diamond' },
                { label: 'Custom', value: 'custom' },
              ],
            },
            {
              name: 'customIcon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (_, siblingData) => siblingData?.iconStyle === 'custom',
              },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              defaultValue: '15 бригад',
            },
            {
              name: 'caption',
              type: 'text',
              required: true,
              defaultValue: 'Кількість підрозділів, яким ми допомогли',
            },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'logoImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'requisitesLabel',
          type: 'text',
          required: true,
          defaultValue: 'РЕКВІЗИТИ',
        },
        {
          name: 'requisitesUrl',
          type: 'text',
          required: true,
          defaultValue: 'https://way-to-ukraine.com/en/requisites',
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
          name: 'socials',
          type: 'array',
          maxRows: 3,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Telegram', value: 'telegram' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Twitter', value: 'twitter' },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHomepage],
  },
}
