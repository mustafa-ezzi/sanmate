import * as XLSX from 'xlsx'

export type ImportProductRow = {
  key: string
  selected: boolean
  category: number
  categoryLabel: string
  name: string
  slug: string
  sku: string
  short_description: string
  description: string
  price: string
  sale_price: string
  cost_price: string
  stock: number
  image_url: string
  is_featured: boolean
  is_active: boolean
}

type CategoryLike = {
  id: number
  name: string
  slug: string
}

function norm(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '')
}

function cell(row: Record<string, unknown>, aliases: string[]): string {
  const keys = Object.keys(row)
  for (const alias of aliases) {
    const want = norm(alias)
    const found = keys.find((k) => norm(k) === want)
    if (found != null && row[found] != null && String(row[found]).trim() !== '') {
      return String(row[found]).trim()
    }
  }
  return ''
}

function toBool(value: string, fallback: boolean): boolean {
  if (!value) return fallback
  const v = value.toLowerCase()
  if (['1', 'true', 'yes', 'y'].includes(v)) return true
  if (['0', 'false', 'no', 'n'].includes(v)) return false
  return fallback
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function resolveCategory(
  label: string,
  categories: CategoryLike[],
  fallbackId: number,
): { id: number; label: string } {
  if (!label) {
    const fallback = categories.find((c) => c.id === fallbackId) || categories[0]
    return { id: fallback?.id || 0, label: fallback?.name || '' }
  }
  const n = norm(label)
  const match = categories.find(
    (c) => norm(c.name) === n || norm(c.slug) === n || String(c.id) === label.trim(),
  )
  if (match) return { id: match.id, label: match.name }
  const fallback = categories.find((c) => c.id === fallbackId) || categories[0]
  return { id: fallback?.id || 0, label: label }
}

export function parseProductXlsx(
  buffer: ArrayBuffer,
  categories: CategoryLike[],
  fallbackCategoryId = 0,
): ImportProductRow[] {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) return []
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
  })

  return rows
    .map((row, index) => {
      const name = cell(row, ['name', 'product', 'product name', 'title'])
      const sku = cell(row, ['sku', 'code', 'product sku', 'item code'])
      if (!name && !sku) return null

      const categoryRaw = cell(row, [
        'category',
        'brand',
        'brand name',
        'category name',
        'category slug',
      ])
      const resolved = resolveCategory(categoryRaw, categories, fallbackCategoryId)
      const slug =
        cell(row, ['slug']) ||
        slugify(name) ||
        slugify(sku) ||
        `product-${index + 1}`

      return {
        key: `row-${index}-${sku || name}`,
        selected: true,
        category: resolved.id,
        categoryLabel: resolved.label,
        name: name || sku,
        slug,
        sku: sku || slug,
        short_description: cell(row, [
          'short_description',
          'short description',
          'summary',
        ]),
        description: cell(row, ['description', 'details', 'long description']),
        price: cell(row, ['price', 'mrp', 'amount']) || '0',
        sale_price: cell(row, ['sale_price', 'sale price', 'sale']),
        cost_price: cell(row, ['cost_price', 'cost price', 'cost']),
        stock: Number(cell(row, ['stock', 'qty', 'quantity']) || 0) || 0,
        image_url: cell(row, [
          'image_url',
          'image',
          'image url',
          'photo',
          'photo url',
        ]),
        is_featured: toBool(
          cell(row, ['is_featured', 'featured']),
          false,
        ),
        is_active: toBool(cell(row, ['is_active', 'active']), true),
      } satisfies ImportProductRow
    })
    .filter((row): row is ImportProductRow => row != null)
}
