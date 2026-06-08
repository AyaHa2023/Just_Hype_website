import type { Metadata } from 'next'
import { StoreProvider } from '@/components/store/StoreContext'
import { StoreModal } from '@/components/store/StoreModal'
import { CartProvider } from '@/components/cart/CartContext'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { DEFAULT_KEYWORDS, SITE_URL } from '@/lib/seo'
import './globals.css'

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Just Hype — Marque Vêtements Homme Tunisie',
    template: '%s | Just Hype',
  },
  description:
    'Just Hype — marque et boutique de mode masculine en Tunisie. Vêtements homme premium à Tunis et Gabès.',
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: 'Just Hype', url: 'https://justhype.tn' }],
  creator: 'Just Hype',
  publisher: 'Just Hype',
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    url: 'https://justhype.tn',
    title: 'Just Hype — Mode Masculine Premium',
    description: 'Boutique en ligne de mode masculine à Tunis et Gabès. Vêtements de qualité, prix compétitifs.',
    siteName: 'Just Hype',
    images: [
      {
        url: 'https://justhype.tn/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Just Hype - Mode Masculine',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Just Hype — Mode Masculine',
    description: 'Boutique mode pour hommes à Tunis et Gabès',
    images: ['https://justhype.tn/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  ...(googleVerification
    ? {
        verification: { google: googleVerification },
        other: { 'google-site-verification': googleVerification },
      }
    : {}),
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://vvuexibjggnodplzuzbv.supabase.co" />
        <link rel="dns-prefetch" href="https://vvuexibjggnodplzuzbv.supabase.co" />
      </head>
      <body
        className="
          bg-white text-black antialiased
          min-h-screen
          selection:bg-black selection:text-white
          overflow-x-hidden
        "
      >
        <StoreProvider>
          <CartProvider>
            <StoreModal />

            {children}

            <ScrollToTop />
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
