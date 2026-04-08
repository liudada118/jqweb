'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import type { BlockItem, PageData, PageOption, DeviceMode } from './types'
import { DEVICE_SIZES } from './types'
import { ComponentTree } from './ComponentTree'
import { PropertyPanel } from './PropertyPanel'
import { EditorToolbar } from './EditorToolbar'
import { AddBlockDialog } from './AddBlockDialog'

interface VisualEditorClientProps {
  initialPages: PageOption[]
  initialSlug?: string
  baseUrl: string
}

/**
 * Flatten relationship fields for Payload save.
 * When depth=2, relationship fields (media, backgroundImage, etc.) are expanded
 * to full objects like { id: '123', url: '...', ... }.
 * Payload expects just the ID string when saving.
 */
function flattenRelationships(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  // Known relationship field keys (media/image fields that reference other collections)
  const RELATIONSHIP_KEYS = [
    'backgroundImage', 'image', 'media', 'coverImage', 'qrCode',
    'logo', 'icon', 'thumbnail', 'avatar', 'photo', 'file',
  ]

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      result[key] = value
      continue
    }

    // Handle relationship fields - flatten object to ID
    if (RELATIONSHIP_KEYS.includes(key) && typeof value === 'object' && !Array.isArray(value)) {
      const objVal = value as Record<string, unknown>
      if (objVal.id) {
        result[key] = objVal.id
      } else {
        result[key] = value
      }
      continue
    }

    // Handle arrays - recursively flatten items
    if (Array.isArray(value)) {
      result[key] = value.map((item) => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          return flattenRelationships(item as Record<string, unknown>)
        }
        return item
      })
      continue
    }

    // Handle nested objects (like link objects) - recursively flatten
    if (typeof value === 'object' && !Array.isArray(value)) {
      const objVal = value as Record<string, unknown>
      // If it looks like a Payload document (has id, createdAt, updatedAt), flatten to ID
      if (objVal.id && objVal.createdAt && objVal.updatedAt) {
        result[key] = objVal.id
        continue
      }
      // Otherwise recursively process
      result[key] = flattenRelationships(objVal)
      continue
    }

    result[key] = value
  }

  return result
}

