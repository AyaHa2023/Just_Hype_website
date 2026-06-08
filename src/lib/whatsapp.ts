import type { CartItem } from '@/types'
import { STORE_LABELS, STORE_WHATSAPP } from '@/lib/availability'
import { formatPrice } from '@/lib/products'

export type FulfillmentType = 'livraison' | 'pickup'

export const PICKUP_FULFILLMENT_LABEL =
  'Récupération en boutique (article réservé pour max 12h)'

export function isLocalBoutiquePickup(
  items: CartItem[],
  userStoreId: 'tunis' | 'gabes'
): boolean {
  return items.every(
    (item) => !item.crossStore && item.shippingStoreId === userStoreId
  )
}

function normalizeWhatsapp(number: string): string {
  return number.replace(/\D/g, '')
}

export function buildCartWhatsappMessage(
  items: CartItem[],
  userStoreId: 'tunis' | 'gabes',
  fulfillment: FulfillmentType
): string {
  const fulfillmentLabel =
    fulfillment === 'livraison' ? 'Livraison' : PICKUP_FULFILLMENT_LABEL

  const lines = items.map((item, index) => {
    const transfer = item.crossStore
      ? item.transferFeePaid
        ? `\n   Transfert inter-boutique : 9.00 TND (réglé en ligne)`
        : `\n   Transfert inter-boutique : +9.00 TND`
      : ''
    return [
      `${index + 1}. ${item.productName}`,
      `   Taille : ${item.size.name}`,
      `   Couleur : ${item.color.name}`,
      `   Quantité : ${item.quantity}`,
      `   Prix : ${formatPrice(item.price * item.quantity)} TND${transfer}`,
    ].join('\n')
  })

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const transferFees =
    items.filter((i) => i.crossStore && !i.transferFeePaid).length * 9
  const total = subtotal + transferFees

  return [
    'Bonjour, je souhaite réserver/acheter ces produits :',
    '',
    ...lines,
    '',
    `Mode : ${fulfillmentLabel}`,
    `Boutique de référence : ${STORE_LABELS[userStoreId]}`,
    '',
    `Sous-total : ${formatPrice(subtotal)} TND`,
    transferFees > 0
      ? `Frais transfert inter-boutique : ${formatPrice(transferFees)} TND`
      : null,
    `Total : ${formatPrice(total)} TND`,
  ]
    .filter(Boolean)
    .join('\n')
}

export function groupCartItemsByWhatsapp(items: CartItem[]) {
  const groups = new Map<string, CartItem[]>()

  for (const item of items) {
    const raw = item.shippingStoreWhatsapp || STORE_WHATSAPP[item.shippingStoreId]
    const key = normalizeWhatsapp(raw)
    const existing = groups.get(key) ?? []
    existing.push(item)
    groups.set(key, existing)
  }

  return Array.from(groups.entries()).map(([whatsapp, groupItems]) => ({
    whatsapp,
    items: groupItems,
  }))
}

export function openWhatsappMessages(
  messages: { whatsapp: string; text: string }[]
) {
  messages.forEach((msg, index) => {
    window.setTimeout(() => {
      window.open(
        `https://wa.me/${normalizeWhatsapp(msg.whatsapp)}?text=${encodeURIComponent(msg.text)}`,
        '_blank'
      )
    }, index * 400)
  })
}
