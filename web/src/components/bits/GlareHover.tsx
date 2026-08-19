import { useRef } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  glareColor?: string
  glareSize?: number
  glareOpacity?: number
}

export default function GlareHover({
  children,
  className = '',
  glareColor = 'rgba(255,255,255,0.22)',
  glareSize = 420,
  glareOpacity = 1,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    const glare = glareRef.current
    if (!el || !glare) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    glare.style.left = `${x - glareSize / 2}px`
    glare.style.top = `${y - glareSize / 2}px`
    glare.style.opacity = String(glareOpacity)
  }

  const onMouseLeave = () => {
    const glare = glareRef.current
    if (glare) glare.style.opacity = '0'
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
      <div
        ref={glareRef}
        aria-hidden
        style={{
          position: 'absolute',
          width: glareSize,
          height: glareSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glareColor} 0%, transparent 70%)`,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.25s ease',
        }}
      />
    </div>
  )
}
