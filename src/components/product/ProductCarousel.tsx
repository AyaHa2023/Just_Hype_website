// C:\Users\USER\Desktop\just_hype\src\components\product\ProductCarousel.tsx
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ImageLightbox } from '@/components/ui/ImageLightbox'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getProductImageUrl } from '@/lib/products'
import type { Product } from '@/types'

type Props = {
  product: Product
}

export function ProductCarousel({ product }: Props) {
  const images = [...(product.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const carouselRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX)
    handleSwipe(e.changedTouches[0].clientX, touchStart)
  }

  const handleSwipe = (end: number, start: number) => {
    if (start - end > 50) {
      setActiveIndex((prev) => (prev + 1) % images.length)
    } else if (end - start > 50) {
      setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
        <span className="text-xs text-gray-400 tracking-widest uppercase font-light">
          Photo bientôt
        </span>
      </div>
    )
  }

  const activeImageUrl = getProductImageUrl(
    images[activeIndex]?.image_path
  )

  return (
    <div className="flex gap-3">
      {images.length > 1 && (
        <div className="hidden md:flex flex-col gap-2 w-16 flex-shrink-0">
          {images.map((img, i) => {
            const thumbUrl = getProductImageUrl(img.image_path)

            if (!thumbUrl) return null

            return (
              <button
                key={img.id ?? i}
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-square w-16 overflow-hidden border-2 transition-all duration-150 flex-shrink-0 ${
                  activeIndex === i
                    ? 'border-black'
                    : 'border-transparent hover:border-gray-300'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={thumbUrl}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            )
          })}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-3">
        <div
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setLightboxOpen(true)}
          className="relative aspect-[3/4] overflow-hidden bg-gray-100 group cursor-zoom-in"
        >
          {activeImageUrl && (
            <Image
              src={activeImageUrl}
              alt={`${product.name} - Image ${activeIndex + 1}`}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}

          {product.discount_percent != null &&
            product.discount_percent > 0 && (
              <div className="absolute top-2 left-2 bg-white text-black text-xs tracking-widest uppercase font-light px-2 py-1 z-10">
                -{product.discount_percent}%
              </div>
            )}

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 transition-all duration-200 z-20 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 transition-all duration-200 z-20 backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex justify-center items-center gap-2">
            <div className="flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`transition-all duration-200 rounded-full ${
                    activeIndex === i
                      ? 'w-6 h-2 bg-black'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={activeIndex === i}
                />
              ))}
            </div>

            <span className="text-xs text-gray-400 tracking-widest ml-4">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        )}

        {activeImageUrl && (
          <ImageLightbox
            src={activeImageUrl}
            alt={product.name}
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </div>
    </div>
  )
}