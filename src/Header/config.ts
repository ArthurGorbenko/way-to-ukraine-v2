import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logoVariant',
      type: 'select',
      required: true,
      defaultValue: 'yellow',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'customLogo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.logoVariant === 'custom',
      },
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
      defaultValue: '#',
    },
    {
      name: 'languageSwitcherMode',
      type: 'select',
      required: true,
      defaultValue: 'visualOnly',
      options: [{ label: 'Visual Only', value: 'visualOnly' }],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
      defaultValue: [
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
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
