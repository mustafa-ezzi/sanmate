import { images } from '../data'
import FadeUp from './FadeUp'

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
  return (
    <section id="gallery" className="py-16 sm:py-24 md:py-[140px] bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <FadeUp className="mb-10 sm:mb-16 max-w-2xl">
          <p className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold mb-4">
            Gallery
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-navy mb-4">
            Bathroom inspiration
          </h2>
          <p className="text-muted text-base sm:text-lg">
            Spaces where SANMATE belongs — calm, luminous, and meticulously finished.
          </p>
        </FadeUp>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
          {gallery.map((g, i) => (
            <FadeUp key={g.src + g.alt} delay={(i % 3) * 0.06}>
              <div
                className={`gallery-item hover-target break-inside-avoid overflow-hidden rounded-[2rem] shadow-2xl ${
                  g.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'
                }`}
              >
                <img src={g.src} alt={g.alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
