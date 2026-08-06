import { ShoppingBag } from 'lucide-react'
import { images } from '../data'
import FadeUp from './FadeUp'

const products = [
  {
    id: 'waste-pipe',
    name: 'Washbasin Waste Pipe',
    tag: 'Best Seller',
    desc: 'Chrome & ABS · 30" · Leak-proof',
    img: images.wasteChrome,
  },
  {
    id: 'bottle-trap',
    name: 'Bottle Trap',
    tag: 'Premium',
    desc: 'Adjustable · 36L/min · 32/40mm',
    img: images.bottleTrap,
  },
]

function buyMailto(product: string) {
  const subject = encodeURIComponent(`Buy SANMATE — ${product}`)
  const body = encodeURIComponent(
    `Hi SANMATE,\n\nI would like to purchase: ${product}.\n\nQuantity:\nCity:\nPhone:\n\nThank you.`,
  )
  return `mailto:info.samsenterprise.pk@gmail.com?subject=${subject}&body=${body}`
}

export default function BuyProducts() {
  return (
    <section id="buy" className="section-pad relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,99,13,0.08),transparent_50%)] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-10">
        <FadeUp className="mb-8 sm:mb-10">
          <p className="text-accent tracking-[0.25em] text-[10px] uppercase font-semibold mb-2 flex items-center gap-2">
            <ShoppingBag size={14} /> Buy Products
          </p>
          <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-navy">
            Shop the collection
          </h2>
          <p className="text-muted text-sm mt-3 max-w-md">
            Two precision products. Order directly — we reply fast.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {products.map((p, i) => (
            <FadeUp key={p.id} delay={i * 0.06}>
              <article className="h-full rounded-[1.75rem] bg-surface border border-border overflow-hidden shadow-[0_16px_40px_rgba(27,29,99,0.06)]">
                <div className="relative aspect-[5/4] overflow-hidden bg-bg">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-accent text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1">
                    {p.tag}
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-navy mb-1">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted mb-4">{p.desc}</p>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <a href={buyMailto(p.name)} className="btn-accent flex-1 text-center">
                      <ShoppingBag size={15} /> Buy Now
                    </a>
                    <a href={`#${p.id}`} className="btn-outline flex-1 text-center">
                      Details
                    </a>
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp className="mt-6 sm:mt-8">
          <p className="text-xs text-muted">
            Or email{' '}
            <a
              href="mailto:info.samsenterprise.pk@gmail.com"
              className="text-accent font-medium break-all"
            >
              info.samsenterprise.pk@gmail.com
            </a>
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
