/**
 * Visual Editor Inject Script
 * 注入到 iframe 中，实现：
 * 1. 点击 block 元素时通知父窗口
 * 2. 接收父窗口的高亮指令
 * 3. 接收内容更新指令实时更新预览
 */
;(function () {
  if (window.__VE_INJECTED__) return
  window.__VE_INJECTED__ = true

  // Style for highlight overlay
  var style = document.createElement('style')
  style.textContent =
    '.ve-highlight-overlay{position:absolute;border:2px solid #3b82f6;background:rgba(59,130,246,0.08);pointer-events:none;z-index:99999;transition:all 0.2s ease;border-radius:4px}' +
    '.ve-highlight-overlay::before{content:attr(data-label);position:absolute;top:-22px;left:-2px;background:#3b82f6;color:white;font-size:11px;padding:1px 6px;border-radius:3px 3px 0 0;white-space:nowrap;font-family:"Noto Sans SC",sans-serif}' +
    '[data-block-id]{transition:outline 0.15s ease}' +
    '[data-block-id]:hover{outline:1px dashed rgba(59,130,246,0.4);outline-offset:2px;cursor:pointer}' +
    '[data-block-id] h1:hover,[data-block-id] h2:hover,[data-block-id] h3:hover,[data-block-id] h4:hover,[data-block-id] p:hover,[data-block-id] span:hover{cursor:text;background:rgba(59,130,246,0.04);border-radius:2px}' +
    '[contenteditable=true]{cursor:text !important;background:rgba(59,130,246,0.05) !important}'
  document.head.appendChild(style)

  var overlay = null

  var LABELS = {
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
    cta: '行动号召',
    content: '内容区块',
    mediaBlock: '媒体区块',
  }

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
    var el = document.querySelector('[data-block-id="' + blockId + '"]')
    if (!el) {
      removeOverlay()
      return
    }

    var rect = el.getBoundingClientRect()
    var ov = createOverlay()
    var blockType = el.getAttribute('data-block-type') || ''

    ov.setAttribute('data-label', LABELS[blockType] || blockType)
    ov.style.top = rect.top + window.scrollY + 'px'
    ov.style.left = rect.left + window.scrollX + 'px'
    ov.style.width = rect.width + 'px'
    ov.style.height = rect.height + 'px'

    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Click handler - notify parent of block selection
  document.addEventListener(
    'click',
    function (e) {
      // Skip if we're currently editing inline
      if (e.target.contentEditable === 'true') return

      var blockEl = e.target.closest('[data-block-id]')
      if (blockEl) {
        e.preventDefault()
        e.stopPropagation()
        var blockId = blockEl.getAttribute('data-block-id')
        currentBlockId = blockId
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
    },
    true,
  )

  // Double-click to edit text inline
  document.addEventListener('dblclick', function(e) {
    var el = e.target
    // Only allow editing on text elements within blocks
    var blockEl = el.closest('[data-block-id]')
    if (!blockEl) return

    var tag = el.tagName.toLowerCase()
    var isTextElement = ['h1','h2','h3','h4','h5','h6','p','span','a','li','td','th','label','strong','em','b','i'].indexOf(tag) !== -1

    if (!isTextElement) return
    if (el.children.length > 2) return // Skip complex elements

    e.preventDefault()
    e.stopPropagation()

    // Make element editable
    el.contentEditable = 'true'
    el.style.outline = '2px solid #3b82f6'
    el.style.outlineOffset = '2px'
    el.style.borderRadius = '2px'
    el.style.minWidth = '20px'
    el.focus()

    // Select all text
    var range = document.createRange()
    range.selectNodeContents(el)
    var sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)

    // Save original text for undo
    var originalText = el.textContent

    function finishEditing() {
      el.contentEditable = 'false'
      el.style.outline = ''
      el.style.outlineOffset = ''
      el.style.borderRadius = ''

      var newText = el.textContent
      if (newText !== originalText) {
        // Notify parent of the text change
        var blockId = blockEl.getAttribute('data-block-id')
        var blockType = blockEl.getAttribute('data-block-type')

        // Try to determine which field was edited based on element type
        var fieldKey = null
        if (tag === 'h1' || tag === 'h2') fieldKey = 'title'
        else if (tag === 'h3' || tag === 'h4') fieldKey = 'subtitle'
        else if (tag === 'p' && el.className && el.className.indexOf('subtitle') !== -1) fieldKey = 'subtitle'
        else if (tag === 'p') fieldKey = 'description'

        window.parent.postMessage({
          type: 've-inline-edit',
          blockId: blockId,
          blockType: blockType,
          fieldKey: fieldKey,
          oldValue: originalText,
          newValue: newText,
          elementTag: tag,
          elementClass: el.className || ''
        }, '*')
      }

      el.removeEventListener('blur', finishEditing)
      el.removeEventListener('keydown', handleKeys)
    }

    function handleKeys(ev) {
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault()
        el.blur()
      }
      if (ev.key === 'Escape') {
        el.textContent = originalText
        el.blur()
      }
    }

    el.addEventListener('blur', finishEditing)
    el.addEventListener('keydown', handleKeys)
  }, true)

  // Listen for messages from parent
  window.addEventListener('message', function (event) {
    var data = event.data
    if (!data || !data.type) return

    switch (data.type) {
      case 've-init':
        console.log('[Visual Editor] Inject script initialized with', (data.blocks || []).length, 'blocks')
        // Notify parent that iframe is ready
        window.parent.postMessage({ type: 've-iframe-ready' }, '*')
        break

      case 've-select-block':
        if (data.blockId) {
          highlightBlock(data.blockId)
        } else {
          removeOverlay()
        }
        break

      case 've-update-block':
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
    var blockEl = document.querySelector('[data-block-id="' + blockId + '"]')
    if (!blockEl) return

    for (var key in updates) {
      if (!updates.hasOwnProperty(key)) continue
      var value = updates[key]
      if (typeof value !== 'string') continue

      // Strategy: find text nodes and elements that match the field content
      // Try specific selectors based on common field names
      var selectors = []
      if (key === 'title' || key === 'sectionTitle') {
        selectors = ['h1', 'h2', 'h3', '.section-title', '[class*="title"]']
      } else if (key === 'subtitle' || key === 'sectionSubtitle') {
        selectors = ['h3', 'h4', 'p.subtitle', '.section-subtitle', '[class*="subtitle"]']
      } else if (key === 'description') {
        selectors = ['p', '.description', '[class*="description"]', '[class*="desc"]']
      }

      // Try to find and update matching elements
      for (var i = 0; i < selectors.length; i++) {
        var els = blockEl.querySelectorAll(selectors[i])
        for (var j = 0; j < els.length; j++) {
          var el = els[j]
          // Only update if the element has direct text content (not deeply nested)
          if (el.children.length === 0 || el.childNodes.length <= 2) {
            el.textContent = value
            break
          }
        }
      }
    }
  }

  // Update overlay position on scroll/resize
  var currentBlockId = null
  window.addEventListener('scroll', function () {
    if (overlay && currentBlockId) {
      highlightBlock(currentBlockId)
    }
  })
  window.addEventListener('resize', function () {
    if (overlay && currentBlockId) {
      highlightBlock(currentBlockId)
    }
  })

  // Notify parent that the page is loaded
  window.parent.postMessage({ type: 've-iframe-ready' }, '*')

  console.log('[Visual Editor] Inject script loaded with inline editing support')
})()
