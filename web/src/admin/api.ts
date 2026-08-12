const BASE = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

const TOKEN_KEY = 'sams-admin-token'
const COMPANY_KEY = 'sams-admin-company'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getCompanySlug() {
  return localStorage.getItem(COMPANY_KEY) || 'sams'
}

export function setCompanySlug(slug: string) {
  localStorage.setItem(COMPANY_KEY, slug)
}

async function request<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {},
): Promise<T> {
  const { skipAuth, ...init } = options
  const headers = new Headers(init.headers || {})
  const isFormData =
    typeof FormData !== 'undefined' && init.body instanceof FormData
  if (!isFormData && !headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (!skipAuth && token) headers.set('Authorization', `Token ${token}`)
  headers.set('X-Company-Slug', 'sams')

  const res = await fetch(`${BASE}/admin${path}`, {
    ...init,
    headers,
  })
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = await res.json()
      message = data.detail || JSON.stringify(data)
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export type AdminUser = {
  id: number
  username: string
  email: string
  role: string
}

export type AdminCompany = {
  id: number
  name: string
  slug: string
  logo_url: string
  storefront_enabled: boolean
  theme: Record<string, string>
  settings?: {
    currency: string
    contact_email: string
    ga_measurement_id: string
  }
}

export type DashboardSummary = {
  company: string
  currency: string
  orders_today: number
  orders_total?: number
  sales_count: number
  revenue: number | string
  profit_estimate: number
  low_stock_products: number
  products_count?: number
  categories_count?: number
  orders_by_status: { status: string; count: number }[]
  revenue_by_day?: { date: string; value: number }[]
  orders_by_day?: { date: string; value: number }[]
  top_products?: {
    name: string
    sku: string
    units: number
    revenue: number
  }[]
  recent_orders?: {
    id: number
    order_number: string
    customer_name: string
    status: string
    payment_status: string
    total: string
    created_at: string
  }[]
  low_stock?: {
    id: number
    name: string
    sku: string
    stock: number
  }[]
}

export const adminApi = {
  login: (username: string, password: string) =>
    request<{
      token: string
      user: AdminUser
      active_company: AdminCompany | null
    }>('/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      skipAuth: true,
    }),
  logout: () => request('/logout/', { method: 'POST' }),
  me: () =>
    request<{ user: AdminUser; active_company: AdminCompany | null }>('/me/'),
  companies: () => request<AdminCompany[]>('/companies/'),
  setContext: (company_slug: string) =>
    request<{ active_company: AdminCompany }>('/context/', {
      method: 'POST',
      body: JSON.stringify({ company_slug }),
    }),
  dashboard: () => request<DashboardSummary>('/dashboard/summary/'),
  categories: {
    list: () => request<AdminCategory[]>('/categories/'),
    create: (body: Partial<AdminCategory>) =>
      request<AdminCategory>('/categories/', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: number, body: Partial<AdminCategory>) =>
      request<AdminCategory>(`/categories/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    remove: (id: number) =>
      request(`/categories/${id}/`, { method: 'DELETE' }),
  },
  products: {
    list: () => request<AdminProduct[]>('/products/'),
    create: (body: Partial<AdminProduct>) =>
      request<AdminProduct>('/products/', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: number, body: Partial<AdminProduct>) =>
      request<AdminProduct>(`/products/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    remove: (id: number) =>
      request(`/products/${id}/`, { method: 'DELETE' }),
  },
  banners: {
    list: () => request<AdminBanner[]>('/banners/'),
    create: (body: Partial<AdminBanner>) =>
      request<AdminBanner>('/banners/', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: number, body: Partial<AdminBanner>) =>
      request<AdminBanner>(`/banners/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    remove: (id: number) =>
      request(`/banners/${id}/`, { method: 'DELETE' }),
  },
  carousels: {
    list: () => request<AdminCarousel[]>('/carousels/'),
    create: (body: Partial<AdminCarousel>) =>
      request<AdminCarousel>('/carousels/', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: number, body: Partial<AdminCarousel>) =>
      request<AdminCarousel>(`/carousels/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    remove: (id: number) =>
      request(`/carousels/${id}/`, { method: 'DELETE' }),
  },
  policies: {
    list: () => request<AdminPolicy[]>('/policies/'),
    create: (body: Partial<AdminPolicy>) =>
      request<AdminPolicy>('/policies/', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: number, body: Partial<AdminPolicy>) =>
      request<AdminPolicy>(`/policies/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    remove: (id: number) =>
      request(`/policies/${id}/`, { method: 'DELETE' }),
  },
  orders: {
    list: () => request<AdminOrder[]>('/orders/'),
    update: (id: number, body: Partial<AdminOrder>) =>
      request<AdminOrder>(`/orders/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    resendWhatsapp: (id: number) =>
      request<{
        sent: number
        total_recipients: number
        configured: boolean
        template: string | null
        hint?: string | null
        recipients: {
          label: string
          phone: string
          success: boolean
          stub?: boolean
          detail?: string
        }[]
      }>(`/orders/${id}/resend-whatsapp/`, { method: 'POST' }),
  },
  settings: {
    get: () => request<AdminSettings>('/settings/'),
    update: (body: Partial<AdminSettings>) =>
      request<AdminSettings>('/settings/', {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
  },
  whatsapp: {
    list: () => request<WhatsAppRecipient[]>('/whatsapp-recipients/'),
    create: (body: Partial<WhatsAppRecipient>) =>
      request<WhatsAppRecipient>('/whatsapp-recipients/', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (id: number, body: Partial<WhatsAppRecipient>) =>
      request<WhatsAppRecipient>(`/whatsapp-recipients/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    remove: (id: number) =>
      request(`/whatsapp-recipients/${id}/`, { method: 'DELETE' }),
  },
  uploadImage: async (file: File) => {
    const body = new FormData()
    body.append('file', file)
    return request<{ url: string; path: string; company: string }>(
      '/media/upload/',
      { method: 'POST', body },
    )
  },
}

export type AdminCategory = {
  id: number
  name: string
  slug: string
  logo_url: string
  hero_image_url: string
  description: string
  sort_order: number
  is_active: boolean
}

export type AdminProduct = {
  id: number
  category: number
  category_name?: string
  name: string
  slug: string
  sku: string
  short_description: string
  description: string
  price: string
  sale_price: string | null
  cost_price: string | null
  stock: number
  specs: Record<string, string>
  is_featured: boolean
  is_active: boolean
  images?: { url: string; alt?: string; sort_order?: number }[]
}

export type AdminBanner = {
  id: number
  title: string
  subtitle: string
  image_url: string
  cta_label: string
  cta_link: string
  sort_order: number
  is_active: boolean
}

export type AdminCarouselSlide = {
  id?: number
  image_url: string
  caption: string
  link: string
  sort_order: number
  is_active: boolean
}

export type AdminCarousel = {
  id: number
  key: string
  name: string
  slides: AdminCarouselSlide[]
}

export type AdminPolicy = {
  id: number
  policy_type: string
  title: string
  body: string
  version: string
  is_published: boolean
}

export type AdminOrder = {
  id: number
  order_number: string
  status: string
  payment_status: string
  customer_name: string
  customer_phone: string
  customer_email: string
  shipping_address: string
  city: string
  currency: string
  total: string
  whatsapp_notified: boolean
  items: {
    product_name: string
    quantity: number
    unit_price: string
    line_total: string
  }[]
  created_at: string
}

export type AdminSettings = {
  company_name: string
  company_slug: string
  currency: string
  contact_email: string
  ga_measurement_id: string
  paysafe_account_id: string
  paysafe_public_key_hint: string
  shipping_notes: string
  storefront_enabled: boolean
  whatsapp?: {
    configured: boolean
    template_name: string
    phone_number_id_set: boolean
    token_set: boolean
  }
  media?: {
    r2_configured: boolean
    public_base_url: string
    bucket: string
  }
}

export type WhatsAppRecipient = {
  id: number
  label: string
  phone: string
  is_active: boolean
  sort_order: number
}
