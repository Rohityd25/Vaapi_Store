'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateProductPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [brand, setBrand] = useState('ATTUS RAW')
  const [category, setCategory] = useState('T-SHIRTS')
  const [price, setPrice] = useState('')
  const [mrp, setMrp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Demo response
      setTimeout(() => {
        setMessage('Product saved successfully!')
        setLoading(false)
        setTimeout(() => router.push('/admin/products'), 1000)
      }, 500)
    } catch (err: any) {
      setMessage('Error creating product.')
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/products" style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
          ← Back to Products
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)', margin: 0 }}>
          ADD NEW PRODUCT
        </h1>
      </div>

      {message && (
        <div style={{ padding: '0.875rem 1rem', background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: 600 }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>PRODUCT TITLE</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Aura Oversized Heavyweight T-Shirt" className="input" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>DESCRIPTION</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product features, fabric details and fit description..." className="input" style={{ width: '100%', resize: 'vertical' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>BRAND LINE</label>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="input" style={{ width: '100%' }}>
              <option value="ATTUS RAW">ATTUS RAW</option>
              <option value="ATTUS LUXE">ATTUS LUXE</option>
              <option value="URBAN THREADS">URBAN THREADS</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>CATEGORY</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input" style={{ width: '100%' }}>
              <option value="T-SHIRTS">T-Shirts & Tops</option>
              <option value="HOODIES">Hoodies & Sweatshirts</option>
              <option value="JOGGERS">Joggers & Pants</option>
              <option value="ACCESSORIES">Accessories</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>SELLING PRICE (₹)</label>
            <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="999" className="input" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>MRP / STRIKE PRICE (₹)</label>
            <input type="number" value={mrp} onChange={(e) => setMrp(e.target.value)} placeholder="1999" className="input" />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/admin/products" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn btn-accent">
            {loading ? 'SAVING...' : 'SAVE & PUBLISH PRODUCT →'}
          </button>
        </div>
      </form>
    </div>
  )
}
