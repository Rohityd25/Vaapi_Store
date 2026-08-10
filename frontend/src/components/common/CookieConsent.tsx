'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('vaapi-cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('vaapi-cookie-consent', 'accepted')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '1.5rem',
        right: '1.5rem',
        maxWidth: '540px',
        background: 'var(--color-brand-primary)',
        color: 'white',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
      className="animate-slide-in-right"
    >
      <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
        🍪 We use cookies to enhance your shopping experience, analyze site traffic, and deliver personalized streetwear recommendations. Learn more in our{' '}
        <Link href="/privacy" style={{ color: 'var(--color-brand-accent)', textDecoration: 'underline' }}>
          Privacy Policy
        </Link>.
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button
          onClick={acceptCookies}
          className="btn btn-accent btn-sm"
          style={{ padding: '0.5rem 1.25rem' }}
        >
          ACCEPT COOKIES
        </button>
      </div>
    </div>
  )
}
