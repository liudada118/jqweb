import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { BackToTopButton } from './BackToTop'
import { ContactAnimation } from './ContactAnimation'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  return (
    <>
      {/* Contact Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container">
          <ContactAnimation type="heading">
            <h2 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-8 lg:mb-12">
              请联系我们
            </h2>
          </ContactAnimation>
          <ContactAnimation type="content">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-3xl mx-auto">
              {['问答', '联系', '加入我们'].map((label, index) => (
                <a
                  key={index}
                  href="#"
                  className="h-12 lg:h-14 text-sm lg:text-base font-medium rounded-sm flex items-center justify-center hover:opacity-90 transition-opacity" style={{ backgroundColor: 'oklch(0.45 0.2 264)', color: '#ffffff' }}
                >
                  {label}
                </a>
              ))}
            </div>
          </ContactAnimation>
        </div>
      </section>

      {/* Back to Top */}
      <div className="py-4 bg-white">
        <div className="container flex justify-end">
          <BackToTopButton />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 lg:py-14">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-16 max-w-2xl">
            {/* Solutions Column */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">解决方案</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/custom/solutions"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    柔性拉高压力传感
                  </Link>
                </li>
                <li>
                  <Link
                    href="/care/solutions"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    柔性金属监测系统
                  </Link>
                </li>
                <li>
                  <Link
                    href="/custom/solutions"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    汽车座椅智能性分析系统
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">关于柜侨工业</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/brand-story"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    联系我们
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brand-story"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    公司简介
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 pt-6 border-t border-gray-800">
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
