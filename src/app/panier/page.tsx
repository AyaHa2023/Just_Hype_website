'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/components/cart/CartContext'
import { useStore } from '@/components/store/StoreContext'
import { CheckoutModal } from '@/components/cart/CheckoutModal'
import { AppModal } from '@/components/ui/AppModal'
import { TRANSFER_FEE_TND } from '@/lib/transfer-payment'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { formatPrice, priceClassSm } from '@/lib/products'

export default function CartPage() {
  const { items, removeItem, clearCart, increaseQty, decreaseQty } = useCart()
  const { storeId, openModal } = useStore()

  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [orderSentModal, setOrderSentModal] = useState(false)
  const [unpaidTransferModal, setUnpaidTransferModal] = useState(false)

  const hasUnpaidTransfer = items.some(
    (item) => item.crossStore && !item.transferFeePaid
  )

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const transferFees = items.filter(
    (item) => item.crossStore && !item.transferFeePaid
  ).length * 9
  const transferFeesPaid = items.filter(
    (item) => item.crossStore && item.transferFeePaid
  ).length * 9
  const total = subtotal + transferFees

  function handleCheckoutClick() {
    if (!storeId) {
      openModal()
      return
    }
    if (hasUnpaidTransfer) {
      setUnpaidTransferModal(true)
      return
    }
    setCheckoutOpen(true)
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="px-4 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <Link href="/produits" className="text-xs uppercase tracking-widest text-gray-500">
            ← Continuer vos achats
          </Link>

          <h1 className="mt-6 text-3xl font-light uppercase tracking-wide">
            Panier ({items.length})
          </h1>

          {items.length === 0 ? (
            <p className="mt-20 text-center text-gray-500 tracking-widest uppercase text-sm">
              Votre panier est vide.
            </p>
          ) : (
            <div className="mt-10 grid lg:grid-cols-[1fr_380px] gap-10">
              <div className="space-y-8">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="grid grid-cols-[100px_1fr] gap-6 border-b pb-8"
                  >
                    <div className="relative aspect-[3/4] bg-gray-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          Photo bientôt
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-black">{item.productName}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.size.name} · {item.color.name}
                      </p>
                      {item.crossStore && (
                        <p className="text-[10px] tracking-widest uppercase text-gray-400 mt-1">
                          Transfert depuis {item.shippingStoreName}
                          {item.transferFeePaid
                            ? ' · 9 TND réglés en ligne'
                            : ' · +9 TND à régler'}
                        </p>
                      )}
                      <p className={`mt-2 ${priceClassSm}`}>
                        {formatPrice(item.price * item.quantity)} TND
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex border border-gray-200">
                          <button
                            type="button"
                            onClick={() => decreaseQty(item.variantId)}
                            className="w-8 text-gray-500 hover:text-black"
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increaseQty(item.variantId)}
                            className="w-8 text-gray-500 hover:text-black"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-xs uppercase tracking-widest px-3 py-1 border border-gray-200 text-gray-500 hover:text-black hover:border-black transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="border border-gray-100 p-6 h-fit">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="tabular-nums">{formatPrice(subtotal)} TND</span>
                  </div>
                  {transferFees > 0 && (
                    <div className="flex justify-between">
                      <span>Transfert à régler</span>
                      <span className="tabular-nums">{formatPrice(transferFees)} TND</span>
                    </div>
                  )}
                  {transferFeesPaid > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Transfert réglé en ligne</span>
                      <span className="tabular-nums">{formatPrice(transferFeesPaid)} TND</span>
                    </div>
                  )}
                </div>
                <p className={`mt-4 text-lg ${priceClassSm}`}>
                  Total : {formatPrice(total)} TND
                </p>

                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="mt-6 w-full bg-black text-white py-3.5 uppercase text-xs tracking-[0.2em] hover:bg-gray-900 transition-colors"
                >
                  Commander
                </button>

                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-3 w-full text-xs text-gray-500 tracking-widest uppercase hover:text-black transition-colors"
                >
                  Vider le panier
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>

      {storeId && (
        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          items={items}
          userStoreId={storeId}
          onComplete={() => setOrderSentModal(true)}
        />
      )}

      <AppModal
        open={unpaidTransferModal}
        onClose={() => setUnpaidTransferModal(false)}
        title="Frais de transfert en attente"
        description={`Un ou plusieurs articles nécessitent le règlement des frais de transfert (${formatPrice(TRANSFER_FEE_TND)} TND par article) en ligne avant de commander. Retirez l'article du panier et ajoutez-le à nouveau depuis la fiche produit pour payer le transfert.`}
        actions={[
          {
            label: 'Compris',
            variant: 'primary',
            onClick: () => setUnpaidTransferModal(false),
          },
        ]}
      />

      <AppModal
        open={orderSentModal}
        onClose={() => setOrderSentModal(false)}
        title="Commande envoyée"
        description="Votre message WhatsApp est prêt. Envoyez-le pour confirmer votre commande avec notre équipe."
        actions={[
          {
            label: 'Compris',
            variant: 'primary',
            onClick: () => setOrderSentModal(false),
          },
        ]}
      />

      <Footer />
    </main>
  )
}
