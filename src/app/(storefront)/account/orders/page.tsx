'use client'

import Link from 'next/link'

export default function UserOrdersPage() {
  const sampleOrders = [
    { id: '1', orderNumber: 'VAAPI-89214', total: 2498, status: 'CONFIRMED', date: '24 Jul 2026', items: ['Aura Oversized Acid Wash T-Shirt (XL)'] },
  ]

  return (
    <div style={{ padding: '3rem 0', background: 'var(--color-surface-2)', minHeight: '85vh' }}>
      <div className="container-narrow" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
              MY ORDERS
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Track orders and delivery status</p>
          </div>
          <Link href="/account" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-brand-accent)' }}>
            ← Back to Account
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sampleOrders.map((ord) => (
            <div key={ord.id} style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--color-surface-3)', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1rem' }}>#{ord.orderNumber}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Ordered on {ord.date}</span>
                </div>
                <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 700, background: '#fef9c3', color: '#854d0e' }}>
                  {ord.status}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                {ord.items.map((item, idx) => (
                  <div key={idx}>• {item}</div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '1.125rem', fontFamily: 'var(--font-display)' }}>Total: ₹{ord.total}</span>
                <button className="btn btn-outline btn-sm">Track Package 🚚</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
