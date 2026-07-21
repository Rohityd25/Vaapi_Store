'use client'

export function BrandStory() {
  const USPs = [
    { icon: '🧶', title: '240+ GSM COTTON', desc: 'Heavyweight premium combed cotton built to retain shape after 100+ washes' },
    { icon: '✂️', title: 'SIGNATURE OVERSIZED FIT', desc: 'Custom drop-shoulder patterns designed in India for streetwear enthusiasts' },
    { icon: '🚀', title: 'EXPRESS SHIPPING', desc: 'Dispatched within 24 hours with real-time tracking via Shiprocket' },
    { icon: '🔄', title: '7-DAY EASY RETURNS', desc: 'Hassle-free returns and instant store credit or original payment refund' },
  ]

  return (
    <section style={{ padding: '5rem 0', background: 'var(--color-brand-primary)', color: 'white' }}>
      <div className="container-narrow">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem auto' }}>
          <span style={{ color: 'var(--color-brand-accent)', fontSize: '0.8125rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
            THE VAAPI WAY
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, textTransform: 'uppercase', margin: '0.75rem 0 1rem 0' }}>
            BUILT FOR THE STREETS, ENGINEERED FOR COMFORT
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.6 }}>
            We reject flimsy fast fashion. VAAPI Comfort blends high-density heavy fabrics with bold artistic expressions so you stand out wherever you go.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
          }}
        >
          {USPs.map((usp) => (
            <div
              key={usp.title}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                transition: 'transform 0.3s ease, background 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-4px)'
                el.style.background = 'rgba(255,255,255,0.07)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(0)'
                el.style.background = 'rgba(255,255,255,0.04)'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{usp.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
                {usp.title}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.5 }}>{usp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
