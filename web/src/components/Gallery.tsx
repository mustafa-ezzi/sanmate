import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { images } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const gallery = [
  { src: images.marbleBath, tall: true, alt: 'White marble bathroom' },
  { src: images.wasteFeaturesChrome, tall: false, alt: 'Chrome waste details' },
  { src: images.luxuryBath, tall: false, alt: 'Luxury bathroom interior' },
  { src: images.darkStone, tall: true, alt: 'Dark stone bathroom' },
  { src: images.bottleFeatures2, tall: false, alt: 'Bottle trap lifestyle' },
  { src: images.whiteSink, tall: false, alt: 'White marble sink' },
  { src: images.hotelBath, tall: true, alt: 'Hotel bathroom suite' },
  { src: images.wasteFeaturesWhite, tall: false, alt: 'ABS waste pipe' },
]

export default function Gallery() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.gallery-item', {
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
      })
    },
    { scope: root },
  )

  return (
    <section id="gallery" ref={root} className="py-[120px] md:py-[160px] bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-16 max-w-2xl">
          <p className="text-navy tracking-[0.25em] text-xs uppercase font-semibold mb-4">
            Gallery
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink mb-6">
            Bathroom inspiration
          </h2>
          <p className="text-muted text-lg">
            Spaces where SANMATE belongs — calm, luminous, and meticulously finished.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {gallery.map((g) => (
            <div
              key={g.src + g.alt}
              className={`gallery-item break-inside-avoid overflow-hidden rounded-[24px] ${
                g.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'
              }`}
            >
              <img src={g.src} alt={g.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
