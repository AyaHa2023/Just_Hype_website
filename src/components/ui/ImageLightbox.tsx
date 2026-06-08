'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

type Props = {
  src: string
  alt: string
  open: boolean
  onClose: () => void
}

const LENS = 88
const ZOOM = 2.5

export function ImageLightbox({ src, alt, open, onClose }: Props) {
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const [lens, setLens] = useState<{
    x: number
    y: number
    w: number
    h: number
    show: boolean
  }>({ x: 0, y: 0, w: 0, h: 0, show: false })

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const updateLens = useCallback((clientX: number, clientY: number) => {
    const wrap = imgWrapRef.current
    if (!wrap) return
    const rect = wrap.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setLens((l) => ({ ...l, show: false }))
      return
    }

    const half = LENS / 2
    const clampX = Math.max(half, Math.min(rect.width - half, x))
    const clampY = Math.max(half, Math.min(rect.height - half, y))

    setLens({
      x: clampX,
      y: clampY,
      w: rect.width,
      h: rect.height,
      show: true,
    })
  }, [])

  if (!open) return null

  const lensLeft = lens.x - LENS / 2
  const lensTop = lens.y - LENS / 2
  const bgX = ((lens.x / lens.w) * 100).toFixed(2)
  const bgY = ((lens.y / lens.h) * 100).toFixed(2)

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
        {lens.show && (
          <div
            className="hidden sm:block w-40 h-40 border border-white/40 overflow-hidden bg-black shrink-0"
            style={{
              backgroundImage: `url(${src})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${lens.w * ZOOM}px ${lens.h * ZOOM}px`,
              backgroundPosition: `${bgX}% ${bgY}%`,
            }}
            aria-hidden
          />
        )}

        <div
          ref={imgWrapRef}
          className="relative w-full max-h-[70vh] sm:max-h-[65vh] touch-none select-none"
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
            src={src}
            alt={alt}
            className="w-full h-auto max-h-[70vh] sm:max-h-[65vh] object-contain mx-auto block"
            draggable={false}
          />

          {lens.show && (
            <>
              <div
                className="absolute border border-white pointer-events-none z-10 bg-white/10"
                style={{
                  width: LENS,
                  height: LENS,
                  left: lensLeft,
                  top: lensTop,
                }}
              />
              <div
                className="sm:hidden absolute left-1/2 -translate-x-1/2 -top-36 w-36 h-36 border border-white/50 overflow-hidden bg-black z-20 pointer-events-none"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: `${lens.w * ZOOM}px ${lens.h * ZOOM}px`,
                  backgroundPosition: `${bgX}% ${bgY}%`,
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
