import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

// Original template blocks
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

// Custom blocks for 柜侨工业
import { HeroBannerBlock } from '@/blocks/HeroBanner/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { BusinessCardsBlock } from '@/blocks/BusinessCards/Component'
import { NewsHighlightBlock } from '@/blocks/NewsHighlight/Component'
import { ProductShowcaseBlock } from '@/blocks/ProductShowcase/Component'
import { SocialChannelsBlock } from '@/blocks/SocialChannels/Component'
import { ContactInfoBlock } from '@/blocks/ContactInfo/Component'
import { RichContentBlock } from '@/blocks/RichContent/Component'
import { TimelineBlock } from '@/blocks/Timeline/Component'
import { ImageGalleryBlock } from '@/blocks/ImageGallery/Component'
import { FeatureGridBlock } from '@/blocks/FeatureGrid/Component'

const blockComponents = {
  // Original template blocks
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  // Custom blocks
  heroBanner: HeroBannerBlock,
  stats: StatsBlock,
  businessCards: BusinessCardsBlock,
  newsHighlight: NewsHighlightBlock,
  productShowcase: ProductShowcaseBlock,
  socialChannels: SocialChannelsBlock,
  contactInfo: ContactInfoBlock,
  richContent: RichContentBlock,
  timeline: TimelineBlock,
  imageGallery: ImageGalleryBlock,
  featureGrid: FeatureGridBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
