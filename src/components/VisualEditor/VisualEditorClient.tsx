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
      // Clean block IDs that were generated client-side
      const cleanedBlocks = blocks.map((b) => {
        const { id, ...rest } = b
        // Keep original IDs, remove client-generated ones
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
        // Refresh page data to get server-generated IDs
        await fetchPage(currentSlug)
        // Reload iframe
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

  // Build iframe URL - use the frontend page URL
  const iframeUrl = currentSlug === 'home' ? `${baseUrl}/` : `${baseUrl}/${currentSlug}`

  return (
    <div className="flex flex-col h-screen bg-gray-100" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
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

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Component Tree */}
        <div style={{ width: leftPanelWidth, minWidth: leftPanelWidth }} className="flex-shrink-0">
          <ComponentTree
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
            onMoveBlock={handleMoveBlock}
            onDeleteBlock={handleDeleteBlock}
          />
          {/* Add block button */}
          <div className="bg-white border-r border-gray-200 px-3 py-2">
            <button
              onClick={() => setShowAddBlock(true)}
              className="w-full py-1.5 text-xs font-medium text-blue-600 border border-blue-300 border-dashed rounded hover:bg-blue-50 transition-colors"
            >
              + 添加模块
            </button>
          </div>
        </div>

        {/* Left resize handle */}
        <div
          className="w-1 cursor-col-resize bg-gray-200 hover:bg-blue-400 transition-colors flex-shrink-0"
          onMouseDown={handleResizeLeft}
        />

        {/* Center - Canvas / iframe preview */}
        <div className="flex-1 flex items-start justify-center overflow-auto bg-gray-200 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-3 animate-pulse">⏳</div>
                <p className="text-sm">加载页面数据...</p>
              </div>
            </div>
          ) : (
            <div
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
              style={{
                width: deviceMode === 'desktop' ? '100%' : deviceSize.width,
                maxWidth: deviceSize.width,
                height: deviceMode === 'desktop' ? 'calc(100vh - 60px)' : deviceSize.height,
              }}
            >
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                className="w-full h-full border-0"
                title="页面预览"
                onLoad={() => {
                  // Inject the visual editor script into the iframe
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
          className="w-1 cursor-col-resize bg-gray-200 hover:bg-blue-400 transition-colors flex-shrink-0"
          onMouseDown={handleResizeRight}
        />

        {/* Right panel - Property Panel */}
        <div style={{ width: rightPanelWidth, minWidth: rightPanelWidth }} className="flex-shrink-0">
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
  )
}
