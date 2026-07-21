import Link from 'next/link'

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ orderNumber?: string }> }) {
  const awaitedSearchParams = await searchParams
  const orderNumber = awaitedSearchParams.orderNumber || 'VAAPI-89214'

  return (
    <div style={{ padding: '5rem 0', background: 'var(--color-surface-2)', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>

          <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
            PAYMENT CONFIRMED
          </span>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', margin: '0.5rem 0 1rem 0', fontFamily: 'var(--font-display)' }}>
            THANK YOU FOR YOUR ORDER!
          </h1>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            We've received your order <strong style={{ color: 'var(--color-brand-primary)' }}>#{orderNumber}</strong>. We're packing your drop right now and will update you via email/SMS once shipped.
          </p>

          <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '2rem', textAlign: 'left', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Order Number:</span>
              <strong style={{ fontFamily: 'var(--font-display)' }}>#{orderNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Estimated Delivery:</span>
              <strong>3-5 Business Days</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping Partner:</span>
              <strong>Shiprocket Express</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/account/orders" className="btn btn-primary btn-lg">
              TRACK MY ORDER
            </Link>
            <Link href="/" className="btn btn-outline btn-lg">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
