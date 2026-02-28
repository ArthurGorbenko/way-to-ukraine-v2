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
  donateUrl: '#',
  detailsLabel: 'ДЕТАЛЬНІШЕ',
  detailsUrl: '#',
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
          required: true,
          defaultValue: 'Збір на авто',
        },
        {
          name: 'leftOverlayTitle',
          type: 'text',
          required: true,
          defaultValue: 'Збір на авто',
        },
        {
          name: 'unitLabel',
          type: 'text',
          required: true,
          defaultValue: 'для:',
        },
        {
          name: 'unitValue',
          type: 'text',
          required: true,
          defaultValue: 'Підрозділ',
        },
        {
          name: 'directionLabel',
          type: 'text',
          required: true,
          defaultValue: 'напрямок:',
        },
        {
          name: 'directionValue',
          type: 'text',
          required: true,
          defaultValue: 'Напрямок',
        },
        {
          name: 'goalLabel',
          type: 'text',
          required: true,
          defaultValue: 'ціль:',
        },
        {
          name: 'goalValue',
          type: 'text',
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
          name: 'detailsLabel',
          type: 'text',
          required: true,
          defaultValue: 'ДЕТАЛЬНІШЕ',
        },
        {
          name: 'detailsUrl',
          type: 'text',
          required: true,
          defaultValue: '#',
        },
      ],
      defaultValue: defaultProjects,
    },
  ],
  hooks: {
    afterChange: [revalidateActiveProjects],
  },
}
