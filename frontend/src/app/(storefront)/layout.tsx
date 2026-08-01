import { PromoBar } from '@/components/storefront/PromoBar'
import { Navbar } from '@/components/storefront/Navbar'
import { CartDrawer } from '@/components/storefront/CartDrawer'
import { Footer } from '@/components/storefront/Footer'
import Script from 'next/script'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <PromoBar />
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <CartDrawer />
      <Footer />
    </div>
  )
}
