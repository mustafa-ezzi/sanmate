import { useEffect, useRef } from 'react'

type Props = {
  items: string[]
  separator?: React.ReactNode
  baseSpeed?: number
  className?: string
  itemClassName?: string
}

export default function ScrollVelocity({
  items,
  separator,
  baseSpeed = 40,
  className = '',
  itemClassName = '',
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const scrollVelRef = useRef(0)
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onScroll = () => {
      const delta = window.scrollY - lastScrollY.current
      lastScrollY.current = window.scrollY
      scrollVelRef.current = delta
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    let lastTs = performance.now()

    const tick = (ts: number) => {
      const dt = Math.min((ts - lastTs) / 1000, 0.05)
      lastTs = ts

      const velocity = scrollVelRef.current
      scrollVelRef.current *= 0.92

      const speed = baseSpeed + Math.abs(velocity) * 1.4
      posRef.current -= speed * dt

      const halfWidth = track.scrollWidth / 2
      if (Math.abs(posRef.current) >= halfWidth) {
        posRef.current += halfWidth
      }

      track.style.transform = `translateX(${posRef.current}px)`
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [baseSpeed])

  const dot = separator ?? <span className="h-1 w-1 rounded-full bg-accent" />
  const repeated = [...items, ...items]

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex gap-10 whitespace-nowrap will-change-transform">
        {repeated.map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-10 ${itemClassName}`}
          >
            {item}
            {dot}
          </span>
        ))}
      </div>
    </div>
  )
}
