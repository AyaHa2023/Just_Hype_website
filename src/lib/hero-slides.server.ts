import { createClient } from '@/lib/supabase/server'
import { orderHeroSlides } from '@/lib/hero-slides'
import type { HeroSlide } from '@/types/hero'

export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('homepage_slides')
      .select(
        'id, image_path, slide_type, sort_order, is_active, title, subtitle, link_url, alt_text'
      )
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('homepage_slides fetch:', error.message)
      return []
    }

    return orderHeroSlides((data ?? []) as HeroSlide[])
  } catch {
    return []
  }
}
