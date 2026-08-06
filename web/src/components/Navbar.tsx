import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

const links = [
  { href: '#story', label: 'Story' },
  { href: '#waste-pipe', label: 'Waste Pipe' },
  { href: '#bottle-trap', label: 'Bottle Trap' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'bg-bg/95 backdrop-blur-md border-b border-border shadow-[0_10px_40px_rgba(0,0,0,0.04)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10 py-3 flex items-center justify-between gap-4">
        <Logo imgClassName="h-10 w-auto sm:h-12 md:h-14" />

        <ul className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="hover-target text-ink/70 text-sm tracking-wide uppercase font-medium hover:text-accent transition-colors duration-400"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#contact" className="btn-primary hidden sm:inline-flex text-xs sm:text-sm px-4 sm:px-5 py-2.5">
            Dealer Inquiry
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="lg:hidden hover-target w-11 h-11 rounded-full border border-border flex items-center justify-center bg-surface"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:hidden border-t border-border bg-bg"
          >
            <ul className="px-6 py-8 space-y-1">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-2xl font-extrabold uppercase tracking-tight text-ink hover:text-accent"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-6">
                <a href="#contact" onClick={() => setOpen(false)} className="btn-accent w-full">
                  Dealer Inquiry
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
