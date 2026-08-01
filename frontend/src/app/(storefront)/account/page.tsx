'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/account')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Loading account details...</p>
      </div>
    )
  }

  const user = session?.user || {
    name: 'Valued Customer',
    email: 'user@example.com',
    role: 'CUSTOMER',
  }

  return (
    <div style={{ padding: '3rem 0', background: 'var(--color-surface-2)', minHeight: '85vh' }}>
      <div className="container-narrow" style={{ maxWidth: '800px' }}>
        {/* Profile Card */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-brand-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MY PROFILE</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', margin: '0.25rem 0' }}>
              {user.name}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>{user.email}</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {user.role && user.role !== 'CUSTOMER' && (
              <Link href="/admin/dashboard" className="btn btn-accent btn-sm">
                ⚙️ Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="btn btn-outline btn-sm"
              style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Links / Sections Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <Link href="/account/orders" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'block', transition: 'all 0.2s ease' }}>
            <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.5rem' }}>📦</span>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>My Orders</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>Track shipments and view past purchases</p>
          </Link>

          <Link href="/account/wishlist" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'block', transition: 'all 0.2s ease' }}>
            <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.5rem' }}>❤️</span>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Wishlist</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>Your saved items & favorite streetwear</p>
          </Link>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.5rem' }}>📍</span>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Delivery Addresses</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>Manage saved addresses for quick checkout</p>
          </div>
        </div>
      </div>
    </div>
  )
}
