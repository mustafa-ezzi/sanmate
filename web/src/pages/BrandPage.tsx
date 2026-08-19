import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import type { Category, Product } from '../api/types'
import ProductCard from '../components/product/ProductCard'
import SectionHeading from '../components/ui/SectionHeading'
import BlurText from '../components/bits/BlurText'

export default function BrandPage() {
  const { slug = '' } = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState('')
  const tone = slug === 'wyped' ? 'wyped' : 'sanmate'

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [cats, prods] = await Promise.all([
          api.categories(),
          api.products({ brand: slug }),
        ])
        if (cancelled) return
        setCategory(cats.results.find((c) => c.slug === slug) || null)
        setProducts(prods.results)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load brand')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (error) {
    return (
      <div className="page-shell py-16">
        <p className="text-accent">{error}</p>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="page-shell py-16">
        <p className="text-muted">Loading brand…</p>
      </div>
    )
  }

  return (
    <div className={`brand-${tone}`}>
      <section
        className={`relative overflow-hidden ${
          tone === 'wyped' ? 'bg-wyped-ink' : 'bg-navy'
        } text-white`}
      >
        {category.hero_image_url && (
          <img
            src={category.hero_image_url}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover opacity-35 ${
              tone === 'wyped' ? 'img-wyped' : 'img-sanmate'
            }`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-black/15" />
        <div className="page-shell relative z-10 py-16 sm:py-24">
          <p className="font-mono-label text-white/55">Brand collection</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[.9] tracking-[-0.08em]">
            {category.name}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
            <BlurText text={category.description || ''} staggerMs={70} initialDelayMs={200} />
          </p>
          <Link to="/products" className="btn-primary mt-8 !bg-white !text-ink">
            Browse all products
          </Link>
        </div>
      </section>

      <div className="page-shell py-16 sm:py-20">
        <SectionHeading
          eyebrow={`${products.length} products`}
          title={`${category.name} edit`}
          subtitle="The same catalogue language — tone shifts with the brand."
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} brandTone={tone} />
          ))}
        </div>
      </div>
    </div>
  )
}
