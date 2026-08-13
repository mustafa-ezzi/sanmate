import { Image, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import {
  adminApi,
  type AdminBanner,
  type AdminCarousel,
  type AdminCarouselSlide,
} from '../api'
import ImageUploadField from '../components/ImageUploadField'
import { Alert, PageHeader } from '../components/ui'

const empty = {
  title: '',
  subtitle: '',
  image_url: '',
  cta_label: 'Shop now',
  cta_link: '/products',
  sort_order: 0,
  is_active: true,
}

const emptySlide = (): AdminCarouselSlide => ({
  image_url: '',
  caption: '',
  link: '/products',
  sort_order: 0,
  is_active: true,
})

export default function BannersPage() {
  const [items, setItems] = useState<AdminBanner[]>([])
  const [carousels, setCarousels] = useState<AdminCarousel[]>([])
  const [form, setForm] = useState(empty)
  const [carouselName, setCarouselName] = useState('Home campaign posters')
  const [slides, setSlides] = useState<AdminCarouselSlide[]>([emptySlide()])
  const [editing, setEditing] = useState<number | null>(null)
  const [editingCarousel, setEditingCarousel] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  async function load() {
    const [banners, carouselItems] = await Promise.all([
      adminApi.banners.list(),
      adminApi.carousels.list(),
    ])
    setItems(banners)
    setCarousels(carouselItems)
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  function resetBanner() {
    setForm(empty)
    setEditing(null)
  }

  function resetCarousel() {
    setEditingCarousel(null)
    setCarouselName('Home campaign posters')
    setSlides([emptySlide()])
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      if (editing) await adminApi.banners.update(editing, form)
      else await adminApi.banners.create(form)
      resetBanner()
      setMsg(editing ? 'Banner updated.' : 'Banner created.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  async function saveCarousel(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMsg('')
    const payload = {
      key: 'home-hero',
      name: carouselName || 'Home campaign posters',
      slides: slides.map((slide, index) => ({ ...slide, sort_order: index })),
    }
    try {
      if (editingCarousel) await adminApi.carousels.update(editingCarousel, payload)
      else await adminApi.carousels.create(payload)
      resetCarousel()
      setMsg(editingCarousel ? 'Carousel updated.' : 'Carousel published.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Carousel save failed')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Image}
        eyebrow="CMS"
        title="Home creative"
        subtitle="Upload hero banners and campaign posters. Images go to Cloudflare R2; URLs are stored in the database."
      />

      <form
        onSubmit={onSubmit}
        className="admin-card grid gap-3 p-5 sm:grid-cols-2"
      >
        <input
          className="field"
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <input
          className="field"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
        />
        <ImageUploadField
          label="Homepage hero banner"
          shownOn="This is the full-screen image on the first homepage carousel slide. Use a wide, dark lifestyle photo (desktop and mobile)."
          value={form.image_url}
          onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
        />
        <input
          className="field"
          placeholder="CTA label"
          value={form.cta_label}
          onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))}
        />
        <input
          className="field"
          placeholder="CTA link"
          value={form.cta_link}
          onChange={(e) => setForm((f) => ({ ...f, cta_link: e.target.value }))}
        />
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button type="submit" className="btn">
            {editing ? <Pencil size={15} /> : <Plus size={15} />}
            {editing ? 'Update' : 'Create'} banner
          </button>
          {editing && (
            <button type="button" className="btn-secondary" onClick={resetBanner}>
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
            <div className="flex gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-lg bg-slate-100">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-slate-500">{item.subtitle}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="admin-btn-edit"
                onClick={() => {
                  setEditing(item.id)
                  setForm({
                    title: item.title,
                    subtitle: item.subtitle,
                    image_url: item.image_url,
                    cta_label: item.cta_label,
                    cta_link: item.cta_link,
                    sort_order: item.sort_order,
                    is_active: item.is_active,
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
                  if (!confirm(`Delete banner “${item.title}”?`)) return
                  await adminApi.banners.remove(item.id)
                  if (editing === item.id) resetBanner()
                  await load()
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
        {!items.length && (
          <p className="p-4 text-sm text-slate-500">No banners yet.</p>
        )}
      </div>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-xl font-semibold">Campaign poster carousel</h2>
        <p className="mt-1 text-sm text-slate-500">
          Homepage reads the <code>home-hero</code> carousel.
        </p>
        <form
          onSubmit={saveCarousel}
          className="admin-card mt-4 space-y-4 p-5"
        >
          <input
            className="field"
            placeholder="Carousel name"
            value={carouselName}
            onChange={(e) => setCarouselName(e.target.value)}
          />
          {slides.map((slide, index) => (
            <div key={index} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Poster {index + 1}</p>
                {slides.length > 1 && (
                  <button
                    type="button"
                    className="admin-btn-danger"
                    onClick={() =>
                      setSlides((all) => all.filter((_, i) => i !== index))
                    }
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <ImageUploadField
                  label={`Carousel poster ${index + 1}`}
                  shownOn="Shown as a homepage hero carousel slide (full-screen). Caption and link appear over this image."
                  value={slide.image_url}
                  onChange={(url) =>
                    setSlides((all) =>
                      all.map((item, i) =>
                        i === index ? { ...item, image_url: url } : item,
                      ),
                    )
                  }
                />
                <div className="space-y-3">
                  <input
                    className="field"
                    placeholder="Poster caption"
                    value={slide.caption}
                    onChange={(e) =>
                      setSlides((all) =>
                        all.map((item, i) =>
                          i === index
                            ? { ...item, caption: e.target.value }
                            : item,
                        ),
                      )
                    }
                  />
                  <input
                    className="field"
                    placeholder="Link (e.g. /brands/sanmate)"
                    value={slide.link}
                    onChange={(e) =>
                      setSlides((all) =>
                        all.map((item, i) =>
                          i === index ? { ...item, link: e.target.value } : item,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setSlides((all) => [...all, emptySlide()])}
            >
              <Plus size={15} /> Add poster
            </button>
            <button type="submit" className="btn">
              {editingCarousel ? <Pencil size={15} /> : <Plus size={15} />}
              {editingCarousel ? 'Update carousel' : 'Publish carousel'}
            </button>
            {editingCarousel && (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetCarousel}
              >
                <X size={15} /> Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-4 space-y-2">
          {carousels.map((carousel) => (
            <div
              key={carousel.id}
              className="admin-card flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <span>
                <strong>{carousel.name}</strong> · {carousel.slides.length}{' '}
                poster(s) · <code>{carousel.key}</code>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="admin-btn-edit"
                  onClick={() => {
                    setEditingCarousel(carousel.id)
                    setCarouselName(carousel.name)
                    setSlides(
                      carousel.slides.length
                        ? carousel.slides
                        : [emptySlide()],
                    )
                  }}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  type="button"
                  className="admin-btn-danger"
                  onClick={async () => {
                    if (!confirm(`Delete carousel “${carousel.name}”?`)) return
                    await adminApi.carousels.remove(carousel.id)
                    if (editingCarousel === carousel.id) resetCarousel()
                    await load()
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
