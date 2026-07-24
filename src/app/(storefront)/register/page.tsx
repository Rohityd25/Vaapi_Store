'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      })

      let data: any = {}
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await res.json()
      } else {
        const text = await res.text()
        data = { error: text || `Server error (${res.status})` }
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register account')
      }

      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '5rem 0', background: 'var(--color-surface-2)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ maxWidth: '460px', width: '100%' }}>
        <div style={{ background: 'white', padding: '2.5rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            CREATE AN ACCOUNT
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
            Join VAAPI Comfort for exclusive drops & instant tracking
          </p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>FULL NAME</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Rohan Sharma" className="input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>EMAIL ADDRESS</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rohan@example.com" className="input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>PHONE NUMBER</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>PASSWORD</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" className="input" />
            </div>

            <button type="submit" disabled={loading} className="btn btn-accent btn-lg btn-full" style={{ marginTop: '0.5rem' }}>
              {loading ? 'CREATING ACCOUNT...' : 'REGISTER ACCOUNT →'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            Already registered?{' '}
            <Link href="/login" style={{ color: 'var(--color-brand-accent)', fontWeight: 700 }}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
