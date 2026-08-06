import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag } from 'lucide-react'
import Logo from './Logo'

const links = [
  { href: '#buy', label: 'Buy' },
  { href: '#waste-pipe', label: 'Waste Pipe' },
  { href: '#bottle-trap', label: 'Bottle Trap' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
        scrolled || open
          ? 'bg-bg/95 backdrop-blur-md border-b border-border shadow-[0_8px_30px_rgba(27,29,99,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-6xl px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        <Logo imgClassName="h-9 w-auto sm:h-11 md:h-12" />

        <ul className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="hover-target text-ink/70 text-xs tracking-wide uppercase font-semibold hover:text-accent transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href="#buy" className="btn-accent !py-2 !px-3 sm:!px-4 text-[11px] sm:text-xs">
            <ShoppingBag size={14} className="shrink-0" />
            <span>Buy Products</span>
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="lg:hidden hover-target w-10 h-10 rounded-full border border-border flex items-center justify-center bg-surface"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-border bg-bg max-h-[80vh] overflow-y-auto"
          >
            <ul className="px-5 py-6 space-y-1">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 font-display text-xl font-extrabold uppercase tracking-tight text-ink hover:text-accent"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-4">
                <a href="#buy" onClick={() => setOpen(false)} className="btn-accent w-full">
                  <ShoppingBag size={16} /> Buy Products
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
