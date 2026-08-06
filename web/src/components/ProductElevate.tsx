import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ShoppingBag } from 'lucide-react'
import { images } from '../data'
import CutoutProduct from './CutoutProduct'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = { active?: boolean }

/**
 * Clean product-only elevation on soft gray stage.
 * Waste pipe rises → bottle trap elevates. Starts visible after splash.
 */
export default function ProductElevate({ active = true }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!active) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const waste = '.pe-waste'
        const bottle = '.pe-bottle'
        const wShadow = '.pe-shadow-waste'
        const bShadow = '.pe-shadow-bottle'
        const wasteLabel = '.pe-label-waste'
        const bottleLabel = '.pe-label-bottle'
        const hint = '.pe-hint'
        const dots = '.pe-dots'
        const cta = '.pe-cta'
        const logo = '.pe-logo'

        // Start with waste already visible (no blank screen after splash)
        gsap.set(waste, { y: 70, scale: 0.88, opacity: 1 })
        gsap.set(bottle, { y: 190, scale: 0.76, opacity: 0 })
        gsap.set(wShadow, { scaleX: 0.7, scaleY: 0.7, opacity: 0.28 })
        gsap.set(bShadow, { scaleX: 0.35, scaleY: 0.35, opacity: 0 })
        gsap.set(wasteLabel, { opacity: 0.85, y: 0 })
        gsap.set([bottleLabel, cta], { opacity: 0, y: 16 })
        gsap.set(bottleLabel, { opacity: 0 })
        gsap.set(hint, { opacity: 1 })
        gsap.set(dots, { opacity: 1 })
        gsap.set('.pe-dot-2', { backgroundColor: 'rgba(27,29,99,0.18)' })
        gsap.set('.pe-dot-1', { backgroundColor: '#F5630D' })
        gsap.set(logo, { opacity: 1 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * (window.innerWidth < 768 ? 3.4 : 4)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        tl.to(hint, { opacity: 0, duration: 0.25 }, 0)
          .to(logo, { opacity: 0, y: -12, duration: 0.35 }, 0.05)

          // Waste elevates into hero spot
          .to(waste, { y: 0, scale: 1, opacity: 1, duration: 0.9 }, 0.05)
          .to(wShadow, { scaleX: 1, scaleY: 1, opacity: 0.4, duration: 0.9 }, 0.05)
          .to(wasteLabel, { opacity: 1, y: 0, duration: 0.25 }, 0.35)

          .to(waste, { y: -10, scale: 1.03, duration: 0.4 }, 0.95)
          .to(wShadow, { scaleX: 0.9, scaleY: 0.9, opacity: 0.3, duration: 0.4 }, 0.95)
          .to(waste, { y: -14, duration: 0.3 }, 1.35)

          // Exit waste
          .to(wasteLabel, { opacity: 0, y: -12, duration: 0.2 }, 1.6)
          .to(waste, { y: -220, scale: 0.8, opacity: 0, duration: 0.55 }, 1.65)
          .to(wShadow, { scaleX: 0.3, opacity: 0, duration: 0.4 }, 1.65)
          .to('.pe-dot-1', { backgroundColor: 'rgba(27,29,99,0.18)', duration: 0.2 }, 1.75)
          .to('.pe-dot-2', { backgroundColor: '#F5630D', duration: 0.2 }, 1.9)

          // Bottle trap elevates — visible on gray stage
          .to(bottle, { y: 0, scale: 1, opacity: 1, duration: 1.1 }, 1.9)
          .to(bShadow, { scaleX: 1, scaleY: 1, opacity: 0.4, duration: 1.1 }, 1.9)
          .to(bottleLabel, { opacity: 1, y: 0, duration: 0.3 }, 2.4)

          .to(bottle, { y: -10, scale: 1.03, duration: 0.5 }, 2.95)
          .to(bShadow, { scaleX: 0.9, scaleY: 0.9, opacity: 0.28, duration: 0.5 }, 2.95)
          .to(cta, { opacity: 1, y: 0, duration: 0.35 }, 3.1)

        // Refresh after pin mounts
        requestAnimationFrame(() => ScrollTrigger.refresh())
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.pe-waste', { opacity: 1, y: 0, scale: 1 })
        gsap.set('.pe-shadow-waste', { opacity: 0.4, scale: 1 })
        gsap.set('.pe-label-waste', { opacity: 1 })
        gsap.set('.pe-cta', { opacity: 1 })
        gsap.set('.pe-hint', { opacity: 0 })
      })
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  )

  return (
    <section
      id="hero"
      ref={root}
      className="relative bg-[#E8E8E4] overflow-hidden"
      aria-label="Product elevation showcase"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#F3F3F0_0%,#E8E8E4_55%,#E0E0DC_100%)]" />

      <div className="relative h-[100svh] w-full flex flex-col items-center justify-center">
        <div className="pe-logo absolute top-[4.5rem] sm:top-20 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <img
            src={images.logo}
            alt="SANMATE"
            className="h-11 sm:h-12 w-auto object-contain"
          />
        </div>

        <div className="absolute top-[22%] sm:top-[18%] left-0 right-0 z-20 text-center pointer-events-none">
          <p className="pe-label-waste font-display text-[11px] sm:text-sm tracking-[0.28em] uppercase font-semibold text-navy">
            Washbasin Waste Pipe
          </p>
          <p className="pe-label-bottle absolute inset-x-0 top-0 font-display text-[11px] sm:text-sm tracking-[0.28em] uppercase font-semibold text-navy">
            Bottle Trap
          </p>
        </div>

        <div className="relative z-10 w-[min(72vw,340px)] sm:w-[min(58vw,380px)] md:w-[min(42vw,420px)] aspect-square flex items-center justify-center">
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[62%] h-[22px] sm:h-[28px] pointer-events-none">
            <div className="pe-shadow-waste absolute inset-0 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(27,29,99,0.28)_0%,transparent_70%)] blur-[5px]" />
            <div className="pe-shadow-bottle absolute inset-0 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(27,29,99,0.28)_0%,transparent_70%)] blur-[5px]" />
          </div>

          <div className="pe-waste absolute inset-0 flex items-center justify-center will-change-transform">
            <CutoutProduct
              src={images.wasteChrome}
              alt="SANMATE washbasin waste pipe"
              cropTop={0.3}
              cropBottom={0.05}
              className="max-w-[92%] max-h-[92%]"
            />
          </div>

          <div className="pe-bottle absolute inset-0 flex items-center justify-center will-change-transform">
            <img
              src={images.bottleTrapBg}
              alt="SANMATE bottle trap"
              className="max-w-[88%] max-h-[88%] w-auto h-auto object-contain pe-bottle-img select-none pointer-events-none"
              draggable={false}
            />
          </div>
        </div>

        <div className="pe-dots absolute bottom-[5.5rem] sm:bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2.5 opacity-80">
          <span className="pe-dot-1 w-2 h-2 rounded-full bg-accent" />
          <span className="pe-dot-2 w-2 h-2 rounded-full bg-navy/20" />
        </div>

        <p className="pe-hint absolute bottom-10 sm:bottom-14 left-1/2 -translate-x-1/2 z-20 text-[10px] tracking-[0.35em] uppercase text-navy/45">
          Scroll
        </p>

        <div className="pe-cta absolute bottom-9 sm:bottom-12 left-0 right-0 z-20 flex justify-center px-4">
          <a href="#buy" className="btn-accent">
            <ShoppingBag size={15} /> Buy Products
          </a>
        </div>
      </div>
    </section>
  )
}
