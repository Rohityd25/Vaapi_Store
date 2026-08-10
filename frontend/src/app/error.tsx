'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled Store Error:', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface-2)',
        padding: '3rem 1rem',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '500px' }}>
        <span
          style={{
            fontSize: '4rem',
            lineHeight: 1,
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          ⚠️
        </span>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          SOMETHING WENT WRONG
        </h1>
        <p
          style={{
            color: 'var(--color-text-muted)',
            marginBottom: '2rem',
            fontSize: '0.9375rem',
          }}
        >
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => reset()} className="btn btn-accent btn-lg">
            TRY AGAIN
          </button>
          <Link href="/" className="btn btn-outline btn-lg">
            GO TO HOMEPAGE
          </Link>
        </div>
      </div>
    </div>
  )
}
