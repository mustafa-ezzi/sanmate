import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { formatPKR } from '../lib/format'
import { trackEvent } from '../lib/ga'
import { useCart } from '../store/cart'

export default function CartPage() {
  const lines = useCart((s) => s.lines)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)
  const subtotal = useCart((s) => s.subtotal)

  if (!lines.length) {
    return (
      <div className="page-shell py-20 text-center">
        <p className="font-mono-label text-muted">Bag</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.06em] text-ink sm:text-4xl">
          Your bag is empty
        </h1>
        <p className="mt-3 text-muted">
          Add products from the catalogue to continue.
        </p>
        <Link to="/products" className="btn-primary mt-8 inline-flex">
          Shop products
        </Link>
      </div>
    )
  }

  return (
    <div className="page-shell py-12 sm:py-16">
      <p className="font-mono-label text-muted">Bag</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.06em] text-ink sm:text-4xl">
        Your bag
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <ul className="space-y-4">
          {lines.map((line) => (
            <li
              key={line.slug}
              className="flex items-center gap-4 rounded-[1.5rem] border border-border bg-surface p-4"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-bg text-center text-xs text-muted">
                {line.image ? (
                  <img
                    src={line.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  line.name
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/products/${line.slug}`}
                  className="block truncate font-display text-lg font-bold tracking-[-0.04em] text-ink"
                >
                  {line.name}
                </Link>
                <p className="font-mono-label mt-1 text-muted">
                  {formatPKR(line.price)}
                </p>
                <div className="mt-2 inline-flex items-center rounded-full border border-border bg-bg">
                  <button
                    type="button"
                    className="h-9 w-9"
                    aria-label="Decrease"
                    onClick={() => setQty(line.slug, line.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm font-semibold">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    className="h-9 w-9"
                    aria-label="Increase"
                    onClick={() => setQty(line.slug, line.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-navy">
                  {formatPKR(Number(line.price) * line.quantity)}
                </p>
                <button
                  type="button"
                  className="mt-2 text-muted hover:text-accent"
                  onClick={() => remove(line.slug)}
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit sticky top-28 rounded-[1.5rem] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(17,17,17,0.06)]">
          <h2 className="font-display text-xl font-bold tracking-[-0.04em]">
            Summary
          </h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-semibold">{formatPKR(subtotal())}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-muted">Shipping</span>
            <span className="font-semibold">Calculated later</span>
          </div>
          <Link
            to="/checkout"
            className="btn-primary mt-6 w-full"
            onClick={() =>
              trackEvent('begin_checkout', { value: subtotal() })
            }
          >
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  )
}
