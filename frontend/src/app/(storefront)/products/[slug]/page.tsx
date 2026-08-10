import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/storefront/ProductCard'
import { ProductDetailClient } from './ProductDetailClient'

const MOCK_SINGLE_PRODUCT = {
  id: 'prod-1',
  title: 'Aura Oversized Acid Wash T-Shirt',
  slug: 'aura-oversized-acid-wash-tshirt',
  description: 'Heavyweight 240 GSM 100% combed cotton. Signature relaxed oversized drop-shoulder fit with vintage acid-wash finish for an effortlessly edgy aesthetic.',
  brand: 'ATTUS RAW',
  basePrice: 999,
  compareAtPrice: 1999,
  isBestseller: true,
  isNewArrival: true,
  images: [
    { id: 'img-1', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', altText: 'Front View' },
    { id: 'img-2', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', altText: 'Back View' },
  ],
  variants: [
    { id: 'v-1', sku: 'AURA-BLK-S', size: 'S', color: 'Vintage Black', colorHex: '#222222', price: 999, stock: 25 },
    { id: 'v-2', sku: 'AURA-BLK-M', size: 'M', color: 'Vintage Black', colorHex: '#222222', price: 999, stock: 40 },
    { id: 'v-3', sku: 'AURA-BLK-L', size: 'L', color: 'Vintage Black', colorHex: '#222222', price: 999, stock: 15 },
    { id: 'v-4', sku: 'AURA-BLK-XL', size: 'XL', color: 'Vintage Black', colorHex: '#222222', price: 999, stock: 0 },
    { id: 'v-5', sku: 'AURA-BLU-M', size: 'M', color: 'Acid Blue', colorHex: '#3b82f6', price: 999, stock: 20 },
  ],
  reviews: [
    { id: 'rev-1', rating: 5, comment: 'Hands down the best quality oversized tee I own in India. Perfect drop shoulder!', user: { name: 'Aryan K.' }, createdAt: new Date() },
    { id: 'rev-2', rating: 5, comment: 'Heavy fabric, great wash quality. Fabric feels premium!', user: { name: 'Priya M.' }, createdAt: new Date() },
  ],
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let product: any = MOCK_SINGLE_PRODUCT
  let relatedProducts: any[] = []

  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: { where: { isActive: true } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (dbProduct) {
      product = dbProduct

      // Fetch related
      const dbRelated = await prisma.product.findMany({
        where: {
          categoryId: dbProduct.categoryId,
          id: { not: dbProduct.id },
          isActive: true,
        },
        include: {
          images: { take: 2 },
          variants: { take: 1 },
        },
        take: 4,
      })

      relatedProducts = dbRelated.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        brand: p.brand,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        imageUrl: p.images[0]?.url,
        secondaryImageUrl: p.images[1]?.url,
        isBestseller: p.isBestseller,
        isNewArrival: p.isNewArrival,
        defaultVariant: p.variants[0],
      }))
    }
  } catch (err) {
    // Fall back to mock
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0', background: 'white' }}>
      <div className="container-narrow">
        <ProductDetailClient product={product} />

        {/* Reviews Section */}
        <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>
            CUSTOMER REVIEWS & RATINGS ({product.reviews?.length || 0})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev: any) => (
                <div key={rev.id} style={{ padding: '1.25rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>{rev.user?.name || 'Verified Buyer'}</span>
                    <span style={{ color: 'var(--color-brand-gold)', fontWeight: 700 }}>★ {rev.rating}.0</span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>{rev.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--color-text-muted)' }}>No reviews yet. Be the first to leave a review!</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>
              YOU MIGHT ALSO LIKE
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} {...rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
