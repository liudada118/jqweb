import React from 'react'
import type { HeroBannerBlock as HeroBannerBlockType } from '@/payload-types'
import Link from 'next/link'
import { MountReveal } from '@/components/motion/ScrollReveal'

const DEFAULT_HERO_IMAGE =
  'https://private-us-east-1.manuscdn.com/sessionFile/vWIh5lveX9X6gT4pZeddG7/sandbox/GznuIhPR1Nm4XeQkbexMJ9-img-1_1770635681000_na1fn_aGVyby1iYW5uZXI.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdldJaDVsdmVYOVg2Z1Q0cFplZGRHNy9zYW5kYm94L0d6bnVJaFBSMU5tNFhlUWtiZXhNSjktaW1nLTFfMTc3MDYzNTY4MTAwMF9uYTFmbl9hR1Z5YnkxaVlXNXVaWEkuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=d0Rpl7HNe1UptQ6~ruMQbUZPGy~modPn0T7lM1RgEoS-mDUy9dTC~49BRWt4wvxFCy~bJ0pE-U1EXopcBD16BtsYXtxFXVgQeaNNhlcfWk1gRgvzqovQYETN3f3rcvwPzFMv1rU1QnkRGzUWK~6p0M-GP-sj6nL5GYczuMdPCqGMP9kcZlbhq9WBF4RFsgLK7sHsp7fotRcDzf5TjlumUD6Uk-YKu8Nm8V32m29P1psFz~Hb9GnJ4TRI9b8joKPtda72CDnT8YcA-UjxRCE~mtfub6xfsKX4WQrTSLovlrRdSKNYeOPDZwSlFnAPfGocHw-s96mQ2j9Itj52gcbBbg__'

export const HeroBannerBlock: React.FC<HeroBannerBlockType> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  ctaButtons,
}) => {
  let bgUrl = DEFAULT_HERO_IMAGE
  if (backgroundImage && typeof backgroundImage === 'object' && backgroundImage.url) {
    bgUrl = backgroundImage.url
  }

  const displayTitle = title || '纤维本身就是传感器'
  const ctaLink = ctaButtons?.[0]?.url || '/products'
  const ctaText = ctaButtons?.[0]?.label || '了解更多'

  return (
    <section className="relative w-full h-[320px] sm:h-[400px] lg:h-[480px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative container h-full flex flex-col justify-end pb-12 lg:pb-16">
        <MountReveal delay={200} duration={700}>
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-white leading-tight tracking-wide">
            {displayTitle}
          </h1>
          <Link
            href={ctaLink}
            className="inline-block mt-3 text-sm text-white/80 hover:text-white transition-colors underline underline-offset-4"
          >
            {ctaText}
          </Link>
        </MountReveal>
      </div>
    </section>
  )
}
