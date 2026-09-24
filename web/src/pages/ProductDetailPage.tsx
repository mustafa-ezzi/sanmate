import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { api } from '../api/client'
import type { Product } from '../api/types'
import { formatPKR } from '../lib/format'
import { normalizeColors } from '../lib/colors'
import { trackEvent } from '../lib/ga'
import { useCart } from '../store/cart'

export default function ProductDetailPage() {
  const { slug = '' } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [imgBroken, setImgBroken] = useState(false)
  const [added, setAdded] = useState(false)
  const [selectedColor, setSelectedColor] = useState('')
  const [colorError, setColorError] = useState('')
  const add = useCart((s) => s.add)

  useEffect(() => {
    let cancelled = false
    setImgBroken(false)
    setError('')
    setProduct(null)
    setSelectedColor('')
    setColorError('')
    api
      .product(slug)
      .then((p) => {
        if (!cancelled) {
          setProduct(p)
          trackEvent('view_item', {
            item_id: p.sku,
            item_name: p.name,
            value: Number(p.effective_price),
          })
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Not found')
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const colors = useMemo(
    () => normalizeColors(product?.colors),
    [product?.colors],
  )

  if (error) {
    return (
      <div className="page-shell py-16">
        <p className="mb-4 text-accent">{error}</p>
        <Link to="/products" className="btn-ghost">
          Back to shop
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page-shell py-16">
        <p className="text-muted">Loading product…</p>
      </div>
    )
  }

  const image = product.images?.[0]?.url || product.primary_image || ''
  const tone = product.category_slug === 'wyped' ? 'wyped' : 'sanmate'
  const selected = colors.find((c) => c.name === selectedColor)

  return (
    <div className={`page-shell py-12 sm:py-16 brand-${tone}`}>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-surface shadow-[0_20px_60px_rgba(17,17,17,0.08)]">
          {image && !imgBroken ? (
            <img
              src={image}
              alt={product.name}
              className={`h-full w-full object-cover ${
                tone === 'wyped' ? 'img-wyped' : 'img-sanmate'
              }`}
              onError={() => setImgBroken(true)}
            />
          ) : (
            <div className="grid h-full place-items-center p-8 text-center font-display text-2xl text-ink/25">
              {product.name}
            </div>
          )}
          {selected && (
            <div
              className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-35"
              style={{ backgroundColor: selected.hex }}
              aria-hidden
            />
          )}
          {selected && (
            <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              {selected.name}
            </span>
          )}
        </div>

        <div>
          <Link
            to={`/brands/${product.category_slug}`}
            className="font-mono-label text-[var(--brand-accent)]"
          >
            {product.category_name}
          </Link>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[.95] tracking-[-0.07em] text-ink">
            {product.name}
          </h1>
          <p className="mt-4 text-muted">{product.short_description}</p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-mono-label text-lg text-navy">
              {formatPKR(product.effective_price)}
            </span>
            {product.sale_price && (
              <span className="font-mono-label text-muted line-through">
                {formatPKR(product.price)}
              </span>
            )}
          </div>
          <p className="font-mono-label mt-4 text-muted">
            SKU {product.sku} ·{' '}
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {colors.length > 0 && (
            <div className="mt-8">
              <p className="font-mono-label text-muted">
                Color{selectedColor ? ` · ${selectedColor}` : ' · choose one'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {colors.map((c) => {
                  const active = selectedColor === c.name
                  return (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      aria-label={c.name}
                      aria-pressed={active}
                      onClick={() => {
                        setSelectedColor(c.name)
                        setColorError('')
                      }}
                      className={`group relative h-10 w-10 rounded-full border-2 transition ${
                        active
                          ? 'border-ink scale-110 shadow-[0_8px_20px_rgba(17,17,17,0.18)]'
                          : 'border-border hover:border-ink/40'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className="sr-only">{c.name}</span>
                    </button>
                  )
                })}
              </div>
              {colorError && (
                <p className="mt-2 text-sm text-accent">{colorError}</p>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border bg-surface">
              <button
                type="button"
                className="h-11 w-11"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button
                type="button"
                className="h-11 w-11"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="btn-primary"
              disabled={product.stock < 1}
              onClick={() => {
                if (colors.length > 0 && !selectedColor) {
                  setColorError('Please select a color')
                  return
                }
                add(product, qty, selectedColor)
                setAdded(true)
                trackEvent('add_to_cart', {
                  item_id: product.sku,
                  item_name: product.name,
                  value: Number(product.effective_price) * qty,
                  quantity: qty,
                })
                window.setTimeout(() => setAdded(false), 1600)
              }}
            >
              <ShoppingBag size={16} />
              {added ? 'Added to bag' : 'Add to bag'}
            </button>
            <Link to="/cart" className="btn-ghost">
              View bag
            </Link>
          </div>

          {product.description && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-bold tracking-[-0.04em]">
                Details
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-muted">
                {product.description}
              </p>
            </div>
          )}

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold tracking-[-0.04em]">
                Specs
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-2xl border border-border bg-surface p-4"
                  >
                    <dt className="font-mono-label text-muted">{k}</dt>
                    <dd className="mt-1 font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
