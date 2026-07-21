import { prisma } from '@/lib/prisma'

const MOCK_ADMIN_ORDERS = [
  { id: '1', orderNumber: 'VAAPI-89214', customer: 'Rohan Sharma', phone: '+91 9988776655', itemsCount: 2, total: 2498, paymentMethod: 'RAZORPAY', paymentStatus: 'PAID', status: 'CONFIRMED', date: 'Today, 10:45 AM' },
  { id: '2', orderNumber: 'VAAPI-89213', customer: 'Ananya Verma', phone: '+91 9876543210', itemsCount: 1, total: 1899, paymentMethod: 'COD', paymentStatus: 'PENDING', status: 'SHIPPED', date: 'Yesterday' },
  { id: '3', orderNumber: 'VAAPI-89212', customer: 'Karan Patel', phone: '+91 9123456789', itemsCount: 1, total: 999, paymentMethod: 'RAZORPAY', paymentStatus: 'PAID', status: 'DELIVERED', date: '20 Jul 2026' },
]

export default async function AdminOrdersPage() {
  let orders = MOCK_ADMIN_ORDERS

  try {
    const dbOrders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })

    if (dbOrders.length > 0) {
      orders = dbOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customer: (o.address as any)?.fullName || 'Guest',
        phone: (o.address as any)?.phone || 'N/A',
        itemsCount: o.items.length,
        total: o.total,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        status: o.status,
        date: new Date(o.createdAt).toLocaleDateString('en-IN'),
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
            ORDER MANAGEMENT
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Track orders, update shipment statuses, and push dispatches to Shiprocket</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>ORDER ID</th>
              <th style={{ padding: '12px 16px' }}>CUSTOMER</th>
              <th style={{ padding: '12px 16px' }}>ITEMS</th>
              <th style={{ padding: '12px 16px' }}>TOTAL</th>
              <th style={{ padding: '12px 16px' }}>PAYMENT</th>
              <th style={{ padding: '12px 16px' }}>ORDER STATUS</th>
              <th style={{ padding: '12px 16px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
                  #{o.orderNumber}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600 }}>{o.customer}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{o.phone}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>{o.itemsCount} items</td>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>₹{o.total}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{o.paymentMethod}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: o.paymentStatus === 'PAID' ? '#16a34a' : '#d97706' }}>
                      {o.paymentStatus}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 700, background: o.status === 'DELIVERED' ? '#dcfce7' : o.status === 'SHIPPED' ? '#dbeafe' : '#fef9c3', color: o.status === 'DELIVERED' ? '#166534' : o.status === 'SHIPPED' ? '#1e40af' : '#854d0e' }}>
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ background: 'var(--color-brand-accent)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                      🚀 Shiprocket Push
                    </button>
                    <button style={{ background: '#f1f5f9', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                      Print Label
                    </button>
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
