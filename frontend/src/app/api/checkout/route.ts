import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  StockMovementType,
} from '@prisma/client'
import { createRazorpayOrder } from '@/lib/razorpay'

/**
 * POST /api/checkout
 * Creates an Order with server-verified pricing/stock and either:
 *  - Returns a Razorpay order (for online payment) — order stays PENDING until verify
 *  - Confirms the order directly for COD
 *
 * Request body:
 *  { address, items: [{variantId, quantity}], couponCode?, paymentMethod, guestEmail? }
 */
import { z } from 'zod'

const checkoutSchema = z.object({
  guestEmail: z.string().email().optional().or(z.literal('')),
  address: z.object({
    fullName: z.string().min(2, 'Name is required'),
    phone: z.string().min(8, 'Phone number is required'),
    line1: z.string().min(3, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(4, 'Pincode is required'),
  }),
  items: z.array(
    z.object({
      variantId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'Cart cannot be empty'),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['RAZORPAY', 'COD']),
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()
    
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => i.message).join(', ')
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

    const { guestEmail, address, items, couponCode, paymentMethod } = parsed.data
    const userId = session?.user?.id || null
    if (!userId && !guestEmail) {
      return NextResponse.json({ error: 'Email required for guest checkout' }, { status: 400 })
    }

    // 1) Fetch variants + product info from DB (server-side pricing/stock)
    const variantIds = items.map((i) => i.variantId)
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds }, isActive: true },
      include: { product: { select: { id: true, title: true, slug: true } } },
    })

    if (variants.length !== items.length) {
      return NextResponse.json({ error: 'One or more items are unavailable' }, { status: 400 })
    }

    // 2) Validate stock & compute subtotal from DB prices
    let subtotal = 0
    const orderItems: { variantId: string; quantity: number; price: number; title: string }[] = []
    for (const req of items) {
      const v = variants.find((x) => x.id === req.variantId)!
      if (req.quantity <= 0 || req.quantity > v.stock) {
        return NextResponse.json(
          { error: `Insufficient stock for ${v.product.title} (${v.size}/${v.color})` },
          { status: 400 }
        )
      }
      subtotal += v.price * req.quantity
      orderItems.push({
        variantId: v.id,
        quantity: req.quantity,
        price: v.price,
        title: v.product.title,
      })
    }

    // 3) Coupon validation
    let discount = 0
    let appliedCoupon: string | null = null
    if (couponCode) {
      const c = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } })
      if (
        c &&
        c.isActive &&
        (!c.expiresAt || c.expiresAt > new Date()) &&
        (!c.maxUses || c.usedCount < c.maxUses) &&
        (!c.minOrderValue || subtotal >= c.minOrderValue)
      ) {
        discount = c.type === 'PERCENT' ? Math.round((subtotal * c.value) / 100) : c.value
        appliedCoupon = c.code
      }
    }

    // 4) Shipping
    const shippingFee = subtotal >= 999 ? 0 : 99
    const total = Math.max(0, subtotal - discount + shippingFee)

    // 5) Create Order (PENDING for Razorpay; CONFIRMED for COD)
    const orderNumber = `ATTUS-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`
    const isRzp = paymentMethod === 'RAZORPAY'

    const order = await prisma.order.create({
      data: {
        orderNumber,
        guestEmail: guestEmail || null,
        userId,
        address,
        subtotal,
        discount,
        shippingFee,
        total,
        couponCode: appliedCoupon,
        paymentMethod: isRzp ? PaymentMethod.RAZORPAY : PaymentMethod.COD,
        paymentStatus: PaymentStatus.PENDING,
        status: isRzp ? OrderStatus.PENDING : OrderStatus.CONFIRMED,
        items: {
          create: orderItems.map((it) => ({
            variantId: it.variantId,
            quantity: it.quantity,
            price: it.price,
          })),
        },
      },
    })

    // 6) For COD: decrement stock now. For Razorpay: wait until verify.
    if (!isRzp) {
      for (const it of orderItems) {
        await prisma.productVariant.update({
          where: { id: it.variantId },
          data: { stock: { decrement: it.quantity } },
        })
        await prisma.stockMovement.create({
          data: {
            variantId: it.variantId,
            type: StockMovementType.SALE,
            quantity: it.quantity,
            note: `Order ${orderNumber} (COD)`,
          },
        })
      }
      // Bump coupon usage for COD (immediate)
      if (appliedCoupon) {
        await prisma.coupon
          .update({ where: { code: appliedCoupon }, data: { usedCount: { increment: 1 } } })
          .catch(() => {})
      }
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentMethod: 'COD',
        total,
      })
    }

    // 7) Razorpay: create/mock payment order
    const mockMode =
      process.env.PAYMENT_MOCK_MODE === 'true' ||
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET

    if (mockMode) {
      const mockRzpOrderId = `order_MOCK_${Date.now()}`
      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: mockRzpOrderId },
      })
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentMethod: 'RAZORPAY',
        mock: true,
        razorpayOrderId: mockRzpOrderId,
        keyId: 'rzp_test_MOCK',
        amount: Math.round(total * 100),
        currency: 'INR',
      })
    }

    const rzpOrder = await createRazorpayOrder({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: orderNumber,
      notes: { orderId: order.id },
    })
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rzpOrder.id },
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentMethod: 'RAZORPAY',
      razorpayOrderId: rzpOrder.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      amount: Math.round(total * 100),
      currency: 'INR',
    })
  } catch (error: any) {
    console.error('Checkout API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
