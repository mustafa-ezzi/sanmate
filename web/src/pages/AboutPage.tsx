import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Droplets, Package, Sparkles } from 'lucide-react'
import { api } from '../api/client'
import type { Category } from '../api/types'
import SectionHeading from '../components/ui/SectionHeading'
import AnimatedContent from '../components/bits/AnimatedContent'
import BlurText from '../components/bits/BlurText'
import GlareHover from '../components/bits/GlareHover'

type BrandMeta = {
  slug: string
  name: string
  focus: string
  blurb: string
  tone: 'sanmate' | 'wyped' | 'house'
  icon: typeof Package
}

// Static story for each brand — images/logos are merged from the live API.
const BRAND_META: BrandMeta[] = [
  {
    slug: 'daisy',
    name: 'Daisy',
    focus: 'Plastic household products',
    blurb:
      'Everyday plastic essentials for the home — durable, thoughtfully moulded pieces that make kitchens, bathrooms and storage effortless.',
    tone: 'house',
    icon: Package,
  },
  {
    slug: 'sanmate',
    name: 'Sanmate',
    focus: 'Sanitary items',
    blurb:
      'Sanitary ware and bathroom fittings built for Pakistani homes — clean lines, dependable quality, and a calm, considered finish.',
    tone: 'sanmate',
    icon: Droplets,
  },
  {
    slug: 'wyped',
    name: 'Wype',
    focus: 'Wipers & cleaning',
    blurb:
      'Wipers and cleaning supplies that keep every surface spotless — practical tools with a sharp, modern edge for a fresher home.',
    tone: 'wyped',
    icon: Sparkles,
  },
]

const PARENTS = [
  {
    name: 'SAMS Enterprises',
    role: 'Parent company',
    blurb:
      'The house that brings distinct household brands under one roof — sourcing, quality and distribution across Pakistan.',
  },
  {
    name: 'AM Enterprises',
    role: 'Parent company',
    blurb:
      'A partner in the house, extending reach and manufacturing so every brand can deliver dependable products at scale.',
  },
]

function toneClasses(tone: BrandMeta['tone']) {
  if (tone === 'wyped') {
    return { bg: 'bg-wyped-ink', img: 'img-wyped' }
  }
  if (tone === 'sanmate') {
    return { bg: 'bg-navy', img: 'img-sanmate' }
  }
  return { bg: 'bg-house', img: '' }
}

