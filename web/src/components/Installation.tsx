import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const steps = [
  { n: '01', title: 'Measure', text: 'Confirm basin outlet size — 32mm or 40mm.' },
  { n: '02', title: 'Fit Seal', text: 'Seat the rubber gasket for a leak-proof joint.' },
  { n: '03', title: 'Secure', text: 'Tighten the chuck nut — no screws inside.' },
  { n: '04', title: 'Connect', text: 'Align waste pipe or bottle trap outlet to wall.' },
  { n: '05', title: 'Test', text: 'Run water. Confirm silent, smooth drainage.' },
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

      gsap.from('.inst-step', {
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      })
    },
    { scope: root },
  )

  return (
    <section id="installation" ref={root} className="py-[120px] md:py-[160px] bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <div className="mb-16 max-w-2xl">
          <p className="text-navy tracking-[0.25em] text-xs uppercase font-semibold mb-4">
            Installation
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink mb-6">
            Five calm steps
          </h2>
          <p className="text-muted text-lg">
            From measure to test — a timeline built for speed and confidence.
          </p>
        </div>

        <svg
          className="hidden lg:block absolute left-10 right-10 top-[280px] h-24 w-[calc(100%-5rem)] pointer-events-none"
          viewBox="0 0 1000 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            ref={path}
            d="M20 40 C 200 10, 300 70, 500 40 S 800 10, 980 40"
            stroke="#0F4C81"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
          {steps.map((s) => (
            <div key={s.n} className="inst-step">
              <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-display text-sm font-semibold mb-6">
                {s.n}
              </div>
              <h3 className="font-display text-xl text-ink mb-2">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
