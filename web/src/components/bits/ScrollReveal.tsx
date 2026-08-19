import { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function ScrollReveal({ children, className = '', delay = 0 }: Props) {
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
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? 'blur(0px)' : 'blur(8px)',
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.75s cubic-bezier(.22,.8,.26,1) ${delay}s, filter 0.75s cubic-bezier(.22,.8,.26,1) ${delay}s, transform 0.75s cubic-bezier(.22,.8,.26,1) ${delay}s`,
        willChange: 'opacity, filter, transform',
      }}
    >
      {children}
    </div>
  )
}
