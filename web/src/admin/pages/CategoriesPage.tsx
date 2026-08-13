import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Plus, Tags, Trash2, X } from 'lucide-react'
import { adminApi, type AdminCategory } from '../api'
import ImageUploadField from '../components/ImageUploadField'
import { Alert, PageHeader } from '../components/ui'

const empty = {
  name: '',
  slug: '',
  description: '',
  logo_url: '',
  hero_image_url: '',
  sort_order: 0,
  is_active: true,
}

export default function CategoriesPage() {
  const [items, setItems] = useState<AdminCategory[]>([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [error, setError] = useState('')

  async function load() {
    setItems(await adminApi.categories.list())
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (editing) await adminApi.categories.update(editing, form)
      else await adminApi.categories.create(form)
      setForm(empty)
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Tags}
        eyebrow="Catalogue"
        title="Child brands"
        subtitle="Create child brands for SAMS (e.g. Sanmate, Wyped)."
      />

      <form onSubmit={onSubmit} className="admin-card grid gap-3 p-5 sm:grid-cols-2">
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
          className="field sm:col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <ImageUploadField
          label="Brand logo"
          shownOn="Shown on the brand page header and as the small thumbnail in this admin list."
          value={form.logo_url}
          onChange={(url) => setForm((f) => ({ ...f, logo_url: url }))}
        />
        <ImageUploadField
          label="Brand hero image"
          shownOn="Displayed on the homepage hero carousel, the brand collection card, and the top of the brand page (e.g. /brands/sanmate)."
          value={form.hero_image_url}
          onChange={(url) => setForm((f) => ({ ...f, hero_image_url: url }))}
        />
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
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button type="submit" className="btn">
            {editing ? <Pencil size={15} /> : <Plus size={15} />}
            {editing ? 'Update' : 'Create'} brand
          </button>
          {editing && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditing(null)
                setForm(empty)
              }}
            >
              <X size={15} /> Cancel
            </button>
          )}
        </div>
      </form>

      {error && <Alert>{error}</Alert>}

      <div className="admin-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                      {item.logo_url ? (
                        <img
                          src={item.logo_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="text-slate-500">{item.slug}</td>
                <td>
                  <span
                    className={`admin-badge ${item.is_active ? 'admin-badge-on' : 'admin-badge-off'}`}
                  >
                    {item.is_active ? 'Active' : 'Off'}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="admin-btn-edit"
                      onClick={() => {
                        setEditing(item.id)
                        setForm({
                          name: item.name,
                          slug: item.slug,
                          description: item.description,
                          logo_url: item.logo_url,
                          hero_image_url: item.hero_image_url,
                          sort_order: item.sort_order,
                          is_active: item.is_active,
                        })
                      }}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger"
                      onClick={async () => {
                        if (!confirm('Delete this brand?')) return
                        await adminApi.categories.remove(item.id)
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
