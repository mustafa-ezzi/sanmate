import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type CutoutProductProps = {
  src: string
  alt: string
  className?: string
  /** Fraction of image height to crop from top (removes baked-in logo text) */
  cropTop?: number
  /** Fraction to crop from bottom */
  cropBottom?: number
  /** 1 = normal, <1 desaturates (e.g. 0.55) */
  saturate?: number
  /** 1 = normal, <1 darkens */
  brightness?: number
}

/**
 * Removes light studio background + top branding strip so only the product remains.
 */
export default function CutoutProduct({
  src,
  alt,
  className = '',
  cropTop = 0.28,
  cropBottom = 0.04,
  saturate = 1,
  brightness: brightMul = 1,
}: CutoutProductProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.decoding = 'async'
    img.src = src

    const run = () => {
      if (cancelled || !canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      const sy = Math.floor(img.height * cropTop)
      const sh = Math.floor(img.height * (1 - cropTop - cropBottom))
      const sx = Math.floor(img.width * 0.06)
      const sw = Math.floor(img.width * 0.88)

      const scale = 2
      canvas.width = sw * scale
      canvas.height = sh * scale
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

        // Near-white / light grey studio backdrop → transparent
        if (brightness > 218 && sat < 0.18) {
          d[i + 3] = 0
          continue
        }
        if (brightness > 195 && sat < 0.1) {
          d[i + 3] = Math.round(((brightness - 195) / 23) * 0) // kill soft grey
          continue
        }
        if (brightness > 180 && sat < 0.07) {
          d[i + 3] = Math.min(d[i + 3], Math.round((1 - (brightness - 180) / 40) * 180))
          continue
        }

        // Soft edge: semi-light pixels near backdrop
        if (brightness > 170 && sat < 0.12) {
          const t = (brightness - 170) / 50
          d[i + 3] = Math.round(d[i + 3] * (1 - t * 0.85))
        }

        // Tone / desaturate remaining product pixels
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

    if (img.complete) run()
    else img.onload = run

    return () => {
      cancelled = true
    }
  }, [src, cropTop, cropBottom, saturate, brightMul])

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      role="img"
      className={`${className} ${ready ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
    />
  )
}
