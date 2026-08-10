'use client'

import { useState, useEffect } from 'react'

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const fetchInventory = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.products) {
        setProducts(data.products)
      }
    } catch (err) {
      console.error('Failed to load inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleStockUpdate = async (productId: string, variantId: string, newStock: number) => {
    setUpdatingId(variantId)
    setMessage('')
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variants: [{ id: variantId, stock: newStock }],
        }),
      })

      if (res.ok) {
        setMessage('Stock level updated successfully!')
        setTimeout(() => setMessage(''), 2000)
        fetchInventory()
      } else {
        alert('Failed to update stock')
      }
    } catch (err) {
      alert('Error updating stock')
    } finally {
      setUpdatingId(null)
    }
  }

  // Flatten all variants across products
  const allVariants: any[] = []
  products.forEach((p) => {
    if (p.variants) {
      p.variants.forEach((v: any) => {
        allVariants.push({
          ...v,
          productId: p.id,
          productTitle: p.title,
        })
      })
    }
  })

  const filteredVariants = allVariants.filter(
    (v) =>
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      v.size.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)', margin: 0 }}>
            INVENTORY & STOCK CONTROL
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
            Real-time stock management across all size & color product variants
          </p>
        </div>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontWeight: 600 }}>
          ✅ {message}
        </div>
      )}

      {/* Search Input */}
      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search SKU, product name, or size..."
          className="input"
          style={{ maxWidth: '400px', background: 'white' }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading inventory...
          </div>
        ) : filteredVariants.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No variants found.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>SKU</th>
                <th style={{ padding: '12px 16px' }}>PRODUCT TITLE</th>
                <th style={{ padding: '12px 16px' }}>SIZE</th>
                <th style={{ padding: '12px 16px' }}>COLOR</th>
                <th style={{ padding: '12px 16px' }}>STOCK QTY</th>
                <th style={{ padding: '12px 16px' }}>STATUS</th>
                <th style={{ padding: '12px 16px' }}>QUICK UPDATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariants.map((item) => {
                const isLow = item.stock <= 5
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: isLow ? '#fff5f5' : 'white' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                      {item.sku}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{item.productTitle}</td>
                    <td style={{ padding: '14px 16px' }}>{item.size}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.colorHex || '#111', border: '1px solid #ccc' }} />
                        {item.color}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 900, fontSize: '1rem', color: isLow ? '#b91c1c' : '#166534', fontFamily: 'var(--font-display)' }}>
                        {item.stock} {isLow && '⚠️'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 700, background: isLow ? '#fee2e2' : '#dcfce7', color: isLow ? '#b91c1c' : '#15803d' }}>
                        {isLow ? 'LOW STOCK' : 'IN STOCK'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => handleStockUpdate(item.productId, item.id, item.stock + 10)}
                          disabled={updatingId === item.id}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleStockUpdate(item.productId, item.id, Math.max(0, item.stock - 10))}
                          disabled={updatingId === item.id}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                        >
                          -10
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
