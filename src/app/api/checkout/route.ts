import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OrderStatus, PaymentMethod, PaymentStatus, StockMovementType } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      guestEmail,
      userId,
      address,
      items,
      subtotal,
      discount,
      shippingFee,
      total,
      couponCode,
      paymentMethod,
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Generate unique order number
    const orderNumber = `ATTUS-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        guestEmail: guestEmail || null,
        userId: userId || null,
        address,
        subtotal,
        discount: discount || 0,
        shippingFee: shippingFee || 0,
        total,
        couponCode: couponCode || null,
        paymentMethod: paymentMethod === 'RAZORPAY' ? PaymentMethod.RAZORPAY : PaymentMethod.COD,
        paymentStatus: paymentMethod === 'RAZORPAY' ? PaymentStatus.PAID : PaymentStatus.PENDING,
        status: OrderStatus.CONFIRMED,
        items: {
          create: items.map((item: any) => ({
            variantId: item.variant.id,
            quantity: item.quantity,
            price: item.variant.price,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Update Stock & log stock movement
    for (const item of items) {
      if (item.variant.id) {
        await prisma.productVariant.update({
          where: { id: item.variant.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })

        await prisma.stockMovement.create({
          data: {
            variantId: item.variant.id,
            type: StockMovementType.SALE,
            quantity: item.quantity,
            note: `Order ${orderNumber}`,
          },
        })
      }
    }

    return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber })
  } catch (error: any) {
    console.error('Checkout API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
