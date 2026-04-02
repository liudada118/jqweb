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
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">组件结构</h3>
        <input
          type="text"
          placeholder="搜索组件..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {filteredBlocks.length === 0 ? (
          <div className="px-3 py-4 text-xs text-gray-400 text-center">暂无内容块</div>
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
                className={`
                  border-l-2 transition-all
                  ${isSelected ? 'border-l-blue-500 bg-blue-50' : 'border-l-transparent hover:bg-gray-50'}
                  ${isDragOver ? 'border-t-2 border-t-blue-400' : ''}
                `}
              >
                {/* Block header */}
                <div
                  className="flex items-center px-2 py-1.5 cursor-pointer group"
                  onClick={() => onSelectBlock(block.id)}
                >
                  {/* Expand toggle */}
                  {children.length > 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpand(block.id)
                      }}
                      className="mr-1 text-gray-400 hover:text-gray-600 w-4 h-4 flex items-center justify-center text-xs"
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                  ) : (
                    <span className="mr-1 w-4" />
                  )}

                  {/* Icon */}
                  <span className="mr-1.5 text-sm">{BLOCK_ICONS[block.blockType] || '📦'}</span>

                  {/* Label */}
                  <span className={`text-xs flex-1 truncate ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                    {BLOCK_LABELS[block.blockType] || block.blockType}
                  </span>

                  {/* Index badge */}
                  <span className="text-[10px] text-gray-400 mr-1">#{index + 1}</span>

                  {/* Drag handle */}
                  <span className="text-gray-300 group-hover:text-gray-500 cursor-grab text-xs">⋮⋮</span>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('确定删除此模块？')) {
                        onDeleteBlock(block.id)
                      }
                    }}
                    className="ml-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    title="删除模块"
                  >
                    ✕
                  </button>
                </div>

                {/* Children */}
                {isExpanded && children.length > 0 && (
                  <div className="pl-7 pb-1">
                    {children.map((child) => (
                      <div
                        key={child.key}
                        className="flex items-center py-0.5 text-[11px] text-gray-500 hover:text-gray-700 cursor-pointer"
                        onClick={() => onSelectBlock(block.id)}
                      >
                        <span className="text-gray-400 mr-1">·</span>
                        <span className="text-gray-500 mr-1">{child.label}:</span>
                        <span className="truncate text-gray-600">{child.value}</span>
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
      <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
        <div className="text-[10px] text-gray-400">
          共 {blocks.length} 个模块 · 拖拽排序
        </div>
      </div>
    </div>
  )
}
