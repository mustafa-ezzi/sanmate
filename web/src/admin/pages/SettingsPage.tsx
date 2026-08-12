import { Cloud, Plus, Save, Settings, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import {
  adminApi,
  type AdminSettings,
  type WhatsAppRecipient,
} from '../api'
import { Alert, PageHeader } from '../components/ui'

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [recipients, setRecipients] = useState<WhatsAppRecipient[]>([])
  const [label, setLabel] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')

  async function load() {
    const [s, w] = await Promise.all([
      adminApi.settings.get(),
      adminApi.whatsapp.list(),
    ])
    setSettings(s)
    setRecipients(w)
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  async function saveSettings(e: FormEvent) {
    e.preventDefault()
    if (!settings) return
    try {
      const updated = await adminApi.settings.update(settings)
      setSettings(updated)
      setSaved('Settings saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  if (!settings) {
    return <p className="text-slate-500">Loading settings…</p>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Settings}
        eyebrow="House"
        title="Settings"
        subtitle="SAMS settings: currency, GA, Paysafe, storefront toggle, WhatsApp team."
      />

      <form
        onSubmit={saveSettings}
        className="admin-card grid gap-3 p-5 sm:grid-cols-2"
      >
        <input
          className="field"
          placeholder="Contact email"
          value={settings.contact_email}
          onChange={(e) =>
            setSettings({ ...settings, contact_email: e.target.value })
          }
        />
        <input
          className="field"
          placeholder="Currency"
          value={settings.currency}
          onChange={(e) =>
            setSettings({ ...settings, currency: e.target.value })
          }
        />
        <input
          className="field"
          placeholder="GA4 Measurement ID"
          value={settings.ga_measurement_id}
          onChange={(e) =>
            setSettings({ ...settings, ga_measurement_id: e.target.value })
          }
        />
        <input
          className="field"
          placeholder="Paysafe account id"
          value={settings.paysafe_account_id}
          onChange={(e) =>
            setSettings({ ...settings, paysafe_account_id: e.target.value })
          }
        />
        <textarea
          className="field sm:col-span-2"
          placeholder="Shipping notes"
          value={settings.shipping_notes}
          onChange={(e) =>
            setSettings({ ...settings, shipping_notes: e.target.value })
          }
        />
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={settings.storefront_enabled}
            onChange={(e) =>
              setSettings({
                ...settings,
                storefront_enabled: e.target.checked,
              })
            }
          />
          Storefront enabled (public website)
        </label>
        <button type="submit" className="btn w-fit">
          <Save size={15} /> Save settings
        </button>
      </form>

      <section className="admin-card p-5">
        <h2 className="font-semibold mb-1">WhatsApp notify recipients</h2>
        <p className="text-sm text-slate-500 mb-3">
          Each active number gets order alerts individually.
        </p>
        {settings.whatsapp?.configured ? (
          <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Cloud API credentials detected
            {settings.whatsapp.template_name
              ? ` · template “${settings.whatsapp.template_name}”`
              : ' · sending free-form text (needs an open chat window, or set WHATSAPP_TEMPLATE_NAME)'}
            .
          </p>
        ) : (
          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Numbers below are saved, but messages are <strong>not</strong> sent
            to WhatsApp yet. Create <code>backend/.env</code> with{' '}
            <code>WHATSAPP_API_TOKEN</code> and{' '}
            <code>WHATSAPP_PHONE_NUMBER_ID</code> from Meta, then restart the
            Django server. See <code>backend/.env.example</code>.
          </p>
        )}
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
          <p className="flex items-center gap-2 font-medium">
            <Cloud size={16} /> Media storage (Cloudflare R2)
          </p>
          {settings.media?.r2_configured ? (
            <p className="mt-1 text-emerald-800">
              R2 connected · bucket <code>{settings.media.bucket}</code> · public{' '}
              <code>{settings.media.public_base_url}</code>
            </p>
          ) : (
            <p className="mt-1 text-amber-900">
              R2 not configured — uploads fall back to local media. Set{' '}
              <code>CF_ACCOUNT_ID</code>, <code>CF_R2_BUCKET</code>,{' '}
              <code>CF_R2_ACCESS_KEY_ID</code>,{' '}
              <code>CF_R2_SECRET_ACCESS_KEY</code>, and{' '}
              <code>CF_MEDIA_BASE_URL</code> in <code>backend/.env</code> (and
              Railway). Public URLs are what get saved in the database.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            className="field max-w-[160px]"
            placeholder="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <input
            className="field max-w-[180px]"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            type="button"
            className="btn"
            onClick={async () => {
              await adminApi.whatsapp.create({
                label,
                phone,
                is_active: true,
                sort_order: recipients.length,
              })
              setLabel('')
              setPhone('')
              await load()
            }}
          >
            <Plus size={15} /> Add
          </button>
        </div>
        <ul className="divide-y">
          {recipients.map((r) => (
            <li
              key={r.id}
              className="py-2 flex items-center justify-between gap-3 text-sm"
            >
              <span>
                <strong>{r.label}</strong> · {r.phone}
                {!r.is_active && ' (off)'}
              </span>
              <button
                type="button"
                className="admin-btn-danger"
                onClick={async () => {
                  await adminApi.whatsapp.remove(r.id)
                  await load()
                }}
              >
                <Trash2 size={14} /> Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      {error && <Alert>{error}</Alert>}
      {saved && <Alert tone="ok">{saved}</Alert>}
    </div>
  )
}
