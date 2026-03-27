import type { Block } from 'payload'

export const Timeline: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: {
    singular: '时间线',
    plural: '时间线',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: '板块标题',
    },
    {
      name: 'events',
      type: 'array',
      label: '时间节点',
      minRows: 1,
      fields: [
        {
          name: 'year',
          type: 'text',
          required: true,
          label: '年份',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: '事件标题',
        },
        {
          name: 'description',
          type: 'textarea',
          label: '事件描述',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '配图',
        },
      ],
    },
  ],
}
