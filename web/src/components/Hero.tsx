import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { images } from '../data'
import { useMagnetic } from '../hooks/useMagnetic'

gsap.registerPlugin(useGSAP)

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const product = useRef<HTMLDivElement>(null)
  const { ref: ctaRef, onMove, onLeave } = useMagnetic(0.3)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-brand', { y: 40, opacity: 0, duration: 0.9 })
        .from('.hero-title', { y: 60, opacity: 0, duration: 1 }, '-=0.5')
        .from('.hero-sub', { y: 30, opacity: 0, duration: 0.8 }, '-=0.55')
        .from('.hero-cta', { y: 50, opacity: 0, duration: 0.8 }, '-=0.4')
        .from('.hero-product', { scale: 0.9, opacity: 0, duration: 1.2 }, '-=1')

      const onMoveMouse = (e: MouseEvent) => {
        if (!product.current) return
        const { innerWidth, innerHeight } = window
        const x = (e.clientX / innerWidth - 0.5) * 30
        const y = (e.clientY / innerHeight - 0.5) * 20
        gsap.to(product.current, {
          x,
          y,
          duration: 1,
          ease: 'power2.out',
        })
      }

      window.addEventListener('mousemove', onMoveMouse)
      return () => window.removeEventListener('mousemove', onMoveMouse)
    },
    { scope: root },
  )

  return (
    <section
      id="hero"
      ref={root}
      className="relative min-h-screen overflow-hidden flex items-end md:items-center"
    >
      <div className="absolute inset-0">
        <img
          src={images.brandHero}
          alt="SANMATE premium bathroom atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7F7F5] via-[#F7F7F5]/88 to-[#F7F7F5]/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(201,206,211,0.35),transparent_55%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-0 grid md:grid-cols-2 gap-10 items-center min-h-screen">
        <div className="pt-16">
          <p className="hero-brand font-display text-navy tracking-[0.35em] text-sm md:text-base font-semibold mb-6">
            SANMATE
          </p>
          <h1 className="hero-title font-display text-[clamp(2.75rem,8vw,5.75rem)] leading-[0.95] text-ink max-w-xl">
            Every drop
            <br />
            deserves <span className="text-navy">better.</span>
          </h1>
          <p className="hero-sub mt-6 text-muted text-lg md:text-xl max-w-md leading-relaxed">
            Precision-engineered waste pipes and bottle traps for modern bathrooms.
          </p>
          <div className="hero-cta mt-10 flex flex-wrap gap-4">
            <a
              ref={ctaRef as React.RefObject<HTMLAnchorElement>}
              href="#waste-pipe"
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              className="magnetic-btn inline-flex items-center justify-center rounded-full bg-navy text-white px-8 py-4 text-sm font-medium tracking-wide"
            >
              Explore Products
            </a>
            <a
              href="#story"
              className="inline-flex items-center justify-center rounded-full border border-navy text-navy px-8 py-4 text-sm font-medium tracking-wide transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            >
              Our Story
            </a>
          </div>
          <p className="mt-8 text-xs tracking-[0.3em] uppercase text-muted">
            Drain your <span className="text-accent font-semibold">worries</span>
          </p>
        </div>

        <div
          ref={product}
          className="hero-product relative flex justify-center items-center"
        >
          <div className="absolute w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(15,76,129,0.12),transparent_70%)] blur-2xl" />
          <div className="float-product chrome-shine relative w-[min(420px,85vw)] rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <img
              src={images.wasteChrome}
              alt="SANMATE chrome washbasin waste pipe"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
