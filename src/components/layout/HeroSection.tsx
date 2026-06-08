// import Link from 'next/link'

// export function HeroSection() {
//   return (
//     <section className="relative h-[100svh] overflow-hidden bg-black">
//       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//       <div className="absolute bottom-12 left-8 md:bottom-16 md:left-16">
//         <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-3">
//           Just Hype
//         </p>
//         <h1 className="text-4xl md:text-6xl font-light tracking-wide text-white leading-tight mb-6">
//           La collection<br />qui vous définit
//         </h1>
//         <Link
//           href="/produits"
//           className="inline-block border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 px-8 py-3 text-xs tracking-[0.2em] uppercase"
//         >
//           Découvrir
//         </Link>
//       </div>
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
//         <div className="w-px h-8 bg-white/40" />
//       </div>
//     </section>
//   )
// }


import { createClient } from '@/lib/supabase/server'
import { HeroCarousel } from '@/components/layout/HeroCarousel'

type HeroSlide = {
  id: string
  image_path: string
  title: string | null
  subtitle: string | null
  cta_label: string | null
  cta_href: string | null
  sort_order: number
}

export async function HeroSection() {
  const supabase = await createClient()

  const { data: slides } = await supabase
    .from('hero_slides')
    .select('id, image_path, title, subtitle, cta_label, cta_href, sort_order')
    .eq('is_active', true)
    .order('sort_order')

  if (!slides || slides.length === 0) {
    return <HeroCarousel slides={[]} />
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  const hydratedSlides = slides.map((slide: HeroSlide) => ({
    ...slide,
    image_url: `${supabaseUrl}/storage/v1/object/public/hero/${slide.image_path}`,
  }))

  return <HeroCarousel slides={hydratedSlides} />
}