import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { images } from '../data'
import FadeUp from './FadeUp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const gallery = [
  { src: images.marbleBath, alt: 'Marble bathroom' },
  { src: images.wasteFeaturesChrome, alt: 'Chrome waste' },
  { src: images.luxuryBath, alt: 'Luxury bath' },
  { src: images.darkStone, alt: 'Dark stone' },
  { src: images.bottleFeatures2, alt: 'Bottle trap' },
  { src: images.whiteSink, alt: 'White sink' },
]

export default function Gallery() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.gal-img').forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.18 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <section id="gallery" ref={root} className="section-pad bg-surface overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <FadeUp className="mb-6 sm:mb-8">
          <p className="text-accent tracking-[0.2em] text-[10px] uppercase font-semibold mb-2">Gallery</p>
          <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-navy">
            Inspiration
          </h2>
        </FadeUp>

        {/* Mobile horizontal scroll with parallax images */}
        <div className="h-scroll md:hidden -mx-4 px-4">
          {gallery.map((g) => (
            <div
              key={g.alt}
              className="gallery-item w-[78vw] max-w-[300px] aspect-[3/4] rounded-[1.5rem] overflow-hidden shadow-2xl"
            >
              <img src={g.src} alt={g.alt} className="gal-img w-full h-full object-cover will-change-transform" />
            </div>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {gallery.map((g, i) => (
            <FadeUp key={g.alt} delay={(i % 3) * 0.05}>
              <div
                className={`gallery-item rounded-[1.75rem] overflow-hidden shadow-2xl ${
                  i === 0 || i === 3 ? 'aspect-[3/4]' : 'aspect-[4/3]'
                }`}
              >
                <img src={g.src} alt={g.alt} className="gal-img w-full h-full object-cover will-change-transform" loading="lazy" />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
