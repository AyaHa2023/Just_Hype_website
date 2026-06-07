'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/components/store/StoreContext'

type Category = {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

type Props = {
  isOpen: boolean
  onClose: () => void
  categories?: Category[]
}

const ACCESSOIRES_CHILDREN = [
  { name: 'Ceintures',             slug: 'ceintures' },
  { name: 'Chapeaux',              slug: 'chapeaux' },
  { name: 'Chaussettes',           slug: 'chaussettes' },
  { name: 'Cravates',              slug: 'cravates' },
  { name: 'Noeuds Papillon',       slug: 'noeuds-papillon' },
  { name: 'Portefeuilles',         slug: 'portefeuilles' },
  { name: 'Sous-vêtements',        slug: 'sous-vetements' },
  { name: 'Housses de Costumes',   slug: 'housses-de-costumes' },
  { name: 'Boutons de Manchettes', slug: 'boutons-de-manchettes' },
  { name: 'Broches',               slug: 'broches' },
]

const TOP_CATEGORIES = [
  { name: 'Chemises',   slug: 'chemises' },
  { name: 'Polos',      slug: 'polos' },
  { name: 'T-Shirts',   slug: 't-shirts' },
  { name: 'Pantalons',  slug: 'pantalons' },
  { name: 'Jeans',      slug: 'jeans' },
  { name: 'Chinos',     slug: 'chinos' },
  { name: 'Shorts',     slug: 'shorts' },
  { name: 'Vestes',     slug: 'vestes',     divider: true },
  { name: 'Blazers',    slug: 'blazers' },
  { name: 'Costumes',   slug: 'costumes' },
  { name: 'Pulls',      slug: 'pulls' },
  { name: 'Manteaux',   slug: 'manteaux',   divider: true },
  { name: 'Chaussures', slug: 'chaussures' },
]

export function Sidebar({ isOpen, onClose }: Props) {
  const { storeName, openModal } = useStore()
  const [accessoiresOpen, setAccessoiresOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // close accessoires dropdown when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      queueMicrotask(() => setAccessoiresOpen(false))
    }
  }, [isOpen])

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[min(100vw-16px,288px)] bg-white flex flex-col transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 md:h-20 border-b border-gray-100">
          <span className="text-xs tracking-[0.3em] uppercase">Menu</span>
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="p-1.5 sm:p-2 -mr-1 sm:-mr-2 text-gray-400 hover:text-black"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto py-4 sm:py-6 px-4 sm:px-6">

          {TOP_CATEGORIES.map((cat) => (
            <div key={cat.slug}>
              {'divider' in cat && cat.divider && (
                <div className="border-t border-gray-100 my-3 sm:my-4" />
              )}
              <Link
                href={`/produits?categorie=${cat.slug}`}
                onClick={onClose}
                className="block py-2 sm:py-3 text-xs sm:text-sm tracking-widest uppercase text-gray-700 hover:text-black transition-colors duration-150"
              >
                {cat.name}
              </Link>
            </div>
          ))}

          {/* divider before accessoires */}
          <div className="border-t border-gray-100 my-3 sm:my-4" />

          {/* Accessoires — dropdown */}
          <div>
            <button
              onClick={() => setAccessoiresOpen((prev) => !prev)}
              className="w-full flex items-center justify-between py-2 sm:py-3 text-xs sm:text-sm tracking-widest uppercase text-gray-700 hover:text-black transition-colors duration-150"
            >
              Accessoires
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={`transition-transform duration-200 ${
                  accessoiresOpen ? 'rotate-180' : ''
                }`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {/* dropdown items */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                accessoiresOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              {/* link to all accessoires */}
              <Link
                href="/produits?categorie=accessoires"
                onClick={onClose}
                className="block py-1.5 sm:py-2 pl-3 sm:pl-4 text-xs tracking-widest uppercase text-gray-500 hover:text-black transition-colors duration-150"
              >
                Tous les accessoires
              </Link>
              {ACCESSOIRES_CHILDREN.map((child) => (
                <Link
                  key={child.slug}
                  href={`/produits?categorie=${child.slug}`}
                  onClick={onClose}
                  className="block py-1.5 sm:py-2 pl-3 sm:pl-4 text-xs tracking-widest uppercase text-gray-500 hover:text-black transition-colors duration-150"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* store selector */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
            Boutique active
          </p>
          <button
            onClick={() => { openModal(); onClose() }}
            className="text-xs sm:text-sm text-black underline underline-offset-4 hover:text-gray-600 transition-colors"
          >
            {storeName || 'Choisir une boutique'}
          </button>
        </div>
      </aside>
    </>
  )
}
