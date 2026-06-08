import type { Product } from '@/types'

export function getProductImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return null
  return `${base}/storage/v1/object/public/products/${imagePath}`
}

export function isValidProduct(product: Product | null | undefined): product is Product {
  return Boolean(product?.id && product?.slug && product?.name?.trim())
}

export function formatPrice(amount: number): string {
  return amount.toLocaleString('fr-TN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const priceClass = 'font-normal tabular-nums tracking-normal text-black'
export const priceClassSm = `text-sm ${priceClass}`
export const priceClassLg = `text-3xl sm:text-4xl font-light tabular-nums tracking-normal text-black`
