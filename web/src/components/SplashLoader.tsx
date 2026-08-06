import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { images } from '../data'

type SplashLoaderProps = {
  onDone: () => void
  minMs?: number
}

/** Full-screen logo intro on reload, then reveals the elevate section */
export default function SplashLoader({ onDone, minMs = 2000 }: SplashLoaderProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => setShow(false), minMs)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [minMs])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[10050] flex flex-col items-center justify-center bg-[#ECECE8]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <motion.img
            src={images.logo}
            alt="SANMATE"
            className="w-[min(56vw,220px)] sm:w-[240px] h-auto object-contain"
            initial={{ opacity: 0, scale: 0.82, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
          />
          <motion.p
            className="mt-5 font-display text-[10px] sm:text-xs tracking-[0.35em] uppercase text-navy/50"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            Drain your worries
          </motion.p>
          <motion.div
            className="mt-8 h-0.5 w-16 rounded-full bg-accent origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
