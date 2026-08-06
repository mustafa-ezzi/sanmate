import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ShoppingBag } from 'lucide-react'
import { images, wasteFeatures } from '../data'
import Logo from './Logo'
import FadeUp from './FadeUp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function WastePipe() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // Works on mobile + desktop
      gsap.fromTo(
        '.wp-main-img',
        { scale: 1.12, y: 30, opacity: 0.5 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.wp-main-img',
            start: 'top 90%',
            end: 'top 35%',
            scrub: 0.8,
          },
        },
      )

      gsap.utils.toArray<HTMLElement>('.wp-feat').forEach((el, i) => {
        gsap.from(el, {
          x: i % 2 === 0 ? -24 : 24,
          opacity: 0,
          duration: 0.55,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        })
      })
    },
    { scope: root },
  )

  const buyHref = `mailto:info.samsenterprise.pk@gmail.com?subject=${encodeURIComponent('Buy SANMATE — Waste Pipe')}&body=${encodeURIComponent('Hi, I want to buy the Washbasin Waste Pipe.\n\nQuantity:\nCity:\nPhone:')}`

  return (
    <section id="waste-pipe" ref={root} className="section-pad bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="lg:sticky lg:top-24">
            <FadeUp className="mb-4 lg:hidden">
              <p className="text-accent tracking-[0.2em] text-[10px] uppercase font-semibold mb-2">Product 01</p>
              <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-navy">
                Waste Pipe
              </h2>
            </FadeUp>
            <div className="chrome-shine rounded-[1.75rem] overflow-hidden shadow-2xl">
              <img
                src={images.wasteChrome}
                alt="Chrome waste pipe"
                className="wp-main-img w-full h-auto will-change-transform"
              />
            </div>
            <a href={buyHref} className="btn-accent w-full mt-4 sm:hidden">
              <ShoppingBag size={15} /> Buy Waste Pipe
            </a>
          </div>

          <div>
            <div className="hidden lg:block mb-8">
              <Logo href="" imgClassName="h-12 w-auto mb-4" />
              <p className="text-accent tracking-[0.2em] text-[10px] uppercase font-semibold mb-2">Product 01</p>
              <h2 className="font-display text-4xl uppercase tracking-tight text-navy mb-3">
                Washbasin Waste Pipe
              </h2>
              <p className="text-muted text-sm max-w-md mb-5">
                Leak-proof. Chrome & ABS. 30" reach. Built for daily performance.
              </p>
              <a href={buyHref} className="btn-accent">
                <ShoppingBag size={15} /> Buy Now
              </a>
            </div>

            <div className="space-y-3 mt-6 lg:mt-0">
              {wasteFeatures.slice(0, 4).map((f) => (
                <article
                  key={f.title}
                  className="wp-feat hover-target rounded-2xl border border-border bg-bg p-4 flex gap-3"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center">
                    <f.Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold uppercase tracking-tight text-sm text-ink">
                      {f.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mt-0.5">{f.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
