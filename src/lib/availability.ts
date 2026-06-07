import type { ProductVariant, AvailabilityState } from "@/types";

export function getAvailability(
    variant: ProductVariant,
    userStoreId: 'tunis' | 'gabes'
): AvailabilityState {
    const otherStoreId = userStoreId === 'tunis' ? 'gabes' : 'tunis'
    const myStock = variant.inventory.find(i => i.store_id === userStoreId)
    const otherStock = variant.inventory.find(i => i.store_id === otherStoreId)
    if (myStock && myStock.quantity > 0){
        return {
            status: 'available',
            quantity: myStock.quantity
        }
    }
    if (otherStock && otherStock.quantity > 0) {
        return{
            status: 'other_store',
            otherStoreId,
            quantity: otherStock.quantity
        }
    }
    return {status: 'unavailable'}
}

// export function getShippingStore(
//     variant: ProductVariant,
//     userStoreId: 'tunis' | 'gabes'
// ) {
//     const availability = getAvailability(variant, userStoreId)
//      if (availability.status === 'unavailable') return null
//      const shippingStoreId = availability.status === 'available' ? userStoreId : availability.otherStoreId
//      const inventoryEntry = variant.inventory.find(
//         i => i.store_id === shippingStoreId
//      )
//      if (!inventoryEntry) return null
//      return {
//         storeId: shippingStoreId,
//         storeName: inventoryEntry.stores.name,
//         whatsappNumber: inventoryEntry.stores.whatsapp_number,
//         crossStore: availability.status === 'other_store'
//      }
// }