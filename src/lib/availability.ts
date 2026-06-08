import type { Product, ProductVariant, AvailabilityState } from '@/types'

export type SizeAvailabilityStatus = 'available' | 'other_store' | 'unavailable' | 'no_variant'

export function isUnavailableEverywhere(product: Product): boolean {
  if (!product.product_variants?.length) return true
  return !product.product_variants.some((variant) =>
    variant.inventory.some((entry) => entry.quantity > 0)
  )
}

export function getAvailability(
  variant: ProductVariant,
  userStoreId: 'tunis' | 'gabes'
): AvailabilityState {
  const otherStoreId = userStoreId === 'tunis' ? 'gabes' : 'tunis'
  const myStock = variant.inventory.find((i) => i.store_id === userStoreId)
  const otherStock = variant.inventory.find((i) => i.store_id === otherStoreId)

  if (myStock && myStock.quantity > 0) {
    return { status: 'available', quantity: myStock.quantity }
  }
  if (otherStock && otherStock.quantity > 0) {
    return {
      status: 'other_store',
      otherStoreId,
      quantity: otherStock.quantity,
    }
  }
  return { status: 'unavailable' }
}

export function findVariant(
  product: Product,
  colorId: string,
  sizeId: string
): ProductVariant | undefined {
  return product.product_variants?.find(
    (v) => v.color_id === colorId && v.size_id === sizeId
  )
}

export function getSizeAvailabilityForColor(
  product: Product,
  colorId: string,
  sizeId: string,
  userStoreId: 'tunis' | 'gabes'
): { status: SizeAvailabilityStatus; availability?: AvailabilityState } {
  const variant = findVariant(product, colorId, sizeId)
  if (!variant) return { status: 'no_variant' }

  const availability = getAvailability(variant, userStoreId)
  if (availability.status === 'unavailable') {
    return { status: 'unavailable', availability }
  }
  return { status: availability.status, availability }
}

export function getShippingStoreInfo(
  variant: ProductVariant,
  userStoreId: 'tunis' | 'gabes'
) {
  const availability = getAvailability(variant, userStoreId)
  if (availability.status === 'unavailable') return null

  const shippingStoreId =
    availability.status === 'available' ? userStoreId : availability.otherStoreId

  const inventoryEntry = variant.inventory.find(
    (i) => i.store_id === shippingStoreId
  )
  if (!inventoryEntry) return null

  return {
    storeId: shippingStoreId,
    storeName: inventoryEntry.stores.name,
    whatsappNumber: inventoryEntry.stores.whatsapp_number,
    crossStore: availability.status === 'other_store',
    quantity: availability.quantity,
  }
}

export const STORE_LABELS: Record<'tunis' | 'gabes', string> = {
  tunis: 'Grand Tunis (Menzah 5)',
  gabes: 'Gabès',
}

export const STORE_WHATSAPP: Record<'tunis' | 'gabes', string> = {
  tunis: '21658370802',
  gabes: '21658370803',
}
