import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { formatPKR } from '../../lib/format'
import { useCart } from '../../store/cart'

const links = [
  { to: '/products', label: 'Shop' },
  { to: '/brands/sanmate', label: 'Sanmate' },
  { to: '/brands/wyped', label: 'Wyped' },
  { to: '/policies/shipping', label: 'Shipping' },
]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [bagOpen, setBagOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const lines = useCart((s) => s.lines)
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0))
  const subtotal = useCart((s) => s.subtotal)

  const overHero = isHome && !scrolled && !menuOpen

  useEffect(() => {
    document.body.style.overflow =
      menuOpen || searchOpen || bagOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, searchOpen, bagOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    setSearchOpen(false)
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  return (
    <>
      <div
        className={`${isHome ? 'fixed inset-x-0 top-0 z-50' : ''} ${
          overHero ? 'text-white' : ''
        }`}
      >
      <div
        className={
          overHero
            ? 'bg-black/35 text-white backdrop-blur-sm'
            : 'bg-house text-white'
        }
      >
        <div className="page-shell flex items-center justify-center gap-3 py-2.5 text-center">
          <span className="soft-pulse h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          <p className="font-mono-label text-white/80">
            Free delivery on orders over Rs 5,000 · Designed for home
          </p>
        </div>
      </div>

      <header
        className={`border-b ${
          overHero
            ? 'border-white/10 bg-transparent'
            : 'border-border/80 bg-bg/90 backdrop-blur-md'
        } ${!isHome ? 'sticky top-0 z-50' : ''} ${
          isHome && scrolled ? 'bg-bg/90 backdrop-blur-md' : ''
        }`}
      >
        <div className="page-shell flex h-[4.25rem] items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src="/images/sams-logo.jpg"
              alt="SAMS Enterprises"
              className={`h-9 w-9 rounded-full object-cover ${
                overHero ? 'ring-1 ring-white/30' : 'ring-1 ring-border'
              }`}
            />
            <div className="min-w-0 leading-tight">
              <p
                className={`truncate font-display text-sm font-extrabold tracking-[-0.05em] sm:text-base ${
                  overHero ? 'text-white' : 'text-ink'
                }`}
              >
                SAMS Enterprises
              </p>
              <p
                className={`font-mono-label hidden sm:block ${
                  overHero ? 'text-white/60' : 'text-muted'
                }`}
              >
                House of Sanmate & Wyped
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `font-mono-label transition-colors ${
                    overHero
                      ? isActive
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                      : isActive
                        ? 'text-navy'
                        : 'text-muted hover:text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                overHero
                  ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                  : 'border-border bg-surface text-ink hover:border-ink/25'
              }`}
            >
              <Search size={17} />
            </button>
            <button
              type="button"
              aria-label="Open bag"
              onClick={() => setBagOpen(true)}
              className={`relative grid h-10 w-10 place-items-center rounded-full ${
                overHero ? 'bg-white text-ink' : 'bg-house text-white'
              }`}
            >
              <ShoppingBag size={17} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={`grid h-10 w-10 place-items-center rounded-full border lg:hidden ${
                overHero
                  ? 'border-white/30 bg-white/10 text-white'
                  : 'border-border bg-surface text-ink'
              }`}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-bg lg:hidden">
            <nav className="page-shell flex flex-col gap-1 py-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 font-mono-label text-ink hover:bg-surface"
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="overlay-scrim absolute inset-0"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative mx-auto mt-24 w-[min(92vw,36rem)] rounded-2xl bg-surface p-5 shadow-[0_30px_80px_rgba(17,17,17,0.18)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono-label text-muted">Search products</p>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={onSearch}>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Sanmate, Wyped…"
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-base outline-none focus:border-navy/40"
              />
              <button type="submit" className="btn-primary mt-4 w-full">
                Search catalogue
              </button>
            </form>
          </div>
        </div>
      )}

      {bagOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="overlay-scrim absolute inset-0"
            aria-label="Close bag"
            onClick={() => setBagOpen(false)}
          />
          <aside className="drawer-panel absolute inset-y-0 right-0 flex w-[min(100vw,26rem)] flex-col">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="font-mono-label text-muted">Your bag</p>
                <p className="font-display text-xl font-extrabold tracking-[-0.05em]">
                  {count} item{count === 1 ? '' : 's'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close bag"
                onClick={() => setBagOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!lines.length ? (
                <div className="py-16 text-center">
                  <p className="font-display text-2xl font-extrabold tracking-[-0.05em]">
                    Your bag is empty
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Explore Sanmate and Wyped to get started.
                  </p>
                  <Link
                    to="/products"
                    onClick={() => setBagOpen(false)}
                    className="btn-primary mt-6 inline-flex"
                  >
                    Shop products
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {lines.map((line) => (
                    <li key={line.slug} className="flex gap-3">
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-bg">
                        {line.image ? (
                          <img
                            src={line.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/products/${line.slug}`}
                          onClick={() => setBagOpen(false)}
                          className="block truncate font-medium"
                        >
                          {line.name}
                        </Link>
                        <p className="font-mono-label mt-1 text-muted">
                          Qty {line.quantity}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-navy">
                          {formatPKR(Number(line.price) * line.quantity)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-border px-5 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono-label text-muted">Subtotal</span>
                  <span className="font-semibold text-navy">
                    {formatPKR(subtotal())}
                  </span>
                </div>
                <Link
                  to="/cart"
                  onClick={() => setBagOpen(false)}
                  className="btn-ghost mb-2 w-full"
                >
                  View bag
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setBagOpen(false)}
                  className="btn-primary w-full"
                >
                  Checkout
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  )
}
