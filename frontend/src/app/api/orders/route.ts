import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * GET /api/orders — returns the authenticated user's orders
 * GET /api/orders?orderNumber=XXX — returns single order (guest lookup by orderNumber if not logged in)
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const orderNumber = url.searchParams.get('orderNumber')
    const session = await auth()

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              variant: {
                include: { product: { include: { images: { take: 1 } } } },
              },
            },
          },
        },
      })
      if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      // If order belongs to a user, require that user to be logged in
      if (order.userId && order.userId !== session?.user?.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.json({ order })
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            variant: {
              include: { product: { include: { images: { take: 1 } } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ orders })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
