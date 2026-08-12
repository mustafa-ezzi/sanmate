import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import type { Category, Product } from '../api/types'
import ProductCard from '../components/product/ProductCard'
import SectionHeading from '../components/ui/SectionHeading'

export default function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const brand = params.get('brand') || ''
  const q = params.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.categories().then((r) => setCategories(r.results)).catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const query: Record<string, string> = {}
    if (brand) query.brand = brand
    if (q) query.search = q
    api
      .products(query)
      .then((r) => {
        if (!cancelled) setProducts(r.results)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [brand, q])

  const tone =
    brand === 'wyped' ? 'wyped' : brand === 'sanmate' ? 'sanmate' : 'house'

  return (
    <div className={`page-shell py-12 sm:py-16 ${brand ? `brand-${brand}` : ''}`}>
      <SectionHeading
        eyebrow="Catalogue"
        title="All products"
        subtitle="Filter by brand or search. One responsive grid — desktop and mobile."
      />

      <div className="mb-10 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Search products…"
          defaultValue={q}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = (e.target as HTMLInputElement).value
              const next = new URLSearchParams(params)
              if (value) next.set('q', value)
              else next.delete('q')
              setParams(next)
            }
          }}
          className="flex-1 rounded-full border border-border bg-surface px-5 py-3 outline-none focus:border-navy/35"
        />
        <select
          value={brand}
          onChange={(e) => {
            const next = new URLSearchParams(params)
            if (e.target.value) next.set('brand', e.target.value)
            else next.delete('brand')
            setParams(next)
          }}
          className="rounded-full border border-border bg-surface px-5 py-3 outline-none"
        >
          <option value="">All brands</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mb-6 text-accent">{error}</p>}
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              brandTone={
                p.category_slug === 'wyped'
                  ? 'wyped'
                  : p.category_slug === 'sanmate'
                    ? 'sanmate'
                    : tone
              }
            />
          ))}
          {!products.length && (
            <p className="col-span-full text-muted">No products found.</p>
          )}
        </div>
      )}
    </div>
  )
}
