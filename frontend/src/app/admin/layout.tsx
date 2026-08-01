import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Logo } from '@/components/common/Logo'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user || { name: 'Admin User', role: 'SUPER_ADMIN', email: 'admin@vaapi.com' }

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Products', href: '/admin/products', icon: '📦' },
    { label: 'Inventory', href: '/admin/inventory', icon: '📋' },
    { label: 'Vendors', href: '/admin/vendors', icon: '🤝' },
    { label: 'Orders', href: '/admin/orders', icon: '📬' },
    { label: 'Customers', href: '/admin/customers', icon: '👥' },
    { label: 'Coupons', href: '/admin/coupons', icon: '🎫' },
    { label: 'Banners & Blog', href: '/admin/content', icon: '🖼️' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'var(--color-brand-primary)',
          color: 'white',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 1rem',
        }}
      >
        <div>
          {/* Logo */}
          <div style={{ padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
            <Logo href="/admin/dashboard" variant="dark" height={48} showSubtext subtext=".ADMIN" />
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Info & Storefront Link */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <div style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', margin: 0 }}>{user.name}</p>
            <span style={{ fontSize: '0.75rem', background: 'var(--color-brand-accent)', color: 'white', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
              {user.role}
            </span>
          </div>

          <Link href="/" style={{ display: 'block', textAlign: 'center', fontSize: '0.8125rem', color: '#94a3b8', textDecoration: 'underline' }}>
            ← Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ marginLeft: '260px', flex: 1, padding: '2rem 3rem' }}>
        {children}
      </div>
    </div>
  )
}
