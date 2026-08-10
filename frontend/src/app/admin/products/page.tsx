'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.products) {
        setProducts(data.products)
      }
    } catch (err) {
      console.error('Failed to fetch admin products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (res.ok) {
        setActionMessage('Product status updated!')
        setTimeout(() => setActionMessage(''), 2000)
        fetchProducts()
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setActionMessage('Product deleted successfully!')
        setTimeout(() => setActionMessage(''), 2500)
        fetchProducts()
      } else {
        alert('Failed to delete product')
      }
    } catch (err) {
      alert('Error deleting product')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)', margin: 0 }}>
            PRODUCT MANAGEMENT
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
            Create, update and manage your clothing store products and inventory
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/products/new" className="btn btn-accent btn-sm">
            + ADD NEW PRODUCT
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div style={{ padding: '0.75rem 1rem', background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontWeight: 600 }}>
          ✅ {actionMessage}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search product by title or brand..."
          className="input"
          style={{ maxWidth: '400px', background: 'white' }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No products found. Click <strong>+ ADD NEW PRODUCT</strong> above to add one.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>PRODUCT</th>
                <th style={{ padding: '12px 16px' }}>BRAND</th>
                <th style={{ padding: '12px 16px' }}>PRICE</th>
                <th style={{ padding: '12px 16px' }}>VARIANTS</th>
                <th style={{ padding: '12px 16px' }}>TOTAL STOCK</th>
                <th style={{ padding: '12px 16px' }}>STATUS</th>
                <th style={{ padding: '12px 16px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const totalStock = p.variants ? p.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) : 0
                const primaryImg = p.images && p.images[0] ? p.images[0].url : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={primaryImg}
                          alt={p.title}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
                            {p.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{p.brand || 'ATTUS'}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                      ₹{p.basePrice}
                      {p.compareAtPrice && (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '0.375rem' }}>
                          ₹{p.compareAtPrice}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>{p.variants ? p.variants.length : 0} SKUs</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 700, color: totalStock <= 10 ? '#b91c1c' : '#166534' }}>
                        {totalStock} units
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => toggleStatus(p.id, p.isActive)}
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: p.isActive ? '#dcfce7' : '#fee2e2',
                          color: p.isActive ? '#15803d' : '#b91c1c',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {p.isActive ? 'ACTIVE' : 'DRAFT'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          style={{
                            background: '#f1f5f9',
                            color: 'var(--color-brand-primary)',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          style={{
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          {deletingId === p.id ? 'Deleting...' : '🗑️ Delete'}
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
