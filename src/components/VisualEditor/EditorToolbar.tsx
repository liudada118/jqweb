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
    <div className="flex items-center h-11 px-3 bg-white border-b border-gray-200 gap-2">
      {/* Logo / Title */}
      <div className="flex items-center mr-3">
        <span className="text-sm font-bold text-gray-800">🎨 可视化编辑器</span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Page selector */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">页面:</span>
        <select
          value={currentPageSlug}
          onChange={(e) => onPageChange(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {pages.map((page) => (
            <option key={page.slug} value={page.slug}>
              {page.title}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Device mode */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onDeviceModeChange('desktop')}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            deviceMode === 'desktop'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="桌面"
        >
          🖥️
        </button>
        <button
          onClick={() => onDeviceModeChange('tablet')}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            deviceMode === 'tablet'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="平板"
        >
          📱
        </button>
        <button
          onClick={() => onDeviceModeChange('mobile')}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            deviceMode === 'mobile'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="手机"
        >
          📲
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            canUndo ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'
          }`}
          title="撤销"
        >
          ↩️
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`px-2 py-1 rounded text-xs transition-colors ${
            canRedo ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'
          }`}
          title="重做"
        >
          ↪️
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Unsaved indicator */}
      {hasUnsavedChanges && (
        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
          ● 有未保存的更改
        </span>
      )}

      {/* Save button */}
      <button
        onClick={onSave}
        disabled={isSaving || !hasUnsavedChanges}
        className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
          hasUnsavedChanges && !isSaving
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSaving ? '保存中...' : '保存'}
      </button>

      {/* Open in Payload */}
      <a
        href="/admin/collections/pages"
        className="px-3 py-1.5 rounded text-xs font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
        title="在 Payload 后台中打开"
      >
        Payload 后台
      </a>
    </div>
  )
}
