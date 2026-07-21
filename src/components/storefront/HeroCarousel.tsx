'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface BannerItem {
  id: string
  title: string
  subtitle?: string | null
  imageUrl: string
  linkUrl?: string | null
  ctaText?: string | null
}

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: '1',
    title: 'DROP 04: ACID SURREALISM',
    subtitle: 'Heavyweight Oversized Tees & Graphic Hoodies crafted for maximum comfort',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
    linkUrl: '/collections/men-tshirts',
    ctaText: 'EXPLORE DROP',
  },
  {
    id: '2',
    title: 'END OF SEASON STREET SALE',
    subtitle: 'Up to 60% OFF on Bestsellers & Co-ord Sets',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
    linkUrl: '/collections/sale',
    ctaText: 'SHOP SALE',
  },
]

export function HeroCarousel({ banners = DEFAULT_BANNERS }: { banners?: BannerItem[] }) {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  const active = banners[activeIdx] || DEFAULT_BANNERS[0]

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - var(--nav-height) - var(--promo-bar-height))',
        maxHeight: '650px',
        minHeight: '420px',
        background: '#0a0a12',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.65, transition: 'opacity 0.8s ease' }}>
        <Image
          src={active.imageUrl}
          alt={active.title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(10,10,18,0.85) 0%, rgba(10,10,18,0.4) 60%, rgba(10,10,18,0.1) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="container-narrow"
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'white',
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: '640px', animation: 'fadeIn 0.5s ease both' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: 'var(--color-brand-accent)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              marginBottom: '1rem',
              fontFamily: 'var(--font-display)',
            }}
          >
            NEW COLLECTION
          </span>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {active.title}
          </h1>

          {active.subtitle && (
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: '#d1d5db',
                marginBottom: '2rem',
                lineHeight: 1.5,
              }}
            >
              {active.subtitle}
            </p>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href={active.linkUrl || '/collections/all'}
              className="btn btn-accent btn-lg"
              style={{ boxShadow: '0 8px 25px rgba(233,69,96,0.4)' }}
            >
              {active.ctaText || 'SHOP NOW'} →
            </Link>
            <Link href="/collections/all" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'white' }}>
              VIEW ALL DROPS
            </Link>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 3,
          }}
        >
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: activeIdx === i ? '28px' : '10px',
                height: '10px',
                borderRadius: '50%',
                background: activeIdx === i ? 'var(--color-brand-accent)' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
