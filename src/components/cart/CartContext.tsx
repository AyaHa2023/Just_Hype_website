// 'use client'

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   type ReactNode
// } from 'react'
// import type { CartItem, CartCookieData } from '@/types'

// type CartContextType = {
//   items: CartItem[]
//   addItem: (item: CartItem) => void
//   removeItem: (variantId: string) => void
//   clearCart: () => void
//   itemCount: number
//   totalPrice: number
// }

// const CartContext = createContext<CartContextType | null>(null)

// const CART_COOKIE = 'just_hype_cart'
// const CART_COOKIE_DAYS = 7

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([])

//   useEffect(() => {
//     const saved = getCookie(CART_COOKIE)
//     if (!saved) return

//     try {
//       const parsed = JSON.parse(saved) as CartCookieData
//       if (Array.isArray(parsed.items)) {
//         queueMicrotask(() => setItems(parsed.items))
//       }
//     } catch {
//       console.warn('Cart cookie corrupted, starting fresh')
//     }
//   }, [])

//   useEffect(() => {
//     const cartData: CartCookieData = {
//       items,
//       updatedAt: new Date().toISOString()
//     }
//     setCookie(CART_COOKIE, JSON.stringify(cartData), CART_COOKIE_DAYS)
//   }, [items])

//   function addItem(newItem: CartItem) {
//     setItems(current => {
//       const exists = current.find(i => i.variantId === newItem.variantId)
//       if (exists) return current
//       return [...current, newItem]
//     })
//   }

//   function removeItem(variantId: string) {
//     setItems(current => current.filter(i => i.variantId !== variantId))
//   }

//   function clearCart() {
//     setItems([])
//     deleteCookie(CART_COOKIE)
//   }

//   const itemCount = items.length

//   const totalPrice = items.reduce((total, item) => {
//     const shippingFee = item.crossStore ? 9 : 0
//     return total + item.price + shippingFee
//   }, 0)

//   const value: CartContextType = {
//     items,
//     addItem,
//     removeItem,
//     clearCart,
//     itemCount,
//     totalPrice,
//   }

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   )
// }

// export function useCart() {
//   const ctx = useContext(CartContext)
//   if (!ctx) throw new Error('useCart() must be used inside <CartProvider>')
//   return ctx
// }

// function setCookie(name: string, value: string, days: number) {
//   const expires = new Date()
//   expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
//   document.cookie =
//     `${name}=${encodeURIComponent(value)};` +
//     `expires=${expires.toUTCString()};` +
//     `path=/;SameSite=Lax`
// }

// function getCookie(name: string): string | null {
//   const match = document.cookie.match(
//     new RegExp('(^| )' + name + '=([^;]+)')
//   )
//   return match ? decodeURIComponent(match[2]) : null
// }

// function deleteCookie(name: string) {
//   document.cookie =
//     `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
// }



'use client'

import { createContext, useContext, useState } from 'react'

type CartItem = {
  variantId: string
  productName: string
  price: number
  quantity: number
  size: any
  color: any
  image?: string
  slug: string
  crossStore?: boolean
  shippingStoreName?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  clearCart: () => void
  increaseQty: (variantId: string) => void
  decreaseQty: (variantId: string) => void
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

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        increaseQty,
        decreaseQty,
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