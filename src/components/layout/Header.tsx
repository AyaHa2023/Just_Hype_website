'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/components/store/StoreContext'
import { useCart } from '@/components/cart/CartContext'
import { Sidebar } from './Sidebar'

export function Header() {
  const pathname = usePathname()
  const { storeName, openModal } = useStore()
  const { itemCount } = useCart()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const isHomepage = pathname === '/'

  useEffect(() => {
    function handleScroll() {
      if (!isHomepage) {
        setIsHidden(window.scrollY > 50)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomepage])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 transition-transform duration-300 ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-8 lg:px-16 h-14 sm:h-16 md:h-20">

          {/* hamburger — always black */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex flex-col gap-1.5 p-1.5 sm:p-2 -ml-1 sm:-ml-2"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block w-5 sm:w-6 h-px bg-black transition-colors duration-300"
              />
            ))}
          </button>

          {/* logo — always black */}
          <Link
            href="/"
            className="text-xs sm:text-sm tracking-[0.3em] uppercase font-medium text-black"
          >
            Just Hype
          </Link>

          {/* right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={openModal}
              className="hidden md:block text-xs tracking-widest uppercase text-gray-500 hover:text-black transition-colors duration-300"
            >
              {storeName || 'Choisir boutique'}
            </button>

            <Link
              href="/panier"
              aria-label="Panier"
              className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-visible"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] leading-none text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
