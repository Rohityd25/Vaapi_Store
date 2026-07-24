import { prisma } from '@/lib/prisma'

const MOCK_INVENTORY_VARIANTS = [
  { id: '1', sku: 'AURA-BLK-S', product: 'Aura Oversized Acid Wash T-Shirt', size: 'S', color: 'Vintage Black', stock: 25, alert: 5 },
  { id: '2', sku: 'AURA-BLK-M', product: 'Aura Oversized Acid Wash T-Shirt', size: 'M', color: 'Vintage Black', stock: 40, alert: 5 },
  { id: '3', sku: 'AURA-BLK-XL', product: 'Aura Oversized Acid Wash T-Shirt', size: 'XL', color: 'Vintage Black', stock: 2, alert: 5 },
  { id: '4', sku: 'CYBER-HOOD-L', product: 'Cyberpunk Cyber-Mesh Hoodie', size: 'L', color: 'Jet Black', stock: 20, alert: 5 },
  { id: '5', sku: 'CYBER-HOOD-XL', product: 'Cyberpunk Cyber-Mesh Hoodie', size: 'XL', color: 'Jet Black', stock: 1, alert: 5 },
]

export default async function AdminInventoryPage() {
  let inventory = MOCK_INVENTORY_VARIANTS

  try {
    const dbVariants = await prisma.productVariant.findMany({
      include: { product: true },
      orderBy: { stock: 'asc' },
    })

    if (dbVariants.length > 0) {
      inventory = dbVariants.map((v: any) => ({
        id: v.id,
        sku: v.sku,
        product: v.product.title,
        size: v.size,
        color: v.color,
        stock: v.stock,
        alert: v.lowStockAlert,
      }))
    }
  } catch (err) {
    // Fall back to mock
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
            INVENTORY & STOCK CONTROL
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Per-SKU real-time stock levels and low-stock alerts</p>
        </div>

        <button className="btn btn-accent btn-sm">+ LOG STOCK ADJUSTMENT</button>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>SKU</th>
              <th style={{ padding: '12px 16px' }}>PRODUCT NAME</th>
              <th style={{ padding: '12px 16px' }}>SIZE</th>
              <th style={{ padding: '12px 16px' }}>COLOR</th>
              <th style={{ padding: '12px 16px' }}>CURRENT STOCK</th>
              <th style={{ padding: '12px 16px' }}>ALERT THRESHOLD</th>
              <th style={{ padding: '12px 16px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: item.stock <= item.alert ? '#fff5f5' : 'white' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{item.sku}</td>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{item.product}</td>
                <td style={{ padding: '14px 16px' }}>{item.size}</td>
                <td style={{ padding: '14px 16px' }}>{item.color}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontWeight: 900, fontSize: '1rem', color: item.stock <= item.alert ? '#b91c1c' : '#166534', fontFamily: 'var(--font-display)' }}>
                    {item.stock} {item.stock <= item.alert && '⚠️'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#64748b' }}>{item.alert} units</td>
                <td style={{ padding: '14px 16px' }}>
                  <button style={{ background: 'var(--color-brand-primary)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
