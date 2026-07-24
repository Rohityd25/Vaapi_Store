export default function AdminContentPage() {
  const BANNERS = [
    { id: '1', title: 'MONOCHROME OVERSIZED DROPS', subtitle: 'Heavyweight Cotton Tees • Up to 40% OFF', location: 'Hero Banner 1', isActive: true },
    { id: '2', title: 'CYBER-MESH HOODIES & JOGGERS', subtitle: 'Next-Gen Urban Streetwear', location: 'Hero Banner 2', isActive: true },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-brand-primary)' }}>
            BANNERS & CONTENT CMS
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage homepage hero sliders, promotional banners & blog posts</p>
        </div>

        <button className="btn btn-accent btn-sm">+ ADD HERO BANNER</button>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>BANNER TITLE</th>
              <th style={{ padding: '12px 16px' }}>SUBTITLE</th>
              <th style={{ padding: '12px 16px' }}>LOCATION</th>
              <th style={{ padding: '12px 16px' }}>STATUS</th>
              <th style={{ padding: '12px 16px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {BANNERS.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{b.title}</td>
                <td style={{ padding: '14px 16px', color: '#64748b' }}>{b.subtitle}</td>
                <td style={{ padding: '14px 16px' }}>{b.location}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 700, background: '#dcfce7', color: '#15803d' }}>
                    ACTIVE
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button style={{ background: '#f1f5f9', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                    Edit Banner
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
