'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useStore } from '@/components/store/StoreContext'
import { getAvailability } from '@/lib/availability'
import type { Product } from '@/types'

type ProductCardProps = {
  product: Product
  showPrice?: boolean
}

export function ProductCard({ product, showPrice = true }: ProductCardProps) {
  const { storeId } = useStore()

  const mainImage = [...(product.product_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)[0]

  const hasAvailableVariant = storeId
    ? product.product_variants.some((variant) => {
        const avail = getAvailability(variant, storeId)
        return avail.status !== 'unavailable'
      })
    : true

  const displayPrice = product.price_after_discount ?? product.price

  return (
    <Link href={`/produits/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
        {mainImage ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${mainImage.image_path}`}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-400 tracking-widest uppercase">
              Photo bientôt
            </span>
          </div>
        )}

        {product.discount_percent && (
          <div className="absolute top-2 left-2 bg-black text-white text-[10px] tracking-widest uppercase px-2 py-1">
            -{product.discount_percent}%
          </div>
        )}

        {!hasAvailableVariant && storeId && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/90 text-[10px] tracking-widest uppercase text-center py-1.5">
            Non disponible
          </div>
        )}
      </div>

      <div>
        <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-1">
          {product.categories?.name}
        </p>
        <p className="text-sm font-light tracking-wide line-clamp-2 group-hover:text-gray-600 transition-colors duration-200">
          {product.name}
        </p>

        {showPrice && (
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-sm font-medium">
              {displayPrice.toFixed(3)} TND
            </span>
            {product.discount_percent && (
              <span className="text-xs text-gray-400 line-through">
                {product.price.toFixed(3)} TND
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}