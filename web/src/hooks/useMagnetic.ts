import { useRef, type MouseEvent } from 'react'

export function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)

  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * strength}px, ${y * strength - 4}px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0, 0)'
  }

  return { ref, onMove, onLeave }
}
