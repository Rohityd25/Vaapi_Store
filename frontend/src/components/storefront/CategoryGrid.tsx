'use client'

import Link from 'next/link'
import Image from 'next/image'

const CATEGORIES = [
  {
    title: 'OVERSIZED TEES',
    subtitle: '240 GSM Heavyweight Cotton',
    href: '/collections/men-tshirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    gridSpan: 'col-span-1 md:col-span-2',
  },
  {
    title: 'HOODIES & SWEATS',
    subtitle: 'Ultra-warm Fleece & Puff Prints',
    href: '/collections/men-hoodies',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    gridSpan: 'col-span-1',
  },
  {
    title: 'CARGO & JOGGERS',
    subtitle: 'Multi-pocket Tactical Fits',
    href: '/collections/men-joggers',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80',
    gridSpan: 'col-span-1',
  },
  {
    title: 'WOMEN STREETWEAR',
    subtitle: 'Crop Tops, Co-ords & Loungewear',
    href: '/collections/women',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    gridSpan: 'col-span-1 md:col-span-2',
  },
]

export function CategoryGrid() {
  return (
    <section style={{ padding: '4rem 0', background: 'var(--color-surface-2)' }}>
      <div className="container-narrow">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            SHOP BY CATEGORY
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
            Curated streetwear essentials built for durability and style
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              style={{
                position: 'relative',
                height: '320px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                display: 'block',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
                className="category-tile-img"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  color: 'white',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#d1d5db', marginBottom: '12px' }}>{cat.subtitle}</p>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-brand-accent)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  EXPLORE CATEGORY →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .category-tile-img:hover {
          transform: scale(1.06);
        }
      `}</style>
    </section>
  )
}
