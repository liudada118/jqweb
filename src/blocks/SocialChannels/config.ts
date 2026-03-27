import type { Block } from 'payload'

export const SocialChannels: Block = {
  slug: 'socialChannels',
  interfaceName: 'SocialChannelsBlock',
  labels: {
    singular: '社交媒体',
    plural: '社交媒体',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: '板块标题',
    },
    {
      name: 'channels',
      type: 'array',
      label: '社交渠道',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          label: '平台',
          options: [
            { label: '微信公众号', value: 'wechat' },
            { label: '微博', value: 'weibo' },
            { label: '抖音', value: 'douyin' },
            { label: '小红书', value: 'xiaohongshu' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter/X', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
            { label: '其他', value: 'other' },
          ],
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: '账号名称',
        },
        {
          name: 'url',
          type: 'text',
          label: '链接地址',
        },
        {
          name: 'qrCode',
          type: 'upload',
          relationTo: 'media',
          label: '二维码图片',
        },
      ],
    },
  ],
}
