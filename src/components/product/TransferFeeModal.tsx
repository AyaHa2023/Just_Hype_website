//C:\Users\USER\Desktop\just_hype\src\components\product\TransferFeeModal.tsx
'use client'

import { useEffect, useState } from 'react'
import { AppModal } from '@/components/ui/AppModal'
import type { PaymentProvider } from '@/lib/payments/types'
import { PAYMENT_PROVIDER_LABELS } from '@/lib/payments'
import { TRANSFER_FEE_TND } from '@/lib/transfer-payment'
import { formatPrice } from '@/lib/products'

type TransferFeeModalProps = {
  open: boolean
  onClose: () => void
  otherStoreLabel: string
  onConfirmPayment: (provider: PaymentProvider) => Promise<void>
}

export function TransferFeeModal({
  open,
  onClose,
  otherStoreLabel,
  onConfirmPayment,
}: TransferFeeModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [available, setAvailable] = useState<PaymentProvider[]>([])
  const [selected, setSelected] = useState<PaymentProvider | null>(null)

  useEffect(() => {
    if (!open) return

    fetch('/api/payments/providers')
      .then((res) => res.json())
      .then((data: { providers?: PaymentProvider[] }) => {
        const list = data.providers ?? []
        setAvailable(list)
        setSelected(list[0] ?? null)
      })
      .catch(() => setAvailable([]))
  }, [open])

  async function handlePay() {
    if (!selected) {
      setError('Aucun moyen de paiement en ligne n\'est configuré pour le moment.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await onConfirmPayment(selected)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Le paiement en ligne est temporairement indisponible.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={`Frais de transfert — ${formatPrice(TRANSFER_FEE_TND)} TND`}
      description="Votre article se trouve dans une autre boutique Just Hype."
      showClose
    >
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <p>
          L&apos;article est disponible à{' '}
          <strong className="text-black font-medium">{otherStoreLabel}</strong>.
          Pour l&apos;acheminer vers votre boutique, nous organisons un transfert physique entre nos magasins.
        </p>

        <div className="border border-gray-200 bg-gray-50 px-4 py-3 text-xs tracking-wide text-gray-600 space-y-2">
          <p className="text-black font-medium tracking-widest uppercase text-[11px]">
            Pourquoi payer en ligne d&apos;abord ?
          </p>
          <p>
            Les {formatPrice(TRANSFER_FEE_TND)} TND couvrent uniquement les frais de transfert
            (livraison inter-boutique), pas le prix de l&apos;article.
          </p>
          <p>
            Ce paiement nous permet de lancer le déplacement du stock sans risque.
            Même si vous renoncez ensuite à l&apos;achat, ce frais reste dû&nbsp;: la boutique
            a déjà engagé un coût réel pour transporter l&apos;article.
          </p>
          <p className="text-gray-500">
            Le règlement du produit se fait ensuite en boutique ou via WhatsApp, comme d&apos;habitude.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-400">
            Choisir le moyen de paiement
          </p>

          {available.length === 0 ? (
            <p className="text-xs text-gray-500 border border-gray-200 px-3 py-3">
              Paiement en ligne en cours de configuration. Contactez la boutique via WhatsApp
              pour organiser le transfert.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {available.map((provider) => {
                const meta = PAYMENT_PROVIDER_LABELS[provider]
                const isActive = selected === provider
                return (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => setSelected(provider)}
                    className={`border text-left py-3.5 px-4 transition-colors duration-200 ${
                      isActive
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    <p className="text-sm tracking-widest uppercase">{meta.name}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isActive ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {meta.hint}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-gray-500 border border-gray-200 px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-black py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handlePay}
            disabled={loading || !selected}
            className="flex-1 bg-black text-white py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {loading ? 'Redirection...' : `Payer ${formatPrice(TRANSFER_FEE_TND)} TND`}
          </button>
        </div>
      </div>
    </AppModal>
  )
}
