'use client'

import React, { useState, useCallback } from 'react'
import type { BlockItem } from './types'
import { BLOCK_LABELS } from './types'

interface PropertyPanelProps {
  block: BlockItem | null
  onUpdateBlock: (blockId: string, updates: Partial<BlockItem>) => void
}

type FieldType = 'text' | 'textarea' | 'image' | 'array' | 'select' | 'richtext' | 'number' | 'boolean' | 'link' | 'unknown'

// Known select field options for each block type
const SELECT_OPTIONS: Record<string, Record<string, { label: string; value: string }[]>> = {
  content: {
    size: [
      { label: '1/3', value: 'oneThird' },
      { label: '1/2', value: 'half' },
      { label: '2/3', value: 'twoThirds' },
      { label: '全宽', value: 'full' },
    ],
  },
  heroBanner: {
    variant: [
      { label: '主要', value: 'primary' },
      { label: '次要', value: 'secondary' },
      { label: '轮廓', value: 'outline' },
    ],
  },
  businessCards: {
    variant: [
      { label: '默认', value: 'default' },
      { label: '紧凑', value: 'compact' },
    ],
    icon: [
      { label: '齿轮 Cog', value: 'Cog' },
      { label: '爱心 Heart', value: 'Heart' },
      { label: '扳手 Wrench', value: 'Wrench' },
      { label: '灯泡 Lightbulb', value: 'Lightbulb' },
      { label: '盾牌 Shield', value: 'Shield' },
      { label: '闪电 Zap', value: 'Zap' },
    ],
  },
  stats: {
    icon: [
      { label: '日历 Calendar', value: 'Calendar' },
      { label: '用户 Users', value: 'Users' },
      { label: '奖章 Award', value: 'Award' },
      { label: '趋势 TrendingUp', value: 'TrendingUp' },
      { label: '工厂 Factory', value: 'Factory' },
      { label: '全球 Globe', value: 'Globe' },
    ],
  },
  socialChannels: {
    platform: [
      { label: '微信', value: 'wechat' },
      { label: '微博', value: 'weibo' },
      { label: '抖音', value: 'douyin' },
      { label: '小红书', value: 'xiaohongshu' },
      { label: 'B站', value: 'bilibili' },
      { label: '知乎', value: 'zhihu' },
      { label: 'LinkedIn', value: 'linkedin' },
      { label: 'Twitter', value: 'twitter' },
      { label: 'Facebook', value: 'facebook' },
    ],
  },
  featureGrid: {
    layout: [
      { label: '网格', value: 'grid' },
      { label: '列表', value: 'list' },
    ],
    columns: [
      { label: '2列', value: '2' },
      { label: '3列', value: '3' },
      { label: '4列', value: '4' },
    ],
  },
  banner: {
    style: [
      { label: '信息', value: 'info' },
      { label: '警告', value: 'warning' },
      { label: '错误', value: 'error' },
      { label: '成功', value: 'success' },
    ],
  },
  imageGallery: {
    layout: [
      { label: '网格', value: 'grid' },
      { label: '轮播', value: 'carousel' },
      { label: '瀑布流', value: 'masonry' },
    ],
    columns: [
      { label: '2列', value: '2' },
      { label: '3列', value: '3' },
      { label: '4列', value: '4' },
    ],
  },
  richContent: {
    layout: [
      { label: '全宽', value: 'full' },
      { label: '左图右文', value: 'imageLeft' },
      { label: '右图左文', value: 'imageRight' },
    ],
    theme: [
      { label: '亮色', value: 'light' },
      { label: '暗色', value: 'dark' },
    ],
    backgroundColor: [
      { label: '无', value: 'none' },
      { label: '灰色', value: 'gray' },
      { label: '深色', value: 'dark' },
    ],
  },
  archive: {
    populateBy: [
      { label: '按集合', value: 'collection' },
      { label: '手动选择', value: 'selection' },
    ],
    relationTo: [
      { label: '文章', value: 'posts' },
    ],
  },
  cta: {
    variant: [
      { label: '主要', value: 'primary' },
      { label: '次要', value: 'secondary' },
      { label: '轮廓', value: 'outline' },
    ],
  },
}

