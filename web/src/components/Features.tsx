import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Sparkles, Shield, CheckCircle2, Gem, Wrench, Layers } from 'lucide-react'
import Logo from './Logo'
import FadeUp from './FadeUp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const features = [
  { title: 'Precision Engineered', text: 'Tight tolerances. Clean lines. Silent performance.', Icon: Sparkles },
  { title: 'Corrosion Resistant', text: 'Chrome and ABS that stay beautiful for years.', Icon: Shield },
  { title: 'Leak Tested', text: 'Every seal verified before it leaves the line.', Icon: CheckCircle2 },
  { title: 'Mirror Finish', text: 'A chrome surface that reflects premium spaces.', Icon: Gem },
  { title: 'Easy Installation', text: 'Designed for speed under basins and vanities.', Icon: Wrench },
  { title: 'Premium Brass & ABS', text: 'Materials chosen for strength and longevity.', Icon: Layers },
]

export default function Features() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.h-card')
        gsap.to(cards, {
          xPercent: -100 * (cards.length - 1.2),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${(track.current?.scrollWidth || 2000) * 0.8}`,
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
      <div className="md:min-h-screen md:flex md:flex-col md:justify-center py-16 sm:py-24 md:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 mb-8 md:mb-14">
          <FadeUp>
            <Logo href="" imgClassName="h-12 w-auto mb-5" />
            <p className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold mb-4">
              Features
            </p>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-navy">
              Designed to disappear.
              <br />
              <span className="text-ink">Built to perform.</span>
            </h2>
          </FadeUp>
        </div>

        <div ref={track} className="flex flex-col md:flex-row gap-4 sm:gap-5 px-4 sm:px-6 md:px-10 md:w-max">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="h-card hover-target shrink-0 w-full md:w-[360px] rounded-[2rem] bg-surface border border-border p-7 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center">
                  <f.Icon size={22} strokeWidth={1.75} />
                </div>
                <span className="text-chrome font-display text-4xl font-extrabold">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-ink mb-3">
                {f.title}
              </h3>
              <p className="text-muted leading-relaxed text-sm sm:text-base">{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
