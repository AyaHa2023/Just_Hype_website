'use client'

import { useState, useMemo, useEffect } from 'react'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { FiltersSidebar } from '@/components/catalog/FiltersSidebar'
import type { Category, Product, Color, Size } from '@/types'

type AttributeOption = {
  id: string
  label: string
  slug: string
  definition_id: string
  attribute_definitions: {
    id: string
    name: string
    slug: string
    category_id: string
  } | null
}

type ProductAttribute = {
  product_id: string
  option_id: string
}

type Props = {
  products: Product[]
  categories: Category[]
  allColors: Color[]
  allSizes: Size[]
  attributeOptions: AttributeOption[]
  productAttributes: ProductAttribute[]
  initialCategorie?: string
}

export function ProductsClient({
  products,
  categories,
  allColors,
  allSizes,
  attributeOptions,
  productAttributes,
  initialCategorie,
}: Props) {
  const [selectedCategorie, setSelectedCategorie] = useState<string | null>(
    initialCategorie ?? null
  )
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  // sync when URL changes (server re-render passes new initialCategorie)
  useEffect(() => {
    queueMicrotask(() => {
      setSelectedCategorie(initialCategorie ?? null)
      setSelectedColors([])
      setSelectedSizes([])
      setSelectedOptions([])
    })
  }, [initialCategorie])

  const topLevelCategories = categories.filter((c) => c.parent_id === null)

  const activeCategory = selectedCategorie
    ? categories.find((c) => c.slug === selectedCategorie)
    : null

  // attribute groups for the active category
  const categoryAttributes = useMemo(() => {
    if (!activeCategory) return []
    const catOptions = attributeOptions.filter(
      (ao) => ao.attribute_definitions?.category_id === activeCategory.id
    )
    const defMap = new Map<string, { name: string; options: AttributeOption[] }>()
    for (const ao of catOptions) {
      if (!ao.attribute_definitions) continue
      const defId = ao.definition_id
      if (!defMap.has(defId)) {
        defMap.set(defId, { name: ao.attribute_definitions.name, options: [] })
      }
      defMap.get(defId)!.options.push(ao)
    }
    return Array.from(defMap.entries()).map(([id, val]) => ({ id, ...val }))
  }, [activeCategory, attributeOptions])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      // category filter
      if (selectedCategorie) {
        const productCatSlug = (p.categories as { slug: string } | null)?.slug
        const productCatParentId = (p.categories as { parent_id: string | null } | null)?.parent_id
        const parentCat = categories.find((c) => c.slug === selectedCategorie)
        const matchesDirect = productCatSlug === selectedCategorie
        const matchesChild = parentCat ? productCatParentId === parentCat.id : false
        if (!matchesDirect && !matchesChild) return false
      }

      // attribute filter (AND logic — must match all selected)
      if (selectedOptions.length > 0) {
        const productOptionIds = productAttributes
          .filter((pa) => pa.product_id === p.id)
          .map((pa) => pa.option_id)
        const hasAll = selectedOptions.every((optId) =>
          productOptionIds.includes(optId)
        )
        if (!hasAll) return false
      }

      // color filter (OR logic — any selected color)
      if (selectedColors.length > 0) {
        const productColorIds = p.product_variants.map((v) => v.color_id)
        const hasColor = selectedColors.some((c) => productColorIds.includes(c))
        if (!hasColor) return false
      }

      // size filter (OR logic — any selected size)
      if (selectedSizes.length > 0) {
        const productSizeIds = p.product_variants.map((v) => v.size_id)
        const hasSize = selectedSizes.some((s) => productSizeIds.includes(s))
        if (!hasSize) return false
      }

      return true
    })
  }, [products, selectedCategorie, selectedOptions, selectedColors, selectedSizes, categories, productAttributes])

  const hasActiveFilters =
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    selectedOptions.length > 0

  function toggleOption(id: string) {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function toggleColor(id: string) {
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function toggleSize(id: string) {
    setSelectedSizes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function handleReset() {
    setSelectedColors([])
    setSelectedSizes([])
    setSelectedOptions([])
  }

  function handleCategorieChange(slug: string | null) {
    setSelectedCategorie(slug)
    setSelectedColors([])
    setSelectedSizes([])
    setSelectedOptions([])
  }

  return (
    <div className="px-3 sm:px-4 md:px-8 lg:px-16 py-6 sm:py-8 md:py-10 overflow-x-hidden">

      {/* header */}
      <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-1">
            {activeCategory ? 'Catégorie' : 'Catalogue'}
          </p>
          <h1 className="text-xl sm:text-2xl font-light tracking-wide truncate">
            {activeCategory ? activeCategory.name : 'Tous les articles'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-1.5 md:gap-2 text-xs tracking-widest uppercase border border-gray-200 hover:border-black transition-colors duration-200 px-2.5 sm:px-4 py-2 flex-shrink-0 whitespace-nowrap"
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2">
            <line x1="0" y1="1" x2="14" y2="1" />
            <line x1="2" y1="5" x2="12" y2="5" />
            <line x1="4" y1="9" x2="10" y2="9" />
          </svg>
          Filtres
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
          )}
        </button>
      </div>

      {/* category pills — only on all-products view */}
      {!selectedCategorie && (
        <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 -mx-3 sm:-mx-4 md:-mx-8 lg:-mx-16 px-3 sm:px-4 md:px-8 lg:px-16">
          {topLevelCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorieChange(cat.slug)}
              className="flex-shrink-0 text-xs tracking-widest uppercase px-3 sm:px-4 py-2 border border-gray-200 hover:border-black transition-colors duration-150 whitespace-nowrap"
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* back link — only inside a category */}
      {selectedCategorie && (
        <button
          onClick={() => handleCategorieChange(null)}
          className="flex items-center gap-2 text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors mb-6 md:mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Tous les articles
        </button>
      )}

      {/* grid */}
      {filtered.length === 0 ? (
        <div className="py-16 md:py-32 text-center">
          <p className="text-sm text-gray-400 tracking-widest uppercase">
            Aucun article trouvé
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="mt-4 text-xs underline underline-offset-4 text-gray-500 hover:text-black"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <ProductGrid products={filtered} />
      )}

      <FiltersSidebar
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        categoryAttributes={categoryAttributes}
        allColors={allColors}
        allSizes={allSizes}
        selectedOptions={selectedOptions}
        selectedColors={selectedColors}
        selectedSizes={selectedSizes}
        onToggleOption={toggleOption}
        onToggleColor={toggleColor}
        onToggleSize={toggleSize}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  )
}
