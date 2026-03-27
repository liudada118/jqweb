import type { Block } from 'payload'

export const ContactInfo: Block = {
  slug: 'contactInfo',
  interfaceName: 'ContactInfoBlock',
  labels: {
    singular: '联系信息',
    plural: '联系信息',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: '板块标题',
    },
    {
      name: 'companyName',
      type: 'text',
      label: '公司名称',
    },
    {
      name: 'address',
      type: 'textarea',
      label: '公司地址',
    },
    {
      name: 'phone',
      type: 'text',
      label: '联系电话',
    },
    {
      name: 'email',
      type: 'email',
      label: '电子邮箱',
    },
    {
      name: 'fax',
      type: 'text',
      label: '传真号码',
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      label: '地图嵌入链接',
      admin: {
        description: '百度地图或高德地图的嵌入 iframe URL',
      },
    },
  ],
}
