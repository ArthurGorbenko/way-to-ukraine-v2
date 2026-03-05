import type { GlobalConfig } from 'payload'

import { revalidateAchievements } from './hooks/revalidateAchievements'

const iconOptions = [
  { label: 'Currency', value: 'currency' },
  { label: 'Diamond', value: 'diamond' },
  { label: 'Dollar', value: 'dollar' },
  { label: 'Pickup', value: 'pickup' },
  { label: 'Bus', value: 'bus' },
  { label: 'SUV', value: 'suv' },
  { label: 'Truck', value: 'truck' },
  { label: 'Night Vision', value: 'nightVision' },
  { label: 'Antenna', value: 'antenna' },
  { label: 'Drone', value: 'drone' },
  { label: 'REB', value: 'reb' },
  { label: 'Ambulance', value: 'ambulance' },
  { label: 'Spectrum', value: 'spectrum' },
]

export const Achievements: GlobalConfig = {
  slug: 'achievements',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pageTitle',
      type: 'text',
      required: true,
      defaultValue: 'Досягнення',
    },
    {
      name: 'topStats',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          required: true,
        },
        {
          name: 'theme',
          type: 'select',
          required: true,
          options: [
            { label: 'Dark', value: 'dark' },
            { label: 'Accent', value: 'accent' },
            { label: 'Blue', value: 'blue' },
          ],
        },
        {
          name: 'iconStyle',
          type: 'select',
          required: true,
          options: iconOptions,
        },
      ],
      defaultValue: [
        {
          value: '7 820 086 гривень',
          caption: 'Усього зібрано фондом',
          theme: 'dark',
          iconStyle: 'currency',
        },
        {
          value: '000 000 доларів',
          caption: 'Усього зібрано фондом',
          theme: 'accent',
          iconStyle: 'dollar',
        },
        {
          value: '14 бригад',
          caption: 'Кількість підрозділів, яким ми допомогли',
          theme: 'blue',
          iconStyle: 'diamond',
        },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 11,
      maxRows: 11,
      fields: [
        {
          name: 'layoutType',
          type: 'select',
          required: true,
          options: [
            { label: 'Stat Card', value: 'stat' },
            { label: 'Photo Wide Card', value: 'photoWide' },
          ],
          defaultValue: 'stat',
        },
        {
          name: 'value',
          type: 'text',
          validate: (value: unknown, { siblingData }: { siblingData?: { layoutType?: string } }) => {
            if (siblingData?.layoutType === 'stat' && !value) return 'Value is required for stat cards'
            return true
          },
          admin: {
            condition: (_, siblingData) => siblingData?.layoutType !== 'photoWide',
          },
        },
        {
          name: 'label',
          type: 'text',
          validate: (value: unknown, { siblingData }: { siblingData?: { layoutType?: string } }) => {
            if (siblingData?.layoutType === 'stat' && !value) return 'Label is required for stat cards'
            return true
          },
          admin: {
            condition: (_, siblingData) => siblingData?.layoutType !== 'photoWide',
          },
        },
        {
          name: 'iconStyle',
          type: 'select',
          options: iconOptions,
          validate: (value: unknown, { siblingData }: { siblingData?: { layoutType?: string } }) => {
            if (siblingData?.layoutType === 'stat' && !value) return 'Icon is required for stat cards'
            return true
          },
          admin: {
            condition: (_, siblingData) => siblingData?.layoutType !== 'photoWide',
          },
        },
        {
          name: 'leafPosition',
          type: 'select',
          options: [
            { label: 'Center', value: 'center' },
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
            { label: 'Upright', value: 'upright' },
          ],
          defaultValue: 'center',
          validate: (value: unknown, { siblingData }: { siblingData?: { layoutType?: string } }) => {
            if (siblingData?.layoutType === 'stat' && !value) return 'Leaf position is required for stat cards'
            return true
          },
          admin: {
            condition: (_, siblingData) => siblingData?.layoutType !== 'photoWide',
          },
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.layoutType === 'photoWide',
          },
        },
      ],
      defaultValue: [
        { layoutType: 'stat', value: '16', label: 'Пікапів', iconStyle: 'pickup', leafPosition: 'center' },
        { layoutType: 'stat', value: '4', label: 'Бусів', iconStyle: 'bus', leafPosition: 'center' },
        { layoutType: 'stat', value: '3', label: 'Позашляховиків', iconStyle: 'suv', leafPosition: 'right' },
        { layoutType: 'stat', value: '2', label: 'Військових вантажівок', iconStyle: 'truck', leafPosition: 'upright' },
        {
          layoutType: 'stat',
          value: '1',
          label: 'Приладів нічного бачення',
          iconStyle: 'nightVision',
          leafPosition: 'left',
        },
        { layoutType: 'stat', value: '2', label: 'Антен', iconStyle: 'antenna', leafPosition: 'center' },
        { layoutType: 'stat', value: '1', label: 'Дронів', iconStyle: 'drone', leafPosition: 'right' },
        { layoutType: 'stat', value: '1', label: 'Засобів РЕБ', iconStyle: 'reb', leafPosition: 'left' },
        {
          layoutType: 'stat',
          value: '1',
          label: 'Карет швидкої допомоги',
          iconStyle: 'ambulance',
          leafPosition: 'upright',
        },
        { layoutType: 'photoWide' },
        { layoutType: 'stat', value: '2', label: 'Аналізаторів спектру', iconStyle: 'spectrum', leafPosition: 'right' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: 'ЗАКРИТІ ПРОЄКТИ',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          defaultValue: '#',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateAchievements],
  },
}
