import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const MonobankJars: CollectionConfig = {
  slug: 'monobank-jars',
  admin: {
    useAsTitle: 'jarUrl',
    defaultColumns: ['jarUrl', 'title', 'progressPercent', 'lastFetchStatus', 'lastFetchedAt'],
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
      admin: {
        description: 'Primary manual field. Add the public send.monobank.ua/jar/{clientId} URL here.',
      },
    },
    {
      name: 'clientId',
      type: 'text',
      index: true,
      admin: {
        description: 'Derived from the jar URL during sync.',
        readOnly: true,
      },
    },
    {
      name: 'extJarId',
      type: 'text',
      index: true,
      admin: {
        description: 'Resolved by sync and used for Monobank API fetches.',
        readOnly: true,
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'amountMinor',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'goalMinor',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'displayAmount',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'displayGoal',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'progressPercent',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      max: 100,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastFetchedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastResolvedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
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
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastResolveStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Success', value: 'success' },
        { label: 'Error', value: 'error' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastError',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastResolveError',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
  ],
}
