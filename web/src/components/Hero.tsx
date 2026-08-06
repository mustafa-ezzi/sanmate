import { useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowDown } from 'lucide-react'
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

      const onMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window
        const rx = ((e.clientY / innerHeight) - 0.5) * -18
        const ry = ((e.clientX / innerWidth) - 0.5) * 22
        gsap.to(el, {
          rotateX: rx,
          rotateY: ry,
          duration: 0.9,
          ease: 'power2.out',
          transformPerspective: 900,
        })
      }

      const onLeave = () => {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 1, ease: 'power2.out' })
      }

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseleave', onLeave)
      return () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseleave', onLeave)
      }
    },
    { scope: root },
  )

  return (
    <section
      id="hero"
      ref={root}
      className="relative min-h-[100svh] overflow-hidden flex items-center"
    >
      <div className="absolute inset-0">
        <img
          src={images.brandHero}
          alt=""
          className="w-full h-full object-cover scale-105"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/92 to-bg md:bg-gradient-to-r md:from-bg md:via-bg/88 md:to-bg/35" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-28 pb-16 md:py-0 grid lg:grid-cols-2 gap-10 lg:gap-8 items-center min-h-[100svh]">
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 sm:mb-8"
          >
            <Logo href="" imgClassName="h-16 w-auto sm:h-20 md:h-24" />
          </motion.div>

          <h1 className="font-display font-black uppercase tracking-tight leading-[0.92] text-[clamp(2.6rem,12vw,5.75rem)] text-navy">
            {words.map((word, i) => (
              <motion.span
                key={word}
                className={`block ${i === 2 ? 'text-accent' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.18, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-6 text-muted text-base sm:text-lg md:text-xl max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
          >
            Precision-engineered waste pipes and bottle traps — cinematic quality for modern bathrooms.
          </motion.p>

          <motion.div
            className="mt-8 sm:mt-10 flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            <a href="#waste-pipe" className="btn-primary w-full sm:w-auto">
              Explore Products
            </a>
            <a href="#story" className="btn-outline w-full sm:w-auto">
              Our Story
            </a>
          </motion.div>
        </div>

        <div className="order-1 lg:order-2 flex justify-center lg:justify-end pt-4 lg:pt-0" style={{ perspective: 1000 }}>
          <div ref={stage} className="relative w-[min(380px,78vw)] sm:w-[min(420px,70vw)] will-change-transform">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(15,76,129,0.18),transparent_70%)] blur-2xl scale-110" />
            <div className="float-y chrome-shine relative rounded-[2rem] overflow-hidden shadow-2xl">
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
        href="#story"
        className="hover-target absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
        <ArrowDown size={16} className="animate-bounce text-accent" />
      </motion.a>
    </section>
  )
}
