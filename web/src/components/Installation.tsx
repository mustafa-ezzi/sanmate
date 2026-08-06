import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Ruler, CircleDot, Lock, Link2, Droplets } from 'lucide-react'
import FadeUp from './FadeUp'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const steps = [
  { n: '01', title: 'Measure', text: 'Confirm basin outlet size — 32mm or 40mm.', Icon: Ruler },
  { n: '02', title: 'Fit Seal', text: 'Seat the rubber gasket for a leak-proof joint.', Icon: CircleDot },
  { n: '03', title: 'Secure', text: 'Tighten the chuck nut — no screws inside.', Icon: Lock },
  { n: '04', title: 'Connect', text: 'Align waste pipe or bottle trap outlet to wall.', Icon: Link2 },
  { n: '05', title: 'Test', text: 'Run water. Confirm silent, smooth drainage.', Icon: Droplets },
]

export default function Installation() {
  const root = useRef<HTMLElement>(null)
  const path = useRef<SVGPathElement>(null)

  useGSAP(
    () => {
      const line = path.current
      if (!line) return
      const length = line.getTotalLength()
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      })
    },
    { scope: root },
  )

  return (
    <section id="installation" ref={root} className="py-16 sm:py-24 md:py-[140px] bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative">
        <FadeUp className="mb-10 sm:mb-16 max-w-2xl">
          <p className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold mb-4">
            Installation
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-navy mb-4">
            Five calm steps
          </h2>
          <p className="text-muted text-base sm:text-lg">
            From measure to test — a timeline built for speed and confidence.
          </p>
        </FadeUp>

        <svg
          className="hidden lg:block absolute left-10 right-10 top-[260px] h-24 w-[calc(100%-5rem)] pointer-events-none"
          viewBox="0 0 1000 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            ref={path}
            d="M20 40 C 200 10, 300 70, 500 40 S 800 10, 980 40"
            stroke="#E8601C"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 relative z-10">
          {steps.map((s, i) => (
            <FadeUp key={s.n} delay={i * 0.06}>
              <div className="rounded-[2rem] border border-border bg-bg p-5 sm:p-6 h-full">
                <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center mb-5">
                  <s.Icon size={20} strokeWidth={1.75} />
                </div>
                <p className="text-accent text-xs tracking-[0.2em] font-semibold mb-2">{s.n}</p>
                <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
