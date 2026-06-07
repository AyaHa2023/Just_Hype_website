import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import Image from 'next/image'

export const metadata = {
  title: 'Notre Histoire | Just Hype',
  description:
    "Découvrez l'histoire de Just Hype et le parcours de Maher Hachana dans le prêt-à-porter en Tunisie.",
}

const timeline = [
  {
    year: '1985',
    title: 'Pantherose',
    text: "Maher Hachana commence son parcours avec Pantherose, une enseigne dédiée aux vêtements pour bébés et enfants.",
  },
  {
    year: 'Gabès',
    title: 'Premières expériences commerciales',
    text: "Il choisit ensuite de poursuivre son activité à Gabès, ville où il a grandi, et y développe ses premières expériences dans le commerce de la mode.",
  },
  {
    year: '1988',
    title: 'Masculin',
    text: "Après 4 Saisons pour la mode féminine, il s'oriente vers le prêt-à-porter masculin avec Masculin.",
  },
  {
    year: '1993',
    title: 'Maxiss',
    text: "Masculin évolue et devient Maxiss, avec une identité modernisée et une gamme complète de vêtements masculins modernes.",
  },
  {
    year: '2002-2006',
    title: 'Franchises et partenariats',
    text:
      'Il développe plusieurs franchises reconnues, notamment Blue Island, Moncef Barkous et Sasio, tout en participant au projet SAMOCO Brighton.',
  },
  {
    year: '2012',
    title: 'Just Hype',
    text:
      'Maxiss devient Just Hype, une étape stratégique vers une identité plus moderne, contemporaine et lifestyle.',
  },
  {
    year: 'Aujourd’hui',
    title: 'Une vision familiale',
    text:
      'Just Hype est gérée collectivement avec certains membres de sa famille, chacun contribuant à son développement et à sa continuité.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="px-4 pb-10 pt-28 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-400">
            Notre histoire
          </p>
          <h1 className="max-w-4xl text-4xl font-light tracking-wide md:text-6xl">
            Une histoire construite au cœur du textile tunisien.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
            Depuis plusieurs décennies, Maher Hachana évolue dans l’univers du
            prêt-à-porter, au cœur du textile et du commerce en Tunisie.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[320px_1fr] md:items-start">
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
  <Image
    src="/images/maher-hachana.png"
    alt="Maher Hachana"
    fill
    className="object-cover"
    priority
  />
</div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-400">
              Fondateur
            </p>
            <h2 className="text-3xl font-light tracking-wide">
              Maher Hachana
            </h2>

            <div className="mt-6 space-y-5 text-sm leading-relaxed text-gray-600 md:text-base">
              <p>
                Issu d’un environnement familial lié au textile à Ksar Hellal,
                il grandit dans une culture profondément ancrée dans les
                métiers du textile et du commerce, ce qui façonne naturellement
                sa vision du vêtement, de la qualité et du marché.
              </p>
              <p>
                Son aventure commence en 1985 avec la création de sa première marque, Pantherose. Il enchaîne ensuite avec 4 Saisons, orientée vers la mode féminine, avant d’opérer en 1988 un tournant décisif vers le prêt-à-porter masculin avec la marque Masculin.Au fil des années, Masculin évolue naturellement pour devenir Just Hype, une marque plus moderne, contemporaine et orientée lifestyle.
              </p>
              <p>
                Avec le temps, Maher Hachana choisit de concentrer son énergie
                sur Just Hype, en réduisant progressivement ses activités dans
                les franchises afin de se consacrer pleinement à sa propre
                vision de marque.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-400">
              Parcours
            </p>
            <h2 className="text-3xl font-light tracking-wide md:text-4xl">
              Just Hype au fil des années
            </h2>
          </div>

          <div className="space-y-6">
            {timeline.map((item) => (
              <article
                key={`${item.year}-${item.title}`}
                className="grid gap-4 border-t border-gray-200 pt-6 md:grid-cols-[180px_1fr]"
              >
                <p className="text-sm uppercase tracking-widest text-gray-400">
                  {item.year}
                </p>
                <div>
                  <h3 className="text-xl font-light">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-14 text-white sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-400">
            Développement
          </p>

          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-5 text-sm leading-relaxed text-gray-300 md:text-base">
              <p>
                En 1993, la marque Masculin évolue et devient Maxiss, un
                repositionnement visant à moderniser l’identité et à proposer
                une gamme complète de vêtements masculins modernes.
              </p>
              <p>
                En 2004, il entame également une activité d’importation de
                vêtements, notamment depuis la Turquie et la France, renforçant
                ainsi l’offre et la qualité des collections proposées.
              </p>
            </div>

            <div className="space-y-5 text-sm leading-relaxed text-gray-300 md:text-base">
              <p>
                Fort de son expérience, il développe ensuite et exploite
                plusieurs franchises reconnues dans le secteur, notamment Blue
                Island (2002), Moncef Barkous (2004), puis Sasio (2006).
              </p>
              <p>
                Parallèlement, il participe à un projet collaboratif avec
                SAMOCO Brighton, spécialisé dans les blazers, vestes et pièces
                masculines.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl space-y-5 text-sm leading-relaxed text-gray-600 md:text-base">
            <p>
              En 2012, Maxiss évolue à nouveau pour devenir Just Hype, une
              étape stratégique vers une identité plus moderne et lifestyle.
            </p>
            <p>
              Aujourd’hui, Just Hype repose sur une philosophie claire :
              proposer des produits de qualité premium, des collections variées
              et accessibles, avec des prix justes adaptés au marché tunisien.
            </p>
            <p>
              La marque s’appuie également sur un réseau de partenaires construit
              au fil des années, garantissant expertise, confiance et continuité.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="border border-gray-200 p-6">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-400">
                Notre vision
              </p>
              <p className="text-xl font-light leading-relaxed">
                Just Hype incarne une marque de confiance, pensée pour
                accompagner tous les styles et toutes les générations.
              </p>
            </div>

            <div className="border border-gray-200 p-6">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gray-400">
                Notre motto
              </p>
              <p className="text-xl font-light leading-relaxed">
                “Just Hype — une signature de style pour chaque homme.”
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}