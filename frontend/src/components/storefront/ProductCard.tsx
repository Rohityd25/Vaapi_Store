'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'

export interface ProductCardProps {
  id: string
  title: string
  slug: string
  brand?: string | null
  basePrice: number
  compareAtPrice?: number | null
  imageUrl?: string | null
  secondaryImageUrl?: string | null
  isBestseller?: boolean
  isNewArrival?: boolean
  rating?: number
  reviewsCount?: number
  defaultVariant?: {
    id: string
    sku: string
    size: string
    color: string
    colorHex?: string | null
    price: number
    stock: number
  }
}

export function ProductCard({
  id,
  title,
  slug,
  brand,
  basePrice,
  compareAtPrice,
  imageUrl,
  secondaryImageUrl,
  isBestseller,
  isNewArrival,
  rating = 4.5,
  reviewsCount = 18,
  defaultVariant,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const isSaved = isInWishlist(id)

  const discountPercent = compareAtPrice && compareAtPrice > basePrice
    ? Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)
    : 0

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!defaultVariant) {
      window.location.href = `/products/${slug}`
      return
    }

    addItem({
      id: defaultVariant.id,
      product: {
        id,
        title,
        slug,
        imageUrl: imageUrl || undefined,
      },
      variant: {
        id: defaultVariant.id,
        sku: defaultVariant.sku,
        size: defaultVariant.size,
        color: defaultVariant.color,
        colorHex: defaultVariant.colorHex || undefined,
        price: defaultVariant.price || basePrice,
        stock: defaultVariant.stock || 10,
      },
    })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      productId: id,
      title,
      slug,
      imageUrl: imageUrl || undefined,
      basePrice,
      compareAtPrice: compareAtPrice || undefined,
    })
  }

  const displayImage = isHovered && secondaryImageUrl ? secondaryImageUrl : imageUrl

  return (
    <div
      className="product-card"
      style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {discountPercent > 0 && <span className="badge-sale">{discountPercent}% OFF</span>}
        {isBestseller && <span className="badge-bestseller">BESTSELLER</span>}
        {isNewArrival && <span className="badge-new">NEW</span>}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        aria-label="Add to wishlist"
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 2,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(4px)',
          border: 'none',
          borderRadius: '50%',
          width: '34px',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={isSaved ? 'var(--color-brand-accent)' : 'none'}
          stroke={isSaved ? 'var(--color-brand-accent)' : '#444'}
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Image container */}
      <Link href={`/products/${slug}`} style={{ position: 'relative', width: '100%', paddingTop: '125%', background: '#f5f5f7', display: 'block', overflow: 'hidden' }}>
        {displayImage ? (
          <Image
            src={displayImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#ccc' }}>
            👕
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {brand && (
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
              {brand}
            </p>
          )}

          <Link href={`/products/${slug}`}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '6px', lineHeight: 1.3 }} className="line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-brand-gold)', fontSize: '0.8125rem' }}>★ {rating.toFixed(1)}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({reviewsCount})</span>
          </div>
        </div>

        {/* Price & Quick Add */}
        <div style={{ paddingTop: '8px', borderTop: '1px solid var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--color-brand-primary)', fontFamily: 'var(--font-display)' }}>
                ₹{basePrice.toLocaleString('en-IN')}
              </span>
              {compareAtPrice && compareAtPrice > basePrice && (
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                  ₹{compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.6875rem', color: '#16a34a', fontWeight: 600 }}>Buy 2 @ ₹{(basePrice * 0.9).toFixed(0)} each</span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="btn btn-sm btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}
