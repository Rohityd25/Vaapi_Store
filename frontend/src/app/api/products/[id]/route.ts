import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/products/[id] — Fetch single product details by ID or Slug
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: true,
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

/**
 * PUT /api/products/[id] — Update product details, status, images & variants
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const {
      title,
      description,
      brand,
      categoryId,
      basePrice,
      compareAtPrice,
      isActive,
      isBestseller,
      isNewArrival,
      images,
      variants,
    } = body || {}

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (brand !== undefined) updateData.brand = brand
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (basePrice !== undefined) updateData.basePrice = Number(basePrice)
    if (compareAtPrice !== undefined) updateData.compareAtPrice = compareAtPrice ? Number(compareAtPrice) : null
    if (isActive !== undefined) updateData.isActive = Boolean(isActive)
    if (isBestseller !== undefined) updateData.isBestseller = Boolean(isBestseller)
    if (isNewArrival !== undefined) updateData.isNewArrival = Boolean(isNewArrival)

    // Update main product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        variants: true,
      },
    })

    // If new images provided, recreate image list
    if (Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } })
      await prisma.productImage.createMany({
        data: images.map((url: string, index: number) => ({
          productId: id,
          url,
          altText: `${updatedProduct.title} View ${index + 1}`,
          position: index,
        })),
      })
    }

    // If variants array provided, update existing or create
    if (Array.isArray(variants)) {
      for (const v of variants) {
        if (v.id) {
          await prisma.productVariant.update({
            where: { id: v.id },
            data: {
              size: v.size,
              color: v.color,
              price: v.price ? Number(v.price) : undefined,
              stock: v.stock !== undefined ? Number(v.stock) : undefined,
              isActive: v.isActive !== undefined ? Boolean(v.isActive) : undefined,
            },
          }).catch(() => {})
        } else {
          await prisma.productVariant.create({
            data: {
              productId: id,
              sku: v.sku || `${updatedProduct.slug.toUpperCase().slice(0, 5)}-${v.size || 'STD'}-${Date.now().toString().slice(-3)}`,
              size: v.size || 'M',
              color: v.color || 'Standard',
              colorHex: v.colorHex || '#111111',
              price: Number(v.price || updatedProduct.basePrice),
              stock: Number(v.stock || 0),
            },
          }).catch(() => {})
        }
      }
    }

    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: true,
        category: true,
      },
    })

    return NextResponse.json({ success: true, product: finalProduct })
  } catch (error: any) {
    console.error('Update Product Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 })
  }
}

/**
 * DELETE /api/products/[id] — Delete product and related variants/images
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Clean up dependent models
    await prisma.review.deleteMany({ where: { productId: id } })
    await prisma.wishlist.deleteMany({ where: { productId: id } })
    await prisma.productImage.deleteMany({ where: { productId: id } })
    await prisma.productVariant.deleteMany({ where: { productId: id } })
    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Product deleted successfully' })
  } catch (error: any) {
    console.error('Delete Product Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 })
  }
}
