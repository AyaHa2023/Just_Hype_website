// import { createClient } from '@/lib/supabase/server'
// import Link from 'next/link'
// import { Footer } from '@/components/layout/Footer'
// import { Header } from '@/components/layout/Header'
// import { ScrollToTop } from '@/components/layout/ScrollToTop'
// import { ProductCarousel } from '@/components/product/ProductCarousel'
// import { ProductDetailsPanel } from '@/components/product/ProductDetailsPanel'
// import { ProductGrid } from '@/components/catalog/ProductGrid'
// import type { Product } from '@/types'
// import { notFound } from 'next/navigation'

// export async function generateMetadata(props: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug } = await props.params
//   const supabase = await createClient()
  
//   const { data: product } = await supabase
//     .from('products')
//     .select('id, name, slug, price')
//     .eq('slug', slug)
//     .single()

//   return {
//     title: product?.name || 'Produit',
//     description: `${product?.name} - ${product?.price} TND`,
//   }
// }

// export default async function ProductPage(props: {
//   params: Promise<{ slug: string }>
// }) {
//   const { slug } = await props.params
//   const supabase = await createClient()

//   const { data: product, error } = await supabase
//     .from('products')
//     .select(`
//       id,
//       name,
//       slug,
//       price,
//       price_after_discount,
//       discount_percent,
//       description,
//       category_id,
//       is_featured,
//       categories ( id, name, slug ),
//       product_images ( id, image_path, sort_order ),
//       product_variants (
//         id,
//         color_id,
//         size_id,
//         colors ( id, name, hex_code ),
//         sizes ( id, name ),
//         inventory (
//           quantity,
//           store_id,
//           stores ( id, name, whatsapp_number )
//         )
//       )
//     `)
//     .eq('slug', slug)
//     .single()

//   if (error || !product) {
//     notFound()
//   }

//   const typedProduct = product as unknown as Product

//   // Get related products (same category)
//   const { data: relatedProducts } = await supabase
//     .from('products')
//     .select(`
//       id,
//       name,
//       slug,
//       price,
//       price_after_discount,
//       discount_percent,
//       is_featured,
//       categories ( id, name, slug ),
//       product_images ( image_path, sort_order ),
//       product_variants (
//         id,
//         colors ( id, name, hex_code ),
//         sizes ( id, name ),
//         inventory (
//           quantity,
//           store_id,
//           stores ( id, name, whatsapp_number )
//         )
//       )
//     `)
//     .eq('category_id', typedProduct.category_id)
//     .neq('id', typedProduct.id)
//     .limit(8)

//   return (
//     <main className="min-h-screen bg-white overflow-x-hidden">
//       <Header />
//       <ScrollToTop />
      
//       {/* Product Detail Section */}
//       <section className="pt-14 sm:pt-16 md:pt-20 px-3 sm:px-4 md:px-8 lg:px-16 py-8 md:py-12">
//         {/* Back Link */}
//         <Link
//           href={typedProduct.categories?.slug ? `/produits?categorie=${typedProduct.categories.slug}` : '/produits'}
//           className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-8"
//         >
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
//           </svg>
//           Retour
//         </Link>

//         {/* Product Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
//           {/* Left: Carousel */}
//           <div className="flex flex-col">
//             <ProductCarousel product={typedProduct} />
//           </div>

//           {/* Right: Details */}
//           <div className="flex flex-col">
//             <ProductDetailsPanel product={typedProduct} />
//           </div>
//         </div>
//       </section>

//       {/* Related Products Section */}
//       {relatedProducts && relatedProducts.length > 0 && (
//         <section className="px-3 sm:px-4 md:px-8 lg:px-16 py-12 md:py-16 border-t border-gray-100">
//           <div className="mb-8 md:mb-10">
//             <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">
//               Vous aimerez aussi
//             </p>
//             <h2 className="text-xl sm:text-2xl font-light tracking-wide">
//               Produits similaires
//             </h2>
//           </div>
//           <ProductGrid products={relatedProducts as unknown as Product[]} />
//         </section>
//       )}

//       <Footer />
//     </main>
//   )
// }

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { ProductDetailsPanel } from '@/components/product/ProductDetailsPanel'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import type { Product } from '@/types'
import { notFound } from 'next/navigation'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('id, name, slug, price')
    .eq('slug', slug)
    .single()

  return {
    title: product?.name ?? 'Produit',
    description: `${product?.name} - ${product?.price} TND`,
  }
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      price_after_discount,
      discount_percent,
      description,
      category_id,
      is_featured,
      categories ( id, name, slug ),
      product_images ( id, image_path, sort_order ),
      product_variants (
        id,
        color_id,
        size_id,
        colors ( id, name, hex_code ),
        sizes ( id, name ),
        inventory (
          quantity,
          store_id,
          stores ( id, name, whatsapp_number )
        )
      )
    `)
    .eq('slug', slug)
    .single()

  if (error || !product) {
    notFound()
  }

  const typedProduct = product as unknown as Product

  const { data: relatedProducts } = await supabase
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
    .eq('category_id', typedProduct.category_id)
    .neq('id', typedProduct.id)
    .limit(8)

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <ScrollToTop />

      <section className="pt-14 sm:pt-16 md:pt-20 px-3 sm:px-4 md:px-8 lg:px-16 py-8 md:py-12">
        <Link
          href={
            typedProduct.categories?.slug
              ? `/produits?categorie=${typedProduct.categories.slug}`
              : '/produits'
          }
          className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Retour
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
          <div className="flex flex-col">
            <ProductCarousel product={typedProduct} />
          </div>
          <div className="flex flex-col">
            <ProductDetailsPanel product={typedProduct} />
          </div>
        </div>
      </section>

      {relatedProducts && relatedProducts.length > 0 && (
        <section className="px-3 sm:px-4 md:px-8 lg:px-16 py-12 md:py-16 border-t border-gray-100">
          <div className="mb-8 md:mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">
              Vous aimerez aussi
            </p>
            <h2 className="text-xl sm:text-2xl font-light tracking-wide">
              Produits similaires
            </h2>
          </div>
          <ProductGrid products={relatedProducts as unknown as Product[]} />
        </section>
      )}

      <Footer />
    </main>
  )
}