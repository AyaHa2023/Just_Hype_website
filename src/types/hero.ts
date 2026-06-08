export type HeroSlideType = 'campaign' | 'announcement'

export type HeroSlide = {
  id: string
  image_path: string
  slide_type: HeroSlideType
  sort_order: number
  is_active: boolean
  title?: string | null
  subtitle?: string | null
  link_url?: string | null
  alt_text?: string | null
}
