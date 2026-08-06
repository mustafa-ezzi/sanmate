import { useEffect } from 'react'

export function useCursorGlow() {
  useEffect(() => {
    const glow = document.createElement('div')
    glow.className = 'cursor-glow'
    document.body.appendChild(glow)

    const onMove = (e: MouseEvent) => {
      glow.classList.add('is-active')
      glow.style.left = `${e.clientX}px`
      glow.style.top = `${e.clientY}px`
    }

    const onLeave = () => glow.classList.remove('is-active')

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      glow.remove()
    }
  }, [])
}
