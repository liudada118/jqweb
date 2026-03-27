import type { Block } from 'payload'

export const NewsHighlight: Block = {
  slug: 'newsHighlight',
  interfaceName: 'NewsHighlightBlock',
  labels: {
    singular: '新闻资讯',
    plural: '新闻资讯',
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
      name: 'showMoreLink',
      type: 'text',
      label: '查看更多链接',
      defaultValue: '/posts',
    },
    {
      name: 'maxItems',
      type: 'number',
      label: '最多显示条数',
      defaultValue: 6,
      min: 1,
      max: 12,
    },
  ],
}
