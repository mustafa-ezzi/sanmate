import { useEffect, useRef, useState } from 'react'
import { specs } from '../data'
import FadeUp from './FadeUp'

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        const start = performance.now()
        const dur = 1600
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur)
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplay(Math.round(value * eased))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

export default function Specifications() {
  return (
    <section id="specifications" className="py-16 sm:py-24 md:py-[140px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <FadeUp className="mb-10 sm:mb-16 max-w-2xl">
          <p className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold mb-4">
            Specifications
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-navy">
            Numbers that matter
          </h2>
        </FadeUp>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {specs.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.06}>
              <article className="hover-target rounded-[2rem] bg-surface border border-border p-5 sm:p-8 h-full transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <p className="font-display text-3xl sm:text-5xl md:text-6xl text-navy font-extrabold tracking-tight">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <h3 className="font-display text-sm sm:text-lg uppercase tracking-tight text-ink mt-4 sm:mt-6 mb-1">
                  {s.label}
                </h3>
                <p className="text-xs sm:text-sm text-muted">{s.detail}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