// Known select fields
const SELECT_FIELD_KEYS = ['size', 'variant', 'layout', 'style', 'theme', 'type', 'platform', 'icon', 'columns', 'backgroundColor', 'populateBy', 'relationTo']

// Known boolean fields
const BOOLEAN_FIELD_KEYS = ['enableLink', 'showMoreLink', 'invertBackground', 'enableDescription']

// Known number fields
const NUMBER_FIELD_KEYS = ['maxItems', 'limit', 'count']

// Known link/url fields
const LINK_FIELD_KEYS = ['link', 'url', 'linkUrl', 'href']

function detectFieldType(key: string, value: unknown, blockType?: string): FieldType {
  // Image fields
  if (key === 'backgroundImage' || key === 'image' || key === 'qrCode' || key === 'media' || key === 'coverImage' || key === 'sideImage') {
    return 'image'
  }
  // Boolean fields
  if (typeof value === 'boolean' || BOOLEAN_FIELD_KEYS.includes(key)) {
    return 'boolean'
  }
  // Number fields
  if (typeof value === 'number' || NUMBER_FIELD_KEYS.includes(key)) {
    return 'number'
  }
  // Select fields (also handle null/undefined values for select fields)
  if (SELECT_FIELD_KEYS.includes(key) && (typeof value === 'string' || value === null || value === undefined)) {
    return 'select'
  }
  // Link object fields
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>
    if ('root' in obj) return 'richtext'
    if ('type' in obj && ('url' in obj || 'reference' in obj || 'label' in obj)) return 'link'
    if ('url' in obj && ('filename' in obj || 'mimeType' in obj || 'alt' in obj)) return 'image'
  }
  // String fields
  if (typeof value === 'string') {
    if (value.length > 100) return 'textarea'
    return 'text'
  }
  // Array fields
  if (Array.isArray(value)) return 'array'
  return 'unknown'
}

const FIELD_LABELS: Record<string, string> = {
  title: '标题', subtitle: '副标题', description: '描述', backgroundImage: '背景图片',
  ctaButtons: '行动按钮', items: '列表项', cards: '卡片列表', channels: '渠道列表',
  products: '产品列表', features: '功能列表', events: '事件列表', images: '图片列表',
  posts: '文章列表', sectionTitle: '板块标题', sectionSubtitle: '板块副标题',
  value: '数值', unit: '单位', label: '标签', icon: '图标', name: '名称',
  platform: '平台', url: '链接', linkUrl: '链接地址', link: '链接',
  year: '年份', caption: '说明', content: '内容', variant: '样式',
  maxItems: '最大显示数量', showMoreLink: '显示更多链接', enableLink: '启用链接',
  invertBackground: '反转背景色', enableDescription: '启用描述', size: '尺寸',
  layout: '布局', style: '样式', theme: '主题', type: '类型',
  limit: '限制数量', count: '数量', columns: '列',
  richText: '富文本内容', media: '媒体', image: '图片', coverImage: '封面图',
  populateBy: '填充方式', relationTo: '关联类型', categories: '分类',
  selectedDocs: '选中文档', introContent: '介绍内容',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '6px 8px', fontSize: '13px',
  border: '1px solid #d1d5db', borderRadius: '6px',
  outline: 'none', boxSizing: 'border-box', background: '#fff',
  transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 600,
  color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

function TextFieldEditor({ fieldKey, value, onChange }: { fieldKey: string; value: string; onChange: (val: string) => void }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{FIELD_LABELS[fieldKey] || fieldKey}</label>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
      />
    </div>
  )
}

function TextareaFieldEditor({ fieldKey, value, onChange }: { fieldKey: string; value: string; onChange: (val: string) => void }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{FIELD_LABELS[fieldKey] || fieldKey}</label>
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)} rows={4}
        style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
      />
    </div>
  )
}

function NumberFieldEditor({ fieldKey, value, onChange }: { fieldKey: string; value: number; onChange: (val: number) => void }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{FIELD_LABELS[fieldKey] || fieldKey}</label>
      <input
        type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
        style={{ ...inputStyle, width: '120px' }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
      />
    </div>
  )
}

