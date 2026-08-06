import { useRef } from 'react'
import { ShoppingBag } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { images } from '../data'
import FadeUp from './FadeUp'
import CutoutProduct from './CutoutProduct'
import bottleTrapBg from '../assets/bottle-trap-bg.png'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const products = [
  {
    id: 'waste-pipe',
    name: 'Washbasin Waste Pipe',
    tag: 'Best Seller',
    desc: 'Chrome & ABS · 30" · Leak-proof',
    kind: 'waste' as const,
  },
  {
    id: 'bottle-trap',
    name: 'Bottle Trap',
    tag: 'Premium',
    desc: 'Adjustable · 36L/min · 32/40mm',
    kind: 'bottle' as const,
  },
]

function buyMailto(product: string) {
  const subject = encodeURIComponent(`Buy SANMATE — ${product}`)
  const body = encodeURIComponent(
    `Hi SANMATE,\n\nI would like to purchase: ${product}.\n\nQuantity:\nCity:\nPhone:\n\nThank you.`,
  )
  return `mailto:info.samsenterprise.pk@gmail.com?subject=${subject}&body=${body}`
}

export default function BuyProducts() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Mobile: each card image floats / scales while scrolling into view
      mm.add('(max-width: 639px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.buy-card').forEach((card) => {
          const media = card.querySelector('.buy-media')
          const shadow = card.querySelector('.buy-shadow')
          if (!media) return

          gsap.fromTo(
            media,
            { y: 36, scale: 0.88, rotate: -3 },
            {
              y: -8,
              scale: 1.04,
              rotate: 2,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 35%',
                scrub: 0.8,
              },
            },
          )

          if (shadow) {
            gsap.fromTo(
              shadow,
              { scaleX: 0.6, opacity: 0.15 },
              {
                scaleX: 1,
                opacity: 0.35,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 90%',
                  end: 'top 35%',
                  scrub: 0.8,
                },
              },
            )
          }
        })
      })

      mm.add('(min-width: 640px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.buy-media').forEach((media) => {
          gsap.fromTo(
            media,
            { y: 24, scale: 0.94 },
            {
              y: -6,
              scale: 1.03,
              ease: 'none',
              scrollTrigger: {
                trigger: media,
                start: 'top 85%',
                end: 'top 40%',
                scrub: 1,
              },
            },
          )
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="buy" ref={root} className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,99,13,0.08),transparent_50%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
        <FadeUp className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-accent tracking-[0.25em] text-[10px] uppercase font-semibold mb-2 flex items-center gap-2">
              <ShoppingBag size={14} /> Buy Products
            </p>
            <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-navy">
              Shop the collection
            </h2>
          </div>
          <p className="text-muted text-sm max-w-xs">
            Two precision products. Order directly — we reply fast.
          </p>
        </FadeUp>

        <div className="sm:grid sm:grid-cols-2 sm:gap-5 hidden">
          {products.map((p, i) => (
            <FadeUp key={p.id} delay={i * 0.08}>
              <ProductCard p={p} />
            </FadeUp>
          ))}
        </div>

        <div className="h-scroll sm:hidden -mx-4 px-4 pb-2">
          {products.map((p) => (
            <div key={p.id} className="w-[85vw] max-w-[340px]">
              <ProductCard p={p} />
            </div>
          ))}
        </div>

        <FadeUp className="mt-6 sm:mt-8 text-center sm:text-left">
          <p className="text-xs text-muted">
            Or email{' '}
            <a
              href="mailto:info.samsenterprise.pk@gmail.com"
              className="text-accent font-medium break-all"
            >
              info.samsenterprise.pk@gmail.com
            </a>
          </p>
        </FadeUp>
      </div>
    </section>
  )
}

function ProductCard({ p }: { p: (typeof products)[0] }) {
  return (
    <article className="buy-card group h-full rounded-[1.75rem] bg-surface border border-border overflow-hidden shadow-[0_16px_40px_rgba(27,29,99,0.06)]">
      <div className="relative aspect-[5/4] overflow-hidden bg-[#E8E8E4] flex items-center justify-center">
        <div className="buy-shadow absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[55%] h-5 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(27,29,99,0.28),transparent_70%)] blur-[3px]" />
        <div className="buy-media relative z-10 w-[78%] h-[78%] flex items-center justify-center will-change-transform">
          {p.kind === 'waste' ? (
            <CutoutProduct
              src={images.wasteChrome}
              alt={p.name}
              cropTop={0.3}
              cropBottom={0.05}
              className="max-w-full max-h-full"
            />
          ) : (
            <CutoutProduct
              src={bottleTrapBg}
              alt={p.name}
              bgMode="dark"
              cropTop={0.1}
              cropBottom={0.02}
              cropSide={0.03}
              saturate={0.85}
              brightness={0.96}
              className="max-w-full max-h-full"
            />
          )}
        </div>
        <span className="absolute top-3 left-3 z-20 rounded-full bg-accent text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1">
          {p.tag}
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-navy mb-1">
          {p.name}
        </h3>
        <p className="text-sm text-muted mb-4">{p.desc}</p>
        <div className="flex flex-col gap-2.5">
          <a href={buyMailto(p.name)} className="btn-accent flex-1 text-center">
            <ShoppingBag size={15} /> Buy Now
          </a>
          <a href={`#${p.id}`} className="btn-outline flex-1 text-center">
            Details
          </a>
        </div>
      </div>
    </article>
  )
}
