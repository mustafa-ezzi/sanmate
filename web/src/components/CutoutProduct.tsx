import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type CutoutProductProps = {
  src: string
  alt: string
  className?: string
  cropTop?: number
  cropBottom?: number
  cropSide?: number
  saturate?: number
  brightness?: number
  /** light = remove white studio bg; dark = remove black bg */
  bgMode?: 'light' | 'dark'
}

/**
 * Removes studio background so only the product remains.
 */
export default function CutoutProduct({
  src,
  alt,
  className = '',
  cropTop = 0.28,
  cropBottom = 0.04,
  cropSide = 0.06,
  saturate = 1,
  brightness: brightMul = 1,
  bgMode = 'light',
}: CutoutProductProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.decoding = 'async'
    img.src = src

    const onError = () => {
      console.error('Failed to load product image:', src)
    }

    const run = () => {
      if (cancelled || !canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      const sy = Math.floor(img.height * cropTop)
      const sh = Math.max(1, Math.floor(img.height * (1 - cropTop - cropBottom)))
      const sx = Math.floor(img.width * cropSide)
      const sw = Math.max(1, Math.floor(img.width * (1 - cropSide * 2)))

      const scale = 2
      canvas.width = sw * scale
      canvas.height = sh * scale
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const d = imageData.data

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i]
        const g = d[i + 1]
        const b = d[i + 2]
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const brightness = (r + g + b) / 3
        const sat = max === 0 ? 0 : (max - min) / max

        if (bgMode === 'dark') {
          // Near-black backdrop → transparent (keep white product)
          if (brightness < 28) {
            d[i + 3] = 0
            continue
          }
          if (brightness < 48) {
            d[i + 3] = Math.round(((brightness - 28) / 20) * 255)
            continue
          }
          if (brightness < 70 && sat < 0.12) {
            const t = (brightness - 48) / 22
            d[i + 3] = Math.round(d[i + 3] * (0.35 + t * 0.65))
          }
        } else {
          // Near-white / light grey studio backdrop → transparent
          if (brightness > 218 && sat < 0.18) {
            d[i + 3] = 0
            continue
          }
          if (brightness > 195 && sat < 0.1) {
            d[i + 3] = 0
            continue
          }
          if (brightness > 180 && sat < 0.07) {
            d[i + 3] = Math.min(d[i + 3], Math.round((1 - (brightness - 180) / 40) * 180))
            continue
          }
          if (brightness > 170 && sat < 0.12) {
            const t = (brightness - 170) / 50
            d[i + 3] = Math.round(d[i + 3] * (1 - t * 0.85))
          }
        }

        if (d[i + 3] > 0 && (saturate !== 1 || brightMul !== 1)) {
          let nr = r
          let ng = g
          let nb = b
          if (saturate !== 1) {
            const gray = 0.299 * nr + 0.587 * ng + 0.114 * nb
            nr = gray + (nr - gray) * saturate
            ng = gray + (ng - gray) * saturate
            nb = gray + (nb - gray) * saturate
          }
          if (brightMul !== 1) {
            nr *= brightMul
            ng *= brightMul
            nb *= brightMul
          }
          d[i] = Math.max(0, Math.min(255, Math.round(nr)))
          d[i + 1] = Math.max(0, Math.min(255, Math.round(ng)))
          d[i + 2] = Math.max(0, Math.min(255, Math.round(nb)))
        }
      }

      ctx.putImageData(imageData, 0, 0)
      setReady(true)
      ScrollTrigger.refresh()
    }

    img.onerror = onError
    if (img.complete && img.naturalWidth > 0) run()
    else img.onload = run

    return () => {
      cancelled = true
    }
  }, [src, cropTop, cropBottom, cropSide, saturate, brightMul, bgMode])

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      role="img"
      className={`${className} ${ready ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
    />
  )
}
