import type { Block } from 'payload'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: {
    singular: '特性网格',
    plural: '特性网格',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: '板块标题',
    },
    {
      name: 'sectionSubtitle',
      type: 'text',
      label: '板块副标题',
    },
    {
      name: 'features',
      type: 'array',
      label: '特性列表',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: '标题',
        },
        {
          name: 'description',
          type: 'textarea',
          label: '描述',
        },
        {
          name: 'icon',
          type: 'text',
          label: '图标名称',
          admin: {
            description: 'Lucide 图标名称，如: Cog, Shield, Zap, Target 等',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '配图',
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      label: '列数',
      defaultValue: '3',
      options: [
        { label: '2列', value: '2' },
        { label: '3列', value: '3' },
        { label: '4列', value: '4' },
      ],
    },
  ],
}
