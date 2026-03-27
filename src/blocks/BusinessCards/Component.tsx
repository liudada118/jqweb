import React from 'react'
import type { BusinessCardsBlock as BusinessCardsBlockType } from '@/payload-types'
import Link from 'next/link'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

const INNOVATION_CENTER_IMG =
  'https://private-us-east-1.manuscdn.com/sessionFile/vWIh5lveX9X6gT4pZeddG7/sandbox/GznuIhPR1Nm4XeQkbexMJ9-img-2_1770635679000_na1fn_aW5ub3ZhdGlvbi1jZW50ZXI.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdldJaDVsdmVYOVg2Z1Q0cFplZGRHNy9zYW5kYm94L0d6bnVJaFBSMU5tNFhlUWtiZXhNSjktaW1nLTJfMTc3MDYzNTY3OTAwMF9uYTFmbl9hVzV1YjNaaGRHbHZiaTFqWlc1MFpYSS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=hspqGOHJKCYImHmnE-YohQT~jfyF2b1gn4F-zivMTIdHG9mpgxXfbgM9cDb-8hTIzvkuMmMYRzTpklFe8ZRP9OLn5lngZN8LMy6qk0RZSmfI4Q6XMYPg5ugLiKe5hY9SDnOvC-kHVBKX7cla6PLbb8OtfaMIr1juE1gq7GbBE0VPsGjj3o773blXBWNC5isQg4beiVdzgDZd0RtChVlr9C8N1tLdclxBL0N7GxQfxArcp2o6hq-WmUCfwlklsDs-xCk3pIyhRC8lSSsgB5XoHNpiWtnMLv27wFp5sJR0~83VbM9SIHxjTEKZq7hLDchaWCbGX1YTBvaglLpMI6RT4A__'

const FACTORY_IMG =
  'https://private-us-east-1.manuscdn.com/sessionFile/vWIh5lveX9X6gT4pZeddG7/sandbox/GznuIhPR1Nm4XeQkbexMJ9-img-3_1770635679000_na1fn_ZmFjdG9yeQ.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdldJaDVsdmVYOVg2Z1Q0cFplZGRHNy9zYW5kYm94L0d6bnVJaFBSMU5tNFhlUWtiZXhNSjktaW1nLTNfMTc3MDYzNTY3OTAwMF9uYTFmbl9abUZqZEc5eWVRLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=TjqsZF7MMYn5MjnwxBGeQwFHpNdd~gC4vU2tM6MQ-KLO2oOwJ-o8P2LGxOGBIwmUO3STCTo88IXJmrFGIxTdHGWzrXAdbKl2j17J5VKb66P0EwCJGqr0UtUkFOYoBR9Uue8zsKijYlmJYY2RmkkeBMnpnZz3dW8X5CmzUaDVV0d9oPiAlt~gxkCR5mo2OEKjKLEY3d8VaLNMZCAhysavqCJyaZTb34jtnhsyBZl8DdxDNCvFg2yCV1wH~m6gUtRzamCYPeSD~N12fAmZljQDYFRbyWHAhreQPfHxabZHyAciyUcVcryxfQywYdKcFfcoX6Sg8nhbgOyMn8b77RVKOA__'

const BRAND_STORY_IMG =
  'https://private-us-east-1.manuscdn.com/sessionFile/vWIh5lveX9X6gT4pZeddG7/sandbox/GznuIhPR1Nm4XeQkbexMJ9-img-4_1770635681000_na1fn_YnJhbmQtc3Rvcnk.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdldJaDVsdmVYOVg2Z1Q0cFplZGRHNy9zYW5kYm94L0d6bnVJaFBSMU5tNFhlUWtiZXhNSjktaW1nLTRfMTc3MDYzNTY4MTAwMF9uYTFmbl9ZbkpoYm1RdGMzUnZjbmsuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=qSuc3v8TarRWCM-jwVNZgsz7usB7PvLyyxXZ97EOYfCMT2MomlEqGWZA4j~cMfoIWlVRop43b6-JxcmICC8JcCisR96mX~rxJkuE2d1vIna3b90xC0-qYb~cl2MG7g~t85atMENqY5dxhkGrhivp8JenGp~2dYPZ7SavAD2kN4uj-fg2ahXb~PROB~pcLgFd9lDHv6O9t7Lxn0xdHQ0Frv30eicotippuf-z9hJNfJ0lv3witUKnZnC8AO6VtLpo-AtnVZovDwsbIroQpSN9lCqaUPAWSIYCVm9Njxr62jkt~rg4-ZwhcyOLjhbrDAWvCYEd4ucrfmmSukXwUmKZAw__'

const defaultCards = [
  { title: '青广基树', image: FACTORY_IMG, labelPosition: 'bottom-left' as const, href: '/brand-story' },
  { title: '创新中心', image: INNOVATION_CENTER_IMG, labelPosition: 'top-right' as const, href: '/brand-story' },
  { title: '品牌故事', image: BRAND_STORY_IMG, labelPosition: 'bottom-right' as const, href: '/brand-story' },
]

export const BusinessCardsBlock: React.FC<BusinessCardsBlockType> = ({ cards }) => {
  const displayCards =
    cards && cards.length > 0
      ? cards.map((card, i) => {
          let imgUrl = defaultCards[i]?.image || FACTORY_IMG
          if (card.image && typeof card.image === 'object' && card.image.url) {
            imgUrl = card.image.url
          }
          return {
            title: card.title,
            image: imgUrl,
            labelPosition: defaultCards[i]?.labelPosition || ('bottom-left' as const),
            href: card.linkUrl || '#',
          }
        })
      : defaultCards

  return (
    <section className="py-8 lg:py-12 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
          {displayCards.map((card, index) => (
            <ScrollReveal key={index} delay={index * 80}>
              <Link
                href={card.href}
                className="group relative aspect-[4/3] overflow-hidden rounded-sm block"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                <div
                  className={`absolute ${
                    card.labelPosition === 'bottom-left'
                      ? 'bottom-4 left-4'
                      : card.labelPosition === 'top-right'
                        ? 'top-4 right-4'
                        : 'bottom-4 right-4'
                  }`}
                >
                  <span className="text-white text-sm lg:text-base font-medium drop-shadow-md">
                    {card.title}
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
