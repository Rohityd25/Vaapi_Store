'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { useUIStore } from '@/store/ui'
import { useWishlistStore } from '@/store/wishlist'

// ─── Nav category data ───────────────────────────────────────────────────────
const NAV_CATEGORIES = [
  {
    label: 'Men',
    href: '/collections/men',
    megaMenu: {
      featured: [
        { label: 'New Arrivals', href: '/collections/men-new-arrivals' },
        { label: 'Bestsellers', href: '/collections/men-bestsellers' },
        { label: 'Sale', href: '/collections/men-sale', badge: 'HOT' },
      ],
      categories: [
        {
          title: 'Tops',
          items: [
            { label: 'T-Shirts', href: '/collections/men-tshirts' },
            { label: 'Shirts', href: '/collections/men-shirts' },
            { label: 'Sweatshirts', href: '/collections/men-sweatshirts' },
            { label: 'Hoodies', href: '/collections/men-hoodies' },
            { label: 'Polos', href: '/collections/men-polos' },
          ],
        },
        {
          title: 'Bottoms',
          items: [
            { label: 'Jeans', href: '/collections/men-jeans' },
            { label: 'Joggers', href: '/collections/men-joggers' },
            { label: 'Shorts', href: '/collections/men-shorts' },
            { label: 'Track Pants', href: '/collections/men-track-pants' },
          ],
        },
        {
          title: 'Accessories',
          items: [
            { label: 'Caps', href: '/collections/men-caps' },
            { label: 'Bags', href: '/collections/men-bags' },
            { label: 'Belts', href: '/collections/men-belts' },
          ],
        },
      ],
    },
  },
  {
    label: 'Women',
    href: '/collections/women',
    megaMenu: {
      featured: [
        { label: 'New Arrivals', href: '/collections/women-new-arrivals' },
        { label: 'Bestsellers', href: '/collections/women-bestsellers' },
        { label: 'Sale', href: '/collections/women-sale', badge: 'HOT' },
      ],
      categories: [
        {
          title: 'Tops',
          items: [
            { label: 'T-Shirts', href: '/collections/women-tshirts' },
            { label: 'Crop Tops', href: '/collections/women-crop-tops' },
            { label: 'Sweatshirts', href: '/collections/women-sweatshirts' },
            { label: 'Hoodies', href: '/collections/women-hoodies' },
          ],
        },
        {
          title: 'Bottoms',
          items: [
            { label: 'Jeans', href: '/collections/women-jeans' },
            { label: 'Joggers', href: '/collections/women-joggers' },
            { label: 'Skirts', href: '/collections/women-skirts' },
          ],
        },
        {
          title: 'Sets',
          items: [
            { label: 'Co-ord Sets', href: '/collections/women-coord-sets' },
            { label: 'Loungewear', href: '/collections/women-loungewear' },
          ],
        },
      ],
    },
  },
  {
    label: 'Unisex',
    href: '/collections/unisex',
    megaMenu: null,
  },
  {
    label: 'Sale',
    href: '/collections/sale',
    megaMenu: null,
    highlight: true,
  },
  {
    label: 'Blog',
    href: '/blog',
    megaMenu: null,
  },
]

