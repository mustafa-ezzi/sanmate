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
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1400)
          setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.35 },
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
    <section id="specifications" className="section-pad">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <FadeUp className="mb-6 sm:mb-8">
          <p className="text-accent tracking-[0.2em] text-[10px] uppercase font-semibold mb-2">Specs</p>
          <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-navy">
            Key numbers
          </h2>
        </FadeUp>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {specs.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.05}>
              <article className="rounded-[1.5rem] bg-surface border border-border p-4 sm:p-6 h-full">
                <p className="font-display text-2xl sm:text-4xl text-navy font-extrabold tracking-tight">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <h3 className="font-display text-xs sm:text-sm uppercase tracking-tight text-ink mt-3 mb-0.5">
                  {s.label}
                </h3>
                <p className="text-[11px] text-muted">{s.detail}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
