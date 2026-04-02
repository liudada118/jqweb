import type { AdminViewServerProps } from 'payload'
import React from 'react'
import { VisualEditorClient } from './VisualEditorClient'
import { getServerSideURL } from '@/utilities/getURL'

export function VisualEditorView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const {
    req: { user, payload },
  } = initPageResult

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>请先登录</h2>
        <p>您需要登录后才能使用可视化编辑器。</p>
        <a href="/admin" style={{ color: '#3b82f6' }}>返回登录</a>
      </div>
    )
  }

  const baseUrl = getServerSideURL()

  const pagesPromise = payload.find({
    collection: 'pages',
    limit: 50,
    sort: 'title',
    select: {
      title: true,
      slug: true,
    },
  })

  return (
    <VisualEditorWrapper
      pagesPromise={pagesPromise}
      baseUrl={baseUrl}
    />
  )
}

async function VisualEditorWrapper({
  pagesPromise,
  baseUrl,
}: {
  pagesPromise: Promise<any>
  baseUrl: string
}) {
  const pagesResult = await pagesPromise
  const pages = pagesResult.docs.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
  }))

  return (
    <VisualEditorClient
      initialPages={pages}
      initialSlug="home"
      baseUrl={baseUrl}
    />
  )
}
