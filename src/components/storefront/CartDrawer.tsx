'use client'

import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import Image from 'next/image'

function formatPrice(p: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, total, couponCode, couponDiscount } = useCartStore()
  const sub = subtotal()
  const tot = total()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="overlay"
        onClick={closeCart}
        style={{ zIndex: 60 }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100dvh',
          width: 'min(420px, 100vw)',
          background: 'white',
          zIndex: 70,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-cart)',
          animation: 'slideInRight 0.3s ease both',
        }}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700 }}>
              My Cart
            </h2>
            <span style={{
              background: 'var(--color-brand-accent)',
              color: 'white',
              borderRadius: 'var(--radius-full)',
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
            }}>
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'var(--color-surface-2)',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem',
              color: 'var(--color-text-secondary)',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-3)' }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)' }}
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Free shipping progress */}
        {sub < 999 && (
          <div style={{ padding: '0.875rem 1.5rem', background: 'var(--color-surface-2)', flexShrink: 0 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
              Add <strong style={{ color: 'var(--color-brand-accent)' }}>{formatPrice(999 - sub)}</strong> more for FREE shipping!
            </p>
            <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min((sub / 999) * 100, 100)}%`,
                background: 'var(--color-brand-accent)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}
        {sub >= 999 && (
          <div style={{ padding: '0.75rem 1.5rem', background: '#f0fdf4', flexShrink: 0 }}>
            <p style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>✓ You qualify for FREE shipping!</p>
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem' }}>🛍️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem' }}>Your cart is empty</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Add some items to get started</p>
              <button onClick={closeCart} className="btn btn-primary">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  {/* Image */}
                  <div style={{ width: '80px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, background: 'var(--color-surface-3)' }}>
                    {item.product.imageUrl ? (
                      <Image src={item.product.imageUrl} alt={item.product.title} width={80} height={100} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👕</div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/products/${item.product.slug}`} onClick={closeCart}>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', lineHeight: '1.3', marginBottom: '0.25rem' }} className="line-clamp-2">
                        {item.product.title}
                      </h4>
                    </Link>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.625rem' }}>
                      Size: {item.variant.size} &nbsp;|&nbsp;
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        Color:
                        <span style={{ width: '10px', height: '10px', background: item.variant.colorHex || item.variant.color, borderRadius: '50%', border: '1px solid var(--color-border)', display: 'inline-block' }} />
                        {item.variant.color}
                      </span>
                    </p>

                    {/* Quantity + Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ width: '32px', height: '32px', background: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--transition-fast)' }}
                          onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)' }}
                          onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'white' }}
                          aria-label="Decrease quantity"
                        >−</button>
                        <span style={{ padding: '0 10px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.875rem', minWidth: '32px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ width: '32px', height: '32px', background: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--transition-fast)' }}
                          disabled={item.quantity >= item.variant.stock}
                          onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)' }}
                          onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'white' }}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-brand-primary)' }}>
                          {formatPrice(item.variant.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', transition: 'all var(--transition-fast)', display: 'flex', alignItems: 'center' }}
                          onMouseOver={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = '#ef4444'; el.style.background = '#fef2f2' }}
                          onMouseOut={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--color-text-muted)'; el.style.background = 'transparent' }}
                          aria-label="Remove item"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ borderTop: '1px solid var(--color-border)', padding: '1.25rem 1.5rem', flexShrink: 0 }}>
            {/* Coupon applied */}
            {couponCode && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '0.625rem 0.875rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>🎉 Coupon "{couponCode}" applied</span>
                <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>-{formatPrice(couponDiscount)}</span>
              </div>
            )}

            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{formatPrice(sub)}</span>
            </div>
            {couponDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#16a34a', fontSize: '0.875rem' }}>Discount</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#16a34a' }}>-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem', color: 'var(--color-brand-primary)' }}>{formatPrice(tot)}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem', textAlign: 'center' }}>
              Shipping calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn btn-accent btn-full btn-lg"
              style={{ justifyContent: 'center', marginBottom: '0.75rem' }}
            >
              Proceed to Checkout →
            </Link>
            <button onClick={closeCart} className="btn btn-ghost btn-full">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
