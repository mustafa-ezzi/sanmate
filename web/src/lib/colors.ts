export type ProductColor = {
  name: string
  hex: string
}

const NAMED_HEX: Record<string, string> = {
  black: '#111111',
  white: '#f5f5f5',
  chrome: '#c0c0c0',
  silver: '#b0b0b0',
  grey: '#6b7280',
  gray: '#6b7280',
  charcoal: '#36454f',
  navy: '#171c4e',
  blue: '#2563eb',
  red: '#dc2626',
  coral: '#e8601c',
  orange: '#ea580c',
  green: '#16a34a',
  beige: '#d6cfc4',
  gold: '#c9a227',
  brown: '#7c4a2d',
  pink: '#ec4899',
  yellow: '#eab308',
  purple: '#7c3aed',
}

function fallbackHex(name: string): string {
  const key = name.trim().toLowerCase()
  if (NAMED_HEX[key]) return NAMED_HEX[key]
  // Stable pastel from name hash
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  const h = hash % 360
  return `hsl(${h} 42% 55%)`
}

/** Parse "Black, White" or "Black:#111, Coral:#E8601C" into color options. */
export function parseColorsInput(raw: string): ProductColor[] {
  return raw
    .split(/[,|;]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [namePart, hexPart] = part.split(':').map((s) => s.trim())
      const name = namePart || part
      const hex =
        hexPart && /^#?[0-9a-fA-F]{3,8}$/.test(hexPart)
          ? hexPart.startsWith('#')
            ? hexPart
            : `#${hexPart}`
          : fallbackHex(name)
      return { name, hex }
    })
}

export function colorsToInput(colors: ProductColor[] | undefined | null): string {
  if (!colors?.length) return ''
  return colors
    .map((c) => {
      const known = NAMED_HEX[c.name.trim().toLowerCase()]
      if (known && known.toLowerCase() === c.hex.toLowerCase()) return c.name
      return `${c.name}:${c.hex}`
    })
    .join(', ')
}

export function normalizeColors(raw: unknown): ProductColor[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (typeof item === 'string') {
        const name = item.trim()
        return name ? { name, hex: fallbackHex(name) } : null
      }
      if (item && typeof item === 'object') {
        const name = String((item as { name?: string }).name || '').trim()
        if (!name) return null
        const hexRaw = String((item as { hex?: string }).hex || '').trim()
        const hex =
          hexRaw && /^#?[0-9a-fA-F]{3,8}$/.test(hexRaw)
            ? hexRaw.startsWith('#')
              ? hexRaw
              : `#${hexRaw}`
            : fallbackHex(name)
        return { name, hex }
      }
      return null
    })
    .filter((c): c is ProductColor => c != null)
}
