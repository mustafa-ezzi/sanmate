export type ProductColor = {
  name: string
  hex: string
  image_url?: string
}

export const PREDEFINED_COLORS: ProductColor[] = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#f5f5f5' },
  { name: 'Chrome', hex: '#c0c0c0' },
  { name: 'Silver', hex: '#b0b0b0' },
  { name: 'Grey', hex: '#6b7280' },
  { name: 'Charcoal', hex: '#36454f' },
  { name: 'Navy', hex: '#171c4e' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Coral', hex: '#e8601c' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Beige', hex: '#d6cfc4' },
  { name: 'Gold', hex: '#c9a227' },
  { name: 'Brown', hex: '#7c4a2d' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#7c3aed' },
]

const NAMED_HEX: Record<string, string> = Object.fromEntries(
  PREDEFINED_COLORS.map((c) => [c.name.toLowerCase(), c.hex]),
)

function fallbackHex(name: string): string {
  const key = name.trim().toLowerCase()
  if (NAMED_HEX[key]) return NAMED_HEX[key]
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  const h = hash % 360
  return `hsl(${h} 42% 55%)`
}

function resolvePreset(name: string): ProductColor {
  const found = PREDEFINED_COLORS.find(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase(),
  )
  if (found) return { ...found }
  return { name: name.trim(), hex: fallbackHex(name) }
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
      const preset = resolvePreset(name)
      const hex =
        hexPart && /^#?[0-9a-fA-F]{3,8}$/.test(hexPart)
          ? hexPart.startsWith('#')
            ? hexPart
            : `#${hexPart}`
          : preset.hex
      return { name: preset.name, hex, image_url: '' }
    })
}

export function colorsToInput(colors: ProductColor[] | undefined | null): string {
  if (!colors?.length) return ''
  return colors.map((c) => c.name).join(', ')
}

export function normalizeColors(raw: unknown): ProductColor[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (typeof item === 'string') {
        const name = item.trim()
        return name ? { ...resolvePreset(name), image_url: '' } : null
      }
      if (item && typeof item === 'object') {
        const name = String((item as { name?: string }).name || '').trim()
        if (!name) return null
        const preset = resolvePreset(name)
        const hexRaw = String((item as { hex?: string }).hex || '').trim()
        const hex =
          hexRaw && /^#?[0-9a-fA-F]{3,8}$/.test(hexRaw)
            ? hexRaw.startsWith('#')
              ? hexRaw
              : `#${hexRaw}`
            : preset.hex
        const image_url = String(
          (item as { image_url?: string }).image_url || '',
        ).trim()
        return { name: preset.name, hex, image_url }
      }
      return null
    })
    .filter((c): c is ProductColor => c != null)
}
