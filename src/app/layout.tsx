import type { Metadata } from 'next'
import { StoreProvider } from '@/components/store/StoreContext'
import { StoreModal } from '@/components/store/StoreModal'
import { CartProvider } from '@/components/cart/CartContext'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import './globals.css'

export const metadata: Metadata = {
  title: 'Just Hype — Boutique Homme Tunisie',
  description: 'Mode masculine premium. Boutiques à Tunis et Gabès.',
  openGraph: {
    title: 'Just Hype',
    description: 'Mode masculine premium. Boutiques à Tunis et Gabès.',
    type: 'website',
    locale: 'fr_TN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
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
