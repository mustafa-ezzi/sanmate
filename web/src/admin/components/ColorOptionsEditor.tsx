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

function isPresetName(name: string) {
  return PREDEFINED_COLORS.some(
    (p) => p.name.toLowerCase() === name.trim().toLowerCase(),
  )
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
        return { ...c, ...patch }
      }),
    )
  }

  function applyPreset(index: number, presetName: string) {
    if (presetName === '__custom__') {
      updateAt(index, {
        name: value[index]?.name?.startsWith('Custom')
          ? value[index].name
          : 'Custom',
      })
      return
    }
    const preset = PREDEFINED_COLORS.find((p) => p.name === presetName)
    if (!preset) return
    updateAt(index, { name: preset.name, hex: preset.hex })
  }

  function addPresetColor() {
    const next = PREDEFINED_COLORS.find(
      (p) => !used.has(p.name.toLowerCase()),
    )
    onChange([
      ...value,
      next
        ? { ...next, image_url: '' }
        : { name: 'Custom', hex: '#e8601c', image_url: '' },
    ])
  }

  function addCustomColor() {
    let n = 1
    let name = 'Custom'
    while (used.has(name.toLowerCase())) {
      n += 1
      name = `Custom ${n}`
    }
    onChange([...value, { name, hex: '#e8601c', image_url: '' }])
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className={compact ? 'min-w-[16rem] space-y-2' : 'space-y-3'}>
      {value.map((color, index) => {
        const presetSelected = isPresetName(color.name)
          ? PREDEFINED_COLORS.find(
              (p) => p.name.toLowerCase() === color.name.toLowerCase(),
            )?.name
          : '__custom__'

        return (
          <div
            key={index}
            className={`rounded-xl border border-slate-200 bg-slate-50/80 ${
              compact ? 'p-2' : 'p-3'
            }`}
          >
            <div
              className={`flex ${
                compact ? 'flex-col gap-2' : 'flex-wrap items-start gap-3'
              }`}
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="shrink-0 text-[11px] font-medium text-slate-500">
                    Quick pick
                  </label>
                  <select
                    className="field min-w-0 flex-1"
                    value={presetSelected || '__custom__'}
                    onChange={(e) => applyPreset(index, e.target.value)}
                  >
                    <option value="__custom__">Custom colour…</option>
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

                <div className="flex flex-wrap items-end gap-2">
                  <label className="block space-y-1">
                    <span className="text-[11px] font-medium text-slate-500">
                      Colour
                    </span>
                    <input
                      type="color"
                      value={
                        /^#[0-9a-fA-F]{6}$/.test(color.hex)
                          ? color.hex
                          : '#e8601c'
                      }
                      onChange={(e) =>
                        updateAt(index, { hex: e.target.value })
                      }
                      className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                      title="Pick colour"
                    />
                  </label>
                  <label className="block min-w-[5.5rem] flex-1 space-y-1">
                    <span className="text-[11px] font-medium text-slate-500">
                      Hex
                    </span>
                    <input
                      className="field font-mono text-xs"
                      value={color.hex}
                      onChange={(e) => {
                        let hex = e.target.value.trim()
                        if (hex && !hex.startsWith('#')) hex = `#${hex}`
                        updateAt(index, { hex })
                      }}
                      placeholder="#e8601c"
                    />
                  </label>
                  <label className="block min-w-[8rem] flex-[2] space-y-1">
                    <span className="text-[11px] font-medium text-slate-500">
                      Colour name
                    </span>
                    <input
                      className="field"
                      value={color.name}
                      onChange={(e) =>
                        updateAt(index, { name: e.target.value })
                      }
                      placeholder="e.g. Mint, Rose gold"
                    />
                  </label>
                </div>
              </div>

              <ImageUploadField
                compact
                value={color.image_url || ''}
                onChange={(url) => updateAt(index, { image_url: url })}
              />
            </div>
            {!compact && (
              <p className="mt-2 text-[11px] text-slate-500">
                Upload the product photo for the{' '}
                <span className="font-medium text-slate-700">
                  {color.name || 'this'}
                </span>{' '}
                finish.
              </p>
            )}
          </div>
        )
      })}

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-secondary" onClick={addPresetColor}>
          <Plus size={14} />
          Add colour
        </button>
        <button type="button" className="btn-secondary" onClick={addCustomColor}>
          <Plus size={14} />
          Add custom colour
        </button>
      </div>
      {!value.length && (
        <p className="text-xs text-slate-500">
          Optional. Use a preset or create your own name + colour, then upload
          a photo for that finish.
        </p>
      )}
    </div>
  )
}