// ─── Search Bar ──────────────────────────────────────────────────────────────
function SearchBar({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '120px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          width: '90%',
          maxWidth: '600px',
          boxShadow: 'var(--shadow-xl)',
          animation: 'scaleIn 0.2s ease both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands, styles..."
              style={{
                flex: 1,
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                border: 'none',
                outline: 'none',
                color: 'var(--color-text-primary)',
              }}
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>
                ✕
              </button>
            )}
          </div>
        </form>
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Popular searches</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['Oversized T-shirts', 'Hoodies', 'Joggers', 'Co-ord Sets'].map((term) => (
              <button
                key={term}
                onClick={() => { setQuery(term); }}
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.375rem 0.875rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Mega Menu ───────────────────────────────────────────────────────────────
function MegaMenu({ megaMenu }: { megaMenu: (typeof NAV_CATEGORIES)[0]['megaMenu'] }) {
  if (!megaMenu) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'white',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        padding: '1.5rem',
        minWidth: '620px',
        display: 'grid',
        gridTemplateColumns: `1fr 1fr 1fr 1fr`,
        gap: '1.5rem',
        zIndex: 100,
        animation: 'scaleIn 0.15s ease both',
      }}
    >
      {/* Featured */}
      <div>
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Featured
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {megaMenu.featured.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                padding: '0.375rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'background var(--transition-fast)',
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              {item.label}
              {'badge' in item && (
                <span className="badge-sale" style={{ fontSize: '9px', padding: '1px 5px' }}>{item.badge}</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      {megaMenu.categories.map((cat) => (
        <div key={cat.title}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            {cat.title}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {cat.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all var(--transition-fast)',
                  display: 'block',
                }}
                onMouseOver={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--color-surface-2)'
                  el.style.color = 'var(--color-text-primary)'
                }}
                onMouseOut={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.color = 'var(--color-text-secondary)'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────
export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())
  const toggleCart = useCartStore((s) => s.toggleCart)
  const wishlistCount = useWishlistStore((s) => s.items.length)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 'var(--nav-height)',
          background: scrolled ? 'rgba(255,255,255,0.96)' : 'white',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
          transition: 'all var(--transition-normal)',
        }}
      >
        <div
          className="container-narrow"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '1.625rem',
              letterSpacing: '-0.03em',
              color: 'var(--color-brand-primary)',
              flexShrink: 0,
            }}
          >
            VAAPI<span style={{ color: 'var(--color-brand-accent)' }}>.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1, justifyContent: 'center' }} className="hidden-mobile">
            {NAV_CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => cat.megaMenu && setActiveMenu(cat.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={cat.href}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: cat.highlight ? 'var(--color-brand-accent)' : 'var(--color-text-primary)',
                    padding: '0.5rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    transition: 'all var(--transition-fast)',
                    background: activeMenu === cat.label ? 'var(--color-surface-2)' : 'transparent',
                  }}
                >
                  {cat.label}
                  {cat.megaMenu && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: activeMenu === cat.label ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }}>
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Link>
                {activeMenu === cat.label && <MegaMenu megaMenu={cat.megaMenu} />}
              </div>
            ))}
          </nav>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
            {/* Search */}
            <button
              id="search-button"
              onClick={() => setSearchOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                transition: 'background var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-3)' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              aria-label="Search"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              id="wishlist-button"
              style={{
                position: 'relative',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                transition: 'background var(--transition-fast)',
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-3)' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              aria-label="Wishlist"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {mounted && wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  background: 'var(--color-brand-accent)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              id="account-button"
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                transition: 'background var(--transition-fast)',
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-3)' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              aria-label="My Account"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            {/* Cart */}
            <button
              id="cart-button"
              onClick={toggleCart}
              style={{
                position: 'relative',
                background: 'var(--color-brand-primary)',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'all var(--transition-fast)',
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#2d2d4a' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-brand-primary)' }}
              aria-label={`Cart — ${mounted ? itemCount : 0} items`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {mounted && itemCount > 0 && (
                <span style={{
                  background: 'var(--color-brand-accent)',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                color: 'var(--color-text-primary)',
              }}
              className="show-mobile"
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                ) : (
                  <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: 'calc(var(--promo-bar-height) + var(--nav-height))',
            background: 'white',
            zIndex: 45,
            overflowY: 'auto',
            borderTop: '1px solid var(--color-border)',
            animation: 'slideInLeft 0.25s ease both',
          }}
        >
          <nav style={{ padding: '1rem' }}>
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: cat.highlight ? 'var(--color-brand-accent)' : 'var(--color-text-primary)',
                  padding: '1rem',
                  borderBottom: '1px solid var(--color-surface-3)',
                }}
              >
                {cat.label}
              </Link>
            ))}
            <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/account" className="btn btn-outline btn-full" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
              <Link href="/account/wishlist" className="btn btn-ghost btn-full" onClick={() => setMobileMenuOpen(false)}>❤️ Wishlist ({wishlistCount})</Link>
            </div>
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
