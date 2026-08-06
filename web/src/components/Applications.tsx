import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { images } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const apps = [
  { title: 'Homes', text: 'Quiet luxury under everyday basins.', img: images.whiteSink },
  { title: 'Hotels', text: 'Durable elegance for high-traffic suites.', img: images.hotelBath },
  { title: 'Architects', text: 'Spec-ready details for refined projects.', img: images.luxuryBath },
  { title: 'Interior Designers', text: 'Finishes that complete the composition.', img: images.marbleBath },
]

export default function Applications() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.app-card', {
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
        x: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      })
    },
    { scope: root },
  )

  return (
    <section id="applications" ref={root} className="py-[120px] md:py-[160px]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-16">
          <p className="text-navy tracking-[0.25em] text-xs uppercase font-semibold mb-4">
            Applications
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink">
            Made for modern spaces
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {apps.map((a) => (
            <article
              key={a.title}
              className="app-card group relative overflow-hidden rounded-[32px] min-h-[320px]"
            >
              <img
                src={a.img}
                alt={a.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
              <div className="absolute bottom-0 p-8 text-white">
                <h3 className="font-display text-3xl mb-2">{a.title}</h3>
                <p className="text-white/85">{a.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
