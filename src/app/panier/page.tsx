// 'use client'

// import Image from 'next/image'
// import Link from 'next/link'
// import { useState } from 'react'
// import { useCart } from '@/components/cart/CartContext'
// import { useStore } from '@/components/store/StoreContext'
// import { Footer } from '@/components/layout/Footer'
// import { Header } from '@/components/layout/Header'

// const STORE_CONTACTS = {
//   tunis: {
//     label: 'Tunis',
//     whatsapp: '21658370802',
//   },
//   gabes: {
//     label: 'Gabes',
//     whatsapp: '21658370803',
//   },
// }

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/components/cart/CartContext'
import { useStore } from '@/components/store/StoreContext'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

const STORE_CONTACTS = {
  tunis: { label: 'Tunis', whatsapp: '21658370802' },
  gabes: { label: 'Gabes', whatsapp: '21658370803' },
}

export default function CartPage() {
  const {
    items,
    removeItem,
    clearCart,
    increaseQty,
    decreaseQty,
  } = useCart()

  const { storeId, openModal } = useStore()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const crossStoreItems = items.filter((item) => item.crossStore)
  const transferFees = crossStoreItems.length * 9
  const total = subtotal + transferFees

  function buildOrderMessage() {
    const activeStoreLabel = storeId
      ? STORE_CONTACTS[storeId].label
      : 'Non selectionnee'

    const orderLines = items
      .map((item, index) => {
        const transferLine = item.crossStore
          ? `\n  Transfert depuis ${item.shippingStoreName}: +9.00 TND accepte`
          : ''

        return [
          `${index + 1}. ${item.productName}`,
          `  Taille: ${item.size.name}`,
          `  Couleur: ${item.color.name}`,
          `  Quantite: ${item.quantity}`,
          `  Prix: ${(item.price * item.quantity).toFixed(2)} TND${transferLine}`,
        ].join('\n')
      })
      .join('\n\n')

    return encodeURIComponent(
      [
        'Nouvelle commande Just Hype',
        '',
        `Boutique choisie: ${activeStoreLabel}`,
        '',
        'Articles:',
        orderLines,
        '',
        `Sous-total: ${subtotal.toFixed(2)} TND`,
        `Frais transfert inter-boutique: ${transferFees.toFixed(2)} TND`,
        `Total: ${total.toFixed(2)} TND`,
      ].join('\n')
    )
  }

  function handleCheckoutClick() {
    if (!storeId) return openModal()
    setCheckoutOpen(true)
  }

  function sendOrderToWhatsapp() {
    if (!storeId) return

    window.open(
      `https://wa.me/${STORE_CONTACTS[storeId].whatsapp}?text=${buildOrderMessage()}`,
      '_blank'
    )

    setCheckoutOpen(false)
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="px-4 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">

          <Link href="/produits" className="text-xs uppercase text-gray-500">
            ← Continuer vos achats
          </Link>

          <h1 className="mt-6 text-3xl font-semibold uppercase">
            Panier ({items.length})
          </h1>

          {items.length === 0 ? (
            <p className="mt-20 text-center text-gray-500">
              Votre panier est vide.
            </p>
          ) : (
            <div className="mt-10 grid lg:grid-cols-[1fr_380px] gap-10">

              {/* ITEMS */}
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
                      <p className="font-medium">{item.productName}</p>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.size.name} • {item.color.name}
                      </p>

                      <p className="mt-2 font-semibold">
                        {(item.price * item.quantity).toFixed(2)} TND
                      </p>

                      {/* QUANTITY */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex border">
                          <button
                            onClick={() => decreaseQty(item.variantId)}
                            className="w-8 text-gray-500 hover:text-black"
                          >
                            −
                          </button>

                          <span className="w-10 text-center text-sm">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQty(item.variantId)}
                            className="w-8 text-gray-500 hover:text-black"
                          >
                            +
                          </button>
                        </div>

                        {/* PREMIUM DELETE */}
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="
                            text-xs uppercase tracking-widest
                            px-3 py-1 border
                            text-gray-500
                            hover:text-red-500 hover:border-red-200 hover:bg-red-50
                            transition
                          "
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUMMARY */}
              <aside className="bg-gray-50 p-6">
                <p className="text-lg font-semibold uppercase">
                  Total: {total.toFixed(2)} TND
                </p>

                <button
                  onClick={handleCheckoutClick}
                  className="mt-6 w-full bg-black text-white py-3 uppercase text-xs"
                >
                  Commander
                </button>

                <button
                  onClick={clearCart}
                  className="mt-3 w-full text-xs text-gray-500"
                >
                  Vider le panier
                </button>
              </aside>

            </div>
          )}
        </div>
      </section>

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 w-[90%] max-w-md">
            <p className="text-sm uppercase text-gray-400">
              WhatsApp Checkout
            </p>

            <button
              onClick={sendOrderToWhatsapp}
              className="mt-6 w-full bg-black text-white py-3 uppercase text-xs"
            >
              Confirmer
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}

