import type { GlobalConfig } from 'payload'
import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { revalidateFinishedProjects } from './hooks/revalidateFinishedProjects'
import { generateSlug } from './hooks/generateSlug'

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
      localized: true,
      required: true,
      defaultValue: 'Закриті проєкти',
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          localized: true,
        },
        {
          name: 'unit',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: '120 бригада, 173 батальйон',
        },
        {
          name: 'vehicle',
          type: 'text',
          localized: true,
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
        {
          name: 'slug',
          type: 'text',
          required: true,
          admin: {
            hidden: true,
            readOnly: true,
          },
          hooks: {
            beforeValidate: [generateSlug],
          },
        },
        {
          name: 'detailsPageTitle',
          type: 'text',
          localized: true,
          defaultValue: 'Детальніше',
        },
        {
          name: 'detailsStoryHeading',
          type: 'text',
          localized: true,
          defaultValue: 'Дорогі друзі!',
        },
        {
          name: 'detailsStoryBody',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        {
          name: 'detailsStoryOutro',
          type: 'text',
          localized: true,
          defaultValue: 'Разом до перемог!',
        },
        {
          name: 'detailsStoryImage',
          type: 'upload',
          relationTo: 'media',
          localized: true,
        },
        {
          name: 'detailsGallery',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          name: 'badgeImage',
          type: 'upload',
          relationTo: 'media',
          localized: true,
        },
        {
          name: 'unitLabel',
          type: 'text',
          localized: true,
          defaultValue: 'для:',
        },
        {
          name: 'unitValue',
          type: 'text',
          localized: true,
          defaultValue: 'Підрозділ',
        },
        {
          name: 'directionLabel',
          type: 'text',
          localized: true,
          defaultValue: 'напрямок:',
        },
        {
          name: 'directionValue',
          type: 'text',
          localized: true,
          defaultValue: 'Напрямок',
        },
      ],
      defaultValue: defaultCards,
    },
  ],
  hooks: {
    afterChange: [revalidateFinishedProjects],
  },
}
