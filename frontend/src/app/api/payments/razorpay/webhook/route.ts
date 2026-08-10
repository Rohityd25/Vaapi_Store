import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { OrderStatus, PaymentStatus, StockMovementType } from '@prisma/client'

/**
 * POST /api/payments/razorpay/webhook
 * Listens for asynchronous payment status webhooks from Razorpay
 * Webhook signature is validated using RAZORPAY_WEBHOOK_SECRET
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex')

      if (expectedSignature !== signature) {
        console.warn('Razorpay webhook signature mismatch.')
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
      }
    }

    const payload = JSON.parse(rawBody)
    const event = payload.event
    const paymentEntity = payload.payload?.payment?.entity

    if (event === 'order.paid' || event === 'payment.captured') {
      const razorpayOrderId = paymentEntity?.order_id
      const razorpayPaymentId = paymentEntity?.id

      if (razorpayOrderId) {
        const order = await prisma.order.findFirst({
          where: { razorpayOrderId },
          include: { items: true },
        })

        if (order && order.paymentStatus !== PaymentStatus.PAID) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: PaymentStatus.PAID,
              status: OrderStatus.CONFIRMED,
              razorpayPaymentId: razorpayPaymentId || order.razorpayPaymentId,
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
                note: `Order ${order.orderNumber} (Webhook)`,
              },
            })
          }

          if (order.couponCode) {
            await prisma.coupon.update({
              where: { code: order.couponCode },
              data: { usedCount: { increment: 1 } },
            }).catch(() => {})
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error)
    return NextResponse.json({ error: error.message || 'Webhook Handler Error' }, { status: 500 })
  }
}
