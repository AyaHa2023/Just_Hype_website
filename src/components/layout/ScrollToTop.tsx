'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const isHomepage = pathname === '/'

  useEffect(() => {
    function handleScroll() {
      // Don't show on homepage, show on other pages when scrolled
      if (isHomepage) {
        setVisible(false)
      } else {
        const threshold = window.innerWidth < 768 ? 200 : 300
        setVisible(window.scrollY > threshold)
      }
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isHomepage])

  function scrollUp() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollUp}
      aria-label="Retour en haut"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 shadow-md"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
  )
}