import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ShoppingBag } from 'lucide-react'
import { images, bottleFeatures } from '../data'
import FadeUp from './FadeUp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function BottleTrap() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // 3D scrub — mobile + desktop
      gsap.fromTo(
        '.bt-3d',
        { rotateY: -22, rotateX: 6, scale: 0.9 },
        {
          rotateY: 22,
          rotateX: -4,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.bt-3d',
            start: 'top 88%',
            end: 'bottom 35%',
            scrub: 1,
          },
        },
      )
    },
    { scope: root },
  )

  const buyHref = `mailto:info.samsenterprise.pk@gmail.com?subject=${encodeURIComponent('Buy SANMATE — Bottle Trap')}&body=${encodeURIComponent('Hi, I want to buy the Bottle Trap.\n\nQuantity:\nCity:\nPhone:')}`

  return (
    <section id="bottle-trap" ref={root} className="section-pad overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <FadeUp className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <p className="text-accent tracking-[0.2em] text-[10px] uppercase font-semibold mb-2">Product 02</p>
          <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-navy mb-3">
            Bottle Trap
          </h2>
          <p className="text-muted text-sm">
            Adjustable height · 36L/min flow · Easy clean base
          </p>
        </FadeUp>

        <div className="relative flex justify-center mb-8 sm:mb-10" style={{ perspective: 1100 }}>
          <div className="absolute w-[60%] aspect-square max-w-sm rounded-full bg-[radial-gradient(circle,rgba(245,99,13,0.16),transparent_70%)] blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="bt-3d chrome-shine relative w-full max-w-[280px] sm:max-w-md rounded-[1.75rem] overflow-hidden shadow-2xl will-change-transform bg-surface">
            <img src={images.bottleTrap} alt="SANMATE bottle trap" className="w-full h-auto" />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <a href={buyHref} className="btn-accent">
            <ShoppingBag size={15} /> Buy Bottle Trap
          </a>
        </div>

        {/* Mobile snap · desktop grid */}
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
