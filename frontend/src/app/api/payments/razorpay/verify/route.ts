import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import {
  OrderStatus,
  PaymentStatus,
  StockMovementType,
} from '@prisma/client'

/**
 * POST /api/payments/razorpay/verify
 * Body: { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
 *
 * In mock mode (no keys), any submission with a MOCK razorpayOrderId is accepted.
 * Marks the order PAID, decrements stock, logs stock movements.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body || {}

    if (!orderId || !razorpayOrderId) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ error: 'Order mismatch' }, { status: 400 })
    }
    // idempotent
    if (order.paymentStatus === PaymentStatus.PAID) {
      return NextResponse.json({ success: true, orderNumber: order.orderNumber })
    }

    const mockMode =
      process.env.PAYMENT_MOCK_MODE === 'true' ||
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET ||
      razorpayOrderId.startsWith('order_MOCK_')

    if (!mockMode) {
      if (!razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json({ error: 'Missing signature fields' }, { status: 400 })
      }
      const valid = verifyRazorpaySignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      })
      if (!valid) {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: PaymentStatus.FAILED },
        })
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
      }
    }

    // Mark as PAID, decrement stock, log movements
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.CONFIRMED,
        razorpayPaymentId: razorpayPaymentId || `pay_MOCK_${Date.now()}`,
      },
    })

    for (const it of order.items) {
      await prisma.productVariant.update({
        where: { id: it.variantId },
        data: { stock: { decrement: it.quantity } },
      })
      await prisma.stockMovement.create({
        data: {
          variantId: it.variantId,
          type: StockMovementType.SALE,
          quantity: it.quantity,
          note: `Order ${order.orderNumber} (Razorpay${mockMode ? ' MOCK' : ''})`,
        },
      })
    }

    // Bump coupon usage
    if (order.couponCode) {
      await prisma.coupon.update({
        where: { code: order.couponCode },
        data: { usedCount: { increment: 1 } },
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      mock: mockMode,
    })
  } catch (error: any) {
    console.error('Verify API Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
