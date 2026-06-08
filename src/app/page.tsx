import Link from 'next/link'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { FeaturedProducts } from '@/components/catalog/ProductGrid'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/layout/HeroSection'
import Image from 'next/image'
import {
  clothingStoreJsonLd,
  DEFAULT_KEYWORDS,
  organizationJsonLd,
  SITE_URL,
  websiteJsonLd,
} from '@/lib/seo'
import type { Product } from '@/types'

export const metadata: Metadata = {
  title: 'Just Hype — Marque Vêtements Homme Tunisie | Boutique Mode Masculine',
  description:
    'Just Hype, marque de vêtements pour hommes en Tunisie. Chemises, pantalons, costumes et mode masculine premium. Boutiques Tunis (Menzah 5) et Gabès. Clothing brand Tunisia.',
  keywords: DEFAULT_KEYWORDS,
  openGraph: {
    title: 'Just Hype — Mode Masculine Premium Tunisie',
    description:
      'Just Hype — boutique et marque de vêtements homme à Tunis et Gabès. Découvrez la collection.',
    type: 'website',
    locale: 'fr_TN',
    url: SITE_URL,
    siteName: 'Just Hype',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default async function Home() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      price_after_discount,
      discount_percent,
      is_featured,
      categories ( id, name, slug ),
      product_images ( image_path, sort_order ),
      product_variants (
        id,
        colors ( id, name, hex_code ),
        sizes ( id, name ),
        inventory (
          quantity,
          store_id,
          stores ( id, name, whatsapp_number )
        )
      )
    `)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(12)

  if (error) {
    console.error('Homepage fetch error:', error)
  }

  const structuredData = [
    organizationJsonLd(),
    websiteJsonLd(),
    ...clothingStoreJsonLd(),
  ]

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <HeroSection />
{/* <div className="flex justify-center py-10 border-b border-gray-100">
  <Image
    src="/images/no_bg_logo.png"
    alt="Just Hype"
    width={80}
    height={80}
    className="opacity-10 object-contain"
  />
</div> */}
      <section className="px-3 sm:px-4 md:px-8 lg:px-16 py-8 sm:py-12 md:py-16">
        <div className="mb-8 md:mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 font-semibold">
            Sélection
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide">
            Nouveautés
          </h2>
        </div>
        <FeaturedProducts products={(products ?? []) as unknown as Product[]} />
      </section>

      <section className="px-3 sm:px-4 md:px-8 lg:px-16 py-8 sm:py-12 md:py-16 border-t border-gray-100">
        <div className="mb-8 md:mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 font-semibold">
            Explorer
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide">
            Catégories
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { name: 'Chemises', slug: 'chemises' },
            { name: 'Pantalons', slug: 'pantalons' },
            { name: 'Costumes', slug: 'costumes' },
            { name: 'Blazers', slug: 'blazers' },
            { name: 'Polos', slug: 'polos' },
            { name: 'Jeans', slug: 'jeans' },
            { name: 'Vestes', slug: 'vestes' },
            { name: 'Accessoires', slug: 'accessoires' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/produits?categorie=${cat.slug}`}
              className="border border-gray-200 hover:border-black transition-colors duration-200 py-4 sm:py-6 px-3 sm:px-4 text-xs sm:text-sm tracking-widest uppercase text-center font-medium hover:bg-black hover:text-white"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
