import type { GlobalConfig } from 'payload'

import { revalidateAbout } from './hooks/revalidateAbout'

const defaultTeamMembers = Array.from({ length: 8 }, (_, index) => ({
  name: `Ім’я Прізвище ${index + 1}`,
  role: 'Посада у фонді',
  bio: 'Короткий опис учасника команди та його або її ролі у фонді.',
}))

const defaultPartners = Array.from({ length: 5 }, (_, index) => ({
  name: `Партнер ${index + 1}`,
  description: 'Короткий опис партнера та його внеску в підтримку фонду.',
}))

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
      name: 'featuredMember',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'name',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Ім’я Прізвище',
        },
        {
          name: 'role',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Посада у фонді',
        },
        {
          name: 'bio',
          type: 'textarea',
          localized: true,
          required: true,
          defaultValue: 'Короткий опис учасника команди та його або її ролі у фонді.',
        },
        {
          name: 'telegramUrl',
          type: 'text',
        },
        {
          name: 'twitterUrl',
          type: 'text',
        },
      ],
    },
    {
      name: 'teamSection',
      type: 'group',
      fields: [
        {
          name: 'members',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'name',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'role',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'bio',
              type: 'textarea',
              localized: true,
              required: true,
            },
            {
              name: 'telegramUrl',
              type: 'text',
            },
            {
              name: 'twitterUrl',
              type: 'text',
            },
          ],
          defaultValue: defaultTeamMembers,
        },
      ],
    },
    {
      name: 'partnersSection',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Наші партнери',
        },
        {
          name: 'partners',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'name',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              required: true,
            },
            {
              name: 'url',
              type: 'text',
            },
          ],
          defaultValue: defaultPartners,
        },
      ],
    },
    {
      name: 'storySection',
      type: 'group',
      fields: [
        {
          name: 'lead',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Way to Ukraine — це волонтерський фонд середнього масштабу, який працює на благо СОУ',
        },
        {
          name: 'paragraphs',
          type: 'array',
          required: true,
          minRows: 1,
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
  ],
  hooks: {
    afterChange: [revalidateAbout],
  },
}
