import Razorpay from 'razorpay'
import crypto from 'crypto'

// Lazy-init: don't construct Razorpay when keys are missing (mock/dev mode).
let _rzp: Razorpay | null = null

function getRzp(): Razorpay {
  if (!_rzp) {
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_id || !key_secret) {
      throw new Error(
        'Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET, or use PAYMENT_MOCK_MODE=true'
      )
    }
    _rzp = new Razorpay({ key_id, key_secret })
  }
  return _rzp
}

export interface CreateRazorpayOrderParams {
  amount: number // in paise
  currency?: string
  receipt: string
  notes?: Record<string, string>
}

export async function createRazorpayOrder(params: CreateRazorpayOrderParams) {
  const order = await getRzp().orders.create({
    amount: params.amount,
    currency: params.currency || 'INR',
    receipt: params.receipt,
    notes: params.notes,
  })
  return order
}

export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return false
  const body = `${razorpayOrderId}|${razorpayPaymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  return expectedSignature === razorpaySignature
}
