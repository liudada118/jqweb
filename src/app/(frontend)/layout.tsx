import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React, { Suspense } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { VisualEditorDetector } from '@/components/VisualEditor/VisualEditorDetector'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="zh-CN" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {/* 
            VisualEditorDetector is a client component that checks for ?ve=1 or iframe context.
            It hides the AdminBar, Header, Footer when in visual editor mode using CSS.
          */}
          <Suspense fallback={null}>
            <VisualEditorDetector />
          </Suspense>

          <div className="ve-chrome">
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
            <Header />
          </div>

          <main className="flex-1">{children}</main>

          <div className="ve-chrome">
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: '柜侨工业 | 精密工业解决方案',
    template: '%s | 柜侨工业',
  },
  description: '柜侨工业 - 专注精密工业设备与解决方案，提供高品质产品和专业服务',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@guiqiao',
  },
}
