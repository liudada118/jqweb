import React from 'react'
import type { ProductShowcaseBlock as ProductShowcaseBlockType } from '@/payload-types'
import Link from 'next/link'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

const PRODUCTS_IMG =
  'https://private-us-east-1.manuscdn.com/sessionFile/vWIh5lveX9X6gT4pZeddG7/sandbox/GznuIhPR1Nm4XeQkbexMJ9-img-5_1770635673000_na1fn_cHJvZHVjdHMtc29sdXRpb25z.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdldJaDVsdmVYOVg2Z1Q0cFplZGRHNy9zYW5kYm94L0d6bnVJaFBSMU5tNFhlUWtiZXhNSjktaW1nLTVfMTc3MDYzNTY3MzAwMF9uYTFmbl9jSEp2WkhWamRITXRjMjlzZFhScGIyNXouanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=EFVuWEVkc4kZCndmVYfMQSvng~6P2WOZAhAvN2qyvWNM-ty9UdlOzQuNEZvRvQ3ZN1wjOiE-BY~lGkjBCvHCx13ve9ARN-CrP9UcDwTvUV9E0xXVc3jSbt2YlZayULj2ezaxh~mEfg31-K20AfHEp1rGlKz9-PzayZppX3KSKE7jHJLe3bF8EWnlUbA~k4kDIHBkLcpHNd8s6~BRUlFSKQz4nFtInapg3yjU348uJgadGCrocb~CPeZgodjFv31U3XLN0mZKczbjzAvIX~N~UVkb53EQ00x~atKsh30DquBPWFY8uWlEmAoylVk4BgIdC7VsCpswzHC2pA3LbwC4AQ__'

export const ProductShowcaseBlock: React.FC<ProductShowcaseBlockType> = ({
  sectionTitle,
  sectionSubtitle,
  products,
}) => {
  let imgUrl = PRODUCTS_IMG
  if (products && products.length > 0) {
    const firstProduct = products[0]
    if (firstProduct.image && typeof firstProduct.image === 'object' && firstProduct.image.url) {
      imgUrl = firstProduct.image.url
    }
  }

  return (
    <section className="py-12 lg:py-20 bg-gray-50">
      <div className="container">
        <ScrollReveal duration={600}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Image */}
            <div className="overflow-hidden rounded-sm">
              <img
                src={imgUrl}
                alt="产品和解决方案"
                className="w-full h-[240px] lg:h-[320px] object-cover"
              />
            </div>

            {/* Right: Content */}
            <div className="flex flex-col items-start">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {sectionTitle || '产品和解决方案'}
              </h2>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-md">
                {sectionSubtitle ||
                  '基于自主研发的智能纤维传感技术，为工业、医疗、汽车等领域提供全方位的解决方案。'}
              </p>
              <Link
                href="/products"
                className="mt-6 px-6 h-10 text-sm font-medium bg-primary text-primary-foreground rounded-md flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                了解更多
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
