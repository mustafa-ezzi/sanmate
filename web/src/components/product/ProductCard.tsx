import { Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { Product } from '../../api/types'
import { formatPKR } from '../../lib/format'
import { normalizeColors } from '../../lib/colors'
import { useCart } from '../../store/cart'
import AnimatedContent from '../bits/AnimatedContent'
import GlareHover from '../bits/GlareHover'

type Props = {
  product: Product
  brandTone?: 'sanmate' | 'wyped' | 'house'
  rail?: boolean
}

const favKey = 'sams-favorites'

function readFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(favKey) || '[]') as string[]
  } catch {
    return []
  }
}

export default function ProductCard({
  product,
  brandTone = 'house',
  rail = false,
}: Props) {
  const add = useCart((s) => s.add)
  const [fav, setFav] = useState(() => readFavorites().includes(product.slug))
  const [added, setAdded] = useState(false)
  const colors = normalizeColors(product.colors)
  const hasColors = colors.length > 0
  const imgClass =
    brandTone === 'wyped'
      ? 'img-wyped'
      : brandTone === 'sanmate'
        ? 'img-sanmate'
        : ''

  const toggleFav = () => {
    const next = readFavorites()
    const exists = next.includes(product.slug)
    const updated = exists
      ? next.filter((s) => s !== product.slug)
      : [...next, product.slug]
    localStorage.setItem(favKey, JSON.stringify(updated))
    setFav(!exists)
  }

  const addToBag = () => {
    add(product, 1)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <AnimatedContent
      direction="vertical"
      distance={24}
      className={`group relative ${
        rail
          ? 'min-w-[78vw] snap-center sm:min-w-[18.5rem] lg:min-w-[20rem]'
          : ''
      }`}
    >
    <article className="h-full">
      <GlareHover className="relative overflow-hidden rounded-[1.5rem] bg-surface shadow-[0_14px_40px_rgba(17,17,17,0.06)]">
        <Link to={`/products/${product.slug}`} className="block aspect-[4/5]">
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.name}
              className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045] ${imgClass}`}
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#e8ecef] to-[#c5ced4] px-4 text-center font-display text-lg font-extrabold text-ink/40">
              {product.name}
            </div>
          )}
        </Link>

        <button
          type="button"
          aria-label={fav ? 'Remove favorite' : 'Add favorite'}
          onClick={toggleFav}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-ink shadow-sm backdrop-blur"
        >
          <Heart
            size={16}
            className={fav ? 'fill-accent text-accent' : ''}
          />
        </button>

        {product.sale_price && (
          <span className="font-mono-label absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-white">
            Sale
          </span>
        )}

        {hasColors ? (
          <Link
            to={`/products/${product.slug}`}
            className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-full bg-ink py-2.5 text-sm font-semibold text-white"
          >
            Choose colour
          </Link>
        ) : (
          <button
            type="button"
            onClick={addToBag}
            className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-full bg-ink py-2.5 text-sm font-semibold text-white opacity-100 transition sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
          >
            <Plus size={16} />
            {added ? 'Added to bag' : 'Add to bag'}
          </button>
        )}
      </GlareHover>

      <div className="mt-4 px-0.5">
        <p className="font-mono-label text-muted">{product.category_name}</p>
        <Link
          to={`/products/${product.slug}`}
          className="mt-1.5 block font-display text-lg font-bold leading-snug tracking-[-0.04em] text-ink"
        >
          {product.name}
        </Link>
        {hasColors && (
          <div className="mt-2.5">
            <p className="font-mono-label mb-1.5 text-muted">
              {colors.length} colour{colors.length === 1 ? '' : 's'}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {colors.slice(0, 6).map((c) => (
                <Link
                  key={c.name}
                  to={`/products/${product.slug}?color=${encodeURIComponent(c.name)}`}
                  title={c.name}
                  className="h-7 w-7 rounded-full border border-black/10 shadow-sm ring-1 ring-black/5 transition hover:scale-110"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {colors.length > 6 && (
                <span className="font-mono-label text-muted">
                  +{colors.length - 6}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono-label text-navy">
            {formatPKR(product.effective_price)}
          </span>
          {product.sale_price && (
            <span className="font-mono-label text-muted line-through">
              {formatPKR(product.price)}
            </span>
          )}
        </div>
      </div>
    </article>
    </AnimatedContent>
  )
}
