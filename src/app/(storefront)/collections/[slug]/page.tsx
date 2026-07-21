import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/storefront/ProductCard'
import { CollectionClient } from './CollectionClient'

const MOCK_COLLECTION_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Aura Oversized Acid Wash T-Shirt',
    slug: 'aura-oversized-acid-wash-tshirt',
    brand: 'VAAPI RAW',
    basePrice: 999,
    compareAtPrice: 1999,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    isBestseller: true,
    isNewArrival: true,
    defaultVariant: { id: 'v-1', sku: 'AURA-S', size: 'S', color: 'Black', price: 999, stock: 20 },
  },
  {
    id: 'prod-2',
    title: 'Cyberpunk Cyber-Mesh Graphic Hoodie',
    slug: 'cyberpunk-cyber-mesh-graphic-hoodie',
    brand: 'VAAPI RAW',
    basePrice: 1899,
    compareAtPrice: 3499,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    isBestseller: true,
    defaultVariant: { id: 'v-2', sku: 'HOOD-M', size: 'M', color: 'Black', price: 1899, stock: 15 },
  },
  {
    id: 'prod-3',
    title: 'Tactical Multi-Pocket Utility Cargo Joggers',
    slug: 'tactical-multi-pocket-utility-cargo-joggers',
    brand: 'URBAN THREADS',
    basePrice: 1499,
    compareAtPrice: 2799,
    imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80',
    isNewArrival: true,
    defaultVariant: { id: 'v-3', sku: 'CARGO-30', size: '30', color: 'Olive', price: 1499, stock: 10 },
  },
  {
    id: 'prod-4',
    title: 'Solstice Ribbed Seamless Crop Top',
    slug: 'solstice-ribbed-seamless-crop-top',
    brand: 'VAAPI LUXE',
    basePrice: 699,
    compareAtPrice: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    isBestseller: true,
    defaultVariant: { id: 'v-4', sku: 'SOL-S', size: 'S', color: 'White', price: 699, stock: 25 },
  },
]

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let categoryName = slug.replace('-', ' ').toUpperCase()
  let products = MOCK_COLLECTION_PRODUCTS

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    })

    if (category) {
      categoryName = category.name
    }

    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { take: 2 },
        variants: { take: 1 },
      },
    })

    if (dbProducts.length > 0) {
      products = dbProducts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        brand: p.brand || undefined,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice || undefined,
        imageUrl: p.images[0]?.url,
        secondaryImageUrl: p.images[1]?.url,
        isBestseller: p.isBestseller,
        isNewArrival: p.isNewArrival,
        defaultVariant: p.variants[0]
          ? {
              id: p.variants[0].id,
              sku: p.variants[0].sku,
              size: p.variants[0].size,
              color: p.variants[0].color,
              price: p.variants[0].price,
              stock: p.variants[0].stock,
            }
          : undefined,
      })) as any
    }
  } catch (err) {
    // Fall back to mock
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0', background: 'var(--color-surface-2)', minHeight: '80vh' }}>
      <div className="container-narrow">
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>COLLECTION</span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 900, textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
            {categoryName}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Showing {products.length} products</p>
        </div>

        <CollectionClient initialProducts={products} />
      </div>
    </div>
  )
}
