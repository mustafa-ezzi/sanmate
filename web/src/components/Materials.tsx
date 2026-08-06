import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { images } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const materials = [
  {
    title: 'Mirror Chrome',
    text: 'Polished reflection that elevates every vanity.',
    img: images.wasteChrome,
  },
  {
    title: 'Premium ABS',
    text: 'Lightweight strength. Rust-free by nature.',
    img: images.wasteWhite,
  },
  {
    title: 'Precision Seals',
    text: 'Leak-tested gaskets for silent confidence.',
    img: images.wasteExploded2,
  },
]

export default function Materials() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.mat-card').forEach((card) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 85%' },
          y: 80,
          opacity: 0,
          scale: 0.96,
          duration: 1,
          ease: 'power3.out',
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="materials" ref={root} className="py-[120px] md:py-[160px] bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-16 max-w-2xl">
          <p className="text-navy tracking-[0.25em] text-xs uppercase font-semibold mb-4">
            Materials
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink mb-6">
            Macro beauty. Micro precision.
          </h2>
          <p className="text-muted text-lg">
            Surfaces that catch light. Materials that refuse compromise.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {materials.map((m) => (
            <article
              key={m.title}
              className="mat-card group relative overflow-hidden rounded-[32px] aspect-[3/4]"
            >
              <img
                src={m.img}
                alt={m.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 p-8 text-white">
                <h3 className="font-display text-2xl mb-2">{m.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{m.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
