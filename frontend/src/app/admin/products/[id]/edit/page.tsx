'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [brand, setBrand] = useState('ATTUS RAW')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [price, setPrice] = useState('')
  const [mrp, setMrp] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isBestseller, setIsBestseller] = useState(false)
  const [isNewArrival, setIsNewArrival] = useState(false)

  // Images state
  const [images, setImages] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Variants state
  const [variants, setVariants] = useState<any[]>([])

  const [initialLoading, setInitialLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    // Fetch product details & categories
    Promise.all([
      fetch(`/api/products/${id}`).then((res) => res.json()),
      fetch('/api/products').then((res) => res.json()),
    ])
      .then(([prodData, catData]) => {
        if (prodData.product) {
          const p = prodData.product
          setTitle(p.title || '')
          setDescription(p.description || '')
          setBrand(p.brand || 'ATTUS RAW')
          setCategoryId(p.categoryId || '')
          setPrice(String(p.basePrice || ''))
          setMrp(p.compareAtPrice ? String(p.compareAtPrice) : '')
          setIsActive(Boolean(p.isActive))
          setIsBestseller(Boolean(p.isBestseller))
          setIsNewArrival(Boolean(p.isNewArrival))
          setImages(p.images ? p.images.map((i: any) => i.url) : [])
          setVariants(p.variants || [])
        } else {
          setError('Product not found')
        }

        if (catData.products) {
          const cats = catData.products.map((p: any) => p.category).filter(Boolean)
          const uniqueCats = Array.from(new Set(cats.map((c: any) => c.id))).map((catId) =>
            cats.find((c: any) => c.id === catId)
          )
          setCategories(uniqueCats)
        }
      })
      .catch((err) => {
        setError('Failed to load product data')
      })
      .finally(() => {
        setInitialLoading(false)
      })
  }, [id])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError('')
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64 = reader.result
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64 }),
        })
        const data = await res.json()
        if (data.url) {
          setImages((prev) => [...prev, data.url])
        } else {
          setError('Failed to upload image')
        }
        setUploadingImage(false)
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed')
      setUploadingImage(false)
    }
  }

  const addImageUrl = () => {
    if (!imageUrlInput) return
    setImages((prev) => [...prev, imageUrlInput])
    setImageUrlInput('')
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: 'XL', color: 'Black', colorHex: '#111111', stock: 10, price },
    ])
  }

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVariantChange = (index: number, field: string, value: any) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccessMessage('')

    try {
      const payload = {
        title,
        description,
        brand,
        categoryId: categoryId || undefined,
        basePrice: Number(price),
        compareAtPrice: mrp ? Number(mrp) : undefined,
        isActive,
        isBestseller,
        isNewArrival,
        images,
        variants,
      }

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update product')

      setSuccessMessage('Product updated successfully!')
      setTimeout(() => router.push('/admin/products'), 1200)
    } catch (err: any) {
      setError(err.message || 'Error updating product')
      setSaving(false)
    }
  }

  if (initialLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading product details...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/products" style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
          ← Back to Products
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)', margin: 0 }}>
          EDIT PRODUCT
        </h1>
      </div>

      {successMessage && (
        <div style={{ padding: '0.875rem 1rem', background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: 600 }}>
          ✅ {successMessage}
        </div>
      )}

      {error && (
        <div style={{ padding: '0.875rem 1rem', background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Basic Info Box */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>
              1. Basic Information
            </h2>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700 }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              {isActive ? '🟢 Active in Store' : '🔴 Draft / Hidden'}
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>PRODUCT TITLE *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>DESCRIPTION</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="input" style={{ width: '100%', resize: 'vertical' }} />
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
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input" style={{ width: '100%' }}>
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Badges Box */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '1.25rem' }}>
            2. Pricing & Badges
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>SELLING PRICE (₹) *</label>
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>MRP / STRIKE PRICE (₹)</label>
              <input type="number" value={mrp} onChange={(e) => setMrp(e.target.value)} className="input" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} />
              🔥 Mark as Bestseller
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} />
              ✨ Mark as New Arrival
            </label>
          </div>
        </div>

        {/* Images Manager */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '1.25rem' }}>
            3. Product Images
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            {images.map((img, idx) => (
              <div key={idx} style={{ position: 'relative', width: '100px', height: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                <img src={img} alt={`Product Image ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    fontSize: '10px',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
              {uploadingImage ? 'Uploading...' : '📁 Upload Image File'}
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploadingImage} />
            </label>

            <span style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>OR</span>

            <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Paste Image URL (https://...)"
                className="input"
                style={{ fontSize: '0.8125rem' }}
              />
              <button type="button" onClick={addImageUrl} className="btn btn-primary btn-sm">
                Add URL
              </button>
            </div>
          </div>
        </div>

        {/* Variants Manager */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>
              4. Product Variants (Size, Color & Stock)
            </h2>
            <button type="button" onClick={handleAddVariant} className="btn btn-outline btn-sm">
              + Add Variant Row
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {variants.map((v, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 40px', gap: '0.75rem', alignItems: 'center', background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block' }}>SIZE</span>
                  <input
                    type="text"
                    value={v.size}
                    onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                    className="input"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8125rem' }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block' }}>COLOR</span>
                  <input
                    type="text"
                    value={v.color}
                    onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                    className="input"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8125rem' }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block' }}>COLOR HEX</span>
                  <input
                    type="color"
                    value={v.colorHex || '#111111'}
                    onChange={(e) => handleVariantChange(idx, 'colorHex', e.target.value)}
                    style={{ width: '100%', height: '36px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block' }}>STOCK QTY</span>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                    className="input"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8125rem' }}
                  />
                </div>

                <div style={{ paddingTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    disabled={variants.length === 1}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.125rem' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Link href="/admin/products" className="btn btn-outline btn-lg">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn btn-accent btn-lg" style={{ minWidth: '220px' }}>
            {saving ? 'SAVING CHANGES...' : 'SAVE CHANGES →'}
          </button>
        </div>
      </form>
    </div>
  )
}
