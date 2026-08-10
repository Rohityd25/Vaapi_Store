'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'

export function ProductDetailClient({ product }: { product: any }) {
  const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.url || '')
  const [selectedColor, setSelectedColor] = useState(product.variants?.[0]?.color || '')
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.size || '')
  const [quantity, setQuantity] = useState(1)
  const [showSizeChart, setShowSizeChart] = useState(false)

  const addItem = useCartStore((s) => s.addItem)

  // Find active variant
  const activeVariant = product.variants?.find(
    (v: any) => v.color === selectedColor && v.size === selectedSize
  ) || product.variants?.[0]

  // Available unique colors and sizes
  const colors = Array.from(new Set(product.variants?.map((v: any) => v.color)))
  const sizes = Array.from(new Set(product.variants?.map((v: any) => v.size)))

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.basePrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0

  const handleAddToCart = () => {
    if (!activeVariant) return

    addItem(
      {
        id: activeVariant.id,
        product: {
          id: product.id,
          title: product.title,
          slug: product.slug,
          imageUrl: selectedImage || product.images?.[0]?.url,
        },
        variant: {
          id: activeVariant.id,
          sku: activeVariant.sku,
          size: activeVariant.size,
          color: activeVariant.color,
          colorHex: activeVariant.colorHex,
          price: activeVariant.price || product.basePrice,
          stock: activeVariant.stock,
        },
      },
      quantity
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
      {/* Image Gallery */}
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'row-reverse' }}>
        {/* Main Image */}
        <div style={{ flex: 1, position: 'relative', paddingTop: '125%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: '#f5f5f7', border: '1px solid var(--color-border)' }}>
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👕</div>
          )}

          {discountPercent > 0 && (
            <span className="badge-sale" style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '0.8125rem', padding: '4px 12px' }}>
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '80px', flexShrink: 0 }}>
            {product.images.map((img: any) => (
              <button
                key={img.id || img.url}
                onClick={() => setSelectedImage(img.url)}
                style={{
                  position: 'relative',
                  width: '80px',
                  height: '100px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: selectedImage === img.url ? '2px solid var(--color-brand-accent)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  background: 'none',
                  padding: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                <Image src={img.url} alt="Thumbnail" fill style={{ objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Form */}
      <div>
        {product.brand && (
          <p style={{ color: 'var(--color-brand-accent)', fontSize: '0.8125rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            {product.brand}
          </p>
        )}

        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: 'var(--color-brand-primary)', lineHeight: 1.2, marginBottom: '1rem' }}>
          {product.title}
        </h1>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ background: 'var(--color-brand-primary)', color: 'white', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', fontWeight: 700 }}>
            ★ 4.9
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Based on 42 verified reviews</span>
        </div>

        {/* Price & Bundle */}
        <div style={{ padding: '1.25rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-brand-primary)', fontFamily: 'var(--font-display)' }}>
              ₹{product.basePrice.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.875rem' }}>Inclusive of all taxes</span>
          </div>

          <div style={{ background: 'white', border: '1px dashed var(--color-brand-accent)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🎁</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
              BUY 2 @ ₹{(product.basePrice * 0.9).toFixed(0)} EACH — Save extra 10%
            </span>
          </div>
        </div>

        {/* Color Selector */}
        {colors.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              COLOR: <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>{selectedColor}</span>
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {colors.map((c: any) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedColor === c ? '2px solid var(--color-brand-accent)' : '1px solid var(--color-border)',
                    background: selectedColor === c ? 'var(--color-surface-2)' : 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selector + Size Chart Modal Link */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase' }}>
              SELECT SIZE: <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>{selectedSize}</span>
            </label>
            <button
              onClick={() => setShowSizeChart(true)}
              style={{ background: 'none', border: 'none', color: 'var(--color-brand-accent)', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              📏 Size Guide
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {sizes.map((s: any) => {
              const variant = product.variants?.find((v: any) => v.size === s && v.color === selectedColor)
              const outOfStock = variant ? variant.stock <= 0 : false

              return (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  disabled={outOfStock}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedSize === s ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                    background: selectedSize === s ? 'var(--color-brand-primary)' : 'white',
                    color: selectedSize === s ? 'white' : outOfStock ? '#ccc' : 'var(--color-text-primary)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    cursor: outOfStock ? 'not-allowed' : 'pointer',
                    textDecoration: outOfStock ? 'line-through' : 'none',
                  }}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        {/* Stock Alert */}
        <div style={{ marginBottom: '1.5rem' }}>
          {activeVariant && activeVariant.stock > 0 ? (
            <p style={{ color: activeVariant.stock <= 5 ? 'var(--color-brand-accent)' : '#16a34a', fontSize: '0.875rem', fontWeight: 600 }}>
              {activeVariant.stock <= 5 ? `🔥 Only ${activeVariant.stock} items left in stock!` : '✓ In Stock — Ready to ship'}
            </p>
          ) : (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 600 }}>❌ Sold Out in selected variant</p>
          )}
        </div>

        {/* Quantity & CTA */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '40px', height: '48px', background: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}>-</button>
            <span style={{ width: '40px', textAlign: 'center', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} style={{ width: '40px', height: '48px', background: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+</button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!activeVariant || activeVariant.stock <= 0}
            className="btn btn-accent btn-lg btn-full"
            style={{ height: '48px', fontSize: '1rem', flex: 1 }}
          >
            ADD TO BAG 🛍️
          </button>
        </div>

        {/* Description */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            PRODUCT DETAILS
          </h4>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{product.description}</p>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowSizeChart(false)}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', maxWidth: '500px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>SIZE CHART (INCHES)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                  <th style={{ padding: '8px' }}>Size</th>
                  <th style={{ padding: '8px' }}>Chest</th>
                  <th style={{ padding: '8px' }}>Length</th>
                  <th style={{ padding: '8px' }}>Shoulder</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}><td style={{ padding: '8px' }}>S</td><td>42"</td><td>28"</td><td>21"</td></tr>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}><td style={{ padding: '8px' }}>M</td><td>44"</td><td>29"</td><td>22"</td></tr>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}><td style={{ padding: '8px' }}>L</td><td>46"</td><td>30"</td><td>23"</td></tr>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}><td style={{ padding: '8px' }}>XL</td><td>48"</td><td>31"</td><td>24"</td></tr>
              </tbody>
            </table>
            <button onClick={() => setShowSizeChart(false)} className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  )
}
