'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { isUnavailableEverywhere } from '@/lib/availability'
import { ImageLightbox } from '@/components/ui/ImageLightbox'
import {
  formatPrice,
  getProductImageUrl,
  isValidProduct,
  priceClassSm,
} from '@/lib/products'
import type { Product } from '@/types'

type ProductCardProps = {
  product: Product
  showPrice?: boolean
}

const badgeClass =
  'bg-white text-black text-xs tracking-widest uppercase font-light px-2 py-1'

const unavailableBadgeClass =
  'bg-white text-black text-[10px] tracking-widest font-light px-2 py-0.5 whitespace-nowrap'

export function ProductCard({ product, showPrice = true }: ProductCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!isValidProduct(product)) return null

  const mainImage = [...(product.product_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)[0]

  const imageUrl = getProductImageUrl(mainImage?.image_path)
  const displayPrice = product.price_after_discount ?? product.price
  const isOutOfStock = isUnavailableEverywhere(product)

  return (
    <>
      <article className="group relative">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
          {imageUrl ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute inset-0 w-full h-full cursor-zoom-in"
              aria-label={`Agrandir ${product.name}`}
            >
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </button>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-xs tracking-widest uppercase text-gray-400 font-light">
                Photo bientôt
              </span>
            </div>
          )}

          {product.discount_percent != null && product.discount_percent > 0 && (
            <div className={`absolute top-2 left-2 z-10 ${badgeClass} pointer-events-none`}>
              -{product.discount_percent}%
            </div>
          )}

          {isOutOfStock && (
            <div
              className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-10 ${unavailableBadgeClass} pointer-events-none`}
            >
              non disponible
            </div>
          )}
        </div>

        <Link href={`/produits/${product.slug}`} className="block">
          <div className="flex flex-col gap-1">
            <p className="text-sm leading-tight line-clamp-2 text-black">
              {product.name}
            </p>

            {showPrice && (
              <div className="flex items-baseline gap-1">
                <span className={priceClassSm}>
                  {formatPrice(displayPrice)} TND
                </span>
                {product.discount_percent && product.price > displayPrice && (
                  <span className="text-xs text-gray-400 line-through font-normal tabular-nums">
                    {formatPrice(product.price)} TND
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </article>

      {imageUrl && (
        <ImageLightbox
          src={imageUrl}
          alt={product.name}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
