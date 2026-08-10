import { prisma } from '@/lib/prisma'
import { HeroCarousel } from '@/components/storefront/HeroCarousel'
import { CategoryGrid } from '@/components/storefront/CategoryGrid'
import { ProductCard } from '@/components/storefront/ProductCard'
import { BrandStory } from '@/components/storefront/BrandStory'
import Link from 'next/link'

// Sample products for immediate preview before database seeding
const MOCK_BESTSELLERS = [
  {
    id: 'prod-1',
    title: 'Aura Oversized Acid Wash T-Shirt',
    slug: 'aura-oversized-acid-wash-tshirt',
    brand: 'ATTUS RAW',
    basePrice: 999,
    compareAtPrice: 1999,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    isBestseller: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 34,
    defaultVariant: {
      id: 'var-1',
      sku: 'AURA-BLK-M',
      size: 'M',
      color: 'Vintage Black',
      colorHex: '#222222',
      price: 999,
      stock: 40,
    },
  },
  {
    id: 'prod-2',
    title: 'Cyberpunk Cyber-Mesh Graphic Hoodie',
    slug: 'cyberpunk-cyber-mesh-graphic-hoodie',
    brand: 'ATTUS RAW',
    basePrice: 1899,
    compareAtPrice: 3499,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&q=80',
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 28,
    defaultVariant: {
      id: 'var-2',
      sku: 'CYBER-HOOD-L',
      size: 'L',
      color: 'Jet Black',
      colorHex: '#111111',
      price: 1899,
      stock: 20,
    },
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
    rating: 4.7,
    reviewsCount: 19,
    defaultVariant: {
      id: 'var-3',
      sku: 'CARGO-KHAKI-32',
      size: '32',
      color: 'Khaki Olive',
      colorHex: '#556b2f',
      price: 1499,
      stock: 25,
    },
  },
  {
    id: 'prod-4',
    title: 'Solstice Ribbed Seamless Crop Top',
    slug: 'solstice-ribbed-seamless-crop-top',
    brand: 'ATTUS LUXE',
    basePrice: 699,
    compareAtPrice: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    isBestseller: true,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 42,
    defaultVariant: {
      id: 'var-4',
      sku: 'SOL-WHT-S',
      size: 'S',
      color: 'Off White',
      colorHex: '#fafafa',
      price: 699,
      stock: 30,
    },
  },
]

export default async function HomePage() {
  let bestsellers = MOCK_BESTSELLERS
  let newArrivals = MOCK_BESTSELLERS
  let banners = undefined

  try {
    const dbBestsellers = await prisma.product.findMany({
      where: { isActive: true, isBestseller: true },
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: { where: { isActive: true }, take: 1 },
      },
      take: 8,
    })

    if (dbBestsellers.length > 0) {
      bestsellers = dbBestsellers.map((p: any) => ({
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
        rating: 4.8,
        reviewsCount: 15,
        defaultVariant: p.variants[0]
          ? {
              id: p.variants[0].id,
              sku: p.variants[0].sku,
              size: p.variants[0].size,
              color: p.variants[0].color,
              colorHex: p.variants[0].colorHex || undefined,
              price: p.variants[0].price,
              stock: p.variants[0].stock,
            }
          : undefined,
      })) as any
    }

    const dbBanners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
    })
    if (dbBanners.length > 0) {
      banners = dbBanners
    }
  } catch (err) {
    // Fall back to mock data
  }

  return (
    <div>
      {/* Hero Banner Carousel */}
      <HeroCarousel banners={banners} />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Bestsellers Section */}
      <section style={{ padding: '4rem 0', background: 'white' }}>
        <div className="container-narrow">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--color-brand-accent)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
                MOST LOVED
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginTop: '4px' }}>
                BESTSELLERS
              </h2>
            </div>
            <Link href="/collections/bestsellers" className="btn btn-outline btn-sm">
              VIEW ALL BESTSELLERS →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {bestsellers.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Offer Strip */}
      <section style={{ padding: '2.5rem 0', background: 'var(--color-brand-accent)', color: 'white', textTransform: 'uppercase' }}>
        <div className="container-narrow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              BUY 2 GET 10% OFF | BUY 3 GET 15% OFF
            </h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Discount automatically applied at checkout across all collections!</p>
          </div>
          <Link href="/collections/all" className="btn btn-primary btn-lg" style={{ background: 'var(--color-brand-primary)', border: 'none' }}>
            SHOP BUNDLE OFFERS
          </Link>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section style={{ padding: '4rem 0', background: 'var(--color-surface-2)' }}>
        <div className="container-narrow">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--color-brand-primary)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
                FRESH DROPS
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginTop: '4px' }}>
                NEW ARRIVALS
              </h2>
            </div>
            <Link href="/collections/new-arrivals" className="btn btn-outline btn-sm">
              EXPLORE ALL NEW DROPS →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {newArrivals.map((item) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Ethos */}
      <BrandStory />
    </div>
  )
}
