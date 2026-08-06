import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Thin top progress bar that fills with page scroll */
export function useScrollProgress() {
  useEffect(() => {
    const bar = document.createElement('div')
    bar.setAttribute('aria-hidden', 'true')
    bar.className = 'scroll-progress'
    document.body.appendChild(bar)

    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      bar.remove()
    }
  }, [])
}
