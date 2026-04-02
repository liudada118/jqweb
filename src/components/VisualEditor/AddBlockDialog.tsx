'use client'

import React, { useState } from 'react'
import { BLOCK_LABELS, BLOCK_ICONS } from './types'

interface AddBlockDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddBlock: (blockType: string) => void
}

const AVAILABLE_BLOCKS = [
  'heroBanner',
  'stats',
  'businessCards',
  'newsHighlight',
  'productShowcase',
  'socialChannels',
  'contactInfo',
  'richContent',
  'timeline',
  'imageGallery',
  'featureGrid',
  'cta',
  'content',
  'mediaBlock',
]

export function AddBlockDialog({ isOpen, onClose, onAddBlock }: AddBlockDialogProps) {
  const [search, setSearch] = useState('')

  if (!isOpen) return null

  const filtered = search
    ? AVAILABLE_BLOCKS.filter((b) => {
        const label = BLOCK_LABELS[b] || b
        return label.toLowerCase().includes(search.toLowerCase())
      })
    : AVAILABLE_BLOCKS

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-[480px] max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">添加内容模块</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2 border-b border-gray-100">
          <input
            type="text"
            placeholder="搜索模块类型..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* Block list */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((blockType) => (
              <button
                key={blockType}
                onClick={() => {
                  onAddBlock(blockType)
                  onClose()
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <span className="text-lg">{BLOCK_ICONS[blockType] || '📦'}</span>
                <div>
                  <div className="text-xs font-medium text-gray-700">
                    {BLOCK_LABELS[blockType] || blockType}
                  </div>
                  <div className="text-[10px] text-gray-400">{blockType}</div>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center text-gray-400 py-8 text-xs">
              未找到匹配的模块类型
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
