//C:\Users\USER\Desktop\just_hype\src\components\catalog\ProductGrid.tsx
'use client'

import type { Product } from '@/types'
import { isValidProduct } from '@/lib/products'
import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: Product[]
  showPrice?: boolean
}

const HOMEPAGE_MAX_PRODUCTS = 12

export function FeaturedProducts({ products }: { products: Product[] }) {
  const validProducts = products.filter(isValidProduct).slice(0, HOMEPAGE_MAX_PRODUCTS)

  if (validProducts.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-16">
        Aucun produit à afficher — marquez des produits comme featured dans Supabase.
      </p>
    )
  }

  return <ProductGrid products={validProducts} showPrice />
}

export function ProductGrid({ products, showPrice = true }: ProductGridProps) {
  const validProducts = products.filter(isValidProduct)

  if (validProducts.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
      {validProducts.map((product) => (
        <ProductCard key={product.id} product={product} showPrice={showPrice} />
      ))}
    </div>
  )
}
