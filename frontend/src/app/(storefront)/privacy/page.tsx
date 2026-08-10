export default function PrivacyPolicyPage() {
  return (
    <div style={{ padding: '4rem 0', background: 'var(--color-surface-2)', minHeight: '80vh' }}>
      <div className="container-narrow" style={{ maxWidth: '800px', background: 'white', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
          PRIVACY POLICY
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Last updated: August 10, 2026
        </p>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              1. Information We Collect
            </h2>
            <p>
              When you visit or make a purchase from Attus, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases. This includes your name, shipping address, billing address, email address, phone number, and payment information.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              2. How We Use Your Information
            </h2>
            <p>
              We use your personal data to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations), communicate with you, and screen orders for potential risk or fraud.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              3. Data Security & Storage
            </h2>
            <p>
              We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk of processing personal data. Payment details are processed securely via PCI-DSS compliant payment gateways (Razorpay).
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              4. Contact Us
            </h2>
            <p>
              For more information about our privacy practices or if you have questions, please contact us by email at <strong>support@attus.store</strong>.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
