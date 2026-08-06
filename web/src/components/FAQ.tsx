import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { faqs } from '../data'
import FadeUp from './FadeUp'

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section-pad bg-surface">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
        <FadeUp className="mb-6 sm:mb-8 text-center">
          <p className="text-accent tracking-[0.2em] text-[10px] uppercase font-semibold mb-2">FAQ</p>
          <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-navy">
            Quick answers
          </h2>
        </FadeUp>

        <div className="space-y-2.5">
          {faqs.slice(0, 4).map((item, i) => {
            const isOpen = open === i
            return (
              <FadeUp key={item.q} delay={i * 0.03}>
                <div className="rounded-2xl border border-border bg-bg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="hover-target w-full flex items-center justify-between gap-3 text-left px-4 sm:px-5 py-3.5"
                  >
                    <span className="font-display font-bold text-xs sm:text-sm uppercase tracking-tight text-ink pr-2">
                      {item.q}
                    </span>
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center text-navy transition-transform duration-400 ${
                        isOpen ? 'rotate-45 bg-navy text-white border-navy' : ''
                      }`}
                    >
                      <Plus size={14} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 sm:px-5 pb-4 text-muted text-sm leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
