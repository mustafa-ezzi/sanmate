import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  TrendingUp,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import { adminApi, type DashboardSummary } from '../api'
import { formatPKR } from '../../lib/format'
import { Alert, PageHeader } from '../components/ui'

function BarChart({
  points,
  color = '#0f172a',
}: {
  points: { date: string; value: number }[]
  color?: string
}) {
  const max = Math.max(...points.map((p) => p.value), 1)
  return (
    <div className="flex h-40 items-end gap-0.5">
      {points.map((p) => (
        <div
          key={p.date}
          className="group relative flex-1 rounded-t-sm"
          style={{
            height: `${Math.max(4, (p.value / max) * 100)}%`,
            background: color,
            opacity: p.value ? 0.85 : 0.15,
          }}
          title={`${p.date}: ${p.value}`}
        />
      ))}
    </div>
  )
}

function LineChart({ points }: { points: { date: string; value: number }[] }) {
  const max = Math.max(...points.map((p) => p.value), 1)
  const w = 600
  const h = 160
  const step = points.length > 1 ? w / (points.length - 1) : w
  const coords = points
    .map((p, i) => {
      const x = i * step
      const y = h - (p.value / max) * (h - 12) - 6
      return `${x},${y}`
    })
    .join(' ')
  const area = `0,${h} ${coords} ${w},${h}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full">
      <polygon points={area} fill="#0f172a" opacity="0.08" />
      <polyline
        points={coords}
        fill="none"
        stroke="#0f172a"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
    adminApi
      .dashboard()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [])

  const statusMax = useMemo(() => {
    if (!data?.orders_by_status?.length) return 1
    return Math.max(...data.orders_by_status.map((s) => s.count), 1)
  }, [data])

  const cards = data
    ? [
        { label: 'Orders today', value: String(data.orders_today), icon: ShoppingBag },
        { label: 'Total orders', value: String(data.orders_total ?? 0), icon: ShoppingBag },
        { label: 'Paid sales', value: String(data.sales_count), icon: TrendingUp },
        { label: 'Revenue', value: formatPKR(data.revenue || 0), icon: Wallet },
        { label: 'Profit (est.)', value: formatPKR(data.profit_estimate || 0), icon: Wallet },
        { label: 'Products', value: String(data.products_count ?? 0), icon: Package },
        { label: 'Brands', value: String(data.categories_count ?? 0), icon: Tags },
        { label: 'Low stock', value: String(data.low_stock_products), icon: TriangleAlert },
      ]
    : []

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LayoutDashboard}
        eyebrow="Overview"
        title="Dashboard"
        subtitle="SAMS Enterprises overview — sales, revenue, catalogue health."
      />
      {error && <Alert>{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="admin-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {c.label}
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#171c4e]/10 text-[#171c4e]">
                <c.icon size={15} />
              </span>
            </div>
            <p className="font-display text-2xl font-extrabold tracking-[-0.04em] text-[#171c4e]">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {data && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="admin-card p-5">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-semibold">Revenue · 30 days</h2>
                <p className="text-xs text-slate-500">Paid orders only</p>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {formatPKR(data.revenue || 0)}
              </p>
            </div>
            <LineChart points={data.revenue_by_day || []} />
          </section>

          <section className="admin-card p-5">
            <div className="mb-3">
              <h2 className="font-semibold">Orders · 30 days</h2>
              <p className="text-xs text-slate-500">Paid order volume by day</p>
            </div>
            <BarChart points={data.orders_by_day || []} color="#334155" />
          </section>

          <section className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Orders by status</h2>
            <div className="space-y-3">
              {(data.orders_by_status || []).map((row) => (
                <div key={row.status}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="capitalize text-slate-600">
                      {row.status.replace(/_/g, ' ')}
                    </span>
                    <span className="font-medium">{row.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{
                        width: `${(row.count / statusMax) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {!data.orders_by_status?.length && (
                <p className="text-sm text-slate-500">No orders yet.</p>
              )}
            </div>
          </section>

          <section className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Top products</h2>
            <ul className="space-y-3">
              {(data.top_products || []).map((p) => (
                <li
                  key={`${p.sku}-${p.name}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      {p.units} sold · {p.sku}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold">
                    {formatPKR(p.revenue)}
                  </span>
                </li>
              ))}
              {!data.top_products?.length && (
                <p className="text-sm text-slate-500">No paid sales yet.</p>
              )}
            </ul>
          </section>
        </div>
      )}

      {data && (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="admin-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Recent orders</h2>
              <Link to="/admin/orders" className="admin-btn-edit">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <ul className="divide-y divide-slate-100">
              {(data.recent_orders || []).map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-3 py-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium">{o.order_number}</p>
                    <p className="text-xs text-slate-500">
                      {o.customer_name} · {o.payment_status}
                    </p>
                  </div>
                  <span className="font-semibold">{formatPKR(o.total)}</span>
                </li>
              ))}
              {!data.recent_orders?.length && (
                <p className="py-4 text-sm text-slate-500">No orders yet.</p>
              )}
            </ul>
          </section>

          <section className="admin-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Low stock</h2>
              <Link to="/admin/products" className="admin-btn-edit">
                Manage <ArrowRight size={14} />
              </Link>
            </div>
            <ul className="divide-y divide-slate-100">
              {(data.low_stock || []).map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 py-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.sku}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.stock <= 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.stock} left
                  </span>
                </li>
              ))}
              {!data.low_stock?.length && (
                <p className="py-4 text-sm text-slate-500">
                  All active products have healthy stock.
                </p>
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}
