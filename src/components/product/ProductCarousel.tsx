// 'use client'

// import { useState } from 'react'
// import Image from 'next/image'
// import type { Product } from '@/types'

// type Props = {
//   product: Product
// }

// export function ProductCarousel({ product }: Props) {
//   const images = [...(product.product_images ?? [])]
//     .sort((a, b) => a.sort_order - b.sort_order)

//   const [activeIndex, setActiveIndex] = useState(0)

//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
//   const bucketBase = `${supabaseUrl}/storage/v1/object/public/products`

//   function getUrl(path: string) {
//   const base = process.env.NEXT_PUBLIC_SUPABASE_URL
//   if (!base) return ''
//   return `${base}/storage/v1/object/public/products/${path}`
// }

//   if (images.length === 0) {
//     return (
//       <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
//         <span className="text-xs text-gray-400 tracking-widest uppercase">
//           Photo bientôt disponible
//         </span>
//       </div>
//     )
//   }

//   return (
//     <div className="flex gap-3">
//       {/* thumbnail strip — left side on desktop, hidden on mobile */}
//       {images.length > 1 && (
//         <div className="hidden md:flex flex-col gap-2 w-16 flex-shrink-0">
//           {images.map((img, i) => (
//             <button
//               key={img.id ?? i}
//               onClick={() => setActiveIndex(i)}
//               className={`relative aspect-square w-16 overflow-hidden border-2 transition-all duration-150 flex-shrink-0 ${
//                 activeIndex === i
//                   ? 'border-black'
//                   : 'border-transparent hover:border-gray-300'
//               }`}
//             >
//               <Image
//                 src={getUrl(img.image_path)}
//                 alt={`${product.name} vue ${i + 1}`}
//                 fill
//                 className="object-cover"
//                 sizes="64px"
//               />
//             </button>
//           ))}
//         </div>
//       )}

//       {/* main image */}
//       <div className="flex-1 flex flex-col gap-3">
//         <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
//           <Image
//             src={getUrl(images[activeIndex].image_path)}
//             alt={product.name}
//             fill
//             className="object-cover transition-opacity duration-300"
//             sizes="(max-width: 768px) 100vw, 50vw"
//             priority
//           />
//           {product.discount_percent && (
//             <div className="absolute top-3 left-3 bg-black text-white text-[10px] tracking-widest uppercase px-2 py-1">
//               -{product.discount_percent}%
//             </div>
//           )}
//         </div>

//         {/* mobile dot indicators */}
//         {images.length > 1 && (
//           <div className="flex md:hidden justify-center gap-1.5">
//             {images.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setActiveIndex(i)}
//                 className={`w-1.5 h-1.5 rounded-full transition-all duration-150 ${
//                   activeIndex === i ? 'bg-black' : 'bg-gray-300'
//                 }`}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'

type Props = {
  product: Product
}

export function ProductCarousel({ product }: Props) {
  const images = [...(product.product_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)

  const [activeIndex, setActiveIndex] = useState(0)

  function getUrl(path: string) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!base) return ''
    return `${base}/storage/v1/object/public/products/${path}`
  }

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
        <span className="text-xs text-gray-400 tracking-widest uppercase">
          Photo bientôt disponible
        </span>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {images.length > 1 && (
        <div className="hidden md:flex flex-col gap-2 w-16 flex-shrink-0">
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square w-16 overflow-hidden border-2 transition-all duration-150 flex-shrink-0 ${
                activeIndex === i
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={getUrl(img.image_path)}
                alt={`${product.name} vue ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-3">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <Image
            src={getUrl(images[activeIndex].image_path)}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {product.discount_percent && (
            <div className="absolute top-3 left-3 bg-black text-white text-[10px] tracking-widest uppercase px-2 py-1">
              -{product.discount_percent}%
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex md:hidden justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-150 ${
                  activeIndex === i ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}