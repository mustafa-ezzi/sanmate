import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { specs } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obj = { n: 0 }
    const tween = gsap.to(obj, {
      n: value,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.n)}${suffix}`
      },
    })
    return () => {
      tween.kill()
    }
  }, [value, suffix])

  return <span ref={ref}>0{suffix}</span>
}

export default function Specifications() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.spec-card', {
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      })
    },
    { scope: root },
  )

  return (
    <section id="specifications" ref={root} className="py-[120px] md:py-[160px]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-16 max-w-2xl">
          <p className="text-navy tracking-[0.25em] text-xs uppercase font-semibold mb-4">
            Specifications
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink">
            Numbers that matter
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((s) => (
            <article
              key={s.label}
              className="spec-card rounded-[32px] bg-surface border border-border p-8 md:p-10"
            >
              <p className="font-display text-5xl md:text-6xl text-navy font-bold tracking-tight">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <h3 className="font-display text-lg text-ink mt-6 mb-1">{s.label}</h3>
              <p className="text-sm text-muted">{s.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
