'use client'

import { useWishlistStore } from '@/store/wishlist'
import Link from 'next/link'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()

  return (
    <div style={{ padding: '3rem 0', background: 'var(--color-surface-2)', minHeight: '85vh' }}>
      <div className="container-narrow" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
              MY WISHLIST ({items.length})
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Your saved streetwear items for quick access</p>
          </div>
          <Link href="/account" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-brand-accent)' }}>
            ← Back to Account
          </Link>
        </div>

        {items.length === 0 ? (
          <div style={{ background: 'white', padding: '4rem 2rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>💔</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Explore our collections and save your favorite tees & hoodies.</p>
            <Link href="/" className="btn btn-accent btn-md">
              BROWSE COLLECTIONS →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {items.map((item: any) => (
              <div key={item.id} style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-brand-accent)' }}>₹{item.price}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <Link href={`/products/${item.slug || 'sample'}`} className="btn btn-accent btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                    View Product
                  </Link>
                  <button onClick={() => removeItem(item.id)} className="btn btn-outline btn-sm" style={{ color: '#b91c1c' }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
