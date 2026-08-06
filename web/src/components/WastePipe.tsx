import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { images, wasteFeatures } from '../data'
import Logo from './Logo'
import FadeUp from './FadeUp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function WastePipe() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to('.wp-pin-img', {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="waste-pipe" ref={root} className="relative bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16 sm:py-24 lg:py-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-14 xl:gap-20 lg:items-start">
          {/* Sticky / pinned product (desktop) */}
          <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-center py-2 lg:py-0 mb-10 lg:mb-0">
            <FadeUp className="mb-6 lg:hidden">
              <Logo href="" imgClassName="h-12 w-auto mb-4" />
              <p className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold mb-3">
                Product 01
              </p>
              <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-navy">
                Washbasin Waste Pipe
              </h2>
            </FadeUp>

            <div className="chrome-shine relative rounded-[2rem] overflow-hidden shadow-2xl mx-auto w-full max-w-md lg:max-w-none">
              <img
                src={images.wasteChrome}
                alt="Chrome waste pipe"
                className="wp-pin-img w-full h-auto will-change-transform"
              />
            </div>
          </div>

          {/* Scrolling features */}
          <div className="lg:py-[18vh] pb-8 lg:pb-[18vh]">
            <div className="hidden lg:block mb-12 xl:mb-14">
              <Logo href="" imgClassName="h-14 w-auto mb-6" />
              <p className="text-accent tracking-[0.25em] text-xs uppercase font-semibold mb-4">
                Product 01
              </p>
              <h2 className="font-display text-5xl xl:text-6xl uppercase tracking-tight text-navy mb-6">
                Washbasin
                <br />
                Waste Pipe
              </h2>
              <p className="text-muted text-lg max-w-md leading-relaxed">
                Engineered for performance. Built to last. Leak-proof design and smooth drainage
                for a cleaner tomorrow.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {wasteFeatures.map((f, i) => (
                <FadeUp key={f.title} delay={i * 0.04}>
                  <article className="hover-target rounded-[2rem] border border-border bg-bg p-5 sm:p-7 flex gap-4 sm:gap-5 transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                    <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-navy text-white flex items-center justify-center">
                      <f.Icon size={20} strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold uppercase tracking-tight text-ink text-base sm:text-lg mb-1">
                        {f.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">{f.text}</p>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-10 sm:mt-14">
              <FadeUp>
                <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3]">
                  <img src={images.wasteWhite} alt="ABS waste pipe" className="w-full h-full object-cover" />
                </div>
              </FadeUp>
              <FadeUp delay={0.1}>
                <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3]">
                  <img src={images.wasteExploded} alt="Exploded view" className="w-full h-full object-cover" />
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
