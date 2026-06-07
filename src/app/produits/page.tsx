    import { createClient } from '@/lib/supabase/server'
    import { Footer } from '@/components/layout/Footer'
    import { Header } from '@/components/layout/Header'
    import { ScrollToTop } from '@/components/layout/ScrollToTop'
    import { ProductsClient } from '@/components/catalog/ProductsClient'
    import type { Category, Color, Product, Size } from '@/types'

    type ProductsClientProps = Parameters<typeof ProductsClient>[0]

    export default async function ProduitsPage({
    searchParams,
    }: {
    searchParams: Promise<{ categorie?: string }>
    }) {
    const { categorie } = await searchParams
    const supabase = await createClient()

    const [
        { data: products, error },
        { data: categories },
        { data: allColors },
        { data: allSizes },
        { data: attributeOptions },
        { data: productAttributes },
    ] = await Promise.all([
        supabase
        .from('products')
        .select(`
            id,
            name,
            slug,
            price,
            price_after_discount,
            discount_percent,
            is_featured,
            category_id,
            categories ( id, name, slug, parent_id ),
            product_images ( image_path, sort_order ),
            product_variants (
            id,
            color_id,
            size_id,
            colors ( id, name, hex_code ),
            sizes ( id, name ),
            inventory (
                quantity,
                store_id,
                stores ( id, name, whatsapp_number )
            )
            )
        `)
        .order('created_at', { ascending: false }),

        supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .order('name'),

        supabase
        .from('colors')
        .select('id, name, hex_code')
        .order('name'),

        supabase
        .from('sizes')
        .select('id, name'),

        supabase
        .from('attribute_options')
        .select(`
            id,
            label,
            slug,
            definition_id,
            attribute_definitions (
            id,
            name,
            slug,
            category_id
            )
        `),

        supabase
        .from('product_attributes')
        .select('product_id, option_id'),
    ])

    if (error) console.error('Produits fetch error:', error)

    return (
        <main className="min-h-screen bg-white">
        <Header />
        <ScrollToTop />
        <div className="pt-16 md:pt-20">
            <ProductsClient
            products={(products ?? []) as unknown as Product[]}
            categories={(categories ?? []) as Category[]}
            allColors={(allColors ?? []) as Color[]}
            allSizes={(allSizes ?? []) as Size[]}
            attributeOptions={
                (attributeOptions ?? []) as unknown as ProductsClientProps['attributeOptions']
            }
            productAttributes={
                (productAttributes ?? []) as unknown as ProductsClientProps['productAttributes']
            }
            initialCategorie={categorie}
            />
        </div>
        <Footer />
        </main>
    )
    }
