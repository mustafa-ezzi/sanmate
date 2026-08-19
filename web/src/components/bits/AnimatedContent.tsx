import { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  direction?: 'vertical' | 'horizontal'
  distance?: number
  delay?: number
  duration?: number
  className?: string
}

export default function AnimatedContent({
  children,
  direction = 'vertical',
  distance = 24,
  delay = 0,
  duration = 0.85,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const translateFrom =
    direction === 'vertical' ? `translateY(${distance}px)` : `translateX(${distance}px)`

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0,0)' : translateFrom,
        transition: `opacity ${duration}s cubic-bezier(.22,.8,.26,1) ${delay}s, transform ${duration}s cubic-bezier(.22,.8,.26,1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
