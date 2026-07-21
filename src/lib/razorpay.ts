import Razorpay from 'razorpay'
import crypto from 'crypto'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export interface CreateRazorpayOrderParams {
  amount: number // in paise (rupees × 100)
  currency?: string
  receipt: string
  notes?: Record<string, string>
}

export async function createRazorpayOrder({
  amount,
  currency = 'INR',
  receipt,
  notes,
}: CreateRazorpayOrderParams) {
  const order = await razorpay.orders.create({
    amount,
    currency,
    receipt,
    notes,
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
  const secret = process.env.RAZORPAY_KEY_SECRET!
  const body = `${razorpayOrderId}|${razorpayPaymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return expectedSignature === razorpaySignature
}
