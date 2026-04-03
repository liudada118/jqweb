'use client'

import React, { useEffect } from 'react'

/**
 * BeforeDashboard component - automatically redirects to the Visual Editor
 * when the user accesses the Payload admin dashboard.
 */
const BeforeDashboard: React.FC = () => {
  useEffect(() => {
    // Redirect to visual editor immediately
    window.location.href = '/admin/visual-editor'
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e5e7eb',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: '14px', color: '#6b7280' }}>正在跳转到可视化编辑器...</p>
      <a
        href="/admin/visual-editor"
        style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'underline' }}
      >
        如果没有自动跳转，请点击这里
      </a>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default BeforeDashboard
