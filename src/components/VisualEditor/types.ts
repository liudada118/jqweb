export interface BlockItem {
  id: string
  blockType: string
  blockName?: string
  // All other fields from the block
  [key: string]: unknown
}

export interface PageData {
  id: number
  title: string
  slug: string
  layout: BlockItem[]
  hero?: Record<string, unknown>
  updatedAt: string
}

export interface PageOption {
  id: number
  title: string
  slug: string
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export const DEVICE_SIZES: Record<DeviceMode, { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
}

export const BLOCK_LABELS: Record<string, string> = {
  heroBanner: 'Hero 横幅',
  stats: '数据统计',
  businessCards: '业务板块',
  newsHighlight: '新闻动态',
  productShowcase: '产品展示',
  socialChannels: '社交渠道',
  contactInfo: '联系信息',
  richContent: '富文本内容',
  timeline: '时间线',
  imageGallery: '图片画廊',
  featureGrid: '功能网格',
  cta: '行动号召',
  content: '内容区块',
  mediaBlock: '媒体区块',
  archive: '文章归档',
  formBlock: '表单',
}

export const BLOCK_ICONS: Record<string, string> = {
  heroBanner: '🖼️',
  stats: '📊',
  businessCards: '💼',
  newsHighlight: '📰',
  productShowcase: '🏭',
  socialChannels: '📱',
  contactInfo: '📞',
  richContent: '📝',
  timeline: '⏳',
  imageGallery: '🖼️',
  featureGrid: '⚡',
  cta: '🔗',
  content: '📄',
  mediaBlock: '🎬',
  archive: '📚',
  formBlock: '📋',
}
