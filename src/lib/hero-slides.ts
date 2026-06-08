import type { HeroSlide } from '@/types/hero'

const HOMEPAGE_BUCKET = 'homepage'

export function getHeroImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return null
  return `${base}/storage/v1/object/public/${HOMEPAGE_BUCKET}/${imagePath}`
}

/** First 2 = campaign, slot 3 = announcement, then the rest by sort_order */
export function orderHeroSlides(slides: HeroSlide[]): HeroSlide[] {
  const active = slides.filter((s) => s.is_active)
  const campaigns = [...active]
    .filter((s) => s.slide_type === 'campaign')
    .sort((a, b) => a.sort_order - b.sort_order)
  const announcements = [...active]
    .filter((s) => s.slide_type === 'announcement')
    .sort((a, b) => a.sort_order - b.sort_order)

  const ordered: HeroSlide[] = []
  const used = new Set<string>()

  for (const slide of campaigns.slice(0, 2)) {
    ordered.push(slide)
    used.add(slide.id)
  }

  const primaryAnnouncement = announcements[0]
  if (primaryAnnouncement) {
    ordered.push(primaryAnnouncement)
    used.add(primaryAnnouncement.id)
  }

  const remainder = active
    .filter((s) => !used.has(s.id))
    .sort((a, b) => a.sort_order - b.sort_order)

  ordered.push(...remainder)
  return ordered
}
