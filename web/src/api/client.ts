import type {
  Banner,
  Carousel,
  Category,
  Company,
  Order,
  OrderPayload,
  Paginated,
  Policy,
  Product,
} from './types'

const BASE = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')
export const COMPANY_SLUG = import.meta.env.VITE_COMPANY_SLUG || 'sams'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(detail || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let message = `Request failed: ${res.status}`
    try {
      const data = await res.json()
      message = JSON.stringify(data)
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

const c = () => `/${COMPANY_SLUG}`

export const api = {
  company: () => get<Company>(`${c()}/`),
  categories: () => get<Paginated<Category>>(`${c()}/categories/`),
  products: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params)}` : ''
    return get<Paginated<Product>>(`${c()}/products/${qs}`)
  },
  product: (slug: string) => get<Product>(`${c()}/products/${slug}/`),
  banners: () => get<Paginated<Banner>>(`${c()}/banners/`),
  carousel: (key: string) => get<Carousel>(`${c()}/carousels/${key}/`),
  policy: (type: string) => get<Policy>(`${c()}/policies/${type}/`),
  createOrder: (payload: OrderPayload) =>
    post<Order>(`${c()}/orders/`, payload),
  paysafeConfig: () =>
    get<{
      company: string
      env: string
      currency: string
      public_key: string
      account_id: string
      configured: boolean
      simulate_allowed: boolean
    }>(`${c()}/payments/paysafe/config/`),
  processPaysafePayment: (body: {
    order_number: string
    payment_handle_token: string
  }) =>
    post<{ status: string; payment_id?: string; order: Order }>(
      `${c()}/payments/paysafe/process/`,
      body,
    ),
  simulatePaysafePayment: (order_number: string) =>
    post<{ status: string; simulated: boolean; order: Order }>(
      `${c()}/payments/paysafe/simulate/`,
      { order_number },
    ),
}
