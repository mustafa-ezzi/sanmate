import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Banner, Carousel, Category } from '../api/types'
import BlurText from './bits/BlurText'

export type HeroSlide = {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaLink: string
  image?: string
}

const fallbackSlides: HeroSlide[] = [
  {
    id: 'sams',
    eyebrow: 'SAMS Enterprises',
    title: 'Sanitary ware, rebuilt for the modern home.',
    subtitle:
      'Two collections under one house — considered fittings for Pakistani bathrooms.',
    ctaLabel: 'Shop the house',
    ctaLink: '/products',
  },
  {
    id: 'sanmate',
    eyebrow: 'Sanmate',
    title: 'Quiet precision for daily ritual.',
    subtitle:
      'Tactile sanitary fittings designed to feel calm, considered, and built to last.',
    ctaLabel: 'Explore Sanmate',
    ctaLink: '/brands/sanmate',
  },
  {
    id: 'wyped',
    eyebrow: 'Wype',
    title: 'Cleaning energy with sharper intent.',
    subtitle:
      'Expressive household essentials with charged color and everyday power.',
    ctaLabel: 'Explore Wype',
    ctaLink: '/brands/wyped',
  },
]

type Props = {
  banners: Banner[]
  carousel: Carousel | null
  categories: Category[]
}

export default function CinematicHero({ banners, carousel, categories }: Props) {
  const [index, setIndex] = useState(0)
  const [opened, setOpened] = useState(false)
  const touchX = useRef<number | null>(null)
  const timer = useRef<number | null>(null)

  const slides = useMemo(() => {
    const fromCms: HeroSlide[] = []

    banners.forEach((b, i) => {
      fromCms.push({
        id: `banner-${b.id}`,
        eyebrow: i === 0 ? 'SAMS Enterprises' : 'Campaign',
        title: b.title || fallbackSlides[0].title,
        subtitle: b.subtitle || fallbackSlides[0].subtitle,
        ctaLabel: b.cta_label || 'Learn more',
        ctaLink: b.cta_link || '/products',
        image: b.image_url,
      })
    })

    carousel?.slides?.forEach((s) => {
      if (!s.image_url) return
      fromCms.push({
        id: `slide-${s.id}`,
        eyebrow: 'Collection',
        title: s.caption || 'Designed to be noticed.',
        subtitle: 'Premium sanitary essentials from the SAMS house.',
        ctaLabel: 'Learn more',
        ctaLink: s.link || '/products',
        image: s.image_url,
      })
    })

    categories.forEach((c) => {
      if (!c.hero_image_url) return
      if (fromCms.some((s) => s.image === c.hero_image_url)) return
      fromCms.push({
        id: `cat-${c.id}`,
        eyebrow: 'SAMS collection',
        title: c.name,
        subtitle: c.description || fallbackSlides[0].subtitle,
        ctaLabel: `Explore ${c.name}`,
        ctaLink: `/brands/${c.slug}`,
        image: c.hero_image_url,
      })
    })

    return fromCms.length ? fromCms.slice(0, 6) : fallbackSlides
  }, [banners, carousel, categories])

  const go = (next: number) => {
    setIndex((next + slides.length) % slides.length)
  }

  useEffect(() => {
    const t = window.setTimeout(() => setOpened(true), 80)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (slides.length < 2) return
    if (timer.current) window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 7000)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [index, slides.length])

  const slide = slides[index] || fallbackSlides[0]

  return (
    <section
      className="cinematic-hero relative isolate h-[100svh] min-h-[36rem] overflow-hidden bg-black text-white"
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(e) => {
        const start = touchX.current
        const end = e.changedTouches[0]?.clientX
        touchX.current = null
        if (start == null || end == null) return
        const dx = end - start
        if (Math.abs(dx) < 48) return
        go(index + (dx < 0 ? 1 : -1))
      }}
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(.22,.8,.26,1)] ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== index}
        >
          {s.image ? (
            <img
              src={s.image}
              alt=""
              className={`hero-kenburns h-full w-full object-cover object-center ${
                i === index ? 'is-active' : ''
              }`}
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_30%_20%,#2a3168,transparent_42%),linear-gradient(160deg,#07080f,#171c4e_55%,#0a0c18)]" />
          )}
        </div>
      ))}

      <div className="hero-veil pointer-events-none absolute inset-0" />

      <div
        className={`hero-curtain pointer-events-none absolute inset-0 z-20 bg-black ${
          opened ? 'is-open' : ''
        }`}
      />

      <div className="page-shell relative z-10 flex h-full flex-col justify-end pb-24 pt-28 sm:pb-16 sm:pt-32 lg:justify-center lg:pb-24">
        <div className="max-w-xl lg:max-w-2xl">
          <p
            key={`${slide.id}-eye`}
            className="hero-copy-in font-mono-label text-white/70"
          >
            {slide.eyebrow}
          </p>
          <h1
            key={`${slide.id}-title`}
            className="hero-copy-in mt-3 font-display text-[clamp(2.15rem,7.2vw,5.4rem)] font-extrabold leading-[0.92] tracking-[-0.07em] text-white"
          >
            {slide.title}
          </h1>
          <p
            key={`${slide.id}-sub`}
            className="hero-copy-in mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/75 sm:text-lg"
          >
            <BlurText
              key={slide.id}
              text={slide.subtitle}
              staggerMs={80}
              initialDelayMs={300}
            />
          </p>
          <div className="hero-copy-in mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link to={slide.ctaLink} className="btn-hero">
              {slide.ctaLabel}
              <ArrowRight size={16} />
            </Link>
            <a href="#collections" className="btn-hero-ghost">
              Meet the brands
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 z-10 page-shell flex items-center justify-between gap-4 sm:bottom-7">
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className="relative h-1 w-8 overflow-hidden rounded-full bg-white/25 sm:w-10"
            >
              {i === index && <span className="hero-progress absolute inset-y-0 left-0 bg-white" />}
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-ink"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-ink"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
