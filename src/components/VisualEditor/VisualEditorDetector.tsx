'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Client component that detects visual editor mode (?ve=1 or inside iframe)
 * and injects CSS to hide Header/Footer/AdminBar.
 * Also injects the visual-editor-inject.js script for iframe communication.
 */
export function VisualEditorDetector() {
  const searchParams = useSearchParams()
  const veParam = searchParams.get('ve')
  const [isVE, setIsVE] = useState(false)

  useEffect(() => {
    // Check if we're in visual editor mode
    const isInIframe = window.self !== window.top
    const hasVeParam = veParam === '1'

    if (isInIframe || hasVeParam) {
      setIsVE(true)

      // Inject the visual editor script
      if (!(window as any).__VE_INJECTED__) {
        const script = document.createElement('script')
        script.src = '/visual-editor-inject.js'
        script.async = true
        document.body.appendChild(script)
      }
    }
  }, [veParam])

  if (!isVE) return null

  return (
    <style>{`
      .ve-chrome {
        display: none !important;
      }
      body {
        overflow-x: hidden;
      }
    `}</style>
  )
}
