'use client'
import React from 'react'
import { motion } from 'framer-motion'

export const StatsAnimation: React.FC<{ children: React.ReactNode; index: number }> = ({
  children,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {children}
    </motion.div>
  )
}
