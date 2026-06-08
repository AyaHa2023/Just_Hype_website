export type Store = {
    id: 'tunis' | 'gabes'
    name: string
    whatsapp_number: string
    address: string | null
}

export type Category = {
    id: string
    name: string
    slug: string
    parent_id: string | null
}

export type Style = {
    id: string
    name: string
    slug: string
    description: string | null
}

export type Saison ={
    id: string
    name: string
    slug: string
}

export type Color = {
    id: string
    name: string
    hex_code: string
}

export type Size = {
  id: string
  name: string                
}

export type ProductImage ={
    id: string
    product_id: string
    image_path: string
    sort_order: number
}

export type InventoryEntry={
    quantity: number
    store_id: string
    stores: {
        id: string
        name: string
        whatsapp_number: string
    }
}

export type ProductVariant = {
    id: string
    product_id: string
    color_id: string
    size_id: string
    colors: Color
    sizes: Size
    inventory: InventoryEntry[]
}

export type Product = {
    id: string
    name: string
    slug: string
    description?: string | null
    price: number
    discount_percent: number | null
    price_after_discount: number
    category_id?: string
    is_featured: boolean
    categories: Category
    product_saisons?: { saisons: Saison }[]
    product_styles?: { styles: Style }[]
    product_images: ProductImage[]
    product_variants: ProductVariant[]
}

export type AvailabilityState =
  | { status: 'available';   quantity: number }
  | { status: 'other_store'; otherStoreId: 'tunis' | 'gabes'; quantity: number }
  | { status: 'unavailable' }


  export type CartItem = {
  productId: string
  productName: string
  slug: string
  variantId: string
  color: Color
  size: Size
  price: number
  quantity: number
  userStoreId: 'tunis' | 'gabes'
  shippingStoreId: 'tunis' | 'gabes'
  shippingStoreName: string
  shippingStoreWhatsapp: string
  crossStore: boolean
  transferFeePaid: boolean
  transferPaymentRef?: string | null
  image: string | null
}

export type CartCookieData = {
  items: CartItem[]
  updatedAt: string
}