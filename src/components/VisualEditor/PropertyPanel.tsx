'use client'

import React, { useState, useCallback } from 'react'
import type { BlockItem } from './types'
import { BLOCK_LABELS } from './types'

interface PropertyPanelProps {
  block: BlockItem | null
  onUpdateBlock: (blockId: string, updates: Partial<BlockItem>) => void
}

type FieldType = 'text' | 'textarea' | 'image' | 'array' | 'select' | 'richtext' | 'unknown'

function detectFieldType(key: string, value: unknown): FieldType {
  if (key === 'backgroundImage' || key === 'image' || key === 'qrCode' || key === 'media') return 'image'
  if (typeof value === 'string') {
    if (value.length > 100) return 'textarea'
    return 'text'
  }
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object' && value !== null) {
    if ('root' in (value as Record<string, unknown>)) return 'richtext'
  }
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
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '4px 8px', fontSize: '13px',
  border: '1px solid #d1d5db', borderRadius: '4px',
  outline: 'none', boxSizing: 'border-box', background: '#fff',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 500,
  color: '#6b7280', marginBottom: '4px',
}

function TextFieldEditor({ fieldKey, value, onChange }: { fieldKey: string; value: string; onChange: (val: string) => void }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>{FIELD_LABELS[fieldKey] || fieldKey}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  )
}

function TextareaFieldEditor({ fieldKey, value, onChange }: { fieldKey: string; value: string; onChange: (val: string) => void }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>{FIELD_LABELS[fieldKey] || fieldKey}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4}
        style={{ ...inputStyle, resize: 'vertical' }} />
    </div>
  )
}

function ImageFieldEditor({ fieldKey, value }: { fieldKey: string; value: unknown }) {
  const imageUrl =
    typeof value === 'object' && value !== null && 'url' in (value as Record<string, unknown>)
      ? (value as Record<string, string>).url
      : typeof value === 'string' ? value : null

  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>{FIELD_LABELS[fieldKey] || fieldKey}</label>
      {imageUrl ? (
        <div style={{ position: 'relative', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
          <img src={imageUrl} alt="" style={{ width: '100%', height: '96px', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', padding: '2px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {imageUrl}
          </div>
        </div>
      ) : (
        <div style={{ border: '1px dashed #d1d5db', borderRadius: '4px', padding: '16px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
          请在 Payload 后台上传图片
        </div>
      )}
      <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>图片请通过 Payload 后台媒体库管理</p>
    </div>
  )
}

function ArrayFieldEditor({ fieldKey, value, blockId, onUpdateBlock }: {
  fieldKey: string; value: unknown[]; blockId: string;
  onUpdateBlock: (blockId: string, updates: Partial<BlockItem>) => void
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const updateArrayItem = (index: number, itemKey: string, newValue: string) => {
    const newArray = [...value]
    newArray[index] = { ...(newArray[index] as Record<string, unknown>), [itemKey]: newValue }
    onUpdateBlock(blockId, { [fieldKey]: newArray })
  }

  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>{FIELD_LABELS[fieldKey] || fieldKey} ({value.length}项)</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {value.map((item, index) => {
          if (typeof item !== 'object' || item === null) return null
          const itemObj = item as Record<string, unknown>
          const isExpanded = expandedIndex === index
          const displayName = (itemObj.title as string) || (itemObj.label as string) || (itemObj.name as string) || (itemObj.platform as string) || (itemObj.value as string) || `项目 ${index + 1}`

          return (
            <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '4px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', padding: '6px 8px', cursor: 'pointer' }}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                onMouseOver={(e) => (e.currentTarget.style.background = '#f9fafb')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '10px', color: '#9ca3af', marginRight: '4px' }}>{isExpanded ? '▼' : '▶'}</span>
                <span style={{ fontSize: '12px', color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>#{index + 1}</span>
              </div>
              {isExpanded && (
                <div style={{ padding: '0 8px 8px', borderTop: '1px solid #f3f4f6' }}>
                  {Object.entries(itemObj).map(([itemKey, itemValue]) => {
                    if (itemKey === 'id') return null
                    if (typeof itemValue === 'string') {
                      return (
                        <div key={itemKey} style={{ marginTop: '8px' }}>
                          <label style={{ ...labelStyle, fontSize: '10px' }}>{FIELD_LABELS[itemKey] || itemKey}</label>
                          <input type="text" value={itemValue} onChange={(e) => updateArrayItem(index, itemKey, e.target.value)}
                            style={{ ...inputStyle, fontSize: '12px', padding: '3px 6px' }} />
                        </div>
                      )
                    }
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

export function PropertyPanel({ block, onUpdateBlock }: PropertyPanelProps) {
  const handleFieldChange = useCallback(
    (fieldKey: string, value: string) => {
      if (!block) return
      onUpdateBlock(block.id, { [fieldKey]: value })
    },
    [block, onUpdateBlock],
  )

  if (!block) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderLeft: '1px solid #e5e7eb' }}>
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
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
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: 0 }}>属性面板</h3>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px' }}>
            {BLOCK_LABELS[block.blockType] || block.blockType}
          </span>
        </div>
      </div>

      {/* Fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        {editableFields.map(([key, value]) => {
          const fieldType = detectFieldType(key, value)
          switch (fieldType) {
            case 'text':
              return <TextFieldEditor key={key} fieldKey={key} value={value as string} onChange={(val) => handleFieldChange(key, val)} />
            case 'textarea':
              return <TextareaFieldEditor key={key} fieldKey={key} value={value as string} onChange={(val) => handleFieldChange(key, val)} />
            case 'image':
              return <ImageFieldEditor key={key} fieldKey={key} value={value} />
            case 'array':
              return <ArrayFieldEditor key={key} fieldKey={key} value={value as unknown[]} blockId={block.id} onUpdateBlock={onUpdateBlock} />
            case 'richtext':
              return (
                <div key={key} style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>{FIELD_LABELS[key] || key}</label>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '8px', fontSize: '12px', color: '#6b7280', background: '#f9fafb' }}>
                    富文本内容 · 请在 Payload 后台编辑
                  </div>
                </div>
              )
            default:
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
      <div style={{ padding: '8px 12px', borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
        <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>修改后点击顶部"保存"按钮提交更改</p>
      </div>
    </div>
  )
}
