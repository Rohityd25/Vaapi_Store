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
  const [sizeUnit, setSizeUnit] = useState<'in' | 'cm'>('in')

  // Pincode Estimator State
  const [pincode, setPincode] = useState('')
  const [deliveryResult, setDeliveryResult] = useState<{
    date: string
    codAvailable: boolean
    freeShipping: boolean
  } | null>(null)
  const [checkingPincode, setCheckingPincode] = useState(false)
  const [pincodeError, setPincodeError] = useState('')

  // Zoom / Lightbox State
  const [zoomActive, setZoomActive] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })

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

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pincode || pincode.trim().length !== 6 || isNaN(Number(pincode))) {
      setPincodeError('Please enter a valid 6-digit Indian pincode')
      setDeliveryResult(null)
      return
    }

    setPincodeError('')
    setCheckingPincode(true)

    // Simulate API delivery estimator (e.g., Shiprocket / Delhivery)
    setTimeout(() => {
      const today = new Date()
      const deliveryDate = new Date(today.setDate(today.getDate() + 3))
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })

      setDeliveryResult({
        date: formattedDate,
        codAvailable: true,
        freeShipping: product.basePrice >= 499,
      })
      setCheckingPincode(false)
    }, 600)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomPos({ x, y })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
      {/* Image Gallery with Zoom */}
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'row-reverse' }}>
        {/* Main Display Image */}
        <div
          onMouseEnter={() => setZoomActive(true)}
          onMouseLeave={() => setZoomActive(false)}
          onMouseMove={handleMouseMove}
          style={{
            flex: 1,
            position: 'relative',
            paddingTop: '125%',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            background: '#f8fafc',
            border: '1px solid var(--color-border)',
            cursor: 'zoom-in',
          }}
        >
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: 'cover',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: zoomActive ? 'scale(2.2)' : 'scale(1)',
                transition: zoomActive ? 'none' : 'transform 0.3s ease',
              }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👕</div>
          )}

          {discountPercent > 0 && (
            <span className="badge-sale" style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '0.8125rem', padding: '4px 12px', zIndex: 10 }}>
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Vertical Thumbnails */}
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
          <p style={{ color: 'var(--color-brand-accent)', fontSize: '0.875rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            {product.brand}
          </p>
        )}

        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: 'var(--color-brand-primary)', lineHeight: 1.2, marginBottom: '0.75rem' }}>
          {product.title}
        </h1>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <span style={{ background: 'var(--color-brand-primary)', color: 'white', padding: '3px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', fontWeight: 700 }}>
            ★ 4.9
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Based on {product.reviews?.length || 42} verified customer reviews
          </span>
        </div>

        {/* Price Box */}
        <div style={{ padding: '1.25rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--color-brand-primary)', fontFamily: 'var(--font-display)' }}>
              ₹{product.basePrice.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discountPercent > 0 && (
              <span style={{ color: 'var(--color-brand-accent)', fontWeight: 800, fontSize: '1rem' }}>
                ({discountPercent}% OFF)
              </span>
            )}
          </div>
          <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8125rem' }}>Inclusive of all taxes</span>
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
                    padding: '0.5rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedColor === c ? '2px solid var(--color-brand-accent)' : '1px solid var(--color-border)',
                    background: selectedColor === c ? 'var(--color-surface-2)' : 'white',
                    fontWeight: 700,
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
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase' }}>
              SELECT SIZE: <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>{selectedSize}</span>
            </label>
            <button
              onClick={() => setShowSizeChart(true)}
              style={{ background: 'none', border: 'none', color: 'var(--color-brand-accent)', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              📏 Size Guide & Measurements
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
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedSize === s ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                    background: selectedSize === s ? 'var(--color-brand-primary)' : 'white',
                    color: selectedSize === s ? 'white' : outOfStock ? '#cbd5e1' : 'var(--color-text-primary)',
                    fontWeight: 800,
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
            <p style={{ color: activeVariant.stock <= 5 ? 'var(--color-brand-accent)' : '#16a34a', fontSize: '0.875rem', fontWeight: 700 }}>
              {activeVariant.stock <= 5 ? `🔥 Low Stock! Only ${activeVariant.stock} left in Size ${selectedSize}` : '✓ In Stock — Ready for Express Dispatch'}
            </p>
          ) : (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 700 }}>❌ Sold Out in selected variant</p>
          )}
        </div>

        {/* Quantity & Add to Bag */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '42px', height: '52px', background: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '1.125rem' }}>-</button>
            <span style={{ width: '42px', textAlign: 'center', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} style={{ width: '42px', height: '52px', background: 'white', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '1.125rem' }}>+</button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!activeVariant || activeVariant.stock <= 0}
            className="btn btn-accent btn-lg btn-full"
            style={{ height: '52px', fontSize: '1rem', flex: 1, letterSpacing: '0.05em' }}
          >
            ADD TO BAG 🛍️
          </button>
        </div>

        {/* Pincode Delivery Estimator */}
        <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📍 Delivery Options & Pincode Check
          </h4>

          <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter 6-digit Pincode (e.g. 560038)"
              className="input"
              style={{ fontSize: '0.875rem', background: 'white' }}
            />
            <button type="submit" disabled={checkingPincode} className="btn btn-primary btn-sm" style={{ padding: '0 1.25rem' }}>
              {checkingPincode ? 'Checking...' : 'Check'}
            </button>
          </form>

          {pincodeError && <p style={{ color: '#ef4444', fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>⚠️ {pincodeError}</p>}

          {deliveryResult && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: '#166534' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                🚚 Estimated Delivery: <strong>{deliveryResult.date}</strong>
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#15803d' }}>
                ✓ Cash on Delivery (COD) Available • {deliveryResult.freeShipping ? 'Free Shipping Eligible' : 'Standard Delivery ₹49'}
              </div>
            </div>
          )}
        </div>

        {/* Myntra Trust Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.25rem 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            <span style={{ fontSize: '1.5rem' }}>🛡️</span>
            <span>100% Original Authentic Apparel</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            <span style={{ fontSize: '1.5rem' }}>🔄</span>
            <span>Easy 7-Day Returns & Exchanges</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            <span style={{ fontSize: '1.5rem' }}>💵</span>
            <span>Pay on Delivery (COD) Available</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <span>Express Shipping Across India</span>
          </div>
        </div>

        {/* Description & Fabric Specs */}
        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
            PRODUCT DETAILS & FABRIC CARE
          </h4>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>{product.description}</p>

          <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.8, margin: 0 }}>
            <li>Fabric: 100% Combed Cotton (240 GSM Heavyweight)</li>
            <li>Fit: Oversized Drop Shoulder Silhouette</li>
            <li>Neck: Ribbed Crew Neck</li>
            <li>Care: Machine wash cold, tumble dry low, do not iron on print</li>
          </ul>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowSizeChart(false)}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', maxWidth: '540px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-display)', margin: 0 }}>SIZE GUIDE & MEASUREMENTS</h3>
              <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '3px', borderRadius: 'var(--radius-md)' }}>
                <button
                  onClick={() => setSizeUnit('in')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: sizeUnit === 'in' ? 'white' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  INCHES (in)
                </button>
                <button
                  onClick={() => setSizeUnit('cm')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: sizeUnit === 'cm' ? 'white' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  CM (cm)
                </button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', background: 'var(--color-surface-2)' }}>
                  <th style={{ padding: '10px' }}>Size</th>
                  <th style={{ padding: '10px' }}>Chest</th>
                  <th style={{ padding: '10px' }}>Length</th>
                  <th style={{ padding: '10px' }}>Shoulder</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px', fontWeight: 700 }}>S</td>
                  <td>{sizeUnit === 'in' ? '42"' : '106 cm'}</td>
                  <td>{sizeUnit === 'in' ? '28"' : '71 cm'}</td>
                  <td>{sizeUnit === 'in' ? '21"' : '53 cm'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px', fontWeight: 700 }}>M</td>
                  <td>{sizeUnit === 'in' ? '44"' : '112 cm'}</td>
                  <td>{sizeUnit === 'in' ? '29"' : '73 cm'}</td>
                  <td>{sizeUnit === 'in' ? '22"' : '56 cm'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px', fontWeight: 700 }}>L</td>
                  <td>{sizeUnit === 'in' ? '46"' : '117 cm'}</td>
                  <td>{sizeUnit === 'in' ? '30"' : '76 cm'}</td>
                  <td>{sizeUnit === 'in' ? '23"' : '58 cm'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px', fontWeight: 700 }}>XL</td>
                  <td>{sizeUnit === 'in' ? '48"' : '122 cm'}</td>
                  <td>{sizeUnit === 'in' ? '31"' : '78 cm'}</td>
                  <td>{sizeUnit === 'in' ? '24"' : '61 cm'}</td>
                </tr>
              </tbody>
            </table>

            <p style={{ color: '#64748b', fontSize: '0.8125rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              💡 <strong>Fit Tip:</strong> Our apparel is designed for an oversized streetwear drape. For a standard regular fit, select one size smaller than your usual size.
            </p>

            <button onClick={() => setShowSizeChart(false)} className="btn btn-primary btn-full">
              GOT IT, CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
