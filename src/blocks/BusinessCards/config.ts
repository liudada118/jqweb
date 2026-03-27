import type { Block } from 'payload'

export const BusinessCards: Block = {
  slug: 'businessCards',
  interfaceName: 'BusinessCardsBlock',
  labels: {
    singular: '业务板块',
    plural: '业务板块',
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
      name: 'cards',
      type: 'array',
      label: '业务卡片',
      minRows: 1,
      maxRows: 6,
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '配图',
        },
        {
          name: 'icon',
          type: 'select',
          label: '图标',
          options: [
            { label: '齿轮', value: 'Cog' },
            { label: '爱心', value: 'Heart' },
            { label: '扳手', value: 'Wrench' },
            { label: '灯泡', value: 'Lightbulb' },
            { label: '盾牌', value: 'Shield' },
            { label: '闪电', value: 'Zap' },
          ],
        },
        {
          name: 'linkUrl',
          type: 'text',
          label: '链接地址',
        },
      ],
    },
  ],
}
