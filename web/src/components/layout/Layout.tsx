import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import { useLenis } from '../../hooks/useLenis'
import { trackPageView } from '../../lib/ga'

export default function Layout() {
  useLenis()
  const location = useLocation()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    trackPageView(location.pathname)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 640)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {showTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-ink shadow-[0_12px_30px_rgba(17,17,17,0.12)] transition hover:-translate-y-0.5"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  )
}
