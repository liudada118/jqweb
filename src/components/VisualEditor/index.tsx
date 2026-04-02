import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
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
      <DefaultTemplate
        i18n={initPageResult.req.i18n}
        locale={initPageResult.locale}
        params={params}
        payload={payload}
        permissions={initPageResult.permissions}
        searchParams={searchParams}
        user={undefined}
        visibleEntities={initPageResult.visibleEntities}
      >
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>请先登录</h2>
          <p>您需要登录后才能使用可视化编辑器。</p>
        </div>
      </DefaultTemplate>
    )
  }

  // We'll fetch pages client-side via the REST API
  // Pass the base URL so the client can build iframe URLs
  const baseUrl = getServerSideURL()

  // Get initial pages list from the server
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
      initPageResult={initPageResult}
      params={params}
      searchParams={searchParams}
    />
  )
}

// Async wrapper to resolve the promise
async function VisualEditorWrapper({
  pagesPromise,
  baseUrl,
  initPageResult,
  params,
  searchParams,
}: {
  pagesPromise: Promise<any>
  baseUrl: string
  initPageResult: any
  params: any
  searchParams: any
}) {
  const pagesResult = await pagesPromise
  const pages = pagesResult.docs.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
  }))

  return (
    <div style={{ margin: '-20px', marginTop: '-40px' }}>
      <VisualEditorClient
        initialPages={pages}
        initialSlug="home"
        baseUrl={baseUrl}
      />
    </div>
  )
}
