import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ShoppingBag } from 'lucide-react'
import { bottleFeatures } from '../data'
import FadeUp from './FadeUp'
import CutoutProduct from './CutoutProduct'
import bottleTrapBg from '../assets/bottle-trap-bg.png'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function BottleTrap() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Mobile: pin + elevate so scroll clearly moves the product
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const product = '.bt-product'
        const shadow = '.bt-floor-shadow'
        const glow = '.bt-glow'

        gsap.set(product, { y: 100, scale: 0.82, opacity: 0.85, rotateY: -12 })
        gsap.set(shadow, { scaleX: 0.55, opacity: 0.2 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage.current,
            start: 'top 18%',
            end: '+=140%',
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
          },
        })

        tl.to(product, { y: 0, scale: 1.05, opacity: 1, rotateY: 0, duration: 1 }, 0)
          .to(shadow, { scaleX: 1, opacity: 0.4, duration: 1 }, 0)
          .to(glow, { opacity: 0.55, scale: 1.1, duration: 1 }, 0)
          .to(product, { y: -16, scale: 1.08, rotateY: 14, duration: 0.8 }, 1)
          .to(shadow, { scaleX: 0.85, opacity: 0.28, duration: 0.8 }, 1)
          .to(product, { y: -8, rotateY: -8, duration: 0.7 }, 1.8)
      })

      // Desktop: scrub rotate through section
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.bt-product',
          { rotateY: -28, rotateX: 8, y: 40, scale: 0.9 },
          {
            rotateY: 28,
            rotateX: -4,
            y: -20,
            scale: 1.06,
            ease: 'none',
            scrollTrigger: {
              trigger: stage.current,
              start: 'top 75%',
              end: 'bottom 25%',
              scrub: 1,
            },
          },
        )
        gsap.fromTo(
          '.bt-floor-shadow',
          { scaleX: 0.6, opacity: 0.2 },
          {
            scaleX: 0.95,
            opacity: 0.38,
            ease: 'none',
            scrollTrigger: {
              trigger: stage.current,
              start: 'top 75%',
              end: 'bottom 25%',
              scrub: 1,
            },
          },
        )
      })
    },
    { scope: root },
  )

  const buyHref = `mailto:info.samsenterprise.pk@gmail.com?subject=${encodeURIComponent('Buy SANMATE — Bottle Trap')}&body=${encodeURIComponent('Hi, I want to buy the Bottle Trap.\n\nQuantity:\nCity:\nPhone:')}`

  return (
    <section id="bottle-trap" ref={root} className="section-pad overflow-hidden bg-[#E8E8E4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <FadeUp className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <p className="text-accent tracking-[0.2em] text-[10px] uppercase font-semibold mb-2">
            Product 02
          </p>
          <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-navy mb-3">
            Bottle Trap
          </h2>
          <p className="text-muted text-sm">
            Adjustable height · 36L/min flow · Easy clean base
          </p>
        </FadeUp>

        {/* Interactive product stage */}
        <div
          ref={stage}
          className="relative flex flex-col items-center justify-center min-h-[52vh] sm:min-h-[420px] mb-6 sm:mb-10"
          style={{ perspective: 1200 }}
        >
          <div className="bt-glow absolute w-[70%] max-w-sm aspect-square rounded-full bg-[radial-gradient(circle,rgba(245,99,13,0.14),transparent_70%)] blur-2xl opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="bt-floor-shadow absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[55%] h-6 sm:h-8 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(27,29,99,0.3),transparent_70%)] blur-[4px]" />

          <div className="bt-product relative z-10 w-[min(70vw,260px)] sm:w-[min(50vw,320px)] aspect-square flex items-center justify-center will-change-transform">
            <CutoutProduct
              src={bottleTrapBg}
              alt="SANMATE bottle trap"
              bgMode="dark"
              cropTop={0.1}
              cropBottom={0.02}
              cropSide={0.03}
              saturate={0.85}
              brightness={0.96}
              className="max-w-[95%] max-h-[95%] bt-cutout"
            />
          </div>

          <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-navy/40 md:hidden">
            Scroll to rotate
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <a href={buyHref} className="btn-accent">
            <ShoppingBag size={15} /> Buy Bottle Trap
          </a>
        </div>

        <div className="h-scroll md:hidden -mx-4 px-4">
          {bottleFeatures.map((f) => (
            <article
              key={f.title}
              className="w-[72vw] max-w-[260px] rounded-2xl bg-surface border border-border p-5"
            >
              <div className="w-10 h-10 rounded-full bg-navy/10 text-navy flex items-center justify-center mb-3">
                <f.Icon size={18} />
              </div>
              <h3 className="font-display font-bold uppercase tracking-tight text-sm text-ink mb-1">
                {f.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed">{f.text}</p>
            </article>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3">
          {bottleFeatures.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.04}>
              <article className="h-full rounded-2xl bg-surface border border-border p-4">
                <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center mb-3">
                  <f.Icon size={16} />
                </div>
                <h3 className="font-display font-bold uppercase tracking-tight text-xs text-ink mb-1">
                  {f.title}
                </h3>
                <p className="text-[11px] text-muted leading-relaxed">{f.text}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
