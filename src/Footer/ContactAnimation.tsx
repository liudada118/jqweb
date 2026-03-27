'use client'
import React, { useEffect, useRef, useState } from 'react'

export const ContactAnimation: React.FC<{
  children: React.ReactNode
  type: 'heading' | 'content'
}> = ({ children, type }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [hydrated, setHydrated] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setHydrated(true)

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: '0px' },
    )

    requestAnimationFrame(() => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const delay = type === 'content' ? 100 : 0
  const visible = !hydrated || isVisible

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(15px)',
        transition: hydrated
          ? `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms`
          : 'none',
      }}
    >
      {children}
    </div>
  )
}
