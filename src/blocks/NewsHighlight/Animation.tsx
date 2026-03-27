'use client'
import React from 'react'
import { motion } from 'framer-motion'

export const NewsAnimation: React.FC<{
  children: React.ReactNode
  type: 'heading' | 'card'
  index?: number
}> = ({ children, type, index = 0 }) => {
  if (type === 'heading') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      {children}
    </motion.div>
  )
}
