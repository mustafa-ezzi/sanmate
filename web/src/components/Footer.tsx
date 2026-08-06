export default function Footer() {
  return (
    <footer className="border-t border-border bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div>
            <p className="font-display text-4xl md:text-6xl tracking-[0.15em] font-bold mb-4">
              SANMATE
            </p>
            <p className="text-white/70 max-w-md">
              Premium drainage solutions — waste pipes & bottle traps for modern bathrooms.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm text-white/70">
            <a href="#waste-pipe" className="hover:text-white transition-colors">Waste Pipe</a>
            <a href="#bottle-trap" className="hover:text-white transition-colors">Bottle Trap</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-white/15 text-sm text-white/50">
          <p>© {new Date().getFullYear()} SANMATE. All rights reserved.</p>
          <p className="tracking-[0.2em] uppercase text-xs">
            Drain your <span className="text-accent">worries</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
