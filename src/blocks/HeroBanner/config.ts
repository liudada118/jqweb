import type { Block } from 'payload'

export const HeroBanner: Block = {
  slug: 'heroBanner',
  interfaceName: 'HeroBannerBlock',
  labels: {
    singular: 'Hero 横幅',
    plural: 'Hero 横幅',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: '主标题',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: '副标题',
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述文字',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: '背景图片',
    },
    {
      name: 'ctaButtons',
      type: 'array',
      label: '行动按钮',
      maxRows: 3,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: '按钮文字',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: '链接地址',
        },
        {
          name: 'variant',
          type: 'select',
          label: '按钮样式',
          defaultValue: 'primary',
          options: [
            { label: '主要', value: 'primary' },
            { label: '次要', value: 'secondary' },
            { label: '轮廓', value: 'outline' },
          ],
        },
      ],
    },
  ],
}
