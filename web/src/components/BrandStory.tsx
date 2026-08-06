import { images } from '../data'
import Logo from './Logo'
import FadeUp from './FadeUp'

export default function BrandStory() {
  return (
    <section id="story" className="py-16 sm:py-24 md:py-[140px] px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 items-center">
        <div className="space-y-6 sm:space-y-8 md:sticky md:top-28">
          <FadeUp>
            <Logo href="" imgClassName="h-12 w-auto sm:h-16" />
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold">
              Brand Story
            </p>
          </FadeUp>
          <FadeUp delay={0.12}>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-[0.95] text-navy">
              Crafted like a product.
              <br />
              <span className="text-ink">Felt like a space.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="text-muted text-base sm:text-lg leading-relaxed max-w-md">
              SANMATE designs sanitary essentials the way Apple designs devices —
              minimal, cinematic, and product-first. Two pieces. Endless calm under the basin.
            </p>
          </FadeUp>
          <FadeUp delay={0.24}>
            <p className="text-muted leading-relaxed max-w-md text-sm sm:text-base">
              Mirror chrome. Premium ABS. Leak-tested seals. Every detail engineered for
              architects, hotels, and homes that refuse compromise.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.1}>
          <div className="rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] sm:aspect-[3/4] md:h-[70vh] md:aspect-auto">
            <img
              src={images.promoFlowing}
              alt="Something better is flowing in"
              className="w-full h-full object-cover"
            />
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
