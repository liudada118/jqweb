'use client'

import React from 'react'
import type { PageOption, DeviceMode } from './types'

interface EditorToolbarProps {
  pages: PageOption[]
  currentPageSlug: string
  onPageChange: (slug: string) => void
  deviceMode: DeviceMode
  onDeviceModeChange: (mode: DeviceMode) => void
  hasUnsavedChanges: boolean
  isSaving: boolean
  onSave: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

const btnBase: React.CSSProperties = {
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s',
  background: 'transparent',
}

export function EditorToolbar({
  pages,
  currentPageSlug,
  onPageChange,
  deviceMode,
  onDeviceModeChange,
  hasUnsavedChanges,
  isSaving,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: EditorToolbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '44px',
        padding: '0 12px',
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        gap: '8px',
        flexShrink: 0,
      }}
    >
      {/* Logo / Title */}
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>🎨 可视化编辑器</span>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', background: '#e5e7eb' }} />

      {/* Page selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>页面:</span>
        <select
          value={currentPageSlug}
          onChange={(e) => onPageChange(e.target.value)}
          style={{
            fontSize: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            padding: '4px 8px',
            background: '#fff',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {pages.map((page) => (
            <option key={page.slug} value={page.slug}>
              {page.title}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', background: '#e5e7eb' }} />

      {/* Device mode */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {(['desktop', 'tablet', 'mobile'] as DeviceMode[]).map((mode) => {
          const icons = { desktop: '🖥️', tablet: '📱', mobile: '📲' }
          const labels = { desktop: '桌面', tablet: '平板', mobile: '手机' }
          const isActive = deviceMode === mode
          return (
            <button
              key={mode}
              onClick={() => onDeviceModeChange(mode)}
              title={labels[mode]}
              style={{
                ...btnBase,
                background: isActive ? '#dbeafe' : 'transparent',
                color: isActive ? '#1d4ed8' : '#6b7280',
              }}
            >
              {icons[mode]}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', background: '#e5e7eb' }} />

      {/* Undo / Redo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="撤销 (Ctrl+Z)"
          style={{
            ...btnBase,
            color: canUndo ? '#4b5563' : '#d1d5db',
            cursor: canUndo ? 'pointer' : 'not-allowed',
          }}
        >
          ↩️
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="重做 (Ctrl+Shift+Z)"
          style={{
            ...btnBase,
            color: canRedo ? '#4b5563' : '#d1d5db',
            cursor: canRedo ? 'pointer' : 'not-allowed',
          }}
        >
          ↪️
        </button>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Unsaved indicator */}
      {hasUnsavedChanges && (
        <span
          style={{
            fontSize: '12px',
            color: '#d97706',
            background: '#fffbeb',
            padding: '2px 8px',
            borderRadius: '4px',
          }}
        >
          ● 有未保存的更改
        </span>
      )}

      {/* Save button */}
      <button
        onClick={onSave}
        disabled={isSaving || !hasUnsavedChanges}
        style={{
          padding: '6px 16px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          border: 'none',
          cursor: hasUnsavedChanges && !isSaving ? 'pointer' : 'not-allowed',
          background: hasUnsavedChanges && !isSaving ? '#2563eb' : '#e5e7eb',
          color: hasUnsavedChanges && !isSaving ? '#fff' : '#9ca3af',
          transition: 'background 0.2s',
        }}
      >
        {isSaving ? '保存中...' : '保存'}
      </button>

      {/* View frontend */}
      <a
        href="/"
        target="_blank"
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          color: '#4b5563',
          border: '1px solid #d1d5db',
          textDecoration: 'none',
          transition: 'background 0.2s',
        }}
        title="查看前台网站"
      >
        🌐 查看前台
      </a>

      {/* Payload admin for media/posts management */}
      <a
        href="/admin/collections/media"
        target="_blank"
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          color: '#4b5563',
          border: '1px solid #d1d5db',
          textDecoration: 'none',
          transition: 'background 0.2s',
        }}
        title="管理媒体库和文章"
      >
        🗂️ 媒体管理
      </a>
    </div>
  )
}