export default function AboutPage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    let cancelled = false
    api
      .categories()
      .then((r) => {
        if (!cancelled) setCategories(r.results)
      })
      .catch(() => {
        if (!cancelled) setCategories([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const bySlug = (slug: string) => categories.find((c) => c.slug === slug)

  const brands = BRAND_META.map((meta) => ({
    ...meta,
    category: bySlug(meta.slug),
  }))

  const heroImage =
    brands.find((b) => b.category?.hero_image_url)?.category?.hero_image_url ||
    '/images/logo-sams.jpg'

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-house text-white">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-house via-house/80 to-house/40" />
        <div className="page-shell relative z-10 py-20 sm:py-28 lg:py-32">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white p-2">
              <img
                src="/images/sams-logo.jpg"
                alt="SAMS Enterprises"
                className="h-12 w-12 rounded-xl object-cover sm:h-14 sm:w-14"
              />
            </div>
            <p className="font-mono-label text-white/60">
              SAMS Enterprises · AM Enterprises
            </p>
          </div>
          <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.5rem,6.5vw,5rem)] font-extrabold leading-[.9] tracking-[-0.08em]">
            <BlurText
              text="One house. Three household brands. Built for everyday life."
              staggerMs={60}
              initialDelayMs={120}
            />
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            SAMS Enterprises and AM Enterprises are the parent companies behind{' '}
            <span className="font-semibold text-white">Sanmate</span>,{' '}
            <span className="font-semibold text-white">Wype</span> and{' '}
            <span className="font-semibold text-white">Daisy</span> — a family of
            brands crafting sanitary ware, cleaning essentials and plastic
            household products for homes across Pakistan.
          </p>
        </div>
      </section>

      {/* Parent companies */}
      <section className="page-shell py-20 sm:py-28">
        <SectionHeading
          eyebrow="The parent companies"
          title="Two companies, one house of brands."
          subtitle="SAMS Enterprises and AM Enterprises together power the family — from sourcing and manufacturing to quality and delivery."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {PARENTS.map((parent, i) => (
            <AnimatedContent
              key={parent.name}
              direction="vertical"
              distance={24}
              delay={i * 0.1}
            >
              <div className="flex h-full flex-col rounded-[1.75rem] border border-border bg-surface p-8 shadow-card sm:p-10">
                <p className="font-mono-label text-[var(--color-accent)]">
                  {parent.role}
                </p>
                <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.06em] text-ink sm:text-4xl">
                  {parent.name}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  {parent.blurb}
                </p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </section>

      {/* Brand family */}
      <section className="bg-[#eceae7] py-20 sm:py-28">
        <div className="page-shell">
          <SectionHeading
            eyebrow="The brand family"
            title="Distinct brands, shared standards."
            subtitle="Each brand has its own focus and tone — all held to the same house standard of quality."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {brands.map((brand, i) => {
              const tone = toneClasses(brand.tone)
              const Icon = brand.icon
              const hero = brand.category?.hero_image_url
              const logo = brand.category?.logo_url
              return (
                <AnimatedContent
                  key={brand.slug}
                  direction="vertical"
                  distance={28}
                  delay={i * 0.12}
                  className="h-full"
                >
                  <GlareHover className="block h-full">
                    <Link
                      to={`/brands/${brand.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-surface shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(17,17,17,0.14)]"
                    >
                      <div
                        className={`relative h-48 overflow-hidden ${tone.bg}`}
                      >
                        {hero && (
                          <img
                            src={hero}
                            alt=""
                            className={`absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105 ${tone.img}`}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-xl bg-white/90 text-house shadow-sm">
                          <Icon size={20} />
                        </div>
                        {logo && (
                          <img
                            src={logo}
                            alt={brand.name}
                            className="absolute bottom-4 left-5 h-10 w-auto max-w-[9rem] object-contain drop-shadow"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6 sm:p-7">
                        <h3 className="font-display text-2xl font-extrabold tracking-[-0.05em] text-ink">
                          {brand.name}
                        </h3>
                        <p className="font-mono-label mt-2 text-[var(--color-accent)]">
                          {brand.focus}
                        </p>
                        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                          {brand.blurb}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink transition group-hover:translate-x-0.5">
                          Explore {brand.name} <ArrowRight size={15} />
                        </span>
                      </div>
                    </Link>
                  </GlareHover>
                </AnimatedContent>
              )
            })}
          </div>
        </div>
      </section>

      {/* House philosophy */}
      <section className="page-shell py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="font-mono-label text-house">The house</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[.92] tracking-[-0.08em] text-ink">
              Built for the rooms you use every day.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Quality first',
                body: 'Every product is sourced and checked to a single house standard, whichever brand it carries.',
              },
              {
                title: 'Made for homes',
                body: 'Designed around real Pakistani households — practical, durable and easy to live with.',
              },
              {
                title: 'One family',
                body: 'Three brands, two parent companies, one shared promise of dependable everyday goods.',
              },
            ].map((item, i) => (
              <AnimatedContent
                key={item.title}
                direction="vertical"
                distance={20}
                delay={i * 0.1}
              >
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <h3 className="font-display text-lg font-extrabold tracking-[-0.04em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-house py-16 text-white sm:py-20">
        <div className="page-shell flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="max-w-xl font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold leading-[.95] tracking-[-0.07em]">
              Explore the full house of brands.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
              Browse Sanmate, Wype and Daisy in one catalogue.
            </p>
          </div>
          <GlareHover className="inline-flex rounded-full">
            <Link to="/products" className="btn-hero">
              Shop the catalogue
              <ArrowRight size={16} />
            </Link>
          </GlareHover>
        </div>
      </section>
    </div>
  )
}
