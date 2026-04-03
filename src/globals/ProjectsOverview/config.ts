import type { GlobalConfig } from 'payload'

import { revalidateProjectsOverview } from './hooks/revalidateProjectsOverview'

const defaultCards = [
  {
    title: 'Актуальні проєкти',
    url: '/projects/active',
    accentSide: 'left',
  },
  {
    title: 'Закриті проєкти',
    url: '/projects/finished',
    accentSide: 'right',
  },
] as const

export const ProjectsOverview: GlobalConfig = {
  slug: 'projects-overview',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Проєкти',
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 2,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'accentSide',
          type: 'select',
          required: true,
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
        },
      ],
      defaultValue: defaultCards,
    },
  ],
  hooks: {
    afterChange: [revalidateProjectsOverview],
  },
}
