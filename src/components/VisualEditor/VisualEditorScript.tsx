'use client'

import { useEffect } from 'react'

/**
 * This component is added to the frontend layout.
 * It checks if the page is loaded inside an iframe from the visual editor,
 * and if so, injects the visual-editor-inject.js script.
 */
export function VisualEditorScript() {
  useEffect(() => {
    // Only inject if we're inside an iframe
    if (window.self === window.top) return

    // Check if parent is the visual editor
    try {
      const script = document.createElement('script')
      script.src = '/visual-editor-inject.js'
      script.async = true
      document.body.appendChild(script)
    } catch (e) {
      // Cross-origin - not our visual editor
      console.log('[VE] Not in visual editor iframe')
    }
  }, [])

  return null
}
