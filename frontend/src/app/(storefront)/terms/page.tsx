export default function TermsOfServicePage() {
  return (
    <div style={{ padding: '4rem 0', background: 'var(--color-surface-2)', minHeight: '80vh' }}>
      <div className="container-narrow" style={{ maxWidth: '800px', background: 'white', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
          TERMS OF SERVICE
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Last updated: August 10, 2026
        </p>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              1. General Terms
            </h2>
            <p>
              By accessing and placing an order with Attus, you confirm that you are in agreement with and bound by the terms of service contained herein. These terms apply to the entire website and any email or other type of communication between you and Attus.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              2. Products & Pricing
            </h2>
            <p>
              We reserve the right to alter or update prices, stock, and descriptions of products on our store at any time without prior notice. All prices are in Indian Rupees (INR) and inclusive of taxes unless specified otherwise.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              3. Orders & Cancellation
            </h2>
            <p>
              We reserve the right to refuse or cancel any order for reasons including stock availability, inaccuracies in product information, or suspected fraudulent transactions.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              4. Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Bengaluru, India.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
