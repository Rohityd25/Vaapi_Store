import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

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

    const where: any = {}
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
        images: { orderBy: { position: 'asc' } },
        variants: true,
        category: true,
      },
    })
    return NextResponse.json({ products })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

/**
 * POST /api/products — Creates a new Product with variants and images
 */
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || !['SUPER_ADMIN', 'STAFF', 'VENDOR'].includes(session.user?.role || '')) {
      // Allow fallback in development/mock mode if no session
      if (process.env.NODE_ENV === 'production' && !session) {
        return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 })
      }
    }

    const body = await req.json()
    const {
      title,
      description,
      brand = 'ATTUS RAW',
      categoryId,
      basePrice,
      compareAtPrice,
      isBestseller = false,
      isNewArrival = true,
      images = [],
      variants = [],
    } = body || {}

    if (!title || !basePrice) {
      return NextResponse.json({ error: 'Title and Base Price are required' }, { status: 400 })
    }

    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`

    // Default category fallback
    let finalCategoryId = categoryId
    if (!finalCategoryId) {
      const defaultCategory = await prisma.category.findFirst()
      if (defaultCategory) {
        finalCategoryId = defaultCategory.id
      } else {
        const createdCat = await prisma.category.create({
          data: { name: 'Streetwear', slug: 'streetwear' },
        })
        finalCategoryId = createdCat.id
      }
    }

    const numBasePrice = Number(basePrice)
    const numComparePrice = compareAtPrice ? Number(compareAtPrice) : null

    // Process image URLs
    const imageList: string[] = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80']

    // Default variants if none provided
    const variantList = Array.isArray(variants) && variants.length > 0
      ? variants
      : [
          { size: 'S', color: 'Black', colorHex: '#111111', stock: 20 },
          { size: 'M', color: 'Black', colorHex: '#111111', stock: 35 },
          { size: 'L', color: 'Black', colorHex: '#111111', stock: 15 },
        ]

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || '',
        brand,
        basePrice: numBasePrice,
        compareAtPrice: numComparePrice,
        isBestseller: Boolean(isBestseller),
        isNewArrival: Boolean(isNewArrival),
        categoryId: finalCategoryId,
        images: {
          create: imageList.map((url: string, index: number) => ({
            url,
            altText: `${title} View ${index + 1}`,
            position: index,
          })),
        },
        variants: {
          create: variantList.map((v: any, index: number) => ({
            sku: v.sku || `${baseSlug.toUpperCase().slice(0, 5)}-${v.size || 'STD'}-${index}`,
            size: v.size || 'M',
            color: v.color || 'Standard',
            colorHex: v.colorHex || '#111111',
            price: Number(v.price || numBasePrice),
            stock: Number(v.stock || 0),
          })),
        },
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Create Product Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 })
  }
}
