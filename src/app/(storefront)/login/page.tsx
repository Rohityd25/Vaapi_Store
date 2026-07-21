'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError('Invalid email or password')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '5rem 0', background: 'var(--color-surface-2)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{ background: 'white', padding: '2.5rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            WELCOME BACK
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
            Log in to manage orders, addresses & wishlist
          </p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>EMAIL ADDRESS</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@vaapi.com" className="input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>PASSWORD</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input" />
            </div>

            <button type="submit" disabled={loading} className="btn btn-accent btn-lg btn-full" style={{ marginTop: '0.5rem' }}>
              {loading ? 'LOGGING IN...' : 'LOG IN →'}
            </button>
          </form>

          <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          </div>

          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl })}
            className="btn btn-outline btn-full"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span>🌐</span> Sign in with Google
          </button>

          <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: 'var(--color-brand-accent)', fontWeight: 700 }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
