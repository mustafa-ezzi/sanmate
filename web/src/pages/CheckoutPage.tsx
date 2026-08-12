import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Order } from '../api/types'
import { formatPKR } from '../lib/format'
import { trackEvent } from '../lib/ga'
import { openPaysafeCheckout, toMinorUnits } from '../lib/paysafe'
import { useCart } from '../store/cart'

type PaysafeConfig = {
  configured: boolean
  simulate_allowed: boolean
  public_key: string
  env: string
  currency: string
}

export default function CheckoutPage() {
  const lines = useCart((s) => s.lines)
  const subtotal = useCart((s) => s.subtotal)
  const clear = useCart((s) => s.clear)
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)

  if (!lines.length && !order) {
    return (
      <div className="page-shell py-20 text-center">
        <p className="font-mono-label text-muted">Checkout</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.06em] text-ink">
          Nothing to checkout
        </h1>
        <Link to="/products" className="btn-primary mt-8 inline-flex">
          Shop products
        </Link>
      </div>
    )
  }

  if (order && order.payment_status === 'paid') {
    return (
      <div className="page-shell mx-auto max-w-xl py-16 text-center">
        <p className="font-mono-label text-accent mb-2">
          Payment successful
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-[-0.06em] text-ink sm:text-4xl">
          Thank you
        </h1>
        <p className="text-muted mb-2">
          Order <strong className="text-navy">{order.order_number}</strong> is paid.
        </p>
        <p className="text-sm text-muted mb-8">
          Total {formatPKR(order.total)}. The SAMS team was notified on WhatsApp.
        </p>
        <Link to="/products" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    )
  }

  async function payForOrder(created: Order, config: PaysafeConfig) {
    setPaying(true)
    setError('')
    try {
      if (config.configured && config.public_key) {
        const token = await openPaysafeCheckout({
          publicKey: config.public_key,
          amountMinor: toMinorUnits(created.total),
          currency: (config.currency || created.currency || 'PKR').toUpperCase(),
          environment:
            (config.env || 'test').toLowerCase() === 'live' ? 'LIVE' : 'TEST',
          merchantRefNum: created.order_number,
          description: `SAMS order ${created.order_number}`,
        })
        const paid = await api.processPaysafePayment({
          order_number: created.order_number,
          payment_handle_token: token,
        })
        clear()
        setOrder(paid.order)
        trackEvent('purchase', {
          transaction_id: paid.order.order_number,
          value: Number(paid.order.total),
          currency: paid.order.currency,
        })
      } else if (config.simulate_allowed) {
        const paid = await api.simulatePaysafePayment(created.order_number)
        clear()
        setOrder(paid.order)
        trackEvent('purchase', {
          transaction_id: paid.order.order_number,
          value: Number(paid.order.total),
          currency: paid.order.currency,
        })
      } else {
        setOrder(created)
        setError(
          'Paysafe keys are not configured. Add PAYSAFE_SAMS_* to backend .env',
        )
      }
    } catch (err) {
      setOrder(created)
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      trackEvent('begin_checkout', { value: subtotal() })
      const created = await api.createOrder({
        customer_name: String(fd.get('name') || ''),
        customer_email: String(fd.get('email') || ''),
        customer_phone: String(fd.get('phone') || ''),
        shipping_address: String(fd.get('address') || ''),
        city: String(fd.get('city') || ''),
        notes: String(fd.get('notes') || ''),
        items: lines.map((l) => ({
          product_slug: l.slug,
          quantity: l.quantity,
        })),
      })
      setOrder(created)
      const config = await api.paysafeConfig()
      await payForOrder(created, config)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  async function retryPayment() {
    if (!order) return
    const config = await api.paysafeConfig()
    await payForOrder(order, config)
  }

  return (
    <div className="page-shell pb-16">
      <h1 className="font-display text-3xl sm:text-4xl text-navy mb-2">
        Checkout
      </h1>
      <p className="text-muted mb-8">
        Place your order and pay securely with Paysafe. In local dev without
        keys, payment is simulated and WhatsApp alerts are logged for the team.
      </p>

      {order && order.payment_status !== 'paid' && (
        <div className="mb-6 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-navy">
          Order <strong>{order.order_number}</strong> created (
          {order.payment_status}). Complete payment to notify the team.
          <div className="mt-3">
            <button
              type="button"
              className="btn-primary"
              disabled={paying}
              onClick={() => void retryPayment()}
            >
              {paying ? 'Processing…' : 'Pay now'}
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <form onSubmit={onSubmit} className="space-y-4">
          {(
            [
              ['name', 'Full name', 'text', true],
              ['phone', 'Phone', 'tel', true],
              ['email', 'Email', 'email', false],
              ['city', 'City', 'text', false],
            ] as const
          ).map(([name, label, type, required]) => (
            <label key={name} className="block">
              <span className="text-sm font-medium text-navy">{label}</span>
              <input
                name={name}
                type={type}
                required={required}
                disabled={!!order}
                className="mt-1 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:border-navy/40 disabled:opacity-60"
              />
            </label>
          ))}
          <label className="block">
            <span className="text-sm font-medium text-navy">Shipping address</span>
            <textarea
              name="address"
              required
              rows={3}
              disabled={!!order}
              className="mt-1 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:border-navy/40 disabled:opacity-60"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-navy">Notes</span>
            <textarea
              name="notes"
              rows={2}
              disabled={!!order}
              className="mt-1 w-full rounded-2xl border border-border bg-white px-4 py-3 outline-none focus:border-navy/40 disabled:opacity-60"
            />
          </label>
          {error && (
            <p className="text-sm text-accent whitespace-pre-wrap">{error}</p>
          )}
          {!order && (
            <button type="submit" className="btn-primary" disabled={loading || paying}>
              {loading || paying ? 'Processing…' : 'Place order & pay'}
            </button>
          )}
        </form>

        <aside className="h-fit rounded-[1.5rem] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(17,17,17,0.06)]">
          <h2 className="font-display text-xl text-navy mb-4">Order</h2>
          <ul className="space-y-3 mb-4">
            {lines.map((l) => (
              <li key={l.slug} className="flex justify-between gap-3 text-sm">
                <span className="text-muted">
                  {l.name} × {l.quantity}
                </span>
                <span className="font-medium">
                  {formatPKR(Number(l.price) * l.quantity)}
                </span>
              </li>
            ))}
            {!lines.length && order && (
              <li className="text-sm text-muted">Order {order.order_number}</li>
            )}
          </ul>
          <div className="flex justify-between font-semibold text-navy pt-3 border-t border-border">
            <span>Total</span>
            <span>
              {formatPKR(lines.length ? subtotal() : Number(order?.total || 0))}
            </span>
          </div>
        </aside>
      </div>
    </div>
  )
}
