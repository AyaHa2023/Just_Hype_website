'use client'

import { useEffect } from 'react'
import type { Color, Size } from '@/types'

type AttributeOption = {
  id: string
  label: string
}

type AttributeGroup = {
  id: string
  name: string
  options: AttributeOption[]
}

type Props = {
  isOpen: boolean
  onClose: () => void
  categoryAttributes: AttributeGroup[]
  allColors: Color[]
  allSizes: Size[]
  selectedOptions: string[]
  selectedColors: string[]
  selectedSizes: string[]
  onToggleOption: (id: string) => void
  onToggleColor: (id: string) => void
  onToggleSize: (id: string) => void
  onReset: () => void
  hasActiveFilters: boolean
}

export function FiltersSidebar({
  isOpen,
  onClose,
  categoryAttributes,
  allColors,
  allSizes,
  selectedOptions,
  selectedColors,
  selectedSizes,
  onToggleOption,
  onToggleColor,
  onToggleSize,
  onReset,
  hasActiveFilters,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-[min(100vw-12px,320px)] sm:w-80 bg-white flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 border-b border-gray-100">
          <span className="text-xs tracking-[0.3em] uppercase">Filtres</span>
          <button onClick={onClose} className="p-1.5 sm:p-2 -mr-1 sm:-mr-2 text-gray-400 hover:text-black">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto py-4 sm:py-6 px-4 sm:px-6 space-y-6 sm:space-y-8">

          {/* ATTRIBUTES — only when inside a category */}
          {categoryAttributes.map((group) => (
            <div key={group.id}>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-2 sm:mb-3">
                {group.name}
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {group.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onToggleOption(opt.id)}
                    className={`text-xs tracking-wide px-2.5 sm:px-3 py-1 sm:py-1.5 border transition-colors duration-150 ${
                      selectedOptions.includes(opt.id)
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {categoryAttributes.length > 0 && (
            <div className="border-t border-gray-100" />
          )}

          {/* COLORS — always all colors from DB */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-2 sm:mb-3">
              Couleur
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {allColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => onToggleColor(color.id)}
                  title={color.name}
                  className={`relative w-6 sm:w-7 h-6 sm:h-7 rounded-full border-2 transition-all duration-150 ${
                    selectedColors.includes(color.id)
                      ? 'border-black scale-110'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color.hex_code }}
                >
                  {color.hex_code === '#FFFFFF' && (
                    <span className="absolute inset-0 rounded-full border border-gray-200" />
                  )}
                </button>
              ))}
            </div>
            {selectedColors.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {allColors
                  .filter((c) => selectedColors.includes(c.id))
                  .map((c) => c.name)
                  .join(', ')}
              </p>
            )}
          </div>

          {/* SIZES — always all sizes from DB */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-2 sm:mb-3">
              Taille
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {allSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => onToggleSize(size.id)}
                  className={`text-xs tracking-wide min-w-[36px] sm:min-w-[40px] px-2 py-1 sm:py-1.5 border transition-colors duration-150 text-center ${
                    selectedSizes.includes(size.id)
                      ? 'bg-black text-white border-black'
                      : 'border-gray-200 hover:border-black'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-t border-gray-100 flex gap-2 sm:gap-3">
          {hasActiveFilters && (
            <button
              onClick={() => { onReset(); onClose() }}
              className="flex-1 border border-gray-200 text-xs tracking-widest uppercase py-2.5 sm:py-3 hover:border-black transition-colors duration-150"
            >
              Réinitialiser
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-black text-white text-xs tracking-widest uppercase py-2.5 sm:py-3 hover:bg-gray-900 transition-colors duration-150"
          >
            Voir les articles
          </button>
        </div>
      </aside>
    </>
  )
}