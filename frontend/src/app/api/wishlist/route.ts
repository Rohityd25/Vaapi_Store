import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ items: [] })
  const items = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      // wishlist stores productId — join manually
    },
  })
  const productIds = items.map((i) => i.productId)
  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { images: { take: 1 }, variants: { take: 1 } },
      })
    : []
  return NextResponse.json({ items: products })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { productId } = await req.json()
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })
  try {
    await prisma.wishlist.create({
      data: { userId: session.user.id, productId },
    })
  } catch {
    // unique constraint — already there. No-op.
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const url = new URL(req.url)
  const productId = url.searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })
  await prisma.wishlist.deleteMany({
    where: { userId: session.user.id, productId },
  })
  return NextResponse.json({ success: true })
}
