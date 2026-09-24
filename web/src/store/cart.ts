import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../api/types'

export type CartLine = {
  key: string
  slug: string
  name: string
  sku: string
  color: string
  price: string
  image: string
  quantity: number
}

function lineKey(slug: string, color = '') {
  return color ? `${slug}::${color}` : slug
}

type CartState = {
  lines: CartLine[]
  add: (product: Product, qty?: number, color?: string) => void
  remove: (key: string) => void
  setQty: (key: string, quantity: number) => void
  clear: () => void
  count: () => number
  subtotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (product, qty = 1, color = '') => {
        const key = lineKey(product.slug, color)
        const match = (product.colors || []).find((c) =>
          typeof c === 'string' ? c === color : c.name === color,
        )
        const imageFromColor =
          match && typeof match !== 'string' ? match.image_url || '' : ''
        set((state) => {
          const existing = state.lines.find((l) => l.key === key)
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.key === key ? { ...l, quantity: l.quantity + qty } : l,
              ),
            }
          }
          return {
            lines: [
              ...state.lines,
              {
                key,
                slug: product.slug,
                name: product.name,
                sku: product.sku,
                color,
                price: product.effective_price,
                image: imageFromColor || product.primary_image,
                quantity: qty,
              },
            ],
          }
        })
      },
      remove: (key) =>
        set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),
      setQty: (key, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.key !== key)
              : state.lines.map((l) =>
                  l.key === key ? { ...l, quantity } : l,
                ),
        })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: () =>
        get().lines.reduce((n, l) => n + Number(l.price) * l.quantity, 0),
    }),
    {
      name: 'sams-cart',
      version: 2,
      migrate: (persisted) => {
        const state = persisted as { lines?: CartLine[] } | undefined
        const lines = (state?.lines || []).map((l) => ({
          ...l,
          key: l.key || lineKey(l.slug, l.color || ''),
          color: l.color || '',
        }))
        return { lines }
      },
    },
  ),
)
