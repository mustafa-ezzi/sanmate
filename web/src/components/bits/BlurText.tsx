import { useEffect, useState } from 'react'

type Props = {
  text: string
  className?: string
  staggerMs?: number
  initialDelayMs?: number
}

export default function BlurText({
  text,
  className = '',
  staggerMs = 80,
  initialDelayMs = 0,
}: Props) {
  const words = text.split(' ')
  const [revealedCount, setRevealedCount] = useState(0)

  useEffect(() => {
    setRevealedCount(0)
    let i = 0
    function next() {
      i++
      setRevealedCount(i)
      if (i < words.length) {
        window.setTimeout(next, staggerMs)
      }
    }
    const t = window.setTimeout(next, initialDelayMs)
    return () => window.clearTimeout(t)
  }, [text, staggerMs, initialDelayMs, words.length])

  return (
    <span className={className} aria-label={text}>
      {words.map((word, idx) => {
        const revealed = idx < revealedCount
        return (
          <span
            key={idx}
            aria-hidden
            style={{
              display: 'inline-block',
              marginRight: idx < words.length - 1 ? '0.3em' : 0,
              opacity: revealed ? 1 : 0,
              filter: revealed ? 'blur(0px)' : 'blur(10px)',
              transform: revealed ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.45s cubic-bezier(.22,.8,.26,1), filter 0.45s cubic-bezier(.22,.8,.26,1), transform 0.45s cubic-bezier(.22,.8,.26,1)',
              willChange: 'opacity, filter, transform',
            }}
          >
            {word}
          </span>
        )
      })}
    </span>
  )
}
