import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { api } from '../api/client'
import type { Product } from '../api/types'
import { formatPKR } from '../lib/format'
import { trackEvent } from '../lib/ga'
import { useCart } from '../store/cart'

export default function ProductDetailPage() {
  const { slug = '' } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [imgBroken, setImgBroken] = useState(false)
  const [added, setAdded] = useState(false)
  const add = useCart((s) => s.add)

  useEffect(() => {
    let cancelled = false
    setImgBroken(false)
    setError('')
    setProduct(null)
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

  return (
    <div className={`page-shell py-12 sm:py-16 brand-${tone}`}>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square overflow-hidden rounded-[1.75rem] bg-surface shadow-[0_20px_60px_rgba(17,17,17,0.08)]">
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
                add(product, qty)
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
