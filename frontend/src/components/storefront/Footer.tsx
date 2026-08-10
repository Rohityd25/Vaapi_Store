'use client'

import Link from 'next/link'
import { Logo } from '@/components/common/Logo'

export function Footer() {
  return (
    <footer style={{ background: '#0d0d18', color: '#9ca3af', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container-narrow">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <Logo variant="dark" height={58} />
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              ATTUS — Premium streetwear & fashion. Crafted with 240+ GSM heavyweight cotton and signature oversized cuts.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {['Instagram', 'Twitter', 'Facebook', 'YouTube'].map((social) => (
                <a key={social} href="#" style={{ color: 'white', fontSize: '0.8125rem', padding: '6px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)' }}>
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              CATEGORIES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><Link href="/collections/men-tshirts">Oversized T-Shirts</Link></li>
              <li><Link href="/collections/men-hoodies">Hoodies & Sweatshirts</Link></li>
              <li><Link href="/collections/men-joggers">Cargo Joggers</Link></li>
              <li><Link href="/collections/women">Women Collection</Link></li>
              <li><Link href="/collections/sale">End of Season Sale</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              HELP & POLICIES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li><Link href="/account/orders">Track Order</Link></li>
              <li><Link href="/pages/shipping-policy">Shipping Policy</Link></li>
              <li><Link href="/pages/return-policy">Returns & Exchange</Link></li>
              <li><Link href="/pages/size-guide">Size Guide</Link></li>
              <li><Link href="/pages/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              JOIN THE CLUB
            </h4>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              Subscribe to get 10% OFF on your first order and exclusive access to secret drops.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                style={{
                  flex: 1,
                  padding: '0.625rem 0.875rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <button type="submit" className="btn btn-accent btn-sm">JOIN</button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
          }}
        >
          <p>© {new Date().getFullYear()} ATTUS FASHION PVT LTD. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>💳 UPI / Cards / COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
