import { images } from '../data'
import FadeUp from './FadeUp'

const materials = [
  { title: 'Mirror Chrome', text: 'Polished reflection that elevates every vanity.', img: images.wasteChrome },
  { title: 'Premium ABS', text: 'Lightweight strength. Rust-free by nature.', img: images.wasteWhite },
  { title: 'Precision Seals', text: 'Leak-tested gaskets for silent confidence.', img: images.wasteExploded2 },
]

export default function Materials() {
  return (
    <section id="materials" className="py-16 sm:py-24 md:py-[140px] bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <FadeUp className="mb-10 sm:mb-16 max-w-2xl">
          <p className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold mb-4">
            Materials
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-navy mb-4">
            Macro beauty.
            <br />
            Micro precision.
          </h2>
          <p className="text-muted text-base sm:text-lg">
            Surfaces that catch light. Materials that refuse compromise.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {materials.map((m, i) => (
            <FadeUp key={m.title} delay={i * 0.08} className={i === 2 ? 'sm:col-span-2 md:col-span-1' : ''}>
              <article className="group relative overflow-hidden rounded-[2rem] aspect-[4/5] sm:aspect-[3/4] shadow-2xl">
                <img
                  src={m.img}
                  alt={m.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute bottom-0 p-6 sm:p-8 text-white">
                  <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight mb-2">{m.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{m.text}</p>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
