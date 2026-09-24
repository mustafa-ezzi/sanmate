import { Plus, Trash2 } from 'lucide-react'
import {
  PREDEFINED_COLORS,
  type ProductColor,
} from '../../lib/colors'
import ImageUploadField from './ImageUploadField'

type Props = {
  value: ProductColor[]
  onChange: (colors: ProductColor[]) => void
  /** Compact layout for import table cells */
  compact?: boolean
}

export default function ColorOptionsEditor({
  value,
  onChange,
  compact = false,
}: Props) {
  const used = new Set(value.map((c) => c.name.toLowerCase()))

  function updateAt(index: number, patch: Partial<ProductColor>) {
    onChange(
      value.map((c, i) => {
        if (i !== index) return c
        const next = { ...c, ...patch }
        if (patch.name) {
          const preset = PREDEFINED_COLORS.find(
            (p) => p.name.toLowerCase() === patch.name!.toLowerCase(),
          )
          if (preset) {
            next.name = preset.name
            next.hex = preset.hex
          }
        }
        return next
      }),
    )
  }

  function addColor() {
    const next = PREDEFINED_COLORS.find(
      (p) => !used.has(p.name.toLowerCase()),
    )
    if (!next) return
    onChange([...value, { ...next, image_url: '' }])
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className={compact ? 'min-w-[14rem] space-y-2' : 'space-y-3'}>
      {value.map((color, index) => (
        <div
          key={`${color.name}-${index}`}
          className={`rounded-xl border border-slate-200 bg-slate-50/80 ${
            compact ? 'p-2' : 'p-3'
          }`}
        >
          <div className={`flex ${compact ? 'flex-col gap-2' : 'flex-wrap items-start gap-3'}`}>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className="h-5 w-5 shrink-0 rounded-full border border-slate-300"
                style={{ backgroundColor: color.hex }}
                aria-hidden
              />
              <select
                className="field min-w-0 flex-1"
                value={color.name}
                onChange={(e) => updateAt(index, { name: e.target.value })}
              >
                {PREDEFINED_COLORS.map((p) => {
                  const taken =
                    used.has(p.name.toLowerCase()) &&
                    p.name.toLowerCase() !== color.name.toLowerCase()
                  return (
                    <option key={p.name} value={p.name} disabled={taken}>
                      {p.name}
                    </option>
                  )
                })}
              </select>
              <button
                type="button"
                className="admin-btn-danger shrink-0"
                aria-label={`Remove ${color.name}`}
                onClick={() => removeAt(index)}
              >
                <Trash2 size={13} />
              </button>
            </div>
            <ImageUploadField
              compact
              value={color.image_url || ''}
              onChange={(url) => updateAt(index, { image_url: url })}
            />
          </div>
          {!compact && (
            <p className="mt-1 text-[11px] text-slate-500">
              Upload the product photo for the {color.name} finish.
            </p>
          )}
        </div>
      ))}

      <button
        type="button"
        className="btn-secondary"
        disabled={value.length >= PREDEFINED_COLORS.length}
        onClick={addColor}
      >
        <Plus size={14} />
        Add color
      </button>
      {!value.length && (
        <p className="text-xs text-slate-500">
          Optional. Add colors and upload a photo for each finish.
        </p>
      )}
    </div>
  )
}
