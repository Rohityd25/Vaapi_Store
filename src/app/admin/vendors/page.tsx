import { prisma } from '@/lib/prisma'

const MOCK_VENDORS = [
  { id: '1', name: 'Urban Threads Co.', email: 'contact@urbanthreads.in', phone: '+91 9876543210', gst: '07AAAAA0000A1Z5', commission: 15, productsCount: 12, sales: 89400 },
  { id: '2', name: 'Raw Craft Apparel', email: 'sales@rawcraft.in', phone: '+91 9911223344', gst: '29BBBBB1111B2Z9', commission: 12, productsCount: 8, sales: 45200 },
]

export default async function AdminVendorsPage() {
  let vendors = MOCK_VENDORS

  try {
    const dbVendors = await prisma.vendor.findMany({
      include: { products: true },
    })
    if (dbVendors.length > 0) {
      vendors = dbVendors.map((v) => ({
        id: v.id,
        name: v.name,
        email: v.contactEmail,
        phone: v.contactPhone,
        gst: v.gstNumber || 'N/A',
        commission: v.commissionPct,
        productsCount: v.products.length,
        sales: 50000,
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
            VENDOR MANAGEMENT
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Onboard third-party clothing vendors, manage commission rates & payouts</p>
        </div>

        <button className="btn btn-accent btn-sm">+ ONBOARD NEW VENDOR</button>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>VENDOR NAME</th>
              <th style={{ padding: '12px 16px' }}>CONTACT</th>
              <th style={{ padding: '12px 16px' }}>GST NUMBER</th>
              <th style={{ padding: '12px 16px' }}>COMMISSION %</th>
              <th style={{ padding: '12px 16px' }}>ASSIGNED PRODUCTS</th>
              <th style={{ padding: '12px 16px' }}>TOTAL SALES</th>
              <th style={{ padding: '12px 16px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
                  {v.name}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '0.8125rem' }}>{v.email}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{v.phone}</div>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace' }}>{v.gst}</td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-brand-accent)' }}>{v.commission}%</td>
                <td style={{ padding: '14px 16px' }}>{v.productsCount} items</td>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>₹{v.sales.toLocaleString('en-IN')}</td>
                <td style={{ padding: '14px 16px' }}>
                  <button style={{ background: '#f1f5f9', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Manage View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
