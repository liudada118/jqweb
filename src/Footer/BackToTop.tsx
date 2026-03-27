'use client'
import React from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTopButton() {
  return (
    <button
      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      回到顶部
      <ArrowUp className="w-3.5 h-3.5" />
    </button>
  )
}
