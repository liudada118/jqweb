'use client'
import React from 'react'
import { motion } from 'framer-motion'

/**
 * Generic section-level scroll animation.
 * Used for sections that animate as a whole (not individual items).
 */
export const SectionAnimation: React.FC<{
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}> = ({ children, className, delay = 0, duration = 0.6 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Heading animation for section titles.
 */
export const HeadingAnimation: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Staggered item animation for lists/grids.
 */
export const ItemAnimation: React.FC<{
  children: React.ReactNode
  index: number
  staggerDelay?: number
  className?: string
}> = ({ children, index, staggerDelay = 0.08, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * staggerDelay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
