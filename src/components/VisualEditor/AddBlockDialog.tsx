'use client'

import React, { useState } from 'react'
import { BLOCK_LABELS, BLOCK_ICONS } from './types'

interface AddBlockDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddBlock: (blockType: string) => void
}

const AVAILABLE_BLOCKS = [
  'heroBanner', 'stats', 'businessCards', 'newsHighlight',
  'productShowcase', 'socialChannels', 'contactInfo', 'richContent',
  'timeline', 'imageGallery', 'featureGrid', 'cta', 'content', 'mediaBlock',
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
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)',
    }}>
      <div style={{
        background: '#fff', borderRadius: '8px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        width: '480px', maxHeight: '70vh',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', margin: 0 }}>添加内容模块</h3>
          <button onClick={onClose} style={{ color: '#9ca3af', fontSize: '18px', border: 'none', background: 'transparent', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Search */}
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #f3f4f6' }}>
          <input
            type="text" placeholder="搜索模块类型..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '6px 12px', fontSize: '13px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }}
            autoFocus
          />
        </div>

        {/* Block list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {filtered.map((blockType) => (
              <button
                key={blockType}
                onClick={() => { onAddBlock(blockType); onClose() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 12px', borderRadius: '4px',
                  border: '1px solid #e5e7eb', background: '#fff',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.background = '#eff6ff' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff' }}
              >
                <span style={{ fontSize: '18px' }}>{BLOCK_ICONS[blockType] || '📦'}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>{BLOCK_LABELS[blockType] || blockType}</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>{blockType}</div>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0', fontSize: '12px' }}>
              未找到匹配的模块类型
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
