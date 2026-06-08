'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { PaymentProvider } from '@/lib/payments/types'
import {
  clearPendingTransfer,
  loadPendingTransfer,
} from '@/lib/transfer-payment'

function parseProvider(value: string | null): PaymentProvider | null {
  return value === 'flouci' || value === 'clictopay' ? value : null
}

function TransferReturnContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [message, setMessage] = useState('Vérification du paiement en cours...')

  useEffect(() => {
    const status = searchParams.get('status')
    const pending = loadPendingTransfer()
    const provider =
      parseProvider(searchParams.get('provider')) ??
      pending?.paymentProvider ??
      null

    const paymentId =
      searchParams.get('payment_id') ??
      searchParams.get('orderId') ??
      searchParams.get('payment_ref') ??
      pending?.paymentRef ??
      null

    if (status === 'failed') {
      setMessage('Le paiement n\'a pas abouti. Aucun article n\'a été ajouté.')
      clearPendingTransfer()
      return
    }

    if (!paymentId || !provider) {
      setMessage('Référence de paiement introuvable. Recommencez depuis la fiche produit.')
      return
    }

    async function verifyAndComplete() {
      const res = await fetch(
        `/api/payments/verify?payment_id=${encodeURIComponent(paymentId!)}&provider=${provider}`
      )
      const data = await res.json()

      if (!data.paid) {
        setMessage(
          data.status === 'PENDING' || data.status === '0'
            ? 'Paiement en attente de confirmation. Patientez quelques instants puis réessayez.'
            : 'Paiement non confirmé. Réessayez ou contactez la boutique.'
        )
        return
      }

      const session = loadPendingTransfer()
      if (!session) {
        setMessage('Session expirée. Retournez sur le produit et recommencez.')
        return
      }

      addItem({
        productId: session.productId,
        productName: session.productName,
        slug: session.slug,
        price: session.price,
        variantId: `${session.productId}-${session.size.id}-${session.color.id}`,
        color: session.color,
        size: session.size,
        quantity: 1,
        userStoreId: session.userStoreId,
        shippingStoreId: session.shippingStoreId,
        shippingStoreName: session.shippingStoreName,
        shippingStoreWhatsapp: session.shippingStoreWhatsapp,
        crossStore: true,
        transferFeePaid: true,
        transferPaymentRef: paymentId,
        image: session.image,
      })

      clearPendingTransfer()
      const label = provider === 'clictopay' ? 'ClicTo Pay' : 'Flouci'
      setMessage(`Paiement ${label} confirmé. Article ajouté au panier.`)
      window.setTimeout(() => router.push('/panier'), 1800)
    }

    verifyAndComplete()
  }, [searchParams, addItem, router])

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="px-4 pt-28 pb-20 max-w-lg mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">
          Just Hype
        </p>
        <h1 className="text-2xl font-light tracking-wide text-black mb-4">
          Transfert inter-boutique
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        <Link
          href="/produits"
          className="inline-block mt-8 text-xs tracking-widest uppercase border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
        >
          Retour au catalogue
        </Link>
      </section>
      <Footer />
    </main>
  )
}

export default function TransferReturnPage() {
  return (
    <Suspense>
      <TransferReturnContent />
    </Suspense>
  )
}
