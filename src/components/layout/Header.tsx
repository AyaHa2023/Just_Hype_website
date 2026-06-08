// 'use client'

// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import Link from 'next/link'
// import { useStore } from '@/components/store/StoreContext'
// import { useCart } from '@/components/cart/CartContext'
// import { Sidebar } from './Sidebar'
// import Image from 'next/image'


// export function Header() {
//   const pathname = usePathname()
//   const { storeName, openModal } = useStore()
//   const { itemCount } = useCart()
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [isHidden, setIsHidden] = useState(false)
//   const isHomepage = pathname === '/'

//   useEffect(() => {
//     function handleScroll() {
//       if (!isHomepage) {
//         setIsHidden(window.scrollY > 50)
//       }
//     }

//     window.addEventListener('scroll', handleScroll, { passive: true })
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [isHomepage])

//   return (
//     <>
//       <header
//         className={`fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 transition-transform duration-300 ${
//           isHidden ? '-translate-y-full' : 'translate-y-0'
//         }`}
//       >
//         {/* GRID HEADER */}
//         <div className="grid grid-cols-3 items-center px-3 sm:px-4 md:px-8 lg:px-16 h-14 sm:h-16 md:h-20">

//           {/* LEFT - hamburger */}
//           <div className="flex items-center justify-start gap-4">
//   <button
//     onClick={() => setSidebarOpen(true)}
//     aria-label="Ouvrir le menu"
//     className="flex flex-col gap-1.5 p-1.5 sm:p-2 -ml-1 sm:-ml-2"
//   >
//     {[0, 1, 2].map((i) => (
//       <span
//         key={i}
//         className="block w-5 sm:w-6 h-px bg-black"
//       />
//     ))}
//   </button>

//   <span className="font-cinzel text-sm tracking-[0.35em] uppercase whitespace-nowrap">
//     Just Hype
//   </span>
// </div>

//           {/* CENTER - logo perfectly centered */}
//          {/* CENTER - logo */}
// <div className="flex justify-center items-center h-full overflow-hidden">
//   <Link href="/" className="flex items-center gap-3 h-full">
    
//     {/* <span className="font-cinzel text-sm tracking-[0.35em] uppercase">
//       Just Hype
//     </span> */}

//     <Image
//       src="/images/no_bg_logo.png"
//       alt="Just Hype"
//       width={80}
//       height={80}
//       className="object-contain"
//     />

//   </Link>
// </div>
//           {/* RIGHT - cart + store */}
//           <div className="flex items-center justify-end gap-2 sm:gap-4">
//             <button
//               onClick={openModal}
//               className="hidden md:block text-xs tracking-widest uppercase text-gray-500 hover:text-black transition-colors duration-300"
//             >
//               {storeName || 'Choisir boutique'}
//             </button>

//             <Link
//               href="/panier"
//               aria-label="Panier"
//               className="relative flex h-10 w-10 items-center justify-center"
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="black"
//                 strokeWidth="1.5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
//                 />
//               </svg>

//               {itemCount > 0 && (
//                 <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] leading-none text-white">
//                   {itemCount}
//                 </span>
//               )}
//             </Link>
//           </div>
//         </div>
//       </header>

//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//     </>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/components/store/StoreContext'
import { useCart } from '@/components/cart/CartContext'
import { Sidebar } from './Sidebar'
import Image from 'next/image'

export function Header() {
  const pathname = usePathname()
  const { storeName, openModal } = useStore()
  const { itemCount } = useCart()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const isHomepage = pathname === '/'

  useEffect(() => {
    function handleScroll() {
      if (!isHomepage) {
        setIsHidden(window.scrollY > 50)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomepage])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 transition-transform duration-300 ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="grid grid-cols-3 items-center px-3 sm:px-4 md:px-8 lg:px-16 h-14 sm:h-16 md:h-20">

          {/* LEFT — hamburger only on mobile, hamburger + brand name on md+ */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu"
              className="flex flex-col gap-1.5 p-1 -ml-1"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="block w-5 sm:w-6 h-px bg-black" />
              ))}
            </button>

            {/* brand name — hidden on mobile to save space */}
            <span className="hidden sm:block text-xs tracking-[0.35em] uppercase font-medium whitespace-nowrap">
              Just Hype
            </span>
          </div>

          {/* CENTER — logo icon only (small, no text since logo already has text) */}
          <div className="flex justify-center items-center">
            <Link href="/">
              <Image
                src="/images/no_bg_logo.png"
                alt="Just Hype"
                width={44}
                height={44}
                className="object-contain w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11"
              />
            </Link>
          </div>

          {/* RIGHT — store selector + cart */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <button
              onClick={openModal}
              className="hidden md:block text-xs tracking-widest uppercase text-gray-500 hover:text-black transition-colors duration-300"
            >
              {storeName || 'Choisir boutique'}
            </button>

            <Link
              href="/panier"
              aria-label="Panier"
              className="relative flex h-10 w-10 items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] leading-none text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}