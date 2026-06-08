'use client'

import { useEffect, useState } from 'react'
import { AppModal, AppModalChoices } from '@/components/ui/AppModal'
import type { CartItem } from '@/types'
import type { FulfillmentType } from '@/lib/whatsapp'
import {
  buildCartWhatsappMessage,
  groupCartItemsByWhatsapp,
  isLocalBoutiquePickup,
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

type Step = 'fulfillment' | 'confirm'

export function CheckoutModal({
  open,
  onClose,
  items,
  userStoreId,
  onComplete,
}: CheckoutModalProps) {
  const localPickupOnly = isLocalBoutiquePickup(items, userStoreId)

  const [step, setStep] = useState<Step>('fulfillment')
  const [fulfillment, setFulfillment] = useState<FulfillmentType | null>(null)

  useEffect(() => {
    if (!open) return
    if (localPickupOnly) {
      setFulfillment('pickup')
      setStep('confirm')
    } else {
      setFulfillment(null)
      setStep('fulfillment')
    }
  }, [open, localPickupOnly])

  function handleClose() {
    setStep('fulfillment')
    setFulfillment(null)
    onClose()
  }

  function handleFulfillmentSelect(type: string) {
    setFulfillment(type as FulfillmentType)
    setStep('confirm')
  }

  function handleConfirm() {
    if (!fulfillment) return

    const groups = groupCartItemsByWhatsapp(items)
    const messages = groups.map((group) => ({
      whatsapp: group.whatsapp,
      text: buildCartWhatsappMessage(group.items, userStoreId, fulfillment),
    }))

    openWhatsappMessages(messages)
    handleClose()
    onComplete()
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const transferFees = items.filter(
    (i) => i.crossStore && !i.transferFeePaid
  ).length * 9
  const total = subtotal + transferFees

  const fulfillmentLabel =
    fulfillment === 'livraison' ? 'Livraison' : PICKUP_FULFILLMENT_LABEL

  const modalTitle =
    step === 'fulfillment'
      ? 'Finaliser la commande'
      : localPickupOnly
        ? 'Récupération en boutique'
        : 'Confirmer sur WhatsApp'

  const modalDescription =
    step === 'fulfillment'
      ? 'Comment souhaitez-vous recevoir votre commande ?'
      : localPickupOnly
        ? 'Article réservé pour max 12h. Confirmez pour envoyer votre commande via WhatsApp.'
        : `Mode choisi : ${fulfillmentLabel}. Votre message WhatsApp sera préparé avec le détail de vos articles.`

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      title={modalTitle}
      description={modalDescription}
      showClose
    >
      {step === 'fulfillment' && !localPickupOnly && (
        <AppModalChoices
          options={[
            {
              id: 'livraison',
              label: 'Livraison',
              hint: 'Transfert depuis une autre boutique',
            },
            {
              id: 'pickup',
              label: 'Récupération en boutique',
              hint: PICKUP_FULFILLMENT_LABEL,
            },
          ]}
          onSelect={handleFulfillmentSelect}
        />
      )}

      {step === 'confirm' && (
        <div className="space-y-4">
          {localPickupOnly && (
            <p className="text-xs tracking-widest uppercase text-gray-500 border border-gray-200 px-4 py-3">
              {PICKUP_FULFILLMENT_LABEL}
            </p>
          )}

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
            {!localPickupOnly && (
              <button
                type="button"
                onClick={() => setStep('fulfillment')}
                className="flex-1 border border-black py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-black text-white py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors"
            >
              Confirmer · WhatsApp
            </button>
          </div>
        </div>
      )}
    </AppModal>
  )
}
