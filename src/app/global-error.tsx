'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontFamily: 'system-ui, sans-serif',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>出错了</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            页面加载时发生了意外错误，请稍后重试。
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#1a1a2e',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            重新加载
          </button>
        </div>
      </body>
    </html>
  )
}
