import React from 'react'
import type { RichContentBlock as RichContentBlockType } from '@/payload-types'
import RichText from '@/components/RichText'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

export const RichContentBlock: React.FC<RichContentBlockType> = ({
  sectionTitle,
  content,
  layout,
  sideImage,
  backgroundColor,
}) => {
  const bgClass =
    backgroundColor === 'gray'
      ? 'bg-gray-50'
      : backgroundColor === 'dark'
        ? 'bg-gray-800 text-white'
        : 'bg-white'

  const isImageLayout = layout === 'imageLeft' || layout === 'imageRight'

  return (
    <section className={`py-12 lg:py-16 ${bgClass}`}>
      <div className="container">
        <ScrollReveal>
          {sectionTitle && (
            <h2 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-8 lg:mb-12">
              {sectionTitle}
            </h2>
          )}

          {isImageLayout && sideImage && typeof sideImage === 'object' && sideImage.url ? (
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                layout === 'imageRight' ? 'lg:[direction:rtl] lg:*:[direction:ltr]' : ''
              }`}
            >
              <div className="overflow-hidden rounded-sm">
                <img
                  src={sideImage.url}
                  alt={sectionTitle || ''}
                  className="w-full h-[240px] lg:h-[320px] object-cover"
                />
              </div>
              <div className="prose prose-sm max-w-none">
                {content && <RichText data={content} enableGutter={false} />}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto prose prose-sm">
              {content && <RichText data={content} enableGutter={false} />}
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}
