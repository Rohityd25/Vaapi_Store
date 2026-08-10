import Link from 'next/link'

interface LogoProps {
  href?: string | null
  variant?: 'light' | 'dark'
  height?: number
  subtext?: string
  showSubtext?: boolean
  className?: string
  style?: React.CSSProperties
}

export function Logo({
  href = '/',
  variant = 'light',
  height = 36,
  subtext,
  showSubtext = false,
  className,
  style,
}: LogoProps) {
  const isDark = variant === 'dark'

  const content = (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: `${height}px`,
          position: 'relative',
        }}
      >
        <img
          src="/logo.png"
          alt="Attus Logo"
          style={{
            height: '100%',
            width: 'auto',
            maxHeight: `${height}px`,
            objectFit: 'contain',
            filter: isDark ? 'invert(1) brightness(1.5)' : 'none',
            display: 'block',
          }}
        />
      </div>

      {(showSubtext || subtext) && (
        <span
          style={{
            fontSize: `${Math.max(10, height * 0.35)}px`,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: 'var(--color-brand-accent, #e94560)',
            fontFamily: 'var(--font-display, sans-serif)',
            textTransform: 'uppercase',
            lineHeight: 1,
          }}
        >
          {subtext || '.COMFORT'}
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} aria-label="Attus Home" style={{ textDecoration: 'none', display: 'inline-flex' }}>
        {content}
      </Link>
    )
  }

  return content
}
