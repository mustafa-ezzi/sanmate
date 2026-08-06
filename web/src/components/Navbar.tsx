import { useMagnetic } from '../hooks/useMagnetic'

const links = [
  { href: '#story', label: 'Story' },
  { href: '#waste-pipe', label: 'Waste Pipe' },
  { href: '#bottle-trap', label: 'Bottle Trap' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const { ref, onMove, onLeave } = useMagnetic(0.25)

  return (
    <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference pointer-events-none">
      <nav className="mx-auto max-w-7xl px-6 md:px-10 py-5 flex items-center justify-between pointer-events-auto">
        <a href="#hero" className="font-display text-white text-lg tracking-[0.2em] font-bold">
          SANMATE
        </a>
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-white/80 text-sm tracking-wide hover:text-white transition-colors duration-500"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href="#contact"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="magnetic-btn hidden sm:inline-flex items-center rounded-full bg-white text-navy px-5 py-2.5 text-sm font-medium tracking-wide"
        >
          Dealer Inquiry
        </a>
      </nav>
    </header>
  )
}
