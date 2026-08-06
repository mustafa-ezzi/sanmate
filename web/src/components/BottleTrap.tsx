import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { images, bottleFeatures } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function BottleTrap() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.bt-reveal', {
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
      })

      gsap.fromTo(
        '.bt-product',
        { rotate: -6, scale: 0.96 },
        {
          scrollTrigger: {
            trigger: '.bt-product',
            start: 'top 85%',
            end: 'center 40%',
            scrub: 1,
          },
          rotate: 8,
          scale: 1,
        },
      )

      gsap.to('.bt-reflect', {
        scrollTrigger: {
          trigger: '.bt-product',
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: true,
        },
        backgroundPosition: '120% 50%',
      })
    },
    { scope: root },
  )

  return (
    <section id="bottle-trap" ref={root} className="py-[120px] md:py-[160px]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="bt-reveal text-center max-w-2xl mx-auto mb-16">
          <p className="text-navy tracking-[0.25em] text-xs uppercase font-semibold mb-4">
            Product 02
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink mb-6">Bottle Trap</h2>
          <p className="text-muted text-lg">
            Adjustable, universal, and quietly premium — the under-basin companion that
            keeps flow smooth and maintenance effortless.
          </p>
        </div>

        <div className="relative mb-20 flex justify-center">
          <div className="bt-product bt-reflect chrome-shine relative w-full max-w-xl rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] bg-[linear-gradient(120deg,#f7f7f5_30%,#ffffff_50%,#e8ebef_70%)] bg-[length:200%_100%]">
            <img
              src={images.bottleTrap}
              alt="SANMATE bottle trap"
              className="w-full h-auto relative z-10"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {bottleFeatures.map((f) => (
            <div
              key={f.title}
              className="bt-reveal feature-card rounded-[24px] bg-surface border border-border p-7"
            >
              <h3 className="font-display font-semibold text-ink mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="bt-reveal rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] max-w-4xl mx-auto">
          <img
            src={images.bottleFeatures}
            alt="Bottle trap features"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  )
}
