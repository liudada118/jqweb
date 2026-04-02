import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { BackToTopButton } from './BackToTop'
import { ContactAnimation } from './ContactAnimation'

const contactLinks = [
  { label: '问答', href: '/about' },
  { label: '联系', href: '/contact' },
  { label: '加入我们', href: '/contact' },
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
          <div className="grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="mb-4 text-sm font-bold text-white">解决方案</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/customsolutions"
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    柔性拉高压力传感
                  </Link>
                </li>
                <li>
                  <Link
                    href="/care"
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    柔性金属监测系统
                  </Link>
                </li>
                <li>
                  <Link
                    href="/precision"
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    汽车座椅智能性分析系统
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold text-white">关于柜侨工业</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/contact"
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    联系我们
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    公司简介
                  </Link>
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
