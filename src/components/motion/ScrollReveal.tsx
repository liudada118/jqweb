'use client'
import React, { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
}

/**
 * CSS-based scroll reveal animation using Intersection Observer.
 * SSR-safe: renders visible by default, then adds animation on client hydration.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 500,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [hydrated, setHydrated] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Mark as hydrated - now we can safely hide and animate
    setHydrated(true)

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: '0px' },
    )

    // Small delay to let the browser paint the hidden state first
    requestAnimationFrame(() => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [once])

  // Before hydration: fully visible (SSR safe)
  // After hydration but before intersection: hidden
  // After intersection: animate in
  const shouldAnimate = hydrated
  const visible = !hydrated || isVisible

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: shouldAnimate
          ? `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`
          : 'none',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Mount animation (not scroll-triggered). For hero sections.
 * SSR-safe: renders visible by default, animates on mount.
 */
export const MountReveal: React.FC<{
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}> = ({ children, className = '', delay = 0, duration = 700 }) => {
  const [hydrated, setHydrated] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setHydrated(true)
    // Trigger animation after a brief delay
    const timer = requestAnimationFrame(() => {
      setTimeout(() => setIsVisible(true), 50)
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  const visible = !hydrated || isVisible

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: hydrated
          ? `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`
          : 'none',
      }}
    >
      {children}
    </div>
  )
}
