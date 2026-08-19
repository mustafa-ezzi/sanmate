import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { api } from '../api/client'
import type { Banner, Carousel, Category, Product } from '../api/types'
import CinematicHero from '../components/CinematicHero'
import ProductCard from '../components/product/ProductCard'
import SectionHeading from '../components/ui/SectionHeading'
import ScrollVelocity from '../components/bits/ScrollVelocity'
import AnimatedContent from '../components/bits/AnimatedContent'
import GlareHover from '../components/bits/GlareHover'

type BrandFilter = 'all' | 'sanmate' | 'wyped'

const tickerItems = [
  'SAMS Enterprises',
  'House of Sanmate & Wype',
  'Designed for Pakistani homes',
  'Premium household brands',
  'Free delivery over Rs 5,000',
]

function HeroMedia({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    )
  }
  return (
    <div
      aria-label={alt}
      className="grid h-full w-full place-items-center bg-house"
    >
      <div className="px-8 text-center">
        <img
          src="/images/sams-logo.jpg"
          alt=""
          className="mx-auto h-20 w-20 rounded-2xl object-cover ring-1 ring-white/20"
        />
        <p className="mt-5 font-display text-3xl font-extrabold tracking-[-0.08em] text-white/90">
          SAMS
        </p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const railRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<BrandFilter>('all')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [carousel, setCarousel] = useState<Carousel | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [cats, bannersRes, homeCarousel] = await Promise.all([
          api.categories(),
          api.banners(),
          api.carousel('home-hero').catch(() => null),
        ])
        if (cancelled) return
        setCategories(cats.results)
        setBanners(bannersRes.results)
        setCarousel(homeCarousel)
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : 'Could not load storefront. Is the API running?',
          )
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const query: Record<string, string> =
      filter === 'all' ? { is_featured: 'true' } : { brand: filter }
    api
      .products(query)
      .then((r) => {
        if (!cancelled) setProducts(r.results)
      })
      .catch(() => {
        if (!cancelled) setProducts([])
      })
    return () => {
      cancelled = true
    }
  }, [filter])

  const scrollRail = (dir: -1 | 1) => {
    railRef.current?.scrollBy({ left: dir * 330, behavior: 'smooth' })
  }

  const setRailFilter = (next: BrandFilter) => {
    setFilter(next)
    window.setTimeout(() => {
      if (railRef.current) railRef.current.scrollLeft = 0
    }, 40)
  }

  return (
    <div>
      <CinematicHero
        banners={banners}
        carousel={carousel}
        categories={categories}
      />

      {/* Statement ticker */}
      <section className="overflow-hidden bg-house py-4 text-white">
        <ScrollVelocity
          items={tickerItems}
          baseSpeed={28}
          itemClassName="font-mono-label text-white/75"
        />
      </section>

      {error && (
        <div className="page-shell mt-8">
          <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-ink">
            {error} Start the API with{' '}
            <code className="font-mono text-xs">python manage.py runserver</code>{' '}
            in <code className="font-mono text-xs">backend/</code>.
          </div>
        </div>
      )}

      {/* Brand collections under SAMS */}
      <section id="collections" className="page-shell scroll-mt-24 py-20 sm:py-28">
        <SectionHeading
          eyebrow="Our brands"
          title="Two worlds under SAMS."
          subtitle="Sanmate and Wype keep their own tone — both belong to the house."
        />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {categories.map((cat, i) => {
            const isWyped = cat.slug === 'wyped'
            return (
              <AnimatedContent key={cat.id} direction="vertical" distance={24} delay={i * 0.1}>
              <GlareHover className="block h-full">
              <Link
                to={`/brands/${cat.slug}`}
                className={`group relative flex min-h-[18rem] overflow-hidden rounded-[1.75rem] text-left transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(17,17,17,0.12)] sm:min-h-[22rem] ${
                  isWyped ? 'bg-wyped-ink' : 'bg-navy'
                }`}
              >
                {cat.hero_image_url && (
                  <img
                    src={cat.hero_image_url}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-[1.04] ${
                      isWyped ? 'img-wyped' : 'img-sanmate'
                    }`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8">
                  <p className="font-mono-label text-white/55">
                    SAMS collection
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.06em] text-white sm:text-4xl">
                    {cat.name}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70 line-clamp-2">
                    {cat.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:translate-x-0.5">
                    Explore {cat.name} <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
              </GlareHover>
              </AnimatedContent>
            )
          })}
          {!categories.length && !error && (
            <p className="text-muted">Loading brands…</p>
          )}
        </div>
      </section>

      {/* House product rail */}
      <section id="shop" className="page-shell scroll-mt-24 pb-20 sm:pb-28">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="From the house"
            title="Products made to be noticed."
            subtitle="A curated edit across Sanmate and Wype."
          />
          <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-10">
            <div
              role="tablist"
              aria-label="Filter by brand"
              className="inline-flex rounded-full border border-border bg-surface p-1"
            >
              {(
                [
                  ['all', 'All'],
                  ['sanmate', 'Sanmate'],
                  ['wyped', 'Wype'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={filter === value}
                  onClick={() => setRailFilter(value)}
                  className={`rounded-full px-3.5 py-2 font-mono-label transition ${
                    filter === value
                      ? 'bg-house text-white'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                aria-label="Scroll products left"
                onClick={() => scrollRail(-1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-ink transition hover:bg-ink hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Scroll products right"
                onClick={() => scrollRail(1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-ink transition hover:bg-ink hover:text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div
          id="product-rail"
          ref={railRef}
          className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:px-0"
        >
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              brandTone={
                p.category_slug === 'wyped'
                  ? 'wyped'
                  : p.category_slug === 'sanmate'
                    ? 'sanmate'
                    : 'house'
              }
              rail
            />
          ))}
          {!products.length && !error && (
            <p className="text-muted">Loading products…</p>
          )}
        </div>

        <div className="mt-8">
          <Link
            to={filter === 'all' ? '/products' : `/products?brand=${filter}`}
            className="btn-ghost"
          >
            View full catalogue
          </Link>
        </div>
      </section>

      {/* Editorial promo — house voice */}
      <section className="bg-[#eceae7] py-20 sm:py-28">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 overflow-hidden rounded-[1.75rem] lg:order-1">
            <div className="aspect-[5/4]">
              <HeroMedia
                src={banners[0]?.image_url || categories[0]?.hero_image_url}
                alt="SAMS editorial"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="font-mono-label text-house">The house</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[.92] tracking-[-0.08em] text-ink">
              {banners[0]?.title ||
                'One product house. Distinct brands. Considered living.'}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              SAMS Enterprises builds brands for the rooms you use every day —
              with editorial clarity, mineral surfaces, and products that earn
              their place.
            </p>
            <GlareHover className="mt-8 inline-flex rounded-full">
              <Link to="/products" className="btn-house inline-flex">
                Explore the catalogue
                <ArrowRight size={16} />
              </Link>
            </GlareHover>
          </div>
        </div>
      </section>
    </div>
  )
}
