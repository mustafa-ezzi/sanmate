import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { images } from '../data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function BrandStory() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.story-text > *', {
        scrollTrigger: {
          trigger: root.current,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 1,
        },
        opacity: 0.15,
        y: 40,
        stagger: 0.15,
      })

      gsap.to('.story-img', {
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        yPercent: -8,
      })
    },
    { scope: root },
  )

  return (
    <section id="story" ref={root} className="py-[120px] md:py-[160px] px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start">
        <div className="story-text md:sticky md:top-28 space-y-8">
          <p className="text-navy tracking-[0.25em] text-xs uppercase font-semibold">Brand Story</p>
          <h2 className="font-display text-4xl md:text-6xl leading-tight text-ink">
            Crafted like a product.
            <br />
            Felt like a space.
          </h2>
          <p className="text-muted text-lg leading-relaxed max-w-md">
            SANMATE designs sanitary essentials the way Apple designs devices —
            minimal, cinematic, and product-first. Two pieces. Endless calm under the basin.
          </p>
          <p className="text-muted leading-relaxed max-w-md">
            Mirror chrome. Premium ABS. Leak-tested seals. Every detail engineered for
            architects, hotels, and homes that refuse compromise.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <img
            src={images.promoFlowing}
            alt="Something better is flowing in"
            className="story-img w-full h-[70vh] object-cover scale-110"
          />
        </div>
      </div>
    </section>
  )
}
