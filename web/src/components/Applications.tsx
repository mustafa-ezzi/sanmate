import { Home, Building2, Compass, Palette } from 'lucide-react'
import { images } from '../data'
import FadeUp from './FadeUp'

const apps = [
  { title: 'Homes', text: 'Quiet luxury under everyday basins.', img: images.whiteSink, Icon: Home },
  { title: 'Hotels', text: 'Durable elegance for high-traffic suites.', img: images.hotelBath, Icon: Building2 },
  { title: 'Architects', text: 'Spec-ready details for refined projects.', img: images.luxuryBath, Icon: Compass },
  { title: 'Interior Designers', text: 'Finishes that complete the composition.', img: images.marbleBath, Icon: Palette },
]

export default function Applications() {
  return (
    <section id="applications" className="py-16 sm:py-24 md:py-[140px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <FadeUp className="mb-10 sm:mb-16">
          <p className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold mb-4">
            Applications
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-navy">
            Made for modern spaces
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {apps.map((a, i) => (
            <FadeUp key={a.title} delay={i * 0.07}>
              <article className="hover-target group relative overflow-hidden rounded-[2rem] min-h-[260px] sm:min-h-[320px] shadow-2xl">
                <img
                  src={a.img}
                  alt={a.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                <div className="absolute bottom-0 p-6 sm:p-8 text-white">
                  <div className="w-10 h-10 rounded-full bg-accent/90 flex items-center justify-center mb-4">
                    <a.Icon size={18} />
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight mb-2">{a.title}</h3>
                  <p className="text-white/85 text-sm sm:text-base">{a.text}</p>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
