import { prisma } from '@/lib/prisma'

const MOCK_COUPONS = [
  { id: '1', code: 'WELCOME10', type: 'PERCENT', value: 10, minOrderValue: 499, usedCount: 42, isActive: true },
  { id: '2', code: 'VAAPI500', type: 'FLAT', value: 500, minOrderValue: 2499, usedCount: 18, isActive: true },
]

export default async function AdminCouponsPage() {
  let coupons = MOCK_COUPONS

  try {
    const dbCoupons = await prisma.coupon.findMany()
    if (dbCoupons.length > 0) {
      coupons = dbCoupons.map((c) => ({
        id: c.id,
        code: c.code,
        type: c.type,
        value: c.value,
        minOrderValue: c.minOrderValue || 0,
        usedCount: c.usedCount,
        isActive: c.isActive,
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
            COUPON & DISCOUNT MANAGEMENT
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Create promotional coupon codes and flat/percentage discounts</p>
        </div>

        <button className="btn btn-accent btn-sm">+ CREATE COUPON</button>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>CODE</th>
              <th style={{ padding: '12px 16px' }}>DISCOUNT TYPE</th>
              <th style={{ padding: '12px 16px' }}>VALUE</th>
              <th style={{ padding: '12px 16px' }}>MIN ORDER VALUE</th>
              <th style={{ padding: '12px 16px' }}>TIMES USED</th>
              <th style={{ padding: '12px 16px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-brand-accent)' }}>
                  {c.code}
                </td>
                <td style={{ padding: '14px 16px' }}>{c.type === 'PERCENT' ? 'Percentage %' : 'Flat ₹ Amount'}</td>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                  {c.type === 'PERCENT' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                </td>
                <td style={{ padding: '14px 16px' }}>₹{c.minOrderValue}</td>
                <td style={{ padding: '14px 16px' }}>{c.usedCount} times</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 700, background: c.isActive ? '#dcfce7' : '#fee2e2', color: c.isActive ? '#15803d' : '#b91c1c' }}>
                    {c.isActive ? 'ACTIVE' : 'EXPIRED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
