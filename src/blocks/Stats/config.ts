import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: '数据统计',
    plural: '数据统计',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: '统计项',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: '数值',
          admin: {
            description: '例如: 20+, 500, 1000+',
          },
        },
        {
          name: 'unit',
          type: 'text',
          label: '单位',
          admin: {
            description: '例如: 年, 项, 家',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: '标签说明',
        },
        {
          name: 'icon',
          type: 'select',
          label: '图标',
          options: [
            { label: '日历', value: 'Calendar' },
            { label: '用户', value: 'Users' },
            { label: '奖杯', value: 'Award' },
            { label: '趋势', value: 'TrendingUp' },
            { label: '工厂', value: 'Factory' },
            { label: '全球', value: 'Globe' },
          ],
        },
      ],
    },
  ],
}
