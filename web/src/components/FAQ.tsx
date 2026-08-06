import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { faqs } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function FAQ() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(0)

  useGSAP(
    () => {
      gsap.from('.faq-item', {
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      })
    },
    { scope: root },
  )

  return (
    <section id="faq" ref={root} className="py-[120px] md:py-[160px] bg-surface">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <div className="mb-14 text-center">
          <p className="text-navy tracking-[0.25em] text-xs uppercase font-semibold mb-4">
            FAQ
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-ink">
            Questions, answered
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className="faq-item rounded-[24px] border border-border bg-bg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                >
                  <span className="font-display font-semibold text-ink pr-4">{item.q}</span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center text-navy transition-transform duration-500 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                  <div>
                    <p className="px-6 pb-6 text-muted leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
