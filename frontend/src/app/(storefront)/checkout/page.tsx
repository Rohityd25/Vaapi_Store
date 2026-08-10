'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, total, couponCode, couponDiscount, clearCart } = useCartStore()

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Karnataka')
  const [pincode, setPincode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sub = subtotal()
  const shippingFee = sub >= 999 ? 0 : 99
  const finalTotal = Math.max(0, sub - couponDiscount + shippingFee)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestEmail: email,
          address: {
            fullName,
            phone,
            line1,
            line2,
            city,
            state,
            pincode,
          },
          items: items.map((it) => ({
            variantId: it.variant.id,
            quantity: it.quantity,
          })),
          couponCode,
          paymentMethod,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

      // COD → straight to success
      if (data.paymentMethod === 'COD') {
        clearCart()
        router.push(`/checkout/success?orderNumber=${data.orderNumber}`)
        return
      }

      // Razorpay in MOCK mode → verify immediately without opening checkout
      if (data.mock) {
        const verifyRes = await fetch('/api/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: data.orderId,
            razorpayOrderId: data.razorpayOrderId,
          }),
        })
        const verifyData = await verifyRes.json()
        if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed')
        clearCart()
        router.push(`/checkout/success?orderNumber=${data.orderNumber}`)
        return
      }

      // Real Razorpay: open the checkout modal
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const RzpAny = (window as any).Razorpay
      if (!RzpAny) {
        throw new Error('Razorpay SDK not loaded. Please refresh and try again.')
      }
      const rzp = new RzpAny({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: 'Attus Store',
        description: `Order ${data.orderNumber}`,
        prefill: { name: fullName, email, contact: phone },
        theme: { color: '#e94560' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          })
          const verifyData = await verifyRes.json()
          if (!verifyRes.ok) {
            setError(verifyData.error || 'Payment verification failed')
            setLoading(false)
            return
          }
          clearCart()
          router.push(`/checkout/success?orderNumber=${data.orderNumber}`)
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })
      rzp.open()
    } catch (err: any) {
      setError(err.message || 'Payment processing failed')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', background: 'var(--color-surface-2)', minHeight: '60vh' }}>
        <div className="container-narrow">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>YOUR BAG IS EMPTY</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Please add some items to proceed with checkout.</p>
          <Link href="/" className="btn btn-accent btn-lg">RETURN TO SHOPPING</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0', background: 'var(--color-surface-2)', minHeight: '85vh' }}>
      <div className="container-narrow">
        <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2rem', fontFamily: 'var(--font-display)' }}>
          CHECKOUT
        </h1>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Shipping Address */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
              1. CONTACT & SHIPPING ADDRESS
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>EMAIL ADDRESS</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rohan@example.com" className="input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>FULL NAME</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Rohan Sharma" className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>PHONE NUMBER</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="input" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>FLAT / HOUSE NO. / STREET</label>
                <input type="text" required value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Flat 402, Indiranagar" className="input" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>LANDMARK (OPTIONAL)</label>
                <input type="text" value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Near Metro Station" className="input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>CITY</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bengaluru" className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>STATE</label>
                  <input type="text" required value={state} onChange={(e) => setState(e.target.value)} placeholder="Karnataka" className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.375rem' }}>PINCODE</label>
                  <input type="text" required value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="560038" className="input" />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', margin: '2.5rem 0 1.5rem 0', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
              2. PAYMENT METHOD
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-lg)', border: paymentMethod === 'RAZORPAY' ? '2px solid var(--color-brand-accent)' : '1px solid var(--color-border)', background: paymentMethod === 'RAZORPAY' ? 'var(--color-surface-2)' : 'white', cursor: 'pointer' }}>
                <input type="radio" name="payment" checked={paymentMethod === 'RAZORPAY'} onChange={() => setPaymentMethod('RAZORPAY')} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9375rem' }}>Razorpay (UPI / Credit & Debit Cards / Netbanking)</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Fast and secure online payments</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-lg)', border: paymentMethod === 'COD' ? '2px solid var(--color-brand-accent)' : '1px solid var(--color-border)', background: paymentMethod === 'COD' ? 'var(--color-surface-2)' : 'white', cursor: 'pointer' }}>
                <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9375rem' }}>Cash on Delivery (COD)</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Pay cash when your shipment arrives at your doorstep</span>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
              ORDER SUMMARY ({items.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
              {items.map((i) => (
                <div key={i.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '60px', borderRadius: 'var(--radius-sm)', background: '#eee', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    {i.product.imageUrl && <img src={i.product.imageUrl} alt={i.product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, fontSize: '0.875rem' }}>
                    <p style={{ fontWeight: 600 }} className="line-clamp-1">{i.product.title}</p>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Size: {i.variant.size} | Qty: {i.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>₹{i.variant.price * i.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{sub}</span>
              </div>
              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping Fee</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.5rem', fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                <span>Total Payable</span>
                <span style={{ color: 'var(--color-brand-accent)' }}>₹{finalTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent btn-lg btn-full"
              style={{ marginTop: '1.5rem', height: '52px', fontSize: '1.0625rem' }}
            >
              {loading ? 'PROCESSING...' : `PLACE ORDER NOW (₹${finalTotal}) →`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
