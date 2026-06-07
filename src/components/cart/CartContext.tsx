'use client'

import { createContext, useContext, useState } from 'react'
import type { CartItem } from '@/types'

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  clearCart: () => void
  increaseQty: (variantId: string) => void
  decreaseQty: (variantId: string) => void
  itemCount: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId)
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, item]
    })
  }

  function removeItem(variantId: string) {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId))
  }

  function clearCart() {
    setItems([])
  }

  function increaseQty(variantId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  function decreaseQty(variantId: string) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = items.reduce((sum, item) => {
    const fee = item.crossStore ? 9 : 0
    return sum + item.price * item.quantity + fee
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        increaseQty,
        decreaseQty,
        itemCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}