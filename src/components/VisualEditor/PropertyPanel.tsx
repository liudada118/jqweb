'use client'

import React, { useState, useCallback } from 'react'
import type { BlockItem } from './types'
import { BLOCK_LABELS } from './types'

interface PropertyPanelProps {
  block: BlockItem | null
  onUpdateBlock: (blockId: string, updates: Partial<BlockItem>) => void
}

// Field types that we can detect and render appropriate editors
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
  title: '标题',
  subtitle: '副标题',
  description: '描述',
  backgroundImage: '背景图片',
  ctaButtons: '行动按钮',
  items: '列表项',
  cards: '卡片列表',
  channels: '渠道列表',
  products: '产品列表',
  features: '功能列表',
  events: '事件列表',
  images: '图片列表',
  posts: '文章列表',
  sectionTitle: '板块标题',
  sectionSubtitle: '板块副标题',
  value: '数值',
  unit: '单位',
  label: '标签',
  icon: '图标',
  name: '名称',
  platform: '平台',
  url: '链接',
  linkUrl: '链接地址',
  link: '链接',
  year: '年份',
  caption: '说明',
  content: '内容',
  variant: '样式',
}

function TextFieldEditor({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {FIELD_LABELS[fieldKey] || fieldKey}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      />
    </div>
  )
}

function TextareaFieldEditor({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {FIELD_LABELS[fieldKey] || fieldKey}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white resize-y"
      />
    </div>
  )
}

function ImageFieldEditor({
  fieldKey,
  value,
}: {
  fieldKey: string
  value: unknown
}) {
  const imageUrl =
    typeof value === 'object' && value !== null && 'url' in (value as Record<string, unknown>)
      ? (value as Record<string, string>).url
      : typeof value === 'string'
        ? value
        : null

  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {FIELD_LABELS[fieldKey] || fieldKey}
      </label>
      {imageUrl ? (
        <div className="relative border border-gray-200 rounded overflow-hidden">
          <img src={imageUrl} alt="" className="w-full h-24 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-0.5 truncate">
            {imageUrl}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 rounded p-4 text-center text-xs text-gray-400">
          请在 Payload 后台上传图片
        </div>
      )}
      <p className="text-[10px] text-gray-400 mt-1">图片请通过 Payload 后台媒体库管理</p>
    </div>
  )
}

function ArrayFieldEditor({
  fieldKey,
  value,
  blockId,
  onUpdateBlock,
}: {
  fieldKey: string
  value: unknown[]
  blockId: string
  onUpdateBlock: (blockId: string, updates: Partial<BlockItem>) => void
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const updateArrayItem = (index: number, itemKey: string, newValue: string) => {
    const newArray = [...value]
    newArray[index] = { ...(newArray[index] as Record<string, unknown>), [itemKey]: newValue }
    onUpdateBlock(blockId, { [fieldKey]: newArray })
  }

  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {FIELD_LABELS[fieldKey] || fieldKey} ({value.length}项)
      </label>
      <div className="space-y-1">
        {value.map((item, index) => {
          if (typeof item !== 'object' || item === null) return null
          const itemObj = item as Record<string, unknown>
          const isExpanded = expandedIndex === index
          const displayName =
            (itemObj.title as string) ||
            (itemObj.label as string) ||
            (itemObj.name as string) ||
            (itemObj.platform as string) ||
            (itemObj.value as string) ||
            `项目 ${index + 1}`

          return (
            <div key={index} className="border border-gray-200 rounded">
              <div
                className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <span className="text-xs text-gray-400 mr-1">{isExpanded ? '▼' : '▶'}</span>
                <span className="text-xs text-gray-700 flex-1 truncate">{displayName}</span>
                <span className="text-[10px] text-gray-400">#{index + 1}</span>
              </div>
              {isExpanded && (
                <div className="px-2 pb-2 border-t border-gray-100">
                  {Object.entries(itemObj).map(([itemKey, itemValue]) => {
                    if (itemKey === 'id') return null
                    if (typeof itemValue === 'string') {
                      return (
                        <div key={itemKey} className="mt-2">
                          <label className="block text-[10px] text-gray-500 mb-0.5">
                            {FIELD_LABELS[itemKey] || itemKey}
                          </label>
                          <input
                            type="text"
                            value={itemValue}
                            onChange={(e) => updateArrayItem(index, itemKey, e.target.value)}
                            className="w-full px-1.5 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      )
                    }
                    if (typeof itemValue === 'object' && itemValue !== null && 'url' in (itemValue as Record<string, unknown>)) {
                      const url = (itemValue as Record<string, string>).url
                      return (
                        <div key={itemKey} className="mt-2">
                          <label className="block text-[10px] text-gray-500 mb-0.5">
                            {FIELD_LABELS[itemKey] || itemKey}
                          </label>
                          {url && <img src={url} alt="" className="w-full h-16 object-cover rounded border" />}
                          <p className="text-[10px] text-gray-400 mt-0.5">通过 Payload 媒体库管理</p>
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
      <div className="flex flex-col h-full bg-white border-l border-gray-200">
        <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">属性面板</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-xs">选择一个组件开始编辑</p>
            <p className="text-[10px] mt-1">点击左侧组件树或画布中的元素</p>
          </div>
        </div>
      </div>
    )
  }

  const editableFields = Object.entries(block).filter(
    ([key]) => !['id', 'blockType', 'blockName'].includes(key),
  )

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">属性面板</h3>
        <div className="flex items-center mt-1">
          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
            {BLOCK_LABELS[block.blockType] || block.blockType}
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {editableFields.map(([key, value]) => {
          const fieldType = detectFieldType(key, value)

          switch (fieldType) {
            case 'text':
              return (
                <TextFieldEditor
                  key={key}
                  fieldKey={key}
                  value={value as string}
                  onChange={(val) => handleFieldChange(key, val)}
                />
              )
            case 'textarea':
              return (
                <TextareaFieldEditor
                  key={key}
                  fieldKey={key}
                  value={value as string}
                  onChange={(val) => handleFieldChange(key, val)}
                />
              )
            case 'image':
              return <ImageFieldEditor key={key} fieldKey={key} value={value} />
            case 'array':
              return (
                <ArrayFieldEditor
                  key={key}
                  fieldKey={key}
                  value={value as unknown[]}
                  blockId={block.id}
                  onUpdateBlock={onUpdateBlock}
                />
              )
            case 'richtext':
              return (
                <div key={key} className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {FIELD_LABELS[key] || key}
                  </label>
                  <div className="border border-gray-200 rounded p-2 text-xs text-gray-500 bg-gray-50">
                    富文本内容 · 请在 Payload 后台编辑
                  </div>
                </div>
              )
            default:
              return null
          }
        })}

        {editableFields.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p className="text-xs">此模块暂无可编辑属性</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
        <p className="text-[10px] text-gray-400">
          修改后点击顶部"保存"按钮提交更改
        </p>
      </div>
    </div>
  )
}
