import { useEffect, useState, type FormEvent } from 'react'
import { Package, Pencil, Plus, Trash2, X } from 'lucide-react'
import { adminApi, type AdminCategory, type AdminProduct } from '../api'
import { formatPKR } from '../../lib/format'
import ImageUploadField from '../components/ImageUploadField'
import { Alert, PageHeader } from '../components/ui'

const empty = {
  category: 0,
  name: '',
  slug: '',
  sku: '',
  short_description: '',
  description: '',
  price: '0',
  sale_price: '',
  cost_price: '',
  stock: 0,
  is_featured: false,
  is_active: true,
  image_url: '',
}

export default function ProductsAdminPage() {
  const [items, setItems] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [error, setError] = useState('')

  async function load() {
    const [products, cats] = await Promise.all([
      adminApi.products.list(),
      adminApi.categories.list(),
    ])
    setItems(products)
    setCategories(cats)
    if (!form.category && cats[0]) {
      setForm((f) => ({ ...f, category: cats[0].id }))
    }
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const payload: Partial<AdminProduct> = {
      category: form.category,
      name: form.name,
      slug: form.slug,
      sku: form.sku,
      short_description: form.short_description,
      description: form.description,
      price: form.price,
      sale_price: form.sale_price || null,
      cost_price: form.cost_price || null,
      stock: Number(form.stock),
      is_featured: form.is_featured,
      is_active: form.is_active,
      specs: {},
      images: form.image_url
        ? [{ url: form.image_url, alt: form.name, sort_order: 0 }]
        : [],
    }
    try {
      if (editing) await adminApi.products.update(editing, payload)
      else await adminApi.products.create(payload)
      setForm({ ...empty, category: categories[0]?.id || 0 })
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Package}
        eyebrow="Catalogue"
        title="Products"
        subtitle="SAMS catalogue. Upload images — the public URL is stored in the database."
      />

      {!categories.length && (
        <Alert tone="warn">Create a child brand first before adding products.</Alert>
      )}

      <form
        onSubmit={onSubmit}
        className="admin-card grid gap-3 p-5 sm:grid-cols-2"
      >
        <select
          className="field"
          value={form.category}
          onChange={(e) =>
            setForm((f) => ({ ...f, category: Number(e.target.value) }))
          }
          required
        >
          <option value={0} disabled>
            Select brand
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          className="field"
          placeholder="SKU"
          required
          value={form.sku}
          onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
        />
        <input
          className="field"
          placeholder="Name"
          required
          value={form.name}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              name: e.target.value,
              slug: editing
                ? f.slug
                : e.target.value.toLowerCase().replace(/\s+/g, '-'),
            }))
          }
        />
        <input
          className="field"
          placeholder="Slug"
          required
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
        />
        <input
          className="field"
          placeholder="Price (PKR)"
          required
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        />
        <input
          className="field"
          placeholder="Sale price"
          value={form.sale_price}
          onChange={(e) =>
            setForm((f) => ({ ...f, sale_price: e.target.value }))
          }
        />
        <input
          className="field"
          placeholder="Cost price (profit)"
          value={form.cost_price}
          onChange={(e) =>
            setForm((f) => ({ ...f, cost_price: e.target.value }))
          }
        />
        <input
          className="field"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm((f) => ({ ...f, stock: Number(e.target.value) }))
          }
        />
        <input
          className="field sm:col-span-2"
          placeholder="Short description"
          value={form.short_description}
          onChange={(e) =>
            setForm((f) => ({ ...f, short_description: e.target.value }))
          }
        />
        <ImageUploadField
          label="Product photo"
          shownOn="Displayed on the product card (shop, homepage rail, brand pages) and as the main image on the product detail page."
          value={form.image_url}
          onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_featured: e.target.checked }))
            }
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_active: e.target.checked }))
            }
          />
          Active
        </label>
        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" className="btn" disabled={!categories.length}>
            {editing ? <Pencil size={15} /> : <Plus size={15} />}
            {editing ? 'Update' : 'Create'} product
          </button>
          {editing && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditing(null)
                setForm({ ...empty, category: categories[0]?.id || 0 })
              }}
            >
              <X size={15} /> Cancel
            </button>
          )}
        </div>
      </form>

      {error && <Alert>{error}</Alert>}

      <div className="admin-card overflow-x-auto">
        <table className="admin-table min-w-[640px]">
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                      {item.images?.[0]?.url ? (
                        <img
                          src={item.images[0].url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.sku}</p>
                    </div>
                  </div>
                </td>
                <td>{item.category_name}</td>
                <td>{formatPKR(item.sale_price || item.price)}</td>
                <td>{item.stock}</td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="admin-btn-edit"
                    onClick={() => {
                      setEditing(item.id)
                      setForm({
                        category: item.category,
                        name: item.name,
                        slug: item.slug,
                        sku: item.sku,
                        short_description: item.short_description,
                        description: item.description,
                        price: item.price,
                        sale_price: item.sale_price || '',
                        cost_price: item.cost_price || '',
                        stock: item.stock,
                        is_featured: item.is_featured,
                        is_active: item.is_active,
                        image_url: item.images?.[0]?.url || '',
                      })
                    }}
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    className="admin-btn-danger"
                    onClick={async () => {
                      if (!confirm('Delete product?')) return
                      await adminApi.products.remove(item.id)
                      await load()
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
