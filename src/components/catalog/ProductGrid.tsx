'use client'

import type { Product } from '@/types'
import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: Product[]
  showPrice?: boolean
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-16">
        Aucun produit à afficher — marquez des produits comme featured dans Supabase.
      </p>
    )
  }
  return <ProductGrid products={products} showPrice={false} />
}

export function ProductGrid({ products, showPrice = true }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} showPrice={showPrice} />
      ))}
    </div>
  )
}