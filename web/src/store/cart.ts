import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../api/types'

export type CartLine = {
  slug: string
  name: string
  sku: string
  price: string
  image: string
  quantity: number
}

type CartState = {
  lines: CartLine[]
  add: (product: Product, qty?: number) => void
  remove: (slug: string) => void
  setQty: (slug: string, quantity: number) => void
  clear: () => void
  count: () => number
  subtotal: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (product, qty = 1) => {
        set((state) => {
          const existing = state.lines.find((l) => l.slug === product.slug)
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.slug === product.slug
                  ? { ...l, quantity: l.quantity + qty }
                  : l,
              ),
            }
          }
          return {
            lines: [
              ...state.lines,
              {
                slug: product.slug,
                name: product.name,
                sku: product.sku,
                price: product.effective_price,
                image: product.primary_image,
                quantity: qty,
              },
            ],
          }
        })
      },
      remove: (slug) =>
        set((state) => ({ lines: state.lines.filter((l) => l.slug !== slug) })),
      setQty: (slug, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.slug !== slug)
              : state.lines.map((l) =>
                  l.slug === slug ? { ...l, quantity } : l,
                ),
        })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: () =>
        get().lines.reduce((n, l) => n + Number(l.price) * l.quantity, 0),
    }),
    { name: 'sams-cart' },
  ),
)
