// 'use client'

// import { useCallback, useEffect, useState } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import type { HeroSlide } from '@/types/hero'
// import { getHeroImageUrl } from '@/lib/hero-slides'

// const INTERVAL_MS = 6000

// type Props = {
//   slides: HeroSlide[]
// }

// export function HeroCarousel({ slides }: Props) {
//   const [index, setIndex] = useState(0)
//   const [prevIndex, setPrevIndex] = useState<number | null>(null)
//   const [animating, setAnimating] = useState(false)

//   const count = slides.length

//   const goNext = useCallback(() => {
//     if (count <= 1 || animating) return
//     setAnimating(true)
//     setPrevIndex(index)
//     setIndex((i) => (i + 1) % count)
//     window.setTimeout(() => {
//       setPrevIndex(null)
//       setAnimating(false)
//     }, 700)
//   }, [count, index, animating])

//   useEffect(() => {
//     if (count <= 1) return
//     const timer = window.setInterval(goNext, INTERVAL_MS)
//     return () => window.clearInterval(timer)
//   }, [count, goNext])

//   const current = slides[index]
//   const previous = prevIndex !== null ? slides[prevIndex] : null

//   return (
//     <section className="relative h-[100svh] overflow-hidden bg-black pt-14 sm:pt-16 md:pt-20">
//       <div className="absolute inset-0 bg-black overflow-hidden">
//         {count === 0 && <div className="absolute inset-0 bg-black" />}

//         {previous && (
//           <SlideLayer
//             key={`out-${previous.id}-${prevIndex}`}
//             slide={previous}
//             className="hero-slide-exit"
//           />
//         )}

//         {current && (
//           <SlideLayer
//             key={`in-${current.id}-${index}-${prevIndex ?? 'init'}`}
//             slide={current}
//             className={prevIndex !== null ? 'hero-slide-enter' : 'opacity-100'}
//           />
//         )}
//       </div>

//       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-10" />

//       <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-8 md:bottom-16 md:left-16 right-4 sm:right-auto z-20">
//         <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-2 sm:mb-3">
//           Just Hype
//         </p>
//         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-white leading-tight mb-4 sm:mb-6">
//           {current?.title ? (
//             current.title
//           ) : (
//             <>
//               La collection
//               <br />
//               qui vous définit
//             </>
//           )}
//         </h1>
//         {current?.subtitle && (
//           <p className="text-sm text-white/70 mb-4 max-w-md tracking-wide">
//             {current.subtitle}
//           </p>
//         )}
//         <Link
//           href={current?.link_url || '/produits'}
//           className="inline-block border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 px-6 sm:px-8 py-2 sm:py-3 text-xs tracking-[0.2em] uppercase"
//         >
//           Découvrir
//         </Link>
//       </div>

//       {count > 1 && (
//         <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
//           {slides.map((slide, i) => (
//             <button
//               key={slide.id}
//               type="button"
//               aria-label={`Slide ${i + 1}`}
//               onClick={() => {
//                 if (i === index || animating) return
//                 setAnimating(true)
//                 setPrevIndex(index)
//                 setIndex(i)
//                 window.setTimeout(() => {
//                   setPrevIndex(null)
//                   setAnimating(false)
//                 }, 700)
//               }}
//               className={`h-1 transition-all duration-300 ${
//                 i === index ? 'w-6 bg-white' : 'w-2 bg-white/40'
//               }`}
//             />
//           ))}
//         </div>
//       )}
//     </section>
//   )
// }

// function SlideLayer({
//   slide,
//   className,
// }: {
//   slide: HeroSlide
//   className: string
// }) {
//   const src = getHeroImageUrl(slide.image_path)
//   if (!src) return null

//   return (
//     <div className={`absolute inset-0 ${className}`}>
//       <Image
//         src={src}
//         alt={slide.alt_text || slide.title || 'Just Hype'}
//         fill
//         className="object-cover object-center"
//         sizes="100vw"
//         priority
//       />
//     </div>
//   )
// }



'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Slide = {
  id: string
  image_url: string
  title: string | null
  subtitle: string | null
  cta_label: string | null
  cta_href: string | null
}

type Props = {
  slides: Slide[]
}

const FALLBACK_SLIDE: Slide = {
  id: 'fallback',
  image_url: '',
  title: 'La collection qui vous définit',
  subtitle: 'Just Hype — Tunis & Gabès',
  cta_label: 'Découvrir',
  cta_href: '/produits',
}

export function HeroCarousel({ slides }: Props) {
  const allSlides = slides.length > 0 ? slides : [FALLBACK_SLIDE]
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex || isTransitioning) return
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveIndex(index)
        setIsTransitioning(false)
      }, 400)
    },
    [activeIndex, isTransitioning]
  )

  useEffect(() => {
    if (allSlides.length <= 1) return
    const timer = setInterval(() => {
      goTo((activeIndex + 1) % allSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [activeIndex, allSlides.length, goTo])

  const current = allSlides[activeIndex]

  return (
    <section className="relative h-[100svh] overflow-hidden bg-black">
      {/* slides */}
      {allSlides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.image_url ? (
            <Image
              src={slide.image_url}
              alt={slide.title ?? 'Just Hype'}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      ))}

      {/* content — slides down on transition */}
      <div
        className={`absolute bottom-16 md:bottom-20 left-8 md:left-16 transition-all duration-500 ${
          isTransitioning
            ? 'opacity-0 translate-y-4'
            : 'opacity-100 translate-y-0'
        }`}
      >
        {current.subtitle && (
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-3">
            {current.subtitle}
          </p>
        )}
        {current.title && (
          <h1 className="text-4xl md:text-6xl font-light tracking-wide text-white leading-tight mb-6 max-w-lg">
            {current.title}
          </h1>
        )}
        {current.cta_label && current.cta_href && (
          <Link
            href={current.cta_href}
            className="inline-block border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 px-8 py-3 text-xs tracking-[0.2em] uppercase"
          >
            {current.cta_label}
          </Link>
        )}
      </div>

      {/* dot indicators */}
      {allSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {allSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === activeIndex
                  ? 'w-6 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* scroll indicator */}
      <div className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-1 animate-bounce">
        <div className="w-px h-8 bg-white/40" />
      </div>
    </section>
  )
}