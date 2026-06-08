export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://justhype.tn'

export const SITE_NAME = 'Just Hype'

export const DEFAULT_KEYWORDS = [
  'Just Hype',
  'just hype tunisie',
  'just hype tunis',
  'just hype gabes',
  'marque vêtements homme',
  'clothing brand tunisia',
  'boutique mode homme',
  'mode masculine tunisie',
  'vêtements homme tunisie',
  'prêt-à-porter homme',
  'chemise homme tunisie',
  'boutique vêtements tunis',
]

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: ['Just Hype Tunisia', 'Just Hype Tunisie'],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'Just Hype — marque de vêtements pour hommes en Tunisie. Boutiques à Tunis (Menzah 5) et Gabès.',
    foundingDate: '1985',
    sameAs: [
      'https://www.facebook.com/people/JUST-HYPE/100054542255686/',
      'https://www.instagram.com/just_hype_official/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['French', 'Arabic'],
      areaServed: 'TN',
    },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Boutique en ligne Just Hype — mode masculine premium en Tunisie',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'fr-TN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/produits?categorie={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function clothingStoreJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: 'Just Hype — Menzah 5',
      image: `${SITE_URL}/logo.png`,
      url: SITE_URL,
      telephone: '+21658370802',
      address: {
        '@type': 'PostalAddress',
        streetAddress: "28 Av. d'Afrique, Menzah 5",
        addressLocality: 'Ariana',
        addressRegion: 'Grand Tunis',
        addressCountry: 'TN',
      },
      priceRange: '$$',
      brand: { '@type': 'Brand', name: SITE_NAME },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: 'Just Hype — Gabès',
      image: `${SITE_URL}/logo.png`,
      url: SITE_URL,
      telephone: '+21658370803',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '154 Av. Farhat Hached, Beb Bhar',
        addressLocality: 'Gabès',
        addressCountry: 'TN',
      },
      priceRange: '$$',
      brand: { '@type': 'Brand', name: SITE_NAME },
    },
  ]
}
