import React from 'react'
import type { StatsBlock as StatsBlockType } from '@/payload-types'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

export const StatsBlock: React.FC<StatsBlockType> = ({ items }) => {
  const defaultStats = [
    { value: 'CU7+', label: '产品系列' },
    { value: 'ICU11', label: '应用场景' },
    { value: '8', label: '发明专利' },
    { value: '8', label: '行业解决方案' },
    { value: '50+', label: '全球伙伴' },
  ]

  const stats = items && items.length > 0 ? items : defaultStats
  const colCount = stats.length <= 4 ? stats.length : 5

  const gridClass =
    colCount <= 3
      ? 'grid-cols-2 sm:grid-cols-3'
      : colCount === 4
        ? 'grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container">
        <div className={`grid ${gridClass} gap-4 lg:gap-6`}>
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 80}>
              <div className="flex flex-col items-center py-6 px-4 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition-colors duration-300">
                <span className="text-xl lg:text-2xl font-bold text-gray-800 tracking-tight">
                  {stat.value}
                </span>
                <span className="mt-2 text-xs text-gray-500 font-medium">{stat.label}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
