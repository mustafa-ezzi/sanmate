import { ShoppingBag } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-navy text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <div className="mb-4 inline-flex rounded-xl bg-white p-2 shadow-2xl">
              <Logo href="#hero" imgClassName="h-11 w-auto sm:h-14" />
            </div>
            <p className="text-white/70 text-sm max-w-sm">
              Premium waste pipes & bottle traps.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <a href="#buy" className="hover-target hover:text-accent transition-colors inline-flex items-center gap-1.5">
              <ShoppingBag size={14} /> Buy
            </a>
            <a href="#waste-pipe" className="hover-target hover:text-accent transition-colors">Waste Pipe</a>
            <a href="#bottle-trap" className="hover-target hover:text-accent transition-colors">Bottle Trap</a>
            <a href="#contact" className="hover-target hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-2 pt-5 border-t border-white/15 text-xs text-white/50">
          <p>© {new Date().getFullYear()} SANMATE</p>
          <a href="mailto:info.samsenterprise.pk@gmail.com" className="hover:text-white break-all">
            info.samsenterprise.pk@gmail.com
          </a>
        </div>
      </div>
    </footer>
  )
}
