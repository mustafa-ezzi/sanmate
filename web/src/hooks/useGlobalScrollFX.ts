import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Global image/text polish: parallax imgs, heading clip reveals, card lifts */
export function useGlobalScrollFX() {
  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Soft parallax for any marked image
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = Number(el.dataset.parallax) || 15
        gsap.fromTo(
          el,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      // Section headings: clip-up reveal
      gsap.utils.toArray<HTMLElement>('[data-reveal-heading]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      // Stagger cards/features entering viewport
      ScrollTrigger.batch('[data-stagger-item]', {
        start: 'top 90%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 50, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.85,
              stagger: 0.08,
              ease: 'power3.out',
              overwrite: true,
            },
          ),
        onLeaveBack: (batch) =>
          gsap.to(batch, { y: 40, opacity: 0.35, scale: 0.98, duration: 0.4, stagger: 0.04 }),
      })

      // Ken Burns slow zoom for lifestyle frames
      gsap.utils.toArray<HTMLElement>('[data-kenburns]').forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.05 },
          {
            scale: 1.18,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    })

    return () => mm.revert()
  }, [])
}
