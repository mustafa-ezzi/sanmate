import { images } from '../data'
import FadeUp from './FadeUp'

const gallery = [
  { src: images.marbleBath, alt: 'Marble bathroom' },
  { src: images.wasteFeaturesChrome, alt: 'Chrome waste' },
  { src: images.luxuryBath, alt: 'Luxury bath' },
  { src: images.darkStone, alt: 'Dark stone' },
  { src: images.bottleFeatures2, alt: 'Bottle trap' },
  { src: images.whiteSink, alt: 'White sink' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="section-pad bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <FadeUp className="mb-6 sm:mb-8">
          <p className="text-accent tracking-[0.2em] text-[10px] uppercase font-semibold mb-2">
            Gallery
          </p>
          <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-navy">
            Inspiration
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map((g, i) => (
            <FadeUp key={g.alt} delay={(i % 3) * 0.04}>
              <div className="gallery-item rounded-[1.5rem] overflow-hidden shadow-[0_16px_40px_rgba(27,29,99,0.08)] aspect-[4/3]">
                <img
                  src={g.src}
                  alt={g.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
