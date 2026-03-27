import React from 'react'
import Link from 'next/link'
import type { NewsHighlightBlock as NewsHighlightBlockType } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

const defaultNewsItems = [
  {
    image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=300&fit=crop',
    title: '柜侨工业参加第八届国际纺织科技论坛',
    summary: '柜侨工业受邀参加第八届国际纺织科技论坛，展示最新纤维传感器技术成果。',
    href: '/brand-story',
  },
  {
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop',
    title: '新一代柔性压力传感器研发成功',
    summary: '经过两年的技术攻关，新一代柔性压力传感器已完成研发并进入量产阶段。',
    href: '/precision',
  },
  {
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    title: '无人机搭载纤维传感系统完成首飞',
    summary: '搭载柜侨纤维传感系统的工业无人机成功完成首次飞行测试。',
    href: '/custom/solutions',
  },
  {
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    title: '柜侨工业荣获年度创新企业奖',
    summary: '凭借在智能纤维领域的突出贡献，柜侨工业荣获年度创新企业大奖。',
    href: '/brand-story',
  },
  {
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    title: '智能纺织品在医疗健康领域的应用',
    summary: '柜侨智能纤维技术在人体健康监测领域取得重大突破，实现精准数据采集。',
    href: '/care',
  },
  {
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
    title: '与全球合作伙伴共建智能纤维生态',
    summary: '柜侨工业与多家国际企业签署战略合作协议，共同推动智能纤维产业发展。',
    href: '/products',
  },
]

export const NewsHighlightBlock: React.FC<NewsHighlightBlockType> = async ({
  sectionTitle,
  maxItems = 6,
}) => {
  let newsItems = defaultNewsItems

  try {
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      limit: typeof maxItems === 'number' ? maxItems : 6,
      sort: '-publishedAt',
      depth: 1,
      where: {
        _status: { equals: 'published' },
      },
    })

    if (posts.docs.length > 0) {
      newsItems = posts.docs.map((post: any) => {
        let image =
          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
        if (post.heroImage && typeof post.heroImage === 'object' && post.heroImage.url) {
          image = post.heroImage.url
        }
        return {
          image,
          title: post.title || '',
          summary: post.meta?.description || '',
          href: `/posts/${post.slug}`,
        }
      })
    }
  } catch (e) {
    // fallback to defaults
  }

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="container">
        {/* Section Title */}
        <ScrollReveal>
          <h2 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-10 lg:mb-14">
            {sectionTitle || '新闻资讯'}
          </h2>
        </ScrollReveal>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {newsItems.map((item, index) => (
            <ScrollReveal key={index} delay={index * 60}>
              <Link
                href={item.href}
                className="group block overflow-hidden rounded-sm bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 lg:p-5">
                  <h3 className="text-sm font-medium text-gray-800 leading-relaxed line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
