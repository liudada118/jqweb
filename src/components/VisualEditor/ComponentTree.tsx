'use client'

import React, { useState } from 'react'
import type { BlockItem } from './types'
import { BLOCK_LABELS, BLOCK_ICONS } from './types'

interface ComponentTreeProps {
  blocks: BlockItem[]
  selectedBlockId: string | null
  onSelectBlock: (blockId: string) => void
  onMoveBlock: (fromIndex: number, toIndex: number) => void
  onDeleteBlock: (blockId: string) => void
}

export function ComponentTree({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onMoveBlock,
  onDeleteBlock,
}: ComponentTreeProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set())
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleExpand = (blockId: string) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev)
      if (next.has(blockId)) {
        next.delete(blockId)
      } else {
        next.add(blockId)
      }
      return next
    })
  }

  const getBlockChildren = (block: BlockItem): { key: string; label: string; value: string }[] => {
    const children: { key: string; label: string; value: string }[] = []
    for (const [key, value] of Object.entries(block)) {
      if (['id', 'blockType', 'blockName'].includes(key)) continue
      if (typeof value === 'string' && value.length > 0 && value.length < 200) {
        children.push({ key, label: key, value: value.substring(0, 60) })
      } else if (Array.isArray(value) && value.length > 0) {
        children.push({ key, label: `${key} (${value.length}项)`, value: '' })
      }
    }
    return children
  }

  const filteredBlocks = searchTerm
    ? blocks.filter((b) => {
        const label = BLOCK_LABELS[b.blockType] || b.blockType
        return label.toLowerCase().includes(searchTerm.toLowerCase())
      })
    : blocks

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRight: '1px solid #e5e7eb' }}>
      {/* Header */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', margin: 0, marginBlockEnd: '8px' }}>组件结构</h3>
        <input
          type="text"
          placeholder="搜索组件..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '4px 8px',
            fontSize: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Tree */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {filteredBlocks.length === 0 ? (
          <div style={{ padding: '16px 12px', fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>暂无内容块</div>
        ) : (
          filteredBlocks.map((block, index) => {
            const isSelected = selectedBlockId === block.id
            const isExpanded = expandedBlocks.has(block.id)
            const children = getBlockChildren(block)
            const isDragOver = dragOverIndex === index && dragIndex !== index

            return (
              <div
                key={block.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOverIndex(index)
                }}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== index) {
                    onMoveBlock(dragIndex, index)
                  }
                  setDragIndex(null)
                  setDragOverIndex(null)
                }}
                onDragEnd={() => {
                  setDragIndex(null)
                  setDragOverIndex(null)
                }}
                style={{
                  borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent',
                  background: isSelected ? '#eff6ff' : 'transparent',
                  borderTop: isDragOver ? '2px solid #60a5fa' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                {/* Block header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onSelectBlock(block.id)}
                  onMouseOver={(e) => {
                    if (!isSelected) e.currentTarget.style.background = '#f9fafb'
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {/* Expand toggle */}
                  {children.length > 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpand(block.id)
                      }}
                      style={{
                        marginRight: '4px',
                        color: '#9ca3af',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                  ) : (
                    <span style={{ marginRight: '4px', width: '16px', display: 'inline-block' }} />
                  )}

                  {/* Icon */}
                  <span style={{ marginRight: '6px', fontSize: '14px' }}>{BLOCK_ICONS[block.blockType] || '📦'}</span>

                  {/* Label */}
                  <span
                    style={{
                      fontSize: '12px',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: isSelected ? '#1d4ed8' : '#374151',
                      fontWeight: isSelected ? 500 : 400,
                    }}
                  >
                    {BLOCK_LABELS[block.blockType] || block.blockType}
                  </span>

                  {/* Index badge */}
                  <span style={{ fontSize: '10px', color: '#9ca3af', marginRight: '4px' }}>#{index + 1}</span>

                  {/* Drag handle */}
                  <span style={{ color: '#d1d5db', cursor: 'grab', fontSize: '12px' }}>⋮⋮</span>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('确定删除此模块？')) {
                        onDeleteBlock(block.id)
                      }
                    }}
                    style={{
                      marginLeft: '4px',
                      color: '#d1d5db',
                      fontSize: '12px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: '0 2px',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#d1d5db')}
                    title="删除模块"
                  >
                    ✕
                  </button>
                </div>

                {/* Children */}
                {isExpanded && children.length > 0 && (
                  <div style={{ paddingLeft: '28px', paddingBottom: '4px' }}>
                    {children.map((child) => (
                      <div
                        key={child.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '2px 0',
                          fontSize: '11px',
                          color: '#6b7280',
                          cursor: 'pointer',
                        }}
                        onClick={() => onSelectBlock(block.id)}
                      >
                        <span style={{ color: '#9ca3af', marginRight: '4px' }}>·</span>
                        <span style={{ color: '#6b7280', marginRight: '4px' }}>{child.label}:</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#4b5563' }}>
                          {child.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Footer info */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
        <div style={{ fontSize: '10px', color: '#9ca3af' }}>
          共 {blocks.length} 个模块 · 拖拽排序
        </div>
      </div>
    </div>
  )
}
