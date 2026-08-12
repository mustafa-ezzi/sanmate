import { useEffect, useState } from 'react'
import { MessageCircle, ShoppingBag } from 'lucide-react'
import { adminApi, type AdminOrder } from '../api'
import { formatPKR } from '../../lib/format'
import { Alert, PageHeader } from '../components/ui'

const statuses = [
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]

export default function OrdersPage() {
  const [items, setItems] = useState<AdminOrder[]>([])
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  async function load() {
    setItems(await adminApi.orders.list())
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShoppingBag}
        eyebrow="Commerce"
        title="Orders"
        subtitle="Manage SAMS orders. Resend WhatsApp notifies all team numbers."
      />
      {error && <Alert>{error}</Alert>}
      {msg && <Alert tone={msg.startsWith('WhatsApp sent') ? 'ok' : 'warn'}>{msg}</Alert>}
      <div className="space-y-4">
        {items.map((order) => (
          <article key={order.id} className="admin-card p-5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-extrabold tracking-[-0.03em] text-[#171c4e]">
                  {order.order_number}
                </p>
                <p className="text-sm text-slate-500">
                  {order.customer_name} · {order.customer_phone}
                </p>
              </div>
              <p className="font-semibold text-[#171c4e]">
                {formatPKR(order.total)}
              </p>
            </div>
            <ul className="mb-4 text-sm text-slate-600">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.product_name} × {item.quantity}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="field max-w-[12rem]"
                value={order.status}
                onChange={async (e) => {
                  await adminApi.orders.update(order.id, {
                    status: e.target.value,
                  })
                  await load()
                }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              <span
                className={`admin-badge ${
                  order.payment_status === 'paid'
                    ? 'admin-badge-on'
                    : 'admin-badge-off'
                }`}
              >
                {order.payment_status}
              </span>
              {order.whatsapp_notified && (
                <span className="admin-badge admin-badge-on">WA sent</span>
              )}
              <button
                type="button"
                className="btn-secondary"
                onClick={async () => {
                  try {
                    const res = await adminApi.orders.resendWhatsapp(order.id)
                    if (!res.configured) {
                      setMsg(
                        `Not delivered — WhatsApp API is in stub mode. Add WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID to backend/.env, then restart Django. (${res.total_recipients} recipient(s) queued in logs)`,
                      )
                    } else if (res.sent > 0) {
                      setMsg(
                        `WhatsApp sent to ${res.sent}/${res.total_recipients} for ${order.order_number}`,
                      )
                    } else {
                      const fail =
                        res.recipients.find((r) => !r.success)?.detail ||
                        'All sends failed'
                      setMsg(`WhatsApp failed: ${fail}`)
                    }
                    await load()
                  } catch (e) {
                    setMsg(e instanceof Error ? e.message : 'Resend failed')
                  }
                }}
              >
                <MessageCircle size={15} /> Resend WhatsApp
              </button>
            </div>
          </article>
        ))}
        {!items.length && (
          <p className="text-sm text-slate-500">No orders yet.</p>
        )}
      </div>
    </div>
  )
}
