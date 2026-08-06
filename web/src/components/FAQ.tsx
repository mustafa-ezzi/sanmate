import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { faqs } from '../data'
import Logo from './Logo'
import FadeUp from './FadeUp'

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-16 sm:py-24 md:py-[140px] bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10">
        <FadeUp className="mb-10 sm:mb-14 text-center">
          <div className="flex justify-center mb-5">
            <Logo href="" imgClassName="h-12 w-auto sm:h-14" />
          </div>
          <p className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold mb-4">
            FAQ
          </p>
          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-navy">
            Questions, answered
          </h2>
        </FadeUp>

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <FadeUp key={item.q} delay={i * 0.04}>
                <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-border bg-bg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="hover-target w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 sm:py-5"
                  >
                    <span className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-ink pr-2">
                      {item.q}
                    </span>
                    <span
                      className={`shrink-0 w-9 h-9 rounded-full border border-border flex items-center justify-center text-navy transition-transform duration-500 ${
                        isOpen ? 'rotate-45 bg-navy text-white border-navy' : ''
                      }`}
                    >
                      <Plus size={16} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-muted text-sm sm:text-base leading-relaxed">
                          {item.a}
                        </p>
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