function BooleanFieldEditor({ fieldKey, value, onChange }: { fieldKey: string; value: boolean; onChange: (val: boolean) => void }) {
  return (
    <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: '36px', height: '20px', borderRadius: '10px', cursor: 'pointer',
          background: value ? '#3b82f6' : '#d1d5db', transition: 'background 0.2s',
          position: 'relative', flexShrink: 0,
        }}
      >
        <div style={{
          width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
          position: 'absolute', top: '2px', left: value ? '18px' : '2px',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
      <label style={{ fontSize: '12px', fontWeight: 500, color: '#374151', cursor: 'pointer' }} onClick={() => onChange(!value)}>
        {FIELD_LABELS[fieldKey] || fieldKey}
      </label>
    </div>
  )
}

function SelectFieldEditor({ fieldKey, value, options, onChange }: {
  fieldKey: string; value: string; options: { label: string; value: string }[]; onChange: (val: string) => void
}) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{FIELD_LABELS[fieldKey] || fieldKey}</label>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

function ImageFieldEditor({ fieldKey, value, onChange }: { fieldKey: string; value: unknown; onChange?: (val: unknown) => void }) {
  const imageUrl =
    typeof value === 'object' && value !== null && 'url' in (value as Record<string, unknown>)
      ? (value as Record<string, string>).url
      : typeof value === 'string' ? value : null

  const imageId =
    typeof value === 'object' && value !== null && 'id' in (value as Record<string, unknown>)
      ? (value as Record<string, unknown>).id
      : null

  const handleSelectMedia = () => {
    // Open Payload media library in a popup window
    const popup = window.open(
      '/admin/collections/media',
      'media-picker',
      'width=1200,height=800,scrollbars=yes,resizable=yes'
    )
    if (popup) {
      // Listen for messages from the popup
      const handler = (event: MessageEvent) => {
        if (event.data?.type === 've-media-selected' && event.data.media) {
          if (onChange) {
            onChange(event.data.media)
          }
          window.removeEventListener('message', handler)
          popup.close()
        }
      }
      window.addEventListener('message', handler)
    }
  }

  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{FIELD_LABELS[fieldKey] || fieldKey}</label>
      {imageUrl ? (
        <div style={{ position: 'relative', border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
          <img src={imageUrl} alt="" style={{ width: '100%', height: '96px', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '3px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {imageUrl}
          </div>
        </div>
      ) : (
        <div style={{ border: '1px dashed #d1d5db', borderRadius: '6px', padding: '16px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
          未设置图片
        </div>
      )}
      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
        <a
          href="/admin/collections/media"
          target="_blank"
          style={{
            flex: 1, padding: '5px 0', fontSize: '11px', fontWeight: 500,
            color: '#2563eb', border: '1px solid #93c5fd', borderRadius: '4px',
            background: '#eff6ff', cursor: 'pointer', textAlign: 'center',
            textDecoration: 'none', display: 'block',
          }}
        >
          📷 管理媒体库
        </a>
      </div>
      <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
        {imageId ? `媒体 ID: ${imageId}` : '上传图片后在 Payload 后台的页面编辑中选择'}
      </p>
    </div>
  )
}

function LinkFieldEditor({ fieldKey, value, onChange }: {
  fieldKey: string; value: Record<string, unknown>; onChange: (val: Record<string, unknown>) => void
}) {
  const linkType = (value.type as string) || 'custom'
  const url = (value.url as string) || ''
  const label = (value.label as string) || ''
  const newTab = (value.newTab as boolean) || false

  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{FIELD_LABELS[fieldKey] || fieldKey}</label>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px', background: '#fafafa' }}>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ ...labelStyle, fontSize: '10px' }}>链接文字</label>
          <input type="text" value={label} onChange={(e) => onChange({ ...value, label: e.target.value })}
            style={{ ...inputStyle, fontSize: '12px', padding: '4px 6px' }} />
        </div>
        {linkType === 'custom' && (
          <div style={{ marginBottom: '8px' }}>
            <label style={{ ...labelStyle, fontSize: '10px' }}>链接地址</label>
            <input type="text" value={url} onChange={(e) => onChange({ ...value, url: e.target.value })}
              style={{ ...inputStyle, fontSize: '12px', padding: '4px 6px' }} placeholder="https://..." />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input type="checkbox" checked={newTab} onChange={(e) => onChange({ ...value, newTab: e.target.checked })} />
          <span style={{ fontSize: '11px', color: '#6b7280' }}>新窗口打开</span>
        </div>
        {linkType !== 'custom' && (
          <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>内部链接请在 Payload 后台管理</p>
        )}
      </div>
    </div>
  )
}

function ArrayFieldEditor({ fieldKey, value, blockId, blockType, onUpdateBlock }: {
  fieldKey: string; value: unknown[]; blockId: string; blockType?: string;
  onUpdateBlock: (blockId: string, updates: Partial<BlockItem>) => void
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const updateArrayItem = (index: number, itemKey: string, newValue: unknown) => {
    const newArray = [...value]
    newArray[index] = { ...(newArray[index] as Record<string, unknown>), [itemKey]: newValue }
    onUpdateBlock(blockId, { [fieldKey]: newArray })
  }

  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{FIELD_LABELS[fieldKey] || fieldKey} ({value.length}项)</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {value.map((item, index) => {
          if (typeof item !== 'object' || item === null) return null
          const itemObj = item as Record<string, unknown>
          const isExpanded = expandedIndex === index
          const displayName = (itemObj.title as string) || (itemObj.label as string) || (itemObj.name as string) || (itemObj.platform as string) || (itemObj.value as string) || `项目 ${index + 1}`

          return (
            <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', padding: '8px 10px', cursor: 'pointer', background: isExpanded ? '#f0f9ff' : '#fff' }}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                onMouseOver={(e) => { if (!isExpanded) e.currentTarget.style.background = '#f9fafb' }}
                onMouseOut={(e) => { if (!isExpanded) e.currentTarget.style.background = '#fff' }}
              >
                <span style={{ fontSize: '10px', color: '#9ca3af', marginRight: '6px', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'none' }}>▶</span>
                <span style={{ fontSize: '12px', color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{displayName}</span>
                <span style={{ fontSize: '10px', color: '#9ca3af', background: '#f3f4f6', padding: '1px 6px', borderRadius: '4px' }}>#{index + 1}</span>
              </div>
              {isExpanded && (
                <div style={{ padding: '8px 10px', borderTop: '1px solid #e5e7eb', background: '#fafafa' }}>
                  {Object.entries(itemObj).map(([itemKey, itemValue]) => {
                    if (itemKey === 'id' || itemKey === 'blockType' || itemKey === 'blockName') return null
                    
                    // Check if it's a select field first (handles string, null, undefined)
                    const selectOpts = SELECT_OPTIONS[blockType || '']?.[itemKey]
                    if (selectOpts) {
                      return (
                        <div key={itemKey} style={{ marginTop: '8px' }}>
                          <label style={{ ...labelStyle, fontSize: '10px' }}>{FIELD_LABELS[itemKey] || itemKey}</label>
                          <select value={(itemValue as string) ?? ''} onChange={(e) => updateArrayItem(index, itemKey, e.target.value)}
                            style={{ ...inputStyle, fontSize: '12px', padding: '4px 6px', cursor: 'pointer' }}>
                            {selectOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                        </div>
                      )
                    }
                    // String fields
                    if (typeof itemValue === 'string') {
                      return (
                        <div key={itemKey} style={{ marginTop: '8px' }}>
                          <label style={{ ...labelStyle, fontSize: '10px' }}>{FIELD_LABELS[itemKey] || itemKey}</label>
                          <input type="text" value={itemValue} onChange={(e) => updateArrayItem(index, itemKey, e.target.value)}
                            style={{ ...inputStyle, fontSize: '12px', padding: '4px 6px' }} />
                        </div>
                      )
                    }
                    // Number fields
                    if (typeof itemValue === 'number') {
                      return (
                        <div key={itemKey} style={{ marginTop: '8px' }}>
                          <label style={{ ...labelStyle, fontSize: '10px' }}>{FIELD_LABELS[itemKey] || itemKey}</label>
                          <input type="number" value={itemValue} onChange={(e) => updateArrayItem(index, itemKey, Number(e.target.value))}
                            style={{ ...inputStyle, fontSize: '12px', padding: '4px 6px', width: '100px' }} />
                        </div>
                      )
                    }
                    // Boolean fields
                    if (typeof itemValue === 'boolean') {
                      return (
                        <div key={itemKey} style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input type="checkbox" checked={itemValue} onChange={(e) => updateArrayItem(index, itemKey, e.target.checked)} />
                          <label style={{ fontSize: '11px', color: '#374151' }}>{FIELD_LABELS[itemKey] || itemKey}</label>
                        </div>
                      )
                    }
                    // Image/media fields
                    if (typeof itemValue === 'object' && itemValue !== null && 'url' in (itemValue as Record<string, unknown>)) {
                      const url = (itemValue as Record<string, string>).url
                      return (
                        <div key={itemKey} style={{ marginTop: '8px' }}>
                          <label style={{ ...labelStyle, fontSize: '10px' }}>{FIELD_LABELS[itemKey] || itemKey}</label>
                          {url && <img src={url} alt="" style={{ width: '100%', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} />}
                          <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>通过 Payload 媒体库管理</p>
                        </div>
                      )
                    }
                    // Link fields
                    if (typeof itemValue === 'object' && itemValue !== null && ('type' in (itemValue as Record<string, unknown>) || 'url' in (itemValue as Record<string, unknown>)) && 'label' in (itemValue as Record<string, unknown>)) {
                      const linkObj = itemValue as Record<string, unknown>
                      return (
                        <div key={itemKey} style={{ marginTop: '8px' }}>
                          <label style={{ ...labelStyle, fontSize: '10px' }}>{FIELD_LABELS[itemKey] || itemKey}</label>
                          <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '6px', background: '#fff' }}>
                            <input type="text" value={(linkObj.label as string) || ''} placeholder="链接文字"
                              onChange={(e) => updateArrayItem(index, itemKey, { ...linkObj, label: e.target.value })}
                              style={{ ...inputStyle, fontSize: '11px', padding: '3px 6px', marginBottom: '4px' }} />
                            {(linkObj.type === 'custom' || !linkObj.type) && (
                              <input type="text" value={(linkObj.url as string) || ''} placeholder="链接地址"
                                onChange={(e) => updateArrayItem(index, itemKey, { ...linkObj, url: e.target.value })}
                                style={{ ...inputStyle, fontSize: '11px', padding: '3px 6px' }} />
                            )}
                          </div>
                        </div>
                      )
                    }
                    // Richtext fields
                    if (typeof itemValue === 'object' && itemValue !== null && 'root' in (itemValue as Record<string, unknown>)) {
                      return (
                        <div key={itemKey} style={{ marginTop: '8px' }}>
                          <label style={{ ...labelStyle, fontSize: '10px' }}>{FIELD_LABELS[itemKey] || itemKey}</label>
                          <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '6px', fontSize: '11px', color: '#6b7280', background: '#f9fafb' }}>
                            富文本 · 请在 Payload 后台编辑
                          </div>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Special block info banners
function BlockInfoBanner({ blockType }: { blockType: string }) {
  const infos: Record<string, { icon: string; text: string }> = {
    newsHighlight: { icon: '📰', text: '新闻内容来自"文章"集合，请在 Payload 后台的 Posts 中管理新闻内容。此处可编辑板块标题、副标题和显示数量。' },
    archive: { icon: '📚', text: '文章归档内容来自"文章"集合，此处可配置显示方式和数量。' },
    form: { icon: '📋', text: '表单内容来自"表单"集合，请在 Payload 后台的 Forms 中管理。' },
  }
  const info = infos[blockType]
  if (!info) return null

  return (
    <div style={{
      margin: '0 0 14px 0', padding: '10px 12px', background: '#eff6ff',
      border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '11px',
      color: '#1e40af', lineHeight: '1.5',
    }}>
      <span style={{ marginRight: '6px' }}>{info.icon}</span>
      {info.text}
    </div>
  )
}

export function PropertyPanel({ block, onUpdateBlock }: PropertyPanelProps) {
  const handleFieldChange = useCallback(
    (fieldKey: string, value: unknown) => {
      if (!block) return
      onUpdateBlock(block.id, { [fieldKey]: value })
    },
    [block, onUpdateBlock],
  )

  if (!block) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderLeft: '1px solid #e5e7eb' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: 0 }}>属性面板</h3>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
            <p style={{ fontSize: '12px' }}>选择一个组件开始编辑</p>
            <p style={{ fontSize: '10px', marginTop: '4px' }}>点击左侧组件树或画布中的元素</p>
          </div>
        </div>
      </div>
    )
  }

  const editableFields = Object.entries(block).filter(
    ([key]) => !['id', 'blockType', 'blockName'].includes(key),
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderLeft: '1px solid #e5e7eb' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: 0 }}>属性面板</h3>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '6px', gap: '6px' }}>
          <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
            {BLOCK_LABELS[block.blockType] || block.blockType}
          </span>
          {block.blockName && (
            <span style={{ fontSize: '10px', color: '#9ca3af' }}>{block.blockName}</span>
          )}
        </div>
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        <BlockInfoBanner blockType={block.blockType} />
        
        {editableFields.map(([key, value]) => {
          const fieldType = detectFieldType(key, value, block.blockType)
          
          switch (fieldType) {
            case 'text':
              return <TextFieldEditor key={key} fieldKey={key} value={value as string} onChange={(val) => handleFieldChange(key, val)} />
            case 'textarea':
              return <TextareaFieldEditor key={key} fieldKey={key} value={value as string} onChange={(val) => handleFieldChange(key, val)} />
            case 'number':
              return <NumberFieldEditor key={key} fieldKey={key} value={value as number} onChange={(val) => handleFieldChange(key, val)} />
            case 'boolean':
              return <BooleanFieldEditor key={key} fieldKey={key} value={value as boolean} onChange={(val) => handleFieldChange(key, val)} />
            case 'select': {
              const options = SELECT_OPTIONS[block.blockType]?.[key] || [
                { label: String(value ?? ''), value: String(value ?? '') },
              ]
              return <SelectFieldEditor key={key} fieldKey={key} value={(value as string) ?? ''} options={options} onChange={(val) => handleFieldChange(key, val)} />
            }
            case 'image':
              return <ImageFieldEditor key={key} fieldKey={key} value={value} onChange={(val) => handleFieldChange(key, val)} />
            case 'link':
              return <LinkFieldEditor key={key} fieldKey={key} value={value as Record<string, unknown>} onChange={(val) => handleFieldChange(key, val)} />
            case 'array':
              return <ArrayFieldEditor key={key} fieldKey={key} value={value as unknown[]} blockId={block.id} blockType={block.blockType} onUpdateBlock={onUpdateBlock} />
            case 'richtext':
              return (
                <div key={key} style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>{FIELD_LABELS[key] || key}</label>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '10px', fontSize: '12px', color: '#6b7280', background: '#f9fafb', textAlign: 'center' }}>
                    <span style={{ fontSize: '16px' }}>📝</span>
                    <p style={{ marginTop: '4px' }}>富文本内容 · 请在 Payload 后台编辑</p>
                  </div>
                </div>
              )
            default:
              // Show unknown fields as read-only info
              if (value !== null && value !== undefined) {
                return (
                  <div key={key} style={{ marginBottom: '14px' }}>
                    <label style={labelStyle}>{FIELD_LABELS[key] || key}</label>
                    <div style={{ fontSize: '12px', color: '#9ca3af', padding: '4px 0' }}>
                      {typeof value === 'object' ? JSON.stringify(value).slice(0, 50) + '...' : String(value)}
                    </div>
                  </div>
                )
              }
              return null
          }
        })}
        {editableFields.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>
            <p style={{ fontSize: '12px' }}>此模块暂无可编辑属性</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
        <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>
          修改后点击顶部"保存"按钮或按 Ctrl+S 提交更改
        </p>
      </div>
    </div>
  )
}
