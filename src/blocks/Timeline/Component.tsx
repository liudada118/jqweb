import React from 'react'
import type { TimelineBlock as TimelineBlockType } from '@/payload-types'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

export const TimelineBlock: React.FC<TimelineBlockType> = ({ sectionTitle, events }) => {
  if (!events || events.length === 0) return null

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="container">
        <ScrollReveal>
          <h2 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-10 lg:mb-14">
            {sectionTitle || '发展历程'}
          </h2>
        </ScrollReveal>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gray-200 lg:-translate-x-px" />

          {events.map((event, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div
                className={`relative flex items-start mb-8 lg:mb-10 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 lg:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 mt-1.5 z-10 ring-4 ring-white" />

                {/* Content */}
                <div
                  className={`ml-10 lg:ml-0 lg:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8'
                  }`}
                >
                  <span className="text-sm font-bold text-primary">{event.year}</span>
                  <h3 className="text-sm font-medium text-gray-800 mt-1">{event.title}</h3>
                  {event.description && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
