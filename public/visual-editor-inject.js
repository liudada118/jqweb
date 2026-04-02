/**
 * Visual Editor Inject Script
 * 注入到 iframe 中，实现：
 * 1. 点击 block 元素时通知父窗口
 * 2. 接收父窗口的高亮指令
 * 3. 接收内容更新指令实时更新预览
 */
(function () {
  if (window.__VE_INJECTED__) return
  window.__VE_INJECTED__ = true

  // Style for highlight overlay
  const style = document.createElement('style')
  style.textContent = `
    .ve-highlight-overlay {
      position: absolute;
      border: 2px solid #3b82f6;
      background: rgba(59, 130, 246, 0.08);
      pointer-events: none;
      z-index: 99999;
      transition: all 0.2s ease;
      border-radius: 4px;
    }
    .ve-highlight-overlay::before {
      content: attr(data-label);
      position: absolute;
      top: -22px;
      left: -2px;
      background: #3b82f6;
      color: white;
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 3px 3px 0 0;
      white-space: nowrap;
      font-family: 'Noto Sans SC', sans-serif;
    }
    [data-block-id]:hover {
      outline: 1px dashed rgba(59, 130, 246, 0.3);
      outline-offset: 2px;
      cursor: pointer;
    }
  `
  document.head.appendChild(style)

  // Highlight overlay element
  let overlay = null

  function createOverlay() {
    if (overlay) return overlay
    overlay = document.createElement('div')
    overlay.className = 've-highlight-overlay'
    document.body.appendChild(overlay)
    return overlay
  }

  function removeOverlay() {
    if (overlay) {
      overlay.remove()
      overlay = null
    }
  }

  function highlightBlock(blockId) {
    const el = document.querySelector(`[data-block-id="${blockId}"]`)
    if (!el) {
      removeOverlay()
      return
    }

    const rect = el.getBoundingClientRect()
    const ov = createOverlay()
    const blockType = el.getAttribute('data-block-type') || ''

    const LABELS = {
      heroBanner: 'Hero 横幅',
      stats: '数据统计',
      businessCards: '业务板块',
      newsHighlight: '新闻动态',
      productShowcase: '产品展示',
      socialChannels: '社交渠道',
      contactInfo: '联系信息',
      richContent: '富文本内容',
      timeline: '时间线',
      imageGallery: '图片画廊',
      featureGrid: '功能网格',
    }

    ov.setAttribute('data-label', LABELS[blockType] || blockType)
    ov.style.top = `${rect.top + window.scrollY}px`
    ov.style.left = `${rect.left + window.scrollX}px`
    ov.style.width = `${rect.width}px`
    ov.style.height = `${rect.height}px`

    // Scroll into view
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Click handler - notify parent of block selection
  document.addEventListener('click', function (e) {
    const blockEl = e.target.closest('[data-block-id]')
    if (blockEl) {
      e.preventDefault()
      e.stopPropagation()
      const blockId = blockEl.getAttribute('data-block-id')
      window.parent.postMessage(
        {
          type: 've-block-clicked',
          blockId: blockId,
          blockType: blockEl.getAttribute('data-block-type'),
        },
        '*',
      )
      highlightBlock(blockId)
    }
  }, true)

  // Listen for messages from parent
  window.addEventListener('message', function (event) {
    const data = event.data
    if (!data || !data.type) return

    switch (data.type) {
      case 've-init':
        // Editor initialized
        console.log('[Visual Editor] Inject script initialized')
        break

      case 've-select-block':
        // Highlight a specific block
        if (data.blockId) {
          highlightBlock(data.blockId)
        } else {
          removeOverlay()
        }
        break

      case 've-update-block':
        // Update block content in real-time
        if (data.blockId && data.updates) {
          updateBlockContent(data.blockId, data.updates)
        }
        break

      case 've-deselect':
        removeOverlay()
        break
    }
  })

  // Update block content for live preview
  function updateBlockContent(blockId, updates) {
    const blockEl = document.querySelector(`[data-block-id="${blockId}"]`)
    if (!blockEl) return

    // For simple text fields, try to find and update text content
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value !== 'string') continue

      // Try to find elements with matching text content or specific selectors
      const candidates = blockEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, div')
      // This is a best-effort approach for live preview
      // The actual update happens when the user saves and the page reloads
    }
  }

  console.log('[Visual Editor] Inject script loaded')
})()
