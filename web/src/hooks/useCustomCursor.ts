import { useEffect } from 'react'

/** Trailing dot + ring cursor (desktop). Expands/hides on interactive hover. */
export function useCustomCursor() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768) {
      return
    }

    const dot = document.createElement('div')
    const ring = document.createElement('div')
    dot.className = 'cursor-dot'
    ring.className = 'cursor-ring'
    document.body.appendChild(dot)
    document.body.appendChild(ring)
    document.body.classList.add('has-custom-cursor')

    let mx = 0
    let my = 0
    let rx = 0
    let ry = 0
    let raf = 0

    const tick = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`
      dot.classList.add('is-on')
      ring.classList.add('is-on')
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      const interactive = t?.closest('a, button, .hover-target, input, textarea, select')
      if (interactive) {
        ring.classList.add('is-hover')
        dot.classList.add('is-hover')
      } else {
        ring.classList.remove('is-hover')
        dot.classList.remove('is-hover')
      }
    }

    const onLeave = () => {
      dot.classList.remove('is-on')
      ring.classList.remove('is-on')
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseleave', onLeave)
      document.body.classList.remove('has-custom-cursor')
      dot.remove()
      ring.remove()
    }
  }, [])
}
