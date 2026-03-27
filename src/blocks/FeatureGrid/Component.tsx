import React from 'react'
import type { FeatureGridBlock as FeatureGridBlockType } from '@/payload-types'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

export const FeatureGridBlock: React.FC<FeatureGridBlockType> = ({
  sectionTitle,
  sectionSubtitle,
  features,
  columns = '3',
}) => {
  if (!features || features.length === 0) return null

  const colClass =
    columns === '2'
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === '4'
        ? 'grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container">
        {(sectionTitle || sectionSubtitle) && (
          <ScrollReveal className="text-center mb-10 lg:mb-14">
            {sectionTitle && (
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{sectionTitle}</h2>
            )}
            {sectionSubtitle && (
              <p className="text-sm text-gray-500 max-w-xl mx-auto">{sectionSubtitle}</p>
            )}
          </ScrollReveal>
        )}

        <div className={`grid ${colClass} gap-4 lg:gap-6`}>
          {features.map((feature, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="flex flex-col items-center py-6 px-4 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition-colors duration-300 text-center">
                <h3 className="text-sm font-bold text-gray-800">{feature.title}</h3>
                {feature.description && (
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
