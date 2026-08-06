import { useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowDown, ShoppingBag } from 'lucide-react'
import { images } from '../data'
import Logo from './Logo'

gsap.registerPlugin(useGSAP)

const words = ['DRAIN', 'YOUR', 'WORRIES']

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = stage.current
      if (!el) return

      // Desktop mouse parallax
      const onMove = (e: MouseEvent) => {
        if (window.matchMedia('(pointer: coarse)').matches) return
        const { innerWidth, innerHeight } = window
        const rx = ((e.clientY / innerHeight) - 0.5) * -16
        const ry = ((e.clientX / innerWidth) - 0.5) * 20
        gsap.to(el, {
          rotateX: rx,
          rotateY: ry,
          duration: 0.85,
          ease: 'power2.out',
          transformPerspective: 900,
        })
      }

      // Mobile: gentle tilt from device orientation / touch drag
      const onTouch = (e: TouchEvent) => {
        const t = e.touches[0]
        if (!t) return
        const rx = ((t.clientY / window.innerHeight) - 0.5) * -10
        const ry = ((t.clientX / window.innerWidth) - 0.5) * 14
        gsap.to(el, {
          rotateX: rx,
          rotateY: ry,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 800,
        })
      }

      const reset = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8 })

      window.addEventListener('mousemove', onMove)
      window.addEventListener('touchmove', onTouch, { passive: true })
      window.addEventListener('mouseleave', reset)
      window.addEventListener('touchend', reset)
      return () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('touchmove', onTouch)
        window.removeEventListener('mouseleave', reset)
        window.removeEventListener('touchend', reset)
      }
    },
    { scope: root },
  )

  return (
    <section
      id="hero"
      ref={root}
      className="relative min-h-[92svh] sm:min-h-[100svh] overflow-hidden flex items-center"
    >
      <div className="absolute inset-0">
        <img src={images.brandHero} alt="" className="w-full h-full object-cover scale-105" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/93 to-bg md:bg-gradient-to-r md:from-bg md:via-bg/90 md:to-bg/40" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-12 md:py-0 grid lg:grid-cols-2 gap-8 items-center min-h-[92svh]">
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5"
          >
            <Logo href="" imgClassName="h-14 w-auto sm:h-16 md:h-20" />
          </motion.div>

          <h1 className="font-display font-black uppercase tracking-tight leading-[0.92] text-[clamp(2.35rem,11vw,4.75rem)] text-navy">
            {words.map((word, i) => (
              <motion.span
                key={word}
                className={`block ${i === 2 ? 'text-accent' : ''}`}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-4 sm:mt-5 text-muted text-sm sm:text-base md:text-lg max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            Premium waste pipes & bottle traps — engineered for modern bathrooms.
          </motion.p>

          <motion.div
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <a href="#buy" className="btn-accent w-full sm:w-auto">
              <ShoppingBag size={16} /> Buy Products
            </a>
            <a href="#waste-pipe" className="btn-outline w-full sm:w-auto">
              View Details
            </a>
          </motion.div>
        </div>

        <div className="order-1 lg:order-2 flex justify-center lg:justify-end" style={{ perspective: 1000 }}>
          <div ref={stage} className="relative w-[min(300px,72vw)] sm:w-[min(380px,65vw)] will-change-transform">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(27,29,99,0.16),transparent_70%)] blur-2xl scale-110" />
            <div className="float-y chrome-shine relative rounded-[1.75rem] overflow-hidden shadow-2xl">
              <img
                src={images.wasteChrome}
                alt="SANMATE chrome washbasin waste pipe"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      </div>

      <motion.a
        href="#buy"
        className="hover-target absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[9px] tracking-[0.3em] uppercase">Shop</span>
        <ArrowDown size={14} className="animate-bounce text-accent" />
      </motion.a>
    </section>
  )
}
