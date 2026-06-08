import type { Color, Size } from '@/types'
import type { PaymentProvider } from '@/lib/payments/types'

export const TRANSFER_FEE_TND = 9
export const TRANSFER_FEE_MILLIMES = TRANSFER_FEE_TND * 1000

export type PendingTransferPayload = {
  productId: string
  productName: string
  slug: string
  price: number
  color: Color
  size: Size
  userStoreId: 'tunis' | 'gabes'
  shippingStoreId: 'tunis' | 'gabes'
  shippingStoreName: string
  shippingStoreWhatsapp: string
  image: string | null
  paymentRef?: string
  paymentProvider?: PaymentProvider
}

const SESSION_KEY = 'just_hype_pending_transfer'

export function savePendingTransfer(payload: PendingTransferPayload) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload))
}

export function loadPendingTransfer(): PendingTransferPayload | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as PendingTransferPayload) : null
  } catch {
    return null
  }
}

export function clearPendingTransfer() {
  sessionStorage.removeItem(SESSION_KEY)
}

