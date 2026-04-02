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

  // Undo/Redo
  const [undoStack, setUndoStack] = useState<BlockItem[][]>([])
  const [redoStack, setRedoStack] = useState<BlockItem[][]>([])

  const iframeRef = useRef<HTMLIFrameElement>(null)

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
    setUndoStack((prev) => [...prev.slice(-20), blocks.map((b) => ({ ...b }))])
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
    setRedoStack((prev) => [...prev, blocks.map((b) => ({ ...b }))])
    const previous = undoStack[undoStack.length - 1]
    setUndoStack((prev) => prev.slice(0, -1))
    setBlocks(previous)
    setHasUnsavedChanges(true)
  }, [undoStack, blocks])

  // Redo
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return
    setUndoStack((prev) => [...prev, blocks.map((b) => ({ ...b }))])
    const next = redoStack[redoStack.length - 1]
    setRedoStack((prev) => prev.slice(0, -1))
    setBlocks(next)
    setHasUnsavedChanges(true)
  }, [redoStack, blocks])

  // Save
  const handleSave = useCallback(async () => {
    if (!pageData || isSaving) return
    setIsSaving(true)
    try {
      const cleanedBlocks = blocks.map((b) => {
        const { id, ...rest } = b
        if (id.startsWith('new-') || id.startsWith('block-')) {
          return rest
        }
        return b
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
        await fetchPage(currentSlug)
        if (iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src
        }
      } else {
        const errorData = await res.json()
        console.error('Save failed:', errorData)
        alert('保存失败，请检查控制台')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('保存失败')
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
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

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
  const iframeUrl = currentSlug === 'home' ? `${baseUrl}/` : `${baseUrl}/${currentSlug}`

  // Use fixed positioning to break out of Payload admin layout constraints
  return (
    <>
      <style>{`
        .ve-root * { box-sizing: border-box; }
        .ve-root { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
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

        {/* Main content - three columns */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left panel - Component Tree */}
          <div style={{ width: leftPanelWidth, minWidth: leftPanelWidth, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ComponentTree
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={handleSelectBlock}
                onMoveBlock={handleMoveBlock}
                onDeleteBlock={handleDeleteBlock}
              />
            </div>
            {/* Add block button */}
            <div style={{ background: '#fff', borderRight: '1px solid #e5e7eb', padding: '8px 12px' }}>
              <button
                onClick={() => setShowAddBlock(true)}
                style={{
                  width: '100%',
                  padding: '6px 0',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#2563eb',
                  border: '1px dashed #93c5fd',
                  borderRadius: '4px',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#eff6ff')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                + 添加模块
              </button>
            </div>
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
            background: '#d1d5db',
            padding: '16px',
          }}>
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>⏳</div>
                  <p style={{ fontSize: '14px' }}>加载页面数据...</p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: '#fff',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  width: deviceMode === 'desktop' ? '100%' : `${deviceSize.width}px`,
                  maxWidth: `${deviceSize.width}px`,
                  height: deviceMode === 'desktop' ? 'calc(100vh - 60px)' : `${deviceSize.height}px`,
                }}
              >
                <iframe
                  ref={iframeRef}
                  src={iframeUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
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
    </>
  )
}
