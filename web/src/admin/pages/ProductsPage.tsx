import { useEffect, useRef, useState, type FormEvent } from 'react'
import { FileSpreadsheet, Package, Pencil, Plus, Trash2, Upload, X } from 'lucide-react'
import { adminApi, type AdminCategory, type AdminProduct } from '../api'
import { formatPKR } from '../../lib/format'
import ImageUploadField from '../components/ImageUploadField'
import { Alert, PageHeader } from '../components/ui'
import {
  parseProductXlsx,
  type ImportProductRow,
} from '../lib/parseProductXlsx'

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
  const [importRows, setImportRows] = useState<ImportProductRow[]>([])
  const [importFileName, setImportFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const [importStatus, setImportStatus] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  function toPayload(row: {
    category: number
    name: string
    slug: string
    sku: string
    short_description: string
    description: string
    price: string
    sale_price: string
    cost_price: string
    stock: number
    is_featured: boolean
    is_active: boolean
    image_url?: string
  }): Partial<AdminProduct> {
    return {
      category: row.category,
      name: row.name,
      slug: row.slug,
      sku: row.sku,
      short_description: row.short_description,
      description: row.description,
      price: row.price,
      sale_price: row.sale_price || null,
      cost_price: row.cost_price || null,
      stock: Number(row.stock),
      is_featured: row.is_featured,
      is_active: row.is_active,
      specs: {},
      images: row.image_url
        ? [{ url: row.image_url, alt: row.name, sort_order: 0 }]
        : [],
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const payload = toPayload(form)
      if (editing) await adminApi.products.update(editing, payload)
      else await adminApi.products.create(payload)
      setForm({ ...empty, category: categories[0]?.id || 0 })
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  async function onImportFile(file: File | null) {
    if (!file) return
    setError('')
    setImportStatus('')
    try {
      const buffer = await file.arrayBuffer()
      const rows = parseProductXlsx(
        buffer,
        categories,
        categories[0]?.id || 0,
      )
      if (!rows.length) {
        setImportRows([])
        setImportFileName('')
        setError('No product rows found in that spreadsheet.')
        return
      }
      setImportRows(rows)
      setImportFileName(file.name)
    } catch (err) {
      setImportRows([])
      setImportFileName('')
      setError(
        err instanceof Error
          ? err.message
          : 'Could not read that XLSX file.',
      )
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function updateImportRow(
    key: string,
    patch: Partial<ImportProductRow>,
  ) {
    setImportRows((rows) =>
      rows.map((row) => {
        if (row.key !== key) return row
        const next = { ...row, ...patch }
        if (patch.category != null) {
          const cat = categories.find((c) => c.id === patch.category)
          next.categoryLabel = cat?.name || next.categoryLabel
        }
        return next
      }),
    )
  }

  async function addAllImported() {
    if (!importRows.length) return
    setImporting(true)
    setError('')
    setImportStatus('')
    let created = 0
    const failures: string[] = []

    for (const [index, row] of importRows.entries()) {
      if (!row.name.trim() || !row.sku.trim() || !row.category) {
        failures.push(`Row ${index + 1}: name, SKU, and brand are required`)
        continue
      }
      try {
        await adminApi.products.create(toPayload(row))
        created += 1
        setImportStatus(`Adding products… ${created}/${importRows.length}`)
      } catch (err) {
        failures.push(
          `Row ${index + 1} (${row.sku || row.name}): ${
            err instanceof Error ? err.message : 'failed'
          }`,
        )
      }
    }

    setImporting(false)
    await load()

    if (failures.length) {
      setError(
        `Added ${created} of ${importRows.length}. ${failures.slice(0, 5).join(' · ')}${
          failures.length > 5 ? ` · +${failures.length - 5} more` : ''
        }`,
      )
      setImportStatus('')
      return
    }

    setImportStatus(`Added ${created} products successfully.`)
    setImportRows([])
    setImportFileName('')
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

      <section className="admin-card space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 font-semibold text-[#171c4e]">
              <FileSpreadsheet size={16} />
              Import products from XLSX
            </div>
            <p className="text-sm text-slate-500">
              Upload a spreadsheet, review/edit every field in the table, then
              add all products at once. Accepted headers: name, sku, brand /
              category, price, sale_price, cost_price, stock, slug,
              short_description, description, image_url, featured, active.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => onImportFile(e.target.files?.[0] || null)}
            />
            <button
              type="button"
              className="btn-secondary"
              disabled={!categories.length || importing}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={15} />
              {importFileName ? 'Replace file' : 'Choose XLSX'}
            </button>
            {importRows.length > 0 && (
              <>
                <button
                  type="button"
                  className="btn"
                  disabled={importing || !categories.length}
                  onClick={addAllImported}
                >
                  <Plus size={15} />
                  {importing
                    ? 'Adding…'
                    : `Add all ${importRows.length} products`}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={importing}
                  onClick={() => {
                    setImportRows([])
                    setImportFileName('')
                    setImportStatus('')
                  }}
                >
                  <X size={15} /> Clear
                </button>
              </>
            )}
          </div>
        </div>

        {importFileName && (
          <p className="text-xs text-slate-500">
            Scanned <span className="font-medium text-slate-700">{importFileName}</span>
            {importRows.length ? ` · ${importRows.length} rows` : ''}
          </p>
        )}

        {importStatus && <Alert tone="ok">{importStatus}</Alert>}

        {importRows.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="admin-table min-w-[1100px]">
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Slug</th>
                  <th>Price</th>
                  <th>Sale</th>
                  <th>Cost</th>
                  <th>Stock</th>
                  <th>Short description</th>
                  <th>Image URL</th>
                  <th>Flags</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {importRows.map((row) => (
                  <tr key={row.key}>
                    <td>
                      <select
                        className="field min-w-[8rem]"
                        value={row.category}
                        onChange={(e) =>
                          updateImportRow(row.key, {
                            category: Number(e.target.value),
                          })
                        }
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="field min-w-[9rem]"
                        value={row.name}
                        onChange={(e) =>
                          updateImportRow(row.key, { name: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="field min-w-[7rem]"
                        value={row.sku}
                        onChange={(e) =>
                          updateImportRow(row.key, { sku: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="field min-w-[8rem]"
                        value={row.slug}
                        onChange={(e) =>
                          updateImportRow(row.key, { slug: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="field min-w-[5.5rem]"
                        value={row.price}
                        onChange={(e) =>
                          updateImportRow(row.key, { price: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="field min-w-[5.5rem]"
                        value={row.sale_price}
                        onChange={(e) =>
                          updateImportRow(row.key, {
                            sale_price: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="field min-w-[5.5rem]"
                        value={row.cost_price}
                        onChange={(e) =>
                          updateImportRow(row.key, {
                            cost_price: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="field min-w-[4.5rem]"
                        type="number"
                        value={row.stock}
                        onChange={(e) =>
                          updateImportRow(row.key, {
                            stock: Number(e.target.value),
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="field min-w-[10rem]"
                        value={row.short_description}
                        onChange={(e) =>
                          updateImportRow(row.key, {
                            short_description: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="field min-w-[10rem]"
                        value={row.image_url}
                        onChange={(e) =>
                          updateImportRow(row.key, {
                            image_url: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 text-xs">
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={row.is_featured}
                            onChange={(e) =>
                              updateImportRow(row.key, {
                                is_featured: e.target.checked,
                              })
                            }
                          />
                          Featured
                        </label>
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={row.is_active}
                            onChange={(e) =>
                              updateImportRow(row.key, {
                                is_active: e.target.checked,
                              })
                            }
                          />
                          Active
                        </label>
                      </div>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="admin-btn-danger"
                        disabled={importing}
                        onClick={() =>
                          setImportRows((rows) =>
                            rows.filter((r) => r.key !== row.key),
                          )
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

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
