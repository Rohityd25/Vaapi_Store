export default function RefundPolicyPage() {
  return (
    <div style={{ padding: '4rem 0', background: 'var(--color-surface-2)', minHeight: '80vh' }}>
      <div className="container-narrow" style={{ maxWidth: '800px', background: 'white', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
          REFUND & RETURN POLICY
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Last updated: August 10, 2026
        </p>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              1. 7-Day Easy Returns & Exchanges
            </h2>
            <p>
              We want you to love your streetwear fit. If you're not 100% satisfied with your purchase, you can return or exchange any unworn, unwashed item with original tags attached within 7 days of delivery.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              2. Return Process
            </h2>
            <p>
              To initiate a return or exchange, navigate to <strong>My Orders</strong> in your account or contact support@attus.store with your Order Number and item details. Once approved, our courier partner will arrange a doorstep pickup.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              3. Refund Processing Time
            </h2>
            <p>
              Once your returned item is received and inspected at our warehouse, refunds are initiated within 48 hours to your original payment method (or bank account for COD orders). It may take 3-5 business days to reflect in your account.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              4. Non-Returnable Items
            </h2>
            <p>
              Innerwear, socks, customized apparel, and items marked as "Final Sale" or bought during warehouse clearance sales are non-returnable.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
