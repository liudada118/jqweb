'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface AnimateInViewProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  once?: boolean
  margin?: string
}

/**
 * Wrapper component that animates children when they enter the viewport.
 * Replicates the original framer-motion whileInView pattern from guiqiao-website.
 */
export const AnimateInView: React.FC<AnimateInViewProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  y = 20,
  once = true,
  margin = '-50px',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Animate on mount (not scroll-triggered). Used for hero sections.
 */
export const AnimateOnMount: React.FC<{
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
}> = ({ children, className, delay = 0, duration = 0.7, y = 30 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Animate heading text when it enters the viewport.
 */
export const AnimateHeading: React.FC<{
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}> = ({ children, className, as: Tag = 'h2' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  )
}
