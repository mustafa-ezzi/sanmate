import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

type FadeUpProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
}

const fadeUp = {
  hidden: (y: number) => ({ opacity: 0, y }),
  show: { opacity: 1, y: 0 },
}

/** Framer Motion whileInView fade-up (replit guide standard reveal) */
export default function FadeUp({
  children,
  delay = 0,
  y = 30,
  className = '',
  once = true,
  ...rest
}: FadeUpProps) {
  return (
    <motion.div
      className={className}
      custom={y}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-8% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
