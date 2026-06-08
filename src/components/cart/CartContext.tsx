'use client'

import { createContext, useContext, useState, useEffect } from 'react'
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
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from cookie on mount
  useEffect(() => {
    const savedCart = getCookie('cart_items')
    if (savedCart) {
      try {
        const parsed = JSON.parse(decodeURIComponent(savedCart))
        if (Array.isArray(parsed)) {
          setItems(
            parsed.map((item: CartItem) => ({
              ...item,
              transferFeePaid: item.transferFeePaid ?? false,
            }))
          )
        }
      } catch (e) {
        console.error('Failed to parse cart cookie:', e)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save cart to cookie whenever it changes
  useEffect(() => {
    if (isHydrated) {
      if (items.length > 0) {
        setCookie('cart_items', encodeURIComponent(JSON.stringify(items)), 365)
      } else {
        deleteCookie('cart_items')
      }
    }
  }, [items, isHydrated])

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
    const transferDue =
      item.crossStore && !item.transferFeePaid ? 9 : 0
    return sum + item.price * item.quantity + transferDue
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

  if (!ctx) {
    throw new Error(
      'useCart() must be used inside <CartProvider>. ' +
      'Make sure CartProvider wraps your app in layout.tsx.'
    )
  }

  return ctx
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie =
    `${name}=${value};` +
    `expires=${expires.toUTCString()};` +
    `path=/`
}

function getCookie(name: string): string | null {
  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith(nameEQ)) {
      return cookie.substring(nameEQ.length)
    }
  }
  return null
}

function deleteCookie(name: string) {
  setCookie(name, '', -1)
}