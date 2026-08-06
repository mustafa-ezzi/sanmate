import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { images, bottleFeatures } from '../data'
import Logo from './Logo'
import FadeUp from './FadeUp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function BottleTrap() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.bt-3d',
          { rotateY: -25, rotateX: 8, scale: 0.92 },
          {
            rotateY: 25,
            rotateX: -6,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.bt-3d',
              start: 'top 85%',
              end: 'bottom 30%',
              scrub: 1,
            },
          },
        )

        gsap.to('.bt-glow', {
          opacity: 0.75,
          scale: 1.2,
          scrollTrigger: {
            trigger: '.bt-3d',
            start: 'top 80%',
            end: 'center center',
            scrub: true,
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="bottle-trap" ref={root} className="py-16 sm:py-24 md:py-[140px] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <FadeUp className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="flex justify-center mb-5">
            <Logo href="" imgClassName="h-12 w-auto sm:h-14" />
          </div>
          <p className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold mb-4">
            Product 02
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-navy mb-5">
            Bottle Trap
          </h2>
          <p className="text-muted text-base sm:text-lg">
            Adjustable, universal, and quietly premium — scrub-linked 3D motion meets under-basin engineering.
          </p>
        </FadeUp>

        <div className="relative flex justify-center mb-12 sm:mb-20" style={{ perspective: 1200 }}>
          <div className="bt-glow absolute w-[70%] aspect-square max-w-md rounded-full bg-[radial-gradient(circle,rgba(232,96,28,0.18),transparent_70%)] blur-2xl opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="bt-3d chrome-shine relative w-full max-w-sm sm:max-w-xl rounded-[2rem] overflow-hidden shadow-2xl will-change-transform bg-surface">
            <img
              src={images.bottleTrap}
              alt="SANMATE bottle trap"
              className="w-full h-auto relative z-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {bottleFeatures.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.06}>
              <article className="hover-target h-full rounded-[2rem] bg-surface border border-border p-6 sm:p-7 transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <div className="w-11 h-11 rounded-full bg-navy/10 text-navy flex items-center justify-center mb-4">
                  <f.Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="font-display font-bold uppercase tracking-tight text-ink mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{f.text}</p>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp>
          <div className="rounded-[2rem] overflow-hidden shadow-2xl max-w-4xl mx-auto">
            <img src={images.bottleFeatures} alt="Bottle trap features" className="w-full h-auto" />
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
