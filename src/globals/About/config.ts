import type { GlobalConfig } from 'payload'

import { revalidateAbout } from './hooks/revalidateAbout'

export const About: GlobalConfig = {
  slug: 'about',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Про нас',
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'WAY TO UKRAINE',
        },
        {
          name: 'headline',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Всім привіт, ми з України!',
        },
        {
          name: 'paragraphs',
          type: 'array',
          minRows: 4,
          maxRows: 4,
          required: true,
          fields: [
            {
              name: 'copy',
              type: 'textarea',
              localized: true,
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'video',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Інтерв’ю «UA:Перший» у марафоні',
        },
        {
          name: 'youtubeUrl',
          type: 'text',
          required: true,
          defaultValue: 'https://www.youtube.com/watch?v=hmbRxrP-dPQ&t=15853',
        },
        {
          name: 'originalVideoLabel',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Оригінальне відео',
        },
        {
          name: 'originalVideoUrl',
          type: 'text',
          required: true,
          defaultValue: 'https://www.youtube.com/watch?v=hmbRxrP-dPQ&t=15853',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateAbout],
  },
}
