import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  let stats = {
    totalSales: 184900,
    totalOrders: 142,
    lowStockCount: 3,
    activeProducts: 24,
  }

  let recentOrders: any[] = [
    { id: '1', orderNumber: 'VAAPI-89214', customer: 'Rohan Sharma', total: 2498, status: 'CONFIRMED', date: 'Today, 10:45 AM' },
    { id: '2', orderNumber: 'VAAPI-89213', customer: 'Ananya Verma', total: 1899, status: 'SHIPPED', date: 'Yesterday' },
    { id: '3', orderNumber: 'VAAPI-89212', customer: 'Karan Patel', total: 999, status: 'DELIVERED', date: '20 Jul 2026' },
  ]

  let lowStockVariants: any[] = [
    { id: '1', productTitle: 'Aura Oversized Acid Wash T-Shirt', sku: 'AURA-BLK-XL', stock: 2, threshold: 5 },
    { id: '2', productTitle: 'Cyberpunk Cyber-Mesh Graphic Hoodie', sku: 'CYBER-HOOD-XL', stock: 1, threshold: 5 },
  ]

  try {
    const dbOrdersCount = await prisma.order.count()
    if (dbOrdersCount > 0) {
      stats.totalOrders = dbOrdersCount
    }
  } catch (err) {
    // Fall back to sample stats
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
            DASHBOARD OVERVIEW
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Welcome back! Here's your store performance breakdown.</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-accent">
          + ADD NEW PRODUCT
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>TOTAL REVENUE</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
            ₹{stats.totalSales.toLocaleString('en-IN')}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>↑ +14.2% from last month</span>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>TOTAL ORDERS</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
            {stats.totalOrders}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>↑ +8.5% new orders</span>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LOW STOCK ALERTS</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-accent)' }}>
            {stats.lowStockCount}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>Action needed in inventory</span>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>ACTIVE PRODUCTS</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
            {stats.activeProducts}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Across 4 categories</span>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Low Stock */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Recent Orders */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>RECENT ORDERS</h3>
            <Link href="/admin/orders" style={{ fontSize: '0.8125rem', color: 'var(--color-brand-accent)', fontWeight: 700 }}>
              VIEW ALL →
            </Link>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 0' }}>ORDER</th>
                <th style={{ padding: '8px 0' }}>CUSTOMER</th>
                <th style={{ padding: '8px 0' }}>TOTAL</th>
                <th style={{ padding: '8px 0' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 0', fontWeight: 700, fontFamily: 'var(--font-display)' }}>#{ord.orderNumber}</td>
                  <td style={{ padding: '12px 0' }}>{ord.customer}</td>
                  <td style={{ padding: '12px 0', fontWeight: 700 }}>₹{ord.total}</td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 700, background: ord.status === 'DELIVERED' ? '#dcfce7' : ord.status === 'SHIPPED' ? '#dbeafe' : '#fef9c3', color: ord.status === 'DELIVERED' ? '#166534' : ord.status === 'SHIPPED' ? '#1e40af' : '#854d0e' }}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alerts */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>LOW STOCK ALERTS</h3>
            <Link href="/admin/inventory" style={{ fontSize: '0.8125rem', color: 'var(--color-brand-accent)', fontWeight: 700 }}>
              MANAGE INVENTORY →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {lowStockVariants.map((item) => (
              <div key={item.id} style={{ padding: '1rem', background: '#fef2f2', borderRadius: 'var(--radius-lg)', border: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '2px' }}>{item.productTitle}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#991b1b' }}>SKU: {item.sku}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#b91c1c', fontFamily: 'var(--font-display)' }}>
                    {item.stock} left
                  </span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#991b1b' }}>Min: {item.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
