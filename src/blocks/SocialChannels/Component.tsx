import React from 'react'
import type { SocialChannelsBlock as SocialChannelsBlockType } from '@/payload-types'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

const defaultChannels = [
  { label: '公众号' },
  { label: '视频号' },
  { label: 'bilibili' },
  { label: '微博' },
]

export const SocialChannelsBlock: React.FC<SocialChannelsBlockType> = ({
  sectionTitle,
  channels,
}) => {
  const displayChannels =
    channels && channels.length > 0
      ? channels.map((ch) => ({ label: ch.name }))
      : defaultChannels

  return (
    <section className="py-12 lg:py-16 bg-white border-b border-gray-100">
      <div className="container">
        <ScrollReveal>
          <h2 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-8 lg:mb-12">
            {sectionTitle || '请关注我们'}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-10 max-w-2xl mx-auto">
            {displayChannels.map((channel, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                {/* QR Code Placeholder */}
                <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gray-100 rounded-sm border border-gray-200 flex items-center justify-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-200 rounded-sm flex items-center justify-center">
                    <svg
                      className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="4" height="4" rx="0.5" />
                      <line x1="21" y1="14" x2="21" y2="21" />
                      <line x1="14" y1="21" x2="21" y2="21" />
                    </svg>
                  </div>
                </div>
                <span className="text-xs lg:text-sm text-gray-500 font-medium">{channel.label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
