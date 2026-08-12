import { FileText, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { adminApi, type AdminPolicy } from '../api'
import { Alert, PageHeader } from '../components/ui'

const types = ['privacy', 'return', 'exchange', 'shipping', 'terms']

const empty = {
  policy_type: 'privacy',
  title: '',
  body: '',
  version: '1.0',
  is_published: true,
}

export default function PoliciesPage() {
  const [items, setItems] = useState<AdminPolicy[]>([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  async function load() {
    setItems(await adminApi.policies.list())
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  function resetForm() {
    setForm(empty)
    setEditing(null)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      if (editing) await adminApi.policies.update(editing, form)
      else await adminApi.policies.create(form)
      resetForm()
      setMsg(editing ? 'Policy updated.' : 'Policy created.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        eyebrow="CMS"
        title="Policies"
        subtitle="Dynamic CMS policies for SAMS storefront pages."
      />
      <form onSubmit={onSubmit} className="admin-card grid gap-3 p-5">
        <select
          className="field"
          value={form.policy_type}
          onChange={(e) =>
            setForm((f) => ({ ...f, policy_type: e.target.value }))
          }
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          className="field"
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <input
          className="field"
          placeholder="Version"
          value={form.version}
          onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
        />
        <textarea
          className="field"
          placeholder="Body"
          required
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) =>
              setForm((f) => ({ ...f, is_published: e.target.checked }))
            }
          />
          Published
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="btn">
            {editing ? <Pencil size={15} /> : <Plus size={15} />}
            {editing ? 'Update' : 'Create'} policy
          </button>
          {editing && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              <X size={15} /> Cancel
            </button>
          )}
        </div>
      </form>
      {error && <Alert>{error}</Alert>}
      {msg && <Alert tone="ok">{msg}</Alert>}
      <div className="admin-card divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-start justify-between gap-4 p-4"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs uppercase text-slate-500">
                {item.policy_type} · v{item.version}
                {item.is_published ? '' : ' · draft'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="admin-btn-edit"
                onClick={() => {
                  setEditing(item.id)
                  setForm({
                    policy_type: item.policy_type,
                    title: item.title,
                    body: item.body,
                    version: item.version,
                    is_published: item.is_published,
                  })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                type="button"
                className="admin-btn-danger"
                onClick={async () => {
                  if (!confirm(`Delete policy “${item.title}”?`)) return
                  await adminApi.policies.remove(item.id)
                  if (editing === item.id) resetForm()
                  await load()
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
        {!items.length && (
          <p className="p-4 text-sm text-slate-500">No policies yet.</p>
        )}
      </div>
    </div>
  )
}
