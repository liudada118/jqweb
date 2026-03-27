import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const RichContent: Block = {
  slug: 'richContent',
  interfaceName: 'RichContentBlock',
  labels: {
    singular: '富文本内容',
    plural: '富文本内容',
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
      name: 'content',
      type: 'richText',
      label: '内容',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
    {
      name: 'layout',
      type: 'select',
      label: '布局方式',
      defaultValue: 'fullWidth',
      options: [
        { label: '全宽', value: 'fullWidth' },
        { label: '图片在左', value: 'imageLeft' },
        { label: '图片在右', value: 'imageRight' },
      ],
    },
    {
      name: 'sideImage',
      type: 'upload',
      relationTo: 'media',
      label: '侧边图片',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.layout === 'imageLeft' || siblingData?.layout === 'imageRight',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: '背景色',
      defaultValue: 'none',
      options: [
        { label: '无', value: 'none' },
        { label: '浅灰', value: 'gray' },
        { label: '深色', value: 'dark' },
      ],
    },
  ],
}
