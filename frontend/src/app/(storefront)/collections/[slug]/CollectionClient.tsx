'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/storefront/ProductCard'

export function CollectionClient({ initialProducts }: { initialProducts: any[] }) {
  const [selectedSort, setSelectedSort] = useState('featured')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(3500)

  // Filter products
  let filtered = initialProducts.filter((p) => p.basePrice <= maxPrice)

  // Sort products
  if (selectedSort === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.basePrice - b.basePrice)
  } else if (selectedSort === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.basePrice - a.basePrice)
  } else if (selectedSort === 'newest') {
    filtered = [...filtered].sort((a, b) => (b.isNewArrival ? 1 : -1))
  }

  const toggleSize = (s: string) => {
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem', alignItems: 'start' }}>
      {/* Sidebar Filter */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', position: 'sticky', top: '100px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
          FILTERS
        </h3>

        {/* Price Filter */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <span>MAX PRICE</span>
            <span style={{ color: 'var(--color-brand-accent)' }}>₹{maxPrice}</span>
          </label>
          <input
            type="range"
            min="500"
            max="4000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-brand-accent)' }}
          />
        </div>

        {/* Size Filter */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>SIZE</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
              <button
                key={sz}
                onClick={() => toggleSize(sz)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: selectedSizes.includes(sz) ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                  background: selectedSizes.includes(sz) ? 'var(--color-brand-primary)' : 'white',
                  color: selectedSizes.includes(sz) ? 'white' : 'var(--color-text-primary)',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setMaxPrice(3500); setSelectedSizes([]) }}
          className="btn btn-ghost btn-full btn-sm"
        >
          CLEAR ALL FILTERS
        </button>
      </div>

      {/* Main Grid */}
      <div>
        {/* Sort header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'white', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Showing {filtered.length} Results</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>SORT BY:</label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Product Cards */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div style={{ background: 'white', padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No products match your filter</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Try clearing filters or adjusting your max price slider.</p>
          </div>
        )}
      </div>
    </div>
  )
}
