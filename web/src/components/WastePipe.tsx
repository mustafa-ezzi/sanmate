import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { images, wasteFeatures } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function WastePipe() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.wp-reveal', {
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      })

      gsap.fromTo(
        '.wp-product',
        { rotationY: -8, rotate: -3 },
        {
          scrollTrigger: {
            trigger: '.wp-product',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
          rotationY: 8,
          rotate: 3,
          ease: 'none',
        },
      )
    },
    { scope: root },
  )

  return (
    <section id="waste-pipe" ref={root} className="py-[120px] md:py-[160px] bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="wp-reveal max-w-3xl mb-16">
          <p className="text-navy tracking-[0.25em] text-xs uppercase font-semibold mb-4">
            Product 01
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink mb-6">
            Washbasin Waste Pipe
          </h2>
          <p className="text-muted text-lg max-w-xl">
            Engineered for performance. Built to last. Premium quality, leak-proof design,
            and smooth drainage for a cleaner tomorrow.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="wp-product chrome-shine relative rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] perspective-[1000px]">
            <img
              src={images.wasteChrome}
              alt="Chrome waste pipe"
              className="w-full h-auto"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {wasteFeatures.map((f) => (
              <div
                key={f.title}
                className="wp-reveal feature-card rounded-[24px] border border-border bg-bg p-6"
              >
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center mb-4">
                  <span className="w-2 h-2 rounded-full bg-navy" />
                </div>
                <h3 className="font-display text-base font-semibold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="wp-reveal rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <img src={images.wasteWhite} alt="ABS white waste pipe" className="w-full h-full object-cover" />
          </div>
          <div className="wp-reveal rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <img src={images.wasteExploded} alt="Exploded waste pipe view" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
