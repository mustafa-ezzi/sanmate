import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type RevealImageProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  parallax?: number
  zoom?: number
  delay?: number
  children?: ReactNode
}

/** Clip-path reveal + optional parallax/zoom on scroll */
export default function RevealImage({
  src,
  alt,
  className = '',
  imgClassName = 'w-full h-full object-cover',
  parallax = 12,
  zoom = 1.12,
  delay = 0,
  children,
}: RevealImageProps) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          root.current,
          { clipPath: 'inset(12% 12% 12% 12% round 24px)', opacity: 0.4 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 32px)',
            opacity: 1,
            duration: 1.35,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: root.current,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        gsap.fromTo(
          '.reveal-img',
          { scale: zoom, yPercent: -parallax / 2 },
          {
            scale: 1,
            yPercent: parallax / 2,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    },
    { scope: root, dependencies: [src, parallax, zoom, delay] },
  )

  return (
    <div ref={root} className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} className={`reveal-img will-change-transform ${imgClassName}`} />
      {children}
    </div>
  )
}
