'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/CartContext'
import { useStore } from '@/components/store/StoreContext'
import { getAvailability } from '@/lib/availability'
import type { Product } from '@/types'

type ProductDetailsPanelProps = {
  product: Product
}

export function ProductDetailsPanel({ product }: ProductDetailsPanelProps) {
  const { addItem } = useCart()
  const { storeId, openModal } = useStore()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // Get unique sizes and colors
  const sizes = Array.from(new Map(
    (product.product_variants || [])
      .filter(v => v.sizes)
      .map(v => [v.sizes.id, v.sizes])
  ).values())

  const colors = Array.from(new Map(
    (product.product_variants || [])
      .filter(v => v.colors)
      .map(v => [v.colors.id, v.colors])
  ).values())

  const handleAddToCart = async () => {
    if (!storeId) {
      openModal()
      return
    }

    if (!selectedSize || !selectedColor) {
      alert('Veuillez sélectionner une taille et une couleur')
      return
    }

    // Find the selected color and size objects
    const selectedColorObj = colors.find(c => c.id === selectedColor)
    const selectedSizeObj = sizes.find(s => s.id === selectedSize)

    if (!selectedColorObj || !selectedSizeObj) {
      alert('Erreur: Taille ou couleur non trouvée')
      return
    }

    // Find a variant that matches the selected size and color to get shipping info
    const matchingVariant = product.product_variants?.find(
      v => v.color_id === selectedColor && v.size_id === selectedSize
    )

    if (!matchingVariant) {
      alert('Cette combinaison taille/couleur est indisponible')
      return
    }

    const availability = getAvailability(
      matchingVariant,
      storeId as 'tunis' | 'gabes'
    )

    if (availability.status === 'unavailable') {
      alert('Cet article est indisponible dans les boutiques Just Hype')
      return
    }

    const shippingStoreId =
      availability.status === 'other_store' ? availability.otherStoreId : storeId

    const storeInfo = matchingVariant.inventory?.find(
      inv => inv.store_id === shippingStoreId
    )?.stores

    if (availability.status === 'other_store') {
      const confirmed = window.confirm(
        'Cet article est disponible dans l autre boutique. Acceptez-vous les frais de transfert de 9 TND pour recevoir votre produit ?'
      )

      if (!confirmed) return
    }

    setIsAdding(true)
    try {
      // Get the main product image
      const imagePath = product.product_images?.[0]?.image_path || null
      const mainImage =
        imagePath && process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${imagePath}`
          : imagePath

      addItem({
        productId: product.id,
        productName: product.name,
        slug: product.slug,
        price: product.price_after_discount || product.price,
        variantId: `${product.id}-${selectedSize}-${selectedColor}`,
        color: selectedColorObj,
        size: selectedSizeObj,
        userStoreId: (storeId as 'tunis' | 'gabes'),
        shippingStoreId: (shippingStoreId as 'tunis' | 'gabes'),
        shippingStoreName: storeInfo?.name || 'Boutique',
        shippingStoreWhatsapp: storeInfo?.whatsapp_number || '',
        crossStore: availability.status === 'other_store',
        image: mainImage,
      })
      // Reset form
      setTimeout(() => {
        alert('Produit ajouté au panier!')
        setIsAdding(false)
      }, 300)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Erreur lors de l\'ajout au panier')
      setIsAdding(false)
    }
  }

  const hasDiscount = product.discount_percent && product.discount_percent > 0
  const displayPrice = product.price_after_discount || product.price

  return (
    <div className="flex flex-col gap-6">
      {/* Category */}
      {product.categories && (
        <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
          {product.categories.name}
        </p>
      )}

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-black leading-tight">
        {product.name}
      </h1>

      {/* Description */}
      {product.description && (
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {product.description}
        </p>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-xl sm:text-2xl font-medium text-black">
          {displayPrice.toFixed(2)} TND
        </span>
        {hasDiscount && (
          <>
            <span className="text-sm sm:text-base text-gray-400 line-through">
              {product.price.toFixed(2)} TND
            </span>
            <span className="text-xs sm:text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
              -{product.discount_percent}%
            </span>
          </>
        )}
      </div>

      <div className="border-t border-gray-100 pt-6" />

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">
            Taille
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.id)}
                className={`px-4 py-2 border text-xs tracking-widest uppercase transition-colors duration-200 ${
                  selectedSize === size.id
                    ? 'bg-black text-white border-black'
                    : 'border-gray-200 text-black hover:border-black'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">
            Couleur
          </p>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                title={color.name}
                className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  selectedColor === color.id
                    ? 'border-black scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.hex_code }}
              >
                {color.hex_code === '#FFFFFF' && (
                  <span className="absolute inset-0 rounded-full border border-gray-300" />
                )}
              </button>
            ))}
          </div>
          {selectedColor && (
            <p className="text-xs text-gray-500 mt-2">
              {colors.find(c => c.id === selectedColor)?.name}
            </p>
          )}
        </div>
      )}

      <div className="border-t border-gray-100 pt-6" />

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || !storeId}
        className="w-full bg-black text-white py-3 sm:py-4 text-sm tracking-widest uppercase hover:bg-gray-900 disabled:bg-gray-400 transition-colors duration-200 font-medium"
      >
        {isAdding ? 'Ajout en cours...' : 'Ajouter au panier'}
      </button>

      {!storeId && (
        <p className="text-xs text-gray-500 text-center">
          Veuillez sélectionner une boutique pour continuer
        </p>
      )}
    </div>
  )
}
