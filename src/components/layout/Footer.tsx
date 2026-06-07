'use client'

import Link from 'next/link'
import { useState } from 'react'

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H7.9V12h2.6V9.8c0-2.57 1.54-4 3.9-4 1.13 0 2.32.2 2.32.2v2.55h-1.31c-1.29 0-1.69.8-1.69 1.62V12h2.88l-.46 2.88h-2.42v6.99A10 10 0 0 0 22 12z" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)

const WHATSAPP_NUMBERS = [
  { label: 'Grand Tunis', number: '58 370 802', href: 'https://wa.me/21658370802' },
  { label: 'Gabes',       number: '58 370 803', href: 'https://wa.me/21658370803' },
]

export function Footer() {
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [showNotice, setShowNotice] = useState(false)

  function handleFeedbackSubmit() {
    const trimmed = feedbackMessage.trim()
    if (!trimmed) {
      alert('Veuillez écrire votre message avant de l\'envoyer.')
      return
    }
    const message = encodeURIComponent(
      ['Message client depuis le site Just Hype', '', trimmed, '', 'Merci de partager ce feedback avec toute l\'équipe Just Hype.'].join('\n')
    )
    window.open(`https://wa.me/21658370800?text=${message}`, '_blank')
    setFeedbackMessage('')
    setShowNotice(true)
    window.setTimeout(() => setShowNotice(false), 5000)
  }

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4 md:px-8 md:py-10 lg:px-16">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-[0.9fr_1.25fr_1fr] md:gap-9">

          {/* col 1 — brand + nav + social */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em]">Just Hype</p>
            <nav className="flex flex-col gap-2 text-sm text-gray-300">
              <Link href="/about"    className="hover:text-white transition-colors">À propos</Link>
              <Link href="/produits" className="hover:text-white transition-colors">Catalogue</Link>
              <Link href="/panier"   className="hover:text-white transition-colors">Panier</Link>
            </nav>
            <div className="mt-5 flex gap-3">
              <a
                href="https://www.facebook.com/people/JUST-HYPE/100054542255686/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Just Hype"
                className="flex h-9 w-9 items-center justify-center border border-gray-700 text-gray-400 hover:border-white hover:text-white transition-all duration-200"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.instagram.com/just_hype_official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Just Hype"
                className="flex h-9 w-9 items-center justify-center border border-gray-700 text-gray-400 hover:border-white hover:text-white transition-all duration-200"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* col 2 — boutiques */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em]">Boutiques</p>
            <div className="grid gap-4 text-sm text-gray-300 sm:grid-cols-2">
              <address className="not-italic leading-relaxed">
                <span className="block font-medium text-white">Grand Tunis</span>
                28 Av. d'Afrique, Menzah 5<br />Ariana, Grand Tunis
                <a href="https://wa.me/21658370802" className="mt-2 block text-white underline underline-offset-4 hover:text-gray-300 transition-colors">
                  WhatsApp 58 370 802
                </a>
              </address>
              <address className="not-italic leading-relaxed">
                <span className="block font-medium text-white">Gabès</span>
                154 Av. Farhat Hached<br />Beb Bhar, Centre Ville de Gabès
                <a href="https://wa.me/21658370803" className="mt-2 block text-white underline underline-offset-4 hover:text-gray-300 transition-colors">
                  WhatsApp 58 370 803
                </a>
              </address>
            </div>
            <div className="mt-5 border-t border-gray-800 pt-4">
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gray-400">Contacts WhatsApp</p>
              <div className="flex flex-wrap gap-2">
                {WHATSAPP_NUMBERS.map((contact) => (
                  <a
                    key={contact.number}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gray-700 px-2.5 py-1.5 text-xs uppercase tracking-widest text-gray-200 hover:border-white hover:text-white transition-colors"
                  >
                    {contact.label}: {contact.number}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* col 3 — feedback */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em]">Feedback</p>
            <p className="mb-3 text-sm leading-relaxed text-gray-300">
              Questions, remarques ou suggestions ? Votre message sera envoyé via WhatsApp à l'équipe Just Hype.
            </p>
            <textarea
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              rows={3}
              className="w-full resize-none border border-gray-700 bg-black px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-white transition-colors"
            />
            <button
              onClick={handleFeedbackSubmit}
              className="mt-2 w-full bg-white px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-black hover:bg-gray-200 transition-colors"
            >
              Envoyer via WhatsApp
            </button>
            {showNotice && (
              <p className="mt-3 text-xs leading-relaxed text-gray-300">
                Merci. Le message est prêt sur WhatsApp.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-4 text-xs text-gray-500">
          © 2026 Just Hype. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}