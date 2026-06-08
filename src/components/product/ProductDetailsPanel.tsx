//C:\Users\USER\Desktop\just_hype\src\components\product\ProductDetailsPanel.tsx
'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/CartContext'
import { useStore } from '@/components/store/StoreContext'
import { AppModal } from '@/components/ui/AppModal'
import { TransferFeeModal } from '@/components/product/TransferFeeModal'
import {
  getSizeAvailabilityForColor,
  getShippingStoreInfo,
  STORE_LABELS,
} from '@/lib/availability'
import { formatPrice, getProductImageUrl, priceClassLg } from '@/lib/products'
import type { PaymentProvider } from '@/lib/payments/types'
import { savePendingTransfer } from '@/lib/transfer-payment'
import { ShoppingCart } from 'lucide-react'
import type { Color, Product, Size } from '@/types'

type ProductDetailsPanelProps = {
  product: Product
}

type PendingAdd = {
  color: Color
  size: Size
  crossStore: boolean
  shippingStoreId: 'tunis' | 'gabes'
  shippingStoreName: string
  shippingStoreWhatsapp: string
}

export function ProductDetailsPanel({ product }: ProductDetailsPanelProps) {
  const { addItem } = useCart()
  const { storeId, openModal } = useStore()

  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [colorHint, setColorHint] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const [crossStoreModal, setCrossStoreModal] = useState(false)
  const [transferFeeModal, setTransferFeeModal] = useState(false)
  const [pendingAdd, setPendingAdd] = useState<PendingAdd | null>(null)
  const [successModal, setSuccessModal] = useState(false)
  const [alertModal, setAlertModal] = useState<{
    title: string
    description: string
  } | null>(null)

  const colors = Array.from(
    new Map(
      (product.product_variants || [])
        .filter((v) => v.colors)
        .map((v) => [v.colors.id, v.colors])
    ).values()
  )

  const sizes = Array.from(
    new Map(
      (product.product_variants || [])
        .filter((v) => v.sizes)
        .map((v) => [v.sizes.id, v.sizes])
    ).values()
  )

  const selectedColorObj = colors.find((c) => c.id === selectedColor)
  const selectedSizeObj = sizes.find((s) => s.id === selectedSize)

  const selectedVariant =
    selectedColor && selectedSize
      ? product.product_variants?.find(
          (v) => v.color_id === selectedColor && v.size_id === selectedSize
        )
      : undefined

  const selectedShipping =
    selectedVariant && storeId
      ? getShippingStoreInfo(selectedVariant, storeId)
      : null

  function handleColorSelect(colorId: string) {
    setSelectedColor(colorId)
    setSelectedSize(null)
    setColorHint(false)
  }

  function handleSizeSelect(sizeId: string) {
    if (!storeId) {
      openModal()
      return
    }

    if (!selectedColor) {
      setColorHint(true)
      return
    }

    const { status } = getSizeAvailabilityForColor(
      product,
      selectedColor,
      sizeId,
      storeId
    )

    if (status === 'no_variant' || status === 'unavailable') return

    setSelectedSize(sizeId)
    setColorHint(false)
  }

  function getSizeState(sizeId: string) {
    if (!selectedColor || !storeId) {
      return { clickable: false, style: 'muted' as const }
    }

    const { status } = getSizeAvailabilityForColor(
      product,
      selectedColor,
      sizeId,
      storeId
    )

    if (status === 'available') {
      return { clickable: true, style: 'available' as const }
    }
    if (status === 'other_store') {
      return { clickable: true, style: 'other_store' as const }
    }
    return { clickable: false, style: 'unavailable' as const }
  }

  function sizeButtonClass(
    sizeId: string,
    style: 'available' | 'other_store' | 'unavailable' | 'muted'
  ) {
    const isSelected = selectedSize === sizeId

    if (style === 'muted') {
      return `inline-block px-5 py-3 border text-xs tracking-widest uppercase font-light border-gray-200 text-gray-300 cursor-not-allowed`
    }

    if (style === 'unavailable') {
      return `inline-block px-5 py-3 border text-xs tracking-widest uppercase font-light border-gray-200 text-gray-300 line-through cursor-not-allowed`
    }

    if (style === 'other_store') {
      return `inline-block px-5 py-3 border text-xs tracking-widest uppercase font-light transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-gray-400 text-white border-gray-400'
          : 'border-gray-300 text-gray-500 hover:border-gray-500'
      }`
    }

    return `inline-block px-5 py-3 border-2 text-xs tracking-widest uppercase font-medium transition-all duration-200 cursor-pointer ${
      isSelected
        ? 'bg-black text-white border-black'
        : 'border-gray-300 text-black hover:border-black'
    }`
  }

  function commitAddToCart(pending: PendingAdd) {
    const imagePath = product.product_images?.[0]?.image_path ?? null

    addItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      price: product.price_after_discount || product.price,
      variantId: `${product.id}-${pending.size.id}-${pending.color.id}`,
      color: pending.color,
      size: pending.size,
      quantity: 1,
      userStoreId: storeId as 'tunis' | 'gabes',
      shippingStoreId: pending.shippingStoreId,
      shippingStoreName: pending.shippingStoreName,
      shippingStoreWhatsapp: pending.shippingStoreWhatsapp,
      crossStore: pending.crossStore,
      transferFeePaid: false,
      transferPaymentRef: null,
      image: getProductImageUrl(imagePath),
    })

    setCrossStoreModal(false)
    setTransferFeeModal(false)
    setPendingAdd(null)
    setSuccessModal(true)
    setIsAdding(false)
  }

  async function handleTransferPayment(provider: PaymentProvider) {
    if (!pendingAdd || !storeId) return

    const imagePath = product.product_images?.[0]?.image_path ?? null
    const orderId = `transfer-${product.id}-${pendingAdd.size.id}-${Date.now()}`

    const res = await fetch('/api/payments/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, provider }),
    })

    const data = await res.json()

    if (!res.ok) {
      if (data.setupRequired) {
        throw new Error(
          `Paiement ${provider === 'clictopay' ? 'ClicTo Pay' : 'Flouci'} non configuré. Contactez la boutique via WhatsApp.`
        )
      }
      throw new Error(data.error ?? 'Impossible de lancer le paiement.')
    }

    savePendingTransfer({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      price: product.price_after_discount || product.price,
      color: pendingAdd.color,
      size: pendingAdd.size,
      userStoreId: storeId,
      shippingStoreId: pendingAdd.shippingStoreId,
      shippingStoreName: pendingAdd.shippingStoreName,
      shippingStoreWhatsapp: pendingAdd.shippingStoreWhatsapp,
      image: getProductImageUrl(imagePath),
      paymentRef: data.paymentId as string,
      paymentProvider: provider,
    })

    window.location.href = data.payUrl as string
  }

  function handleAddToCart() {
    if (!storeId) {
      openModal()
      return
    }

    if (!selectedColor) {
      setAlertModal({
        title: 'Couleur requise',
        description: 'Veuillez sélectionner une couleur en premier.',
      })
      return
    }

    if (!selectedSize || !selectedColorObj || !selectedSizeObj || !selectedVariant) {
      setAlertModal({
        title: 'Taille requise',
        description: 'Veuillez sélectionner une taille disponible pour cette couleur.',
      })
      return
    }

    const shipping = getShippingStoreInfo(selectedVariant, storeId)
    if (!shipping) {
      setAlertModal({
        title: 'Indisponible',
        description: 'Cette combinaison n\'est pas disponible dans nos boutiques.',
      })
      return
    }

    const pending: PendingAdd = {
      color: selectedColorObj,
      size: selectedSizeObj,
      crossStore: shipping.crossStore,
      shippingStoreId: shipping.storeId,
      shippingStoreName: shipping.storeName,
      shippingStoreWhatsapp: shipping.whatsappNumber,
    }

    if (shipping.crossStore) {
      setPendingAdd(pending)
      setCrossStoreModal(true)
      return
    }

    setIsAdding(true)
    commitAddToCart(pending)
  }

  const hasDiscount = product.discount_percent && product.discount_percent > 0
  const displayPrice = product.price_after_discount || product.price

  const otherStoreLabel =
    storeId === 'tunis' ? STORE_LABELS.gabes : STORE_LABELS.tunis

  return (
    <>
      <article className="flex flex-col gap-6">
        {product.categories && (
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 font-semibold">
            {product.categories.name}
          </p>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wider text-black leading-tight">
          {product.name}
        </h1>

        {product.description && (
          <div className="text-sm sm:text-base text-gray-600 leading-relaxed">
            <p>{product.description}</p>
          </div>
        )}

        <div className="py-4 border-t border-b border-gray-100">
          <div className="flex items-baseline gap-4">
            <span className={priceClassLg}>
              {formatPrice(displayPrice)} TND
            </span>
            {hasDiscount && (
              <div className="flex items-center gap-3">
                <span className="text-lg sm:text-xl text-gray-400 line-through font-normal tabular-nums">
                  {formatPrice(product.price)} TND
                </span>
                <span className="inline-flex items-center bg-white text-black border border-gray-200 px-2 py-1 text-xs tracking-widest uppercase font-light">
                  -{product.discount_percent}%
                </span>
              </div>
            )}
          </div>
        </div>

        {colors.length > 0 && (
          <fieldset className="space-y-3">
            <legend className="text-xs tracking-[0.3em] uppercase text-gray-400 font-semibold">
              Sélectionner la couleur
            </legend>
            <div className="flex flex-wrap gap-4">
              {colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleColorSelect(color.id)}
                  className="flex flex-col items-center gap-2"
                  aria-label={`Couleur : ${color.name}`}
                >
                  <div
                    title={color.name}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color.id
                        ? 'border-black scale-110'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color.hex_code }}
                  />
                  {selectedColor === color.id && (
                    <span className="text-xs text-gray-600 font-medium">
                      {color.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {sizes.length > 0 && (
          <fieldset className="space-y-3">
            <div className="flex items-baseline gap-3">
              <legend className="text-xs tracking-[0.3em] uppercase text-gray-400 font-semibold">
                Sélectionner la taille
              </legend>
              {colorHint && !selectedColor && (
                <span className="text-[10px] tracking-widest uppercase text-gray-400">
                  Choisissez la couleur d&apos;abord
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => {
                const { clickable, style } = getSizeState(size.id)
                return (
                  <button
                    key={size.id}
                    type="button"
                    disabled={!clickable && !!selectedColor}
                    onClick={() => handleSizeSelect(size.id)}
                    className={sizeButtonClass(size.id, style)}
                  >
                    {size.name}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}

        {selectedShipping && selectedColorObj && selectedSizeObj && (
          <p className="text-xs tracking-widest uppercase text-gray-500">
            {selectedShipping.crossStore ? (
              <>
                Disponible à {otherStoreLabel} — transfert +9 TND
              </>
            ) : (
              <>
                En stock à {STORE_LABELS[storeId!]} ({selectedShipping.quantity}{' '}
                restant{selectedShipping.quantity > 1 ? 's' : ''})
              </>
            )}
          </p>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || !storeId}
          className="w-full bg-black text-white py-4 sm:py-5 text-sm sm:text-base tracking-widest uppercase font-medium hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <ShoppingCart size={20} className="transition-transform group-hover:scale-110" />
          {isAdding ? 'Ajout en cours...' : 'Ajouter au panier'}
        </button>

        {!storeId && (
          <p className="text-xs text-center text-gray-500 border border-gray-200 p-3 tracking-widest uppercase">
            Sélectionnez une boutique pour voir les stocks
          </p>
        )}
      </article>

      <AppModal
        open={crossStoreModal}
        onClose={() => {
          setCrossStoreModal(false)
          setPendingAdd(null)
        }}
        title="Article dans une autre boutique"
        description={`Ce produit n'est pas disponible dans votre boutique mais l'est à ${otherStoreLabel}. Souhaitez-vous le faire transférer pour 9 TND ?`}
        actions={[
          {
            label: 'Non',
            icon: 'x',
            variant: 'secondary',
            onClick: () => {
              setCrossStoreModal(false)
              setPendingAdd(null)
            },
          },
          {
            label: 'Oui',
            icon: 'check',
            variant: 'primary',
            onClick: () => {
              setCrossStoreModal(false)
              setTransferFeeModal(true)
            },
          },
        ]}
      />

      <TransferFeeModal
        open={transferFeeModal}
        onClose={() => {
          setTransferFeeModal(false)
          setPendingAdd(null)
        }}
        otherStoreLabel={otherStoreLabel}
        onConfirmPayment={handleTransferPayment}
      />

      <AppModal
  open={successModal}
  onClose={() => setSuccessModal(false)}
  title="Ajouté au panier"
  description="Votre article a été ajouté. Vous pouvez continuer vos achats ou passer commande."
  actions={[
    {
      label: 'Continuer les achats',
      variant: 'secondary',
      onClick: () => setSuccessModal(false),
    },
    {
      label: 'Voir le panier',
      icon: 'check',
      variant: 'primary',
      onClick: () => {
        setSuccessModal(false)
        window.location.href = '/panier'
      },
    },
  ]}
/>

      <AppModal
        open={!!alertModal}
        onClose={() => setAlertModal(null)}
        title={alertModal?.title ?? ''}
        description={alertModal?.description}
        actions={[
          {
            label: 'Compris',
            variant: 'primary',
            onClick: () => setAlertModal(null),
          },
        ]}
      />
    </>
  )
}
