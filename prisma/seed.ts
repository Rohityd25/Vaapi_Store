import { PrismaClient, Role, OrderStatus, PaymentMethod, PaymentStatus, StockMovementType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Clean existing data
  await prisma.review.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.stockMovement.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.vendor.deleteMany()
  await prisma.user.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.blogPost.deleteMany()

  // 2. Create Users
  const passwordHash = await bcrypt.hash('admin123', 10)
  const customerPassword = await bcrypt.hash('customer123', 10)
  const vendorPassword = await bcrypt.hash('vendor123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@vaapi.com',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  })

  const vendorOrg = await prisma.vendor.create({
    data: {
      name: 'Urban Threads Co.',
      contactEmail: 'contact@urbanthreads.in',
      contactPhone: '+91 9876543210',
      gstNumber: '07AAAAA0000A1Z5',
      commissionPct: 15,
      bankDetails: {
        accountName: 'Urban Threads Co',
        accountNumber: '1234567890',
        ifsc: 'HDFC0001234',
        bankName: 'HDFC Bank',
      },
    },
  })

  const vendorUser = await prisma.user.create({
    data: {
      name: 'Urban Threads Admin',
      email: 'vendor@vaapi.com',
      passwordHash: vendorPassword,
      role: Role.VENDOR,
      vendorId: vendorOrg.id,
    },
  })

  const customer = await prisma.user.create({
    data: {
      name: 'Rohan Sharma',
      email: 'customer@vaapi.com',
      phone: '+91 9988776655',
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
      addresses: {
        create: [
          {
            fullName: 'Rohan Sharma',
            phone: '+91 9988776655',
            line1: 'Flat 402, Sunshine Apartments',
            line2: 'MG Road, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
            isDefault: true,
          },
        ],
      },
    },
  })

  console.log('✅ Users & Vendors created')

  // 3. Create Categories
  const men = await prisma.category.create({
    data: { name: 'Men', slug: 'men', description: 'Men Streetwear & Casuals' },
  })

  const women = await prisma.category.create({
    data: { name: 'Women', slug: 'women', description: 'Women Fashion & Streetwear' },
  })

  const tshirts = await prisma.category.create({
    data: { name: 'T-Shirts', slug: 'men-tshirts', parentId: men.id },
  })

  const hoodies = await prisma.category.create({
    data: { name: 'Hoodies & Sweatshirts', slug: 'men-hoodies', parentId: men.id },
  })

  const joggers = await prisma.category.create({
    data: { name: 'Joggers & Cargoes', slug: 'men-joggers', parentId: men.id },
  })

  const womenTops = await prisma.category.create({
    data: { name: 'Crop Tops & Tees', slug: 'women-tshirts', parentId: women.id },
  })

  console.log('✅ Categories created')

  // 4. Create Products & Variants
  const productsData = [
    {
      title: 'Aura Oversized Acid Wash T-Shirt',
      slug: 'aura-oversized-acid-wash-tshirt',
      description: 'Heavyweight 240 GSM 100% combed cotton. Signature relaxed oversized drop-shoulder fit with vintage acid-wash finish.',
      brand: 'VAAPI RAW',
      basePrice: 999,
      compareAtPrice: 1999,
      isBestseller: true,
      isNewArrival: true,
      categoryId: tshirts.id,
      vendorId: vendorOrg.id,
      tags: ['oversized', 'acid-wash', 'streetwear', 'cotton'],
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      ],
      variants: [
        { sku: 'AURA-BLK-S', size: 'S', color: 'Vintage Black', colorHex: '#222222', price: 999, stock: 25 },
        { sku: 'AURA-BLK-M', size: 'M', color: 'Vintage Black', colorHex: '#222222', price: 999, stock: 40 },
        { sku: 'AURA-BLK-L', size: 'L', color: 'Vintage Black', colorHex: '#222222', price: 999, stock: 15 },
        { sku: 'AURA-BLK-XL', size: 'XL', color: 'Vintage Black', colorHex: '#222222', price: 999, stock: 8 },
        { sku: 'AURA-BLU-M', size: 'M', color: 'Acid Blue', colorHex: '#3b82f6', price: 999, stock: 20 },
      ],
    },
    {
      title: 'Cyberpunk Cyber-Mesh Graphic Hoodie',
      slug: 'cyberpunk-cyber-mesh-graphic-hoodie',
      description: 'Ultra-warm 380 GSM fleece hoodie with high-density puff graphic prints on sleeves and back. Double-lined hood with custom metal aglets.',
      brand: 'VAAPI RAW',
      basePrice: 1899,
      compareAtPrice: 3499,
      isBestseller: true,
      isNewArrival: false,
      categoryId: hoodies.id,
      vendorId: vendorOrg.id,
      tags: ['hoodie', 'fleece', 'graphic', 'streetwear'],
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&q=80',
      ],
      variants: [
        { sku: 'CYBER-HOOD-M', size: 'M', color: 'Jet Black', colorHex: '#111111', price: 1899, stock: 12 },
        { sku: 'CYBER-HOOD-L', size: 'L', color: 'Jet Black', colorHex: '#111111', price: 1899, stock: 20 },
        { sku: 'CYBER-HOOD-XL', size: 'XL', color: 'Jet Black', colorHex: '#111111', price: 1899, stock: 5 },
      ],
    },
    {
      title: 'Tactical Multi-Pocket Utility Cargo Joggers',
      slug: 'tactical-multi-pocket-utility-cargo-joggers',
      description: '6-pocket heavy twill cargo joggers with elastic drawstring waist and adjustable ankle toggles for customizable streetwear silhouette.',
      brand: 'URBAN THREADS',
      basePrice: 1499,
      compareAtPrice: 2799,
      isBestseller: false,
      isNewArrival: true,
      categoryId: joggers.id,
      vendorId: vendorOrg.id,
      tags: ['cargo', 'joggers', 'tactical', 'bottomwear'],
      images: [
        'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&q=80',
      ],
      variants: [
        { sku: 'CARGO-KHAKI-30', size: '30', color: 'Khaki Olive', colorHex: '#556b2f', price: 1499, stock: 18 },
        { sku: 'CARGO-KHAKI-32', size: '32', color: 'Khaki Olive', colorHex: '#556b2f', price: 1499, stock: 25 },
        { sku: 'CARGO-BLK-32', size: '32', color: 'Matte Black', colorHex: '#1a1a1a', price: 1499, stock: 30 },
      ],
    },
    {
      title: 'Solstice Ribbed Seamless Crop Top',
      slug: 'solstice-ribbed-seamless-crop-top',
      description: 'Premium stretch ribbed knit crop top with micro-embroidered emblem. Ultra-breathable moisture-wicking fabric for everyday style.',
      brand: 'VAAPI LUXE',
      basePrice: 699,
      compareAtPrice: 1299,
      isBestseller: true,
      isNewArrival: true,
      categoryId: womenTops.id,
      vendorId: vendorOrg.id,
      tags: ['crop-top', 'women', 'ribbed', 'seamless'],
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
      ],
      variants: [
        { sku: 'SOL-WHT-XS', size: 'XS', color: 'Off White', colorHex: '#fafafa', price: 699, stock: 10 },
        { sku: 'SOL-WHT-S', size: 'S', color: 'Off White', colorHex: '#fafafa', price: 699, stock: 30 },
        { sku: 'SOL-PNK-S', size: 'S', color: 'Dusty Pink', colorHex: '#ec4899', price: 699, stock: 15 },
      ],
    },
  ]

  for (const prod of productsData) {
    const product = await prisma.product.create({
      data: {
        title: prod.title,
        slug: prod.slug,
        description: prod.description,
        brand: prod.brand,
        basePrice: prod.basePrice,
        compareAtPrice: prod.compareAtPrice,
        isBestseller: prod.isBestseller,
        isNewArrival: prod.isNewArrival,
        categoryId: prod.categoryId,
        vendorId: prod.vendorId,
        tags: prod.tags,
        images: {
          create: prod.images.map((url, pos) => ({
            url,
            altText: `${prod.title} View ${pos + 1}`,
            position: pos,
          })),
        },
        variants: {
          create: prod.variants.map((v) => ({
            sku: v.sku,
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            price: v.price,
            stock: v.stock,
          })),
        },
      },
    })

    // Add initial review
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: customer.id,
        rating: 5,
        comment: 'Absolutely love the quality and oversized fit! Will definitely order again.',
        isApproved: true,
      },
    })
  }

  console.log('✅ Products, Images & Variants seeded')

  // 5. Create Banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'DROP 04: ACID SURREALISM',
        subtitle: 'Heavyweight Oversized Tees & Graphic Hoodies',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
        linkUrl: '/collections/men-tshirts',
        ctaText: 'EXPLORE DROP',
        position: 0,
        isActive: true,
      },
      {
        title: 'FLAT 50% OFF END OF SEASON SALE',
        subtitle: 'Use code VAAPI50 at checkout',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
        linkUrl: '/collections/sale',
        ctaText: 'SHOP SALE',
        position: 1,
        isActive: true,
      },
    ],
  })

  // 6. Create Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        type: 'PERCENT',
        value: 10,
        minOrderValue: 499,
        description: '10% OFF on your first order',
      },
      {
        code: 'VAAPI500',
        type: 'FLAT',
        value: 500,
        minOrderValue: 2499,
        description: 'Flat ₹500 OFF on orders above ₹2499',
      },
    ],
  })

  // 7. Create Blog Posts
  await prisma.blogPost.create({
    data: {
      title: 'The Evolution of Streetwear in India: From Niche to Mainstream',
      slug: 'evolution-of-streetwear-in-india',
      excerpt: 'How oversized fits, drop shoulder silhouettes, and graphic tees took over Indian youth fashion.',
      coverImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=80',
      body: `
        # The Rise of Indian Streetwear
        
        Over the last five years, Indian youth fashion has undergone a massive cultural shift. Traditional fitted tees and formal shirts are giving way to relaxed, boxy, oversized silhouettes...
        
        ## Why 240 GSM Cotton Matters
        Quality fabric is the backbone of great streetwear. Higher GSM (Grams per Square Meter) gives tees structured drapes that don't sag after washing...
      `,
      author: 'VAAPI Editorial Team',
      publishedAt: new Date(),
    },
  })

  console.log('✅ Banners, Coupons & Blog posts seeded!')
  console.log('🎉 DB Seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
