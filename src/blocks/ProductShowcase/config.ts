import type { Block } from 'payload'

export const ProductShowcase: Block = {
  slug: 'productShowcase',
  interfaceName: 'ProductShowcaseBlock',
  labels: {
    singular: '产品展示',
    plural: '产品展示',
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
      name: 'products',
      type: 'array',
      label: '产品列表',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: '产品名称',
        },
        {
          name: 'description',
          type: 'textarea',
          label: '产品描述',
        },
        {
          name: 'category',
          type: 'text',
          label: '产品分类',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: '产品图片',
        },
        {
          name: 'linkUrl',
          type: 'text',
          label: '详情链接',
        },
      ],
    },
  ],
}