export function VisualEditorClient({
  initialPages,
  initialSlug,
  baseUrl,
}: VisualEditorClientProps) {
  const [pages] = useState<PageOption[]>(initialPages)
  const [currentSlug, setCurrentSlug] = useState(initialSlug || initialPages[0]?.slug || 'home')
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [blocks, setBlocks] = useState<BlockItem[]>([])
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [leftPanelWidth, setLeftPanelWidth] = useState(260)
  const [rightPanelWidth, setRightPanelWidth] = useState(300)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Undo/Redo
  const [undoStack, setUndoStack] = useState<BlockItem[][]>([])
  const [redoStack, setRedoStack] = useState<BlockItem[][]>([])

  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Use client-side origin for iframe URL to avoid cross-origin issues
  const [clientOrigin, setClientOrigin] = useState(baseUrl)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientOrigin(window.location.origin)
    }
  }, [])

  // Auto-dismiss save message
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [saveMessage])

  // Fetch page data
  const fetchPage = useCallback(
    async (slug: string) => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&draft=true`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (data.docs && data.docs.length > 0) {
          const page = data.docs[0] as PageData
          setPageData(page)
          const layoutBlocks = (page.layout || []).map((block: BlockItem, index: number) => ({
            ...block,
            id: block.id || `block-${index}`,
          }))
          setBlocks(layoutBlocks)
          setUndoStack([])
          setRedoStack([])
          setHasUnsavedChanges(false)
          setSelectedBlockId(null)
        }
      } catch (err) {
        console.error('Failed to fetch page:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchPage(currentSlug)
  }, [currentSlug, fetchPage])

  // Push to undo stack before making changes
  const pushUndo = useCallback(() => {
    setUndoStack((prev) => [...prev.slice(-20), JSON.parse(JSON.stringify(blocks))])
    setRedoStack([])
  }, [blocks])

  // Update a block's fields
  const handleUpdateBlock = useCallback(
    (blockId: string, updates: Partial<BlockItem>) => {
      pushUndo()
      setBlocks((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, ...updates } : b)),
      )
      setHasUnsavedChanges(true)

      // Send update to iframe for live preview
      if (iframeRef.current?.contentWindow) {
        const block = blocks.find((b) => b.id === blockId)
        if (block) {
          iframeRef.current.contentWindow.postMessage(
            {
              type: 've-update-block',
              blockId,
              blockType: block.blockType,
              updates,
            },
            '*',
          )
        }
      }
    },
    [blocks, pushUndo],
  )

  // Move block (drag and drop)
  const handleMoveBlock = useCallback(
    (fromIndex: number, toIndex: number) => {
      pushUndo()
      setBlocks((prev) => {
        const next = [...prev]
        const [moved] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, moved)
        return next
      })
      setHasUnsavedChanges(true)
    },
    [pushUndo],
  )

  // Delete block
  const handleDeleteBlock = useCallback(
    (blockId: string) => {
      if (!confirm('确定要删除此模块吗？')) return
      pushUndo()
      setBlocks((prev) => prev.filter((b) => b.id !== blockId))
      if (selectedBlockId === blockId) setSelectedBlockId(null)
      setHasUnsavedChanges(true)
    },
    [pushUndo, selectedBlockId],
  )

  // Add block
  const handleAddBlock = useCallback(
    (blockType: string) => {
      pushUndo()
      const newBlock: BlockItem = {
        id: `new-${Date.now()}`,
        blockType,
        blockName: '',
      }
      setBlocks((prev) => [...prev, newBlock])
      setSelectedBlockId(newBlock.id)
      setHasUnsavedChanges(true)
    },
    [pushUndo],
  )

  // Undo
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return
    setRedoStack((prev) => [...prev, JSON.parse(JSON.stringify(blocks))])
    const previous = undoStack[undoStack.length - 1]
    setUndoStack((prev) => prev.slice(0, -1))
    setBlocks(previous)
    setHasUnsavedChanges(true)
  }, [undoStack, blocks])

  // Redo
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(blocks))])
    const next = redoStack[redoStack.length - 1]
    setRedoStack((prev) => prev.slice(0, -1))
    setBlocks(next)
    setHasUnsavedChanges(true)
  }, [redoStack, blocks])

  // Save - with relationship flattening
  const handleSave = useCallback(async () => {
    if (!pageData || isSaving) return
    setIsSaving(true)
    setSaveMessage(null)
    try {
      // Clean blocks: remove temporary IDs and flatten relationship fields
      const cleanedBlocks = blocks.map((b) => {
        const cleaned = flattenRelationships(b as unknown as Record<string, unknown>) as BlockItem
        // Remove temporary IDs (new- or block- prefixed)
        if (cleaned.id && (cleaned.id.startsWith('new-') || cleaned.id.startsWith('block-'))) {
          const { id, ...rest } = cleaned
          return rest
        }
        return cleaned
      })

      const res = await fetch(`/api/pages/${pageData.id}?draft=true`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layout: cleanedBlocks,
        }),
      })

      if (res.ok) {
        setHasUnsavedChanges(false)
        setSaveMessage({ type: 'success', text: '保存成功！' })
        // Reload page data and refresh iframe
        await fetchPage(currentSlug)
        if (iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src
        }
      } else {
        const errorData = await res.json()
        console.error('Save failed:', errorData)
        const errorMsg = errorData?.errors?.[0]?.message || errorData?.message || '保存失败，请检查控制台'
        setSaveMessage({ type: 'error', text: errorMsg })
      }
    } catch (err) {
      console.error('Save error:', err)
      setSaveMessage({ type: 'error', text: '网络错误，保存失败' })
    } finally {
      setIsSaving(false)
    }
  }, [pageData, blocks, isSaving, currentSlug, fetchPage])

  // Select block and highlight in iframe
  const handleSelectBlock = useCallback(
    (blockId: string) => {
      setSelectedBlockId(blockId)
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 've-select-block', blockId },
          '*',
        )
      }
    },
    [],
  )

  // Listen for messages from iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 've-block-clicked') {
        const { blockId } = event.data
        if (blockId) {
          setSelectedBlockId(blockId)
        }
      }
      // Handle inline text edits from iframe
      if (event.data?.type === 've-inline-edit') {
        const { blockId, fieldKey, newValue } = event.data
        if (blockId && fieldKey && newValue !== undefined) {
          // Push undo state
          setUndoStack((prev) => [...prev.slice(-20), JSON.parse(JSON.stringify(blocks))])
          setRedoStack([])
          // Update the block field
          setBlocks((prev) =>
            prev.map((b) => (b.id === blockId ? { ...b, [fieldKey]: newValue } : b)),
          )
          setHasUnsavedChanges(true)
          setSelectedBlockId(blockId)
        }
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [blocks])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          handleRedo()
        } else {
          handleUndo()
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleUndo, handleRedo, handleSave])

  // Resizable panels
  const handleResizeLeft = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = leftPanelWidth
    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      setLeftPanelWidth(Math.max(200, Math.min(400, startWidth + delta)))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [leftPanelWidth])

  const handleResizeRight = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = rightPanelWidth
    const onMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.clientX
      setRightPanelWidth(Math.max(240, Math.min(450, startWidth + delta)))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [rightPanelWidth])

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null
  const deviceSize = DEVICE_SIZES[deviceMode]

  // Build iframe URL using client origin and add ?ve=1 to signal visual editor mode
  const iframePath = currentSlug === 'home' ? '/' : `/${currentSlug}`
  const iframeUrl = `${clientOrigin}${iframePath}?ve=1`

  return (
    <>
      <style>{`
        .ve-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .ve-root { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .ve-root select, .ve-root input, .ve-root textarea, .ve-root button { font-family: inherit; }
      `}</style>
      <div
        className="ve-root"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          background: '#f3f4f6',
        }}
      >
        {/* Toolbar */}
        <EditorToolbar
          pages={pages}
          currentPageSlug={currentSlug}
          onPageChange={setCurrentSlug}
          deviceMode={deviceMode}
          onDeviceModeChange={setDeviceMode}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          onSave={handleSave}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
        />

        {/* Save message toast */}
        {saveMessage && (
          <div style={{
            position: 'fixed',
            top: '56px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100001,
            padding: '8px 20px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#fff',
            background: saveMessage.type === 'success' ? '#16a34a' : '#dc2626',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'veToastIn 0.3s ease',
          }}>
            {saveMessage.type === 'success' ? '✓ ' : '✕ '}{saveMessage.text}
          </div>
        )}

        {/* Main content - three columns */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          {/* Left panel - Component Tree */}
          <div style={{ width: leftPanelWidth, minWidth: leftPanelWidth, flexShrink: 0, overflow: 'hidden', height: '100%' }}>
              <ComponentTree
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={handleSelectBlock}
                onMoveBlock={handleMoveBlock}
                onDeleteBlock={handleDeleteBlock}
                onAddBlock={() => setShowAddBlock(true)}
              />
          </div>

          {/* Left resize handle */}
          <div
            style={{
              width: '4px',
              cursor: 'col-resize',
              background: '#e5e7eb',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
            onMouseDown={handleResizeLeft}
            onMouseOver={(e) => (e.currentTarget.style.background = '#60a5fa')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#e5e7eb')}
          />

          {/* Center - Canvas / iframe preview */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflow: 'auto',
            background: '#e5e7eb',
            padding: deviceMode === 'desktop' ? '0' : '16px',
          }}>
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>⏳</div>
                  <p style={{ fontSize: '14px' }}>加载页面数据...</p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: '#fff',
                  boxShadow: deviceMode === 'desktop' ? 'none' : '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                  borderRadius: deviceMode === 'desktop' ? '0' : '8px',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  width: deviceMode === 'desktop' ? '100%' : `${deviceSize.width}px`,
                  maxWidth: deviceMode === 'desktop' ? '100%' : `${deviceSize.width}px`,
                  height: deviceMode === 'desktop' ? '100%' : `${deviceSize.height}px`,
                }}
              >
                <iframe
                  ref={iframeRef}
                  src={iframeUrl}
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  title="页面预览"
                  onLoad={() => {
                    if (iframeRef.current?.contentWindow) {
                      iframeRef.current.contentWindow.postMessage(
                        { type: 've-init', blocks: blocks.map((b) => ({ id: b.id, blockType: b.blockType })) },
                        '*',
                      )
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Right resize handle */}
          <div
            style={{
              width: '4px',
              cursor: 'col-resize',
              background: '#e5e7eb',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
            onMouseDown={handleResizeRight}
            onMouseOver={(e) => (e.currentTarget.style.background = '#60a5fa')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#e5e7eb')}
          />

          {/* Right panel - Property Panel */}
          <div style={{ width: rightPanelWidth, minWidth: rightPanelWidth, flexShrink: 0 }}>
            <PropertyPanel
              block={selectedBlock}
              onUpdateBlock={handleUpdateBlock}
            />
          </div>
        </div>

        {/* Add Block Dialog */}
        <AddBlockDialog
          isOpen={showAddBlock}
          onClose={() => setShowAddBlock(false)}
          onAddBlock={handleAddBlock}
        />
      </div>

      <style>{`
        @keyframes veToastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  )
}
