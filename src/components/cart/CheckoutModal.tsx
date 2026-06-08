'use client'

import { useEffect } from 'react'
import { AppModal } from '@/components/ui/AppModal'
import type { CartItem } from '@/types'
import {
  buildCartWhatsappMessage,
  groupCartItemsByWhatsapp,
  openWhatsappMessages,
  PICKUP_FULFILLMENT_LABEL,
} from '@/lib/whatsapp'
import { formatPrice } from '@/lib/products'

type CheckoutModalProps = {
  open: boolean
  onClose: () => void
  items: CartItem[]
  userStoreId: 'tunis' | 'gabes'
  onComplete: () => void
}

export function CheckoutModal({
  open,
  onClose,
  items,
  userStoreId,
  onComplete,
}: CheckoutModalProps) {

  useEffect(() => {
    if (!open) return
  }, [open])

  function handleConfirm() {
    const groups = groupCartItemsByWhatsapp(items)
    const messages = groups.map((group) => ({
      whatsapp: group.whatsapp,
      text: buildCartWhatsappMessage(group.items, userStoreId, 'pickup'),
    }))
    openWhatsappMessages(messages)
    onClose()
    onComplete()
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const transferFees = items.filter((i) => i.crossStore && !i.transferFeePaid).length * 9
  const total = subtotal + transferFees

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Confirmer la réservation"
      description={PICKUP_FULFILLMENT_LABEL}
      showClose
    >
      <div className="space-y-4">
        <div className="border border-gray-200 p-4 text-sm space-y-2">
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between gap-4">
              <span className="text-gray-600">
                {item.productName}
                <span className="block text-xs text-gray-400">
                  {item.size.name} · {item.color.name}
                  {item.crossStore && ' · Transfert +9 TND'}
                </span>
              </span>
              <span className="tabular-nums whitespace-nowrap">
                {formatPrice(item.price * item.quantity)} TND
              </span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 flex justify-between font-medium">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(total)} TND</span>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-black py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-black text-white py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors"
          >
            Confirmer · WhatsApp
          </button>
        </div>
      </div>
    </AppModal>
  )
}