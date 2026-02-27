import type { GlobalConfig } from 'payload'

import { revalidateFinishedProjects } from './hooks/revalidateFinishedProjects'

const defaultCards = Array.from({ length: 9 }, (_, index) => ({
  unit: '120 бригада, 173 батальйон',
  vehicle: 'STEYR 1291',
  cornerStyle: index % 2 === 0 ? 'left' : 'right',
}))

export const FinishedProjects: GlobalConfig = {
  slug: 'finished-projects',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      required: true,
      defaultValue: 'Закриті проєкти',
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 9,
      maxRows: 9,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'unit',
          type: 'text',
          required: true,
          defaultValue: '120 бригада, 173 батальйон',
        },
        {
          name: 'vehicle',
          type: 'text',
          required: true,
          defaultValue: 'STEYR 1291',
        },
        {
          name: 'cornerStyle',
          type: 'select',
          required: true,
          defaultValue: 'left',
          options: [
            { label: 'Left Corner', value: 'left' },
            { label: 'Right Corner', value: 'right' },
          ],
        },
      ],
      defaultValue: defaultCards,
    },
  ],
  hooks: {
    afterChange: [revalidateFinishedProjects],
  },
}
