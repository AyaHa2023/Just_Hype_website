// ============================================================
// src/components/store/StoreModal.tsx
//
// The first-visit modal. Shows when no store cookie exists.
// Black and white, premium feel — no colors, no gradients.
//
// Two buttons: Grand Tunis / Gabès
// On click → calls setStore() from context → modal closes
// → cookie saved → user never sees this again for 365 days
//
// 'use client' because:
//   - It reads from StoreContext (which is client-side)
//   - It handles click events
// ============================================================

'use client'

import { useStore } from './StoreContext'

// The two store options — hardcoded because you only have 2 stores
// and they'll never change without a code deployment anyway
const STORES = [
  {
    id: 'tunis' as const,        // 'as const' tells TypeScript this
    name: 'Boutique Menzah 5',   // is the literal string 'tunis'
    city: 'Grand Tunis',         // not just any string
    address: '28 Av. d\'Afrique, Menzah V, Ariana',
  },
  {
    id: 'gabes' as const,
    name: 'Boutique Gabès',
    city: 'Gabès',
    address: '154 Av. Farhat Hached, Beb Bhar',
  },
]

export function StoreModal() {
  // Read isModalOpen and setStore from the context
  // This component only renders something visible when isModalOpen = true
  const { isModalOpen, setStore } = useStore()

  // If modal is not open, render nothing at all
  // The component still exists in the tree but outputs no HTML
  if (!isModalOpen) return null

  return (
    // BACKDROP
    // Fixed means it stays in place even when you scroll
    // inset-0 means top:0, right:0, bottom:0, left:0 = covers the full screen
    // z-50 puts it above everything else on the page
    // bg-black/60 = black with 60% opacity (the dark overlay behind the modal)
    // flex + items-center + justify-center = center the modal card
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      {/* MODAL CARD
          bg-white = white background
          p-10 = padding on all sides
          max-w-md = maximum width (medium)
          w-full = takes full width up to max-w-md
          mx-4 = horizontal margin on mobile so it doesn't touch screen edges */}
      <div className="bg-white p-10 max-w-md w-full mx-4">

        {/* BRAND NAME — small caps, tracked out */}
        <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">
          Just Hype
        </p>

        {/* HEADLINE */}
        <h2 className="text-2xl font-light tracking-wide text-black mb-2">
          Choisissez votre boutique
        </h2>

        {/* SUBTITLE */}
        <p className="text-sm text-gray-500 mb-10 leading-relaxed">
          Vos articles seront vérifiés selon le stock
          de la boutique sélectionnée.
        </p>

        {/* STORE BUTTONS
            flex-col = stack vertically
            gap-3 = space between buttons */}
        <div className="flex flex-col gap-3">
          {STORES.map((store) => (
            <button
              key={store.id}
              // When clicked: call setStore with both id and name
              // setStore lives in StoreContext, saves cookie + closes modal
              onClick={() => setStore(store.id, store.name)}

              // Tailwind classes for a premium black/white button
              // border border-black = thin black border
              // hover:bg-black hover:text-white = inverts on hover
              // transition-colors = smooth color change on hover
              // py-4 px-6 = vertical and horizontal padding
              // text-left = align text to the left
              // group = lets child elements react to hover on this parent
              className="
                border border-black
                hover:bg-black hover:text-white
                transition-colors duration-200
                py-4 px-6 text-left group
              "
            >
              {/* CITY NAME — large */}
              <p className="text-base font-medium tracking-wide">
                {store.city}
              </p>

              {/* STORE NAME + ADDRESS — small, muted
                  group-hover:text-gray-300 = when button is hovered,
                  this text goes from gray-400 to gray-300 */}
             
<p className="text-xs text-gray-500 group-hover:text-gray-400 mt-0.5">
  {store.name} — {store.address}
</p>
            </button>
          ))}
        </div>

        {/* FOOTER NOTE */}
        <p className="text-xs text-gray-400 mt-6 text-center">
          Vous pouvez changer de boutique à tout moment
        </p>
      </div>
    </div>
  )
}