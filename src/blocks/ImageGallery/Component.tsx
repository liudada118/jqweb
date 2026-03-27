'use client'
import React, { useState, useEffect, useRef } from 'react'
import type { ImageGalleryBlock as ImageGalleryBlockType } from '@/payload-types'

const GalleryItem: React.FC<{
  imgUrl: string
  caption?: string | null
  index: number
  onClick: () => void
}> = ({ imgUrl, caption, index, onClick }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '-50px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 500ms ease-out ${index * 60}ms, transform 500ms ease-out ${index * 60}ms`,
      }}
    >
      <div
        className="group relative aspect-[4/3] overflow-hidden rounded-sm cursor-pointer"
        onClick={onClick}
      >
        <img
          src={imgUrl}
          alt={caption || ''}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        {caption && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
            <p className="text-white text-xs">{caption}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const ImageGalleryBlock: React.FC<ImageGalleryBlockType> = ({
  sectionTitle,
  images,
  columns = '3',
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  const colClass =
    columns === '2'
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === '4'
        ? 'grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-2 lg:grid-cols-3'

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container">
        {sectionTitle && (
          <h2 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-8 lg:mb-12">
            {sectionTitle}
          </h2>
        )}

        <div className={`grid ${colClass} gap-4 lg:gap-5`}>
          {images.map((item, i) => {
            const imgUrl =
              item.image && typeof item.image === 'object' && item.image.url
                ? item.image.url
                : ''
            if (!imgUrl) return null

            return (
              <GalleryItem
                key={i}
                imgUrl={imgUrl}
                caption={item.caption}
                index={i}
                onClick={() => setLightboxIndex(i)}
              />
            )
          })}
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 text-2xl"
              onClick={() => setLightboxIndex(null)}
            >
              &times;
            </button>
            {images[lightboxIndex]?.image &&
              typeof images[lightboxIndex].image === 'object' &&
              images[lightboxIndex].image.url && (
                <div
                  className="max-w-4xl max-h-[80vh] relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={images[lightboxIndex].image.url}
                    alt={images[lightboxIndex].caption || ''}
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                  {images[lightboxIndex].caption && (
                    <p className="text-white text-center mt-4 text-sm">
                      {images[lightboxIndex].caption}
                    </p>
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </section>
  )
}
