import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Sparkles, Shield, CheckCircle2, Gem, Wrench, Layers } from 'lucide-react'
import FadeUp from './FadeUp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const features = [
  { title: 'Precision Engineered', text: 'Tight tolerances. Silent performance.', Icon: Sparkles },
  { title: 'Corrosion Resistant', text: 'Chrome & ABS built to last.', Icon: Shield },
  { title: 'Leak Tested', text: 'Every seal factory verified.', Icon: CheckCircle2 },
  { title: 'Mirror Finish', text: 'Premium chrome that shines.', Icon: Gem },
  { title: 'Easy Install', text: 'Fast fit under any vanity.', Icon: Wrench },
  { title: 'Premium Materials', text: 'ABS strength. Chrome beauty.', Icon: Layers },
]

export default function Features() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // Desktop pin scrub
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.h-card')
        gsap.to(cards, {
          xPercent: -100 * (cards.length - 1.25),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${(track.current?.scrollWidth || 1600) * 0.7}`,
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
      <div className="md:min-h-screen md:flex md:flex-col md:justify-center section-pad md:py-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-6 md:mb-10">
          <FadeUp>
            <p className="text-accent tracking-[0.2em] text-[10px] uppercase font-semibold mb-2">Features</p>
            <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-navy">
              Built to perform
            </h2>
          </FadeUp>
        </div>

        {/* Mobile: swipe carousel */}
        <div className="h-scroll md:hidden px-4 -mx-0">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="w-[78vw] max-w-[280px] rounded-[1.5rem] bg-surface border border-border p-6 shadow-[0_12px_40px_rgba(27,29,99,0.06)]"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center">
                  <f.Icon size={18} />
                </div>
                <span className="text-chrome font-display text-3xl font-extrabold">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display text-lg uppercase tracking-tight text-ink mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.text}</p>
            </article>
          ))}
        </div>

        {/* Desktop: pinned horizontal */}
        <div ref={track} className="hidden md:flex md:flex-row gap-4 px-8 md:w-max">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="h-card shrink-0 w-[320px] rounded-[1.75rem] bg-surface border border-border p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center">
                  <f.Icon size={20} />
                </div>
                <span className="text-chrome font-display text-4xl font-extrabold">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display text-xl uppercase tracking-tight text-ink mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
