import type { Block } from 'payload'

export const ImageGallery: Block = {
  slug: 'imageGallery',
  interfaceName: 'ImageGalleryBlock',
  labels: {
    singular: '图片画廊',
    plural: '图片画廊',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: '板块标题',
    },
    {
      name: 'images',
      type: 'array',
      label: '图片列表',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: '图片',
        },
        {
          name: 'caption',
          type: 'text',
          label: '图片说明',
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
