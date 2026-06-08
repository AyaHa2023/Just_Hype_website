'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

type Props = {
  src: string
  alt: string
  open: boolean
  onClose: () => void
}

const LENS = 100
const ZOOM = 1.8          // reduced from 2.5 — less pixelated
const PREVIEW = LENS * ZOOM

export function ImageLightbox({ src, alt, open, onClose }: Props) {
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [lens, setLens] = useState<{
    x: number; y: number; w: number; h: number; show: boolean
  }>({ x: 0, y: 0, w: 0, h: 0, show: false })

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const updateLens = useCallback((clientX: number, clientY: number) => {
    const img = imgRef.current
    if (!img) return

    // use the actual rendered img bounds, not the wrapper
    const rect = img.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    // hide if pointer is outside the actual image (not just the wrapper)
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setLens((l) => ({ ...l, show: false }))
      return
    }

    const half = LENS / 2
    const clampX = Math.max(half, Math.min(rect.width - half, x))
    const clampY = Math.max(half, Math.min(rect.height - half, y))

    setLens({ x: clampX, y: clampY, w: rect.width, h: rect.height, show: true })
  }, [])

  if (!open) return null

  const lensLeft = lens.x - LENS / 2
  const lensTop = lens.y - LENS / 2

  // position preview to the right of lens, flip left if near right edge
  const previewLeft =
    lens.w > 0 && lens.x + LENS / 2 + PREVIEW + 12 > lens.w
      ? lensLeft - PREVIEW - 12
      : lens.x + LENS / 2 + 12

  const previewTop = Math.max(0, Math.min(lens.h - PREVIEW, lens.y - PREVIEW / 2))
  const bgPosX = -(lens.x * ZOOM - PREVIEW / 2)
  const bgPosY = -(lens.y * ZOOM - PREVIEW / 2)

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-[210] w-10 h-10 bg-black border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
        aria-label="Fermer"
      >
        <X size={18} strokeWidth={1.5} />
      </button>

      <div
        className="relative w-full max-w-4xl flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={imgWrapRef}
          className="relative w-full max-h-[70vh] sm:max-h-[65vh] touch-none select-none flex items-center justify-center"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            updateLens(e.clientX, e.clientY)
          }}
          onPointerMove={(e) => updateLens(e.clientX, e.clientY)}
          onPointerUp={() => setLens((l) => ({ ...l, show: false }))}
          onPointerLeave={() => setLens((l) => ({ ...l, show: false }))}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className="w-auto h-auto max-w-full max-h-[70vh] sm:max-h-[65vh] object-contain block"
            draggable={false}
          />

          {lens.show && (
            <>
              {/* offset the overlays to match the img position inside the wrapper */}
              <div
                className="absolute border-2 border-white pointer-events-none z-10 bg-white/10"
                style={{
                  width: LENS,
                  height: LENS,
                  left: (imgRef.current?.getBoundingClientRect().left ?? 0) -
                    (imgWrapRef.current?.getBoundingClientRect().left ?? 0) + lensLeft,
                  top: (imgRef.current?.getBoundingClientRect().top ?? 0) -
                    (imgWrapRef.current?.getBoundingClientRect().top ?? 0) + lensTop,
                }}
              />
              <div
                className="absolute pointer-events-none z-20 border border-white/60 overflow-hidden"
                style={{
                  width: PREVIEW,
                  height: PREVIEW,
                  left: (imgRef.current?.getBoundingClientRect().left ?? 0) -
                    (imgWrapRef.current?.getBoundingClientRect().left ?? 0) + previewLeft,
                  top: (imgRef.current?.getBoundingClientRect().top ?? 0) -
                    (imgWrapRef.current?.getBoundingClientRect().top ?? 0) + previewTop,
                  backgroundImage: `url(${src})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: `${lens.w * ZOOM}px ${lens.h * ZOOM}px`,
                  backgroundPosition: `${bgPosX}px ${bgPosY}px`,
                }}
                aria-hidden
              />
            </>
          )}
        </div>

        <p className="text-[10px] tracking-widest uppercase text-white/50 text-center">
          Glissez le doigt ou la souris sur l&apos;image pour zoomer
        </p>
      </div>
    </div>
  )
}