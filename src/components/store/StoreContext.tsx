'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

import type { Store } from '@/types'

type StoreContextType = {
  storeId: Store['id'] | null
  storeName: string               // fixed: was string | null
  setStore: (id: Store['id'], name: string) => void
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

// We combine storeId + storeName into one object
// so we only call setState once instead of twice
// This eliminates the "cascading renders" warning
type StoreState = {
  id: Store['id'] | null
  name: string
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {

  // ONE state object instead of two separate useState calls
  // This means one re-render instead of two when both change
  const [store, setStoreState] = useState<StoreState>({
    id: null,
    name: ''     // empty string instead of null — no type mismatch
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const savedId = getCookie('store_id') as Store['id'] | null
    const savedName = getCookie('store_name') ?? ''
    // ?? '' means: if getCookie returns null, use '' instead

    if ((savedId === 'tunis' || savedId === 'gabes') && savedName) {
      // ONE setState call — updates both id and name together
      // This is why we combined them: one update = one render
      queueMicrotask(() => setStoreState({ id: savedId, name: savedName }))
    } else {
      queueMicrotask(() => setIsModalOpen(true))
    }
  }, [])

  function setStore(id: Store['id'], name: string) {
    // Again one setState call for both values
    setStoreState({ id, name })
    setCookie('store_id', id, 365)
    setCookie('store_name', name, 365)
    setIsModalOpen(false)
  }

  const value: StoreContextType = {
    storeId: store.id,
    storeName: store.name,
    setStore,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)

  if (!ctx) {
    throw new Error(
      'useStore() must be used inside <StoreProvider>. ' +
      'Make sure StoreProvider wraps your app in layout.tsx.'
    )
  }

  return ctx
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie =
    `${name}=${encodeURIComponent(value)};` +
    `expires=${expires.toUTCString()};` +
    `path=/;` +
    `SameSite=Lax`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp('(^| )' + name + '=([^;]+)')
  )
  return match ? decodeURIComponent(match[2]) : null
}

export function deleteCookie(name: string) {
  document.cookie =
    `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}
