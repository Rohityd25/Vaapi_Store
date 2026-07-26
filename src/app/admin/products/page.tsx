import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const MOCK_ADMIN_PRODUCTS = [
  { id: '1', title: 'Aura Oversized Acid Wash T-Shirt', brand: 'ATTUS RAW', price: 999, variantsCount: 5, stock: 108, isActive: true },
  { id: '2', title: 'Cyberpunk Cyber-Mesh Graphic Hoodie', brand: 'ATTUS RAW', price: 1899, variantsCount: 3, stock: 37, isActive: true },
  { id: '3', title: 'Tactical Multi-Pocket Cargo Joggers', brand: 'URBAN THREADS', price: 1499, variantsCount: 3, stock: 73, isActive: true },
  { id: '4', title: 'Solstice Ribbed Seamless Crop Top', brand: 'ATTUS LUXE', price: 699, variantsCount: 3, stock: 55, isActive: true },
]

export default async function AdminProductsPage() {
  let products = MOCK_ADMIN_PRODUCTS

  try {
    const dbProds = await prisma.product.findMany({
      include: {
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    if (dbProds.length > 0) {
      products = dbProds.map((p: any) => ({
        id: p.id,
        title: p.title,
        brand: p.brand || 'ATTUS',
        price: p.basePrice,
        variantsCount: p.variants.length,
        stock: p.variants.reduce((sum: number, v: any) => sum + v.stock, 0),
        isActive: p.isActive,
      }))
    }
  } catch (err) {
    // Fall back to sample
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
            PRODUCT MANAGEMENT
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Create, edit and organize your clothing products & variants</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline btn-sm">📥 Bulk Import (CSV)</button>
          <Link href="/admin/products/new" className="btn btn-accent btn-sm">
            + CREATE PRODUCT
          </Link>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>PRODUCT TITLE</th>
              <th style={{ padding: '12px 16px' }}>BRAND</th>
              <th style={{ padding: '12px 16px' }}>PRICE</th>
              <th style={{ padding: '12px 16px' }}>VARIANTS</th>
              <th style={{ padding: '12px 16px' }}>TOTAL STOCK</th>
              <th style={{ padding: '12px 16px' }}>STATUS</th>
              <th style={{ padding: '12px 16px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
                  {p.title}
                </td>
                <td style={{ padding: '14px 16px', color: '#64748b' }}>{p.brand}</td>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>₹{p.price}</td>
                <td style={{ padding: '14px 16px' }}>{p.variantsCount} SKUs</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontWeight: 700, color: p.stock <= 10 ? '#b91c1c' : '#166534' }}>{p.stock} units</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 700, background: p.isActive ? '#dcfce7' : '#fee2e2', color: p.isActive ? '#15803d' : '#b91c1c' }}>
                    {p.isActive ? 'ACTIVE' : 'DRAFT'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ background: '#f1f5f9', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Edit</button>
                    <button style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
