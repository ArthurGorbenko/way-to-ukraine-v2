import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const MonobankJars: CollectionConfig = {
  slug: 'monobank-jars',
  admin: {
    useAsTitle: 'jarId',
    defaultColumns: ['jarId', 'title', 'progressPercent', 'lastFetchStatus', 'lastFetchedAt'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'jarUrl',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'jarId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'amountMinor',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'goalMinor',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'displayAmount',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'displayGoal',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'progressPercent',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      max: 100,
    },
    {
      name: 'lastFetchedAt',
      type: 'date',
    },
    {
      name: 'lastFetchStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Success', value: 'success' },
        { label: 'Error', value: 'error' },
      ],
    },
    {
      name: 'lastError',
      type: 'textarea',
    },
  ],
}
