import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10 mb-12 md:mb-16">
          <div>
            <div className="mb-5 inline-flex rounded-2xl bg-white p-2.5 sm:p-3 shadow-2xl">
              <Logo href="#hero" imgClassName="h-12 w-auto sm:h-16 md:h-20" />
            </div>
            <p className="text-white/70 max-w-md text-sm sm:text-base">
              Premium drainage solutions — waste pipes & bottle traps for modern bathrooms.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 sm:gap-8 text-sm text-white/70">
            <a href="#waste-pipe" className="hover-target hover:text-accent transition-colors">Waste Pipe</a>
            <a href="#bottle-trap" className="hover-target hover:text-accent transition-colors">Bottle Trap</a>
            <a href="#gallery" className="hover-target hover:text-accent transition-colors">Gallery</a>
            <a href="#contact" className="hover-target hover:text-accent transition-colors">Contact</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 sm:pt-8 border-t border-white/15 text-xs sm:text-sm text-white/50">
          <p>© {new Date().getFullYear()} SANMATE. All rights reserved.</p>
          <a
            href="mailto:info.samsenterprise.pk@gmail.com"
            className="hover-target hover:text-white transition-colors break-all"
          >
            info.samsenterprise.pk@gmail.com
          </a>
        </div>
      </div>
    </footer>
  )
}
