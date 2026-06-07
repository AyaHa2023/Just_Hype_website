import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative h-[100svh] overflow-hidden bg-black pt-14 sm:pt-16 md:pt-20">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-8 md:bottom-16 md:left-16 right-4 sm:right-auto">
        <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-2 sm:mb-3">
          Just Hype
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-white leading-tight mb-4 sm:mb-6">
          La collection<br />qui vous définit
        </h1>
        <Link
          href="/produits"
          className="inline-block border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 px-6 sm:px-8 py-2 sm:py-3 text-xs tracking-[0.2em] uppercase"
        >
          Découvrir
        </Link>
      </div>
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <div className="w-px h-6 sm:h-8 bg-white/40" />
      </div>
    </section>
  )
}