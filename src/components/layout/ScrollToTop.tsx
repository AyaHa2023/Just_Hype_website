'use client'

import { useState, useEffect } from 'react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 200)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollUp}
      aria-label="Retour en haut"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 min-w-10 h-10 px-2 bg-black text-white text-lg leading-none flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 shadow-md"
    >
      ^
    </button>
  )
}
