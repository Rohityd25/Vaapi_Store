import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface-2)',
        padding: '3rem 1rem',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '500px' }}>
        <span
          style={{
            fontSize: '5rem',
            fontWeight: 900,
            color: 'var(--color-brand-accent)',
            fontFamily: 'var(--font-display)',
            lineHeight: 1,
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          404
        </span>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          PAGE NOT FOUND
        </h1>
        <p
          style={{
            color: 'var(--color-text-muted)',
            marginBottom: '2rem',
            fontSize: '0.9375rem',
          }}
        >
          The page or product collection you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-accent btn-lg">
            RETURN TO HOME
          </Link>
          <Link href="/collections/all" className="btn btn-outline btn-lg">
            EXPLORE CATALOG
          </Link>
        </div>
      </div>
    </div>
  )
}
