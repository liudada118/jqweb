import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { BackToTopButton } from './BackToTop'
import { ContactAnimation } from './ContactAnimation'

const contactLinks = [
  { label: '问答', href: '/products' },
  { label: '联系', href: '/brand-story' },
  { label: '加入我们', href: '/brand-story' },
]

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  void footerData

  return (
    <>
      <section className="bg-white py-12 lg:py-20">
        <div className="container">
          <ContactAnimation type="heading">
            <h2 className="mb-8 text-center text-xl font-bold text-gray-900 lg:mb-12 lg:text-2xl">
              请联系我们
            </h2>
          </ContactAnimation>
          <ContactAnimation type="content">
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
              {contactLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex h-12 items-center justify-center rounded-sm text-sm font-medium text-white transition-opacity hover:opacity-90 lg:h-14 lg:text-base"
                  style={{ backgroundColor: 'oklch(0.45 0.2 264)' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </ContactAnimation>
        </div>
      </section>

      <div className="bg-white py-4">
        <div className="container flex justify-end">
          <BackToTopButton />
        </div>
      </div>

      <footer className="bg-gray-900 py-10 text-gray-300 lg:py-14">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Solutions Column */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-white">解决方案</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/care"
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    柔性压力传感
                  </Link>
                </li>
                <li>
                  <Link
                    href="/precision"
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    精密光纤监测系统
                  </Link>
                </li>
                <li>
                  <Link
                    href="/customsolutions"
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    定制化传感方案
                  </Link>
                </li>
              </ul>
            </div>

            {/* Products Column */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">产品中心</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/products"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    产品与解决方案
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    CU7+ 光纤传感器
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    ICU11 智能监测平台
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-white">关于柜侨工业</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/brand-story"
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    品牌故事
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brand-story"
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    公司简介
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    新闻资讯
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">联系我们</h3>
              <ul className="space-y-2.5">
                <li className="text-xs text-gray-400">
                  电话: +86-755-8888-6666
                </li>
                <li className="text-xs text-gray-400">
                  邮箱: info@guiqiao.com
                </li>
                <li className="text-xs text-gray-400">
                  地址: 中国广东省深圳市南山区
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-800 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} 柜侨工业. All rights reserved.
              </p>
              <ThemeSelector />
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
