import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Vaapi Comfort — Premium Streetwear & Fashion',
    template: '%s | Vaapi Comfort',
  },
  description:
    'Discover premium streetwear and fashion at Vaapi Comfort. Shop the latest collections, bestsellers, and new arrivals with fast delivery across India.',
  keywords: ['streetwear', 'fashion', 'clothing', 'online shopping', 'India', 'vaapi'],
  openGraph: {
    title: 'Vaapi Comfort — Premium Streetwear & Fashion',
    description: 'Discover premium streetwear and fashion at Vaapi Comfort.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
