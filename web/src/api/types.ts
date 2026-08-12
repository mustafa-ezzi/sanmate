export type Company = {
  id: number
  name: string
  slug: string
  logo_url: string
  theme: { primary?: string; accent?: string }
  storefront_enabled: boolean
  settings: {
    currency: string
    contact_email: string
    ga_measurement_id: string
    shipping_notes: string
  }
}

export type Category = {
  id: number
  name: string
  slug: string
  logo_url: string
  hero_image_url: string
  description: string
  sort_order: number
}

export type ProductImage = {
  id: number
  url: string
  alt: string
  sort_order: number
}

export type Product = {
  id: number
  name: string
  slug: string
  sku: string
  short_description: string
  description?: string
  price: string
  sale_price: string | null
  effective_price: string
  stock: number
  is_featured: boolean
  category_slug: string
  category_name: string
  primary_image: string
  specs?: Record<string, string>
  images?: ProductImage[]
}

export type Banner = {
  id: number
  title: string
  subtitle: string
  image_url: string
  cta_label: string
  cta_link: string
  sort_order: number
}

export type CarouselSlide = {
  id: number
  image_url: string
  caption: string
  link: string
  sort_order: number
}

export type Carousel = {
  id: number
  key: string
  name: string
  slides: CarouselSlide[]
}

export type Policy = {
  id: number
  policy_type: string
  title: string
  body: string
  version: string
  updated_at: string
}

export type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type OrderPayload = {
  customer_name: string
  customer_email?: string
  customer_phone: string
  shipping_address: string
  city?: string
  notes?: string
  items: { product_slug: string; quantity: number }[]
}

export type Order = {
  id: number
  order_number: string
  status: string
  payment_status: string
  total: string
  currency: string
  items: {
    product_name: string
    sku: string
    quantity: number
    unit_price: string
    line_total: string
  }[]
}
