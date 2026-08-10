import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/products — supports ?category=slug&search=&limit=&featured=bestseller|new
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const categorySlug = url.searchParams.get('category')
    const search = url.searchParams.get('search') || ''
    const featured = url.searchParams.get('featured')
    const limit = parseInt(url.searchParams.get('limit') || '24', 10)

    const where: any = { isActive: true }
    if (categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: categorySlug } })
      if (cat) where.categoryId = cat.id
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (featured === 'bestseller') where.isBestseller = true
    if (featured === 'new') where.isNewArrival = true

    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { position: 'asc' }, take: 2 },
        variants: { where: { isActive: true } },
        category: true,
      },
    })
    return NextResponse.json({ products })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
