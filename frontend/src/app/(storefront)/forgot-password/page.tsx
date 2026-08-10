'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send reset email')
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '4rem 0', background: 'var(--color-surface-2)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            RESET PASSWORD
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          {submitted ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.9375rem' }}>
              <strong>Check your inbox! 📧</strong>
              <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.875rem' }}>
                If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <Link href="/login" className="btn btn-outline btn-full">
                  BACK TO LOGIN
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="input"
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-accent btn-lg btn-full" style={{ height: '48px' }}>
                {loading ? 'SENDING LINK...' : 'SEND RESET LINK →'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <Link href="/login" style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textDecoration: 'underline' }}>
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
