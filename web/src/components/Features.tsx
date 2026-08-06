import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const features = [
  { title: 'Precision Engineered', text: 'Tight tolerances. Clean lines. Silent performance.' },
  { title: 'Corrosion Resistant', text: 'Chrome and ABS that stay beautiful for years.' },
  { title: 'Leak Tested', text: 'Every seal verified before it leaves the line.' },
  { title: 'Mirror Finish', text: 'A chrome surface that reflects premium spaces.' },
  { title: 'Easy Installation', text: 'Designed for speed under basins and vanities.' },
  { title: 'Premium Brass & ABS', text: 'Materials chosen for strength and longevity.' },
]

export default function Features() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.h-card')
        gsap.to(cards, {
          xPercent: -100 * (cards.length - 1.2),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${track.current?.offsetWidth || 2000}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="features" ref={root} className="relative bg-bg overflow-hidden">
      <div className="md:min-h-screen md:flex md:flex-col md:justify-center py-[100px] md:py-0">
        <div className="max-w-7xl mx-auto px-6 md:px-10 mb-10 md:mb-16">
          <p className="text-navy tracking-[0.25em] text-xs uppercase font-semibold mb-4">
            Features
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink">
            Designed to disappear.
            <br />
            Built to perform.
          </h2>
        </div>

        <div
          ref={track}
          className="flex flex-col md:flex-row gap-6 px-6 md:px-10 md:w-max"
        >
          {features.map((f, i) => (
            <article
              key={f.title}
              className="h-card feature-card shrink-0 w-full md:w-[380px] rounded-[32px] bg-surface border border-border p-10 shadow-[0_20px_60px_rgba(0,0,0,0.04)]"
            >
              <span className="text-chrome font-display text-5xl font-bold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-2xl text-ink mt-8 mb-4">{f.title}</h3>
              <p className="text-muted leading-relaxed">{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
