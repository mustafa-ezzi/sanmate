import { useRef, type ReactNode, type ElementType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type RevealProps = {
  children: ReactNode
  className?: string
  as?: ElementType
  y?: number
  x?: number
  scale?: number
  delay?: number
  duration?: number
}

export default function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  y = 48,
  x = 0,
  scale = 1,
  delay = 0,
  duration = 1,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y, x, scale: scale === 1 ? 1 : scale, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })
    },
    { scope: ref, dependencies: [y, x, scale, delay, duration] },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
