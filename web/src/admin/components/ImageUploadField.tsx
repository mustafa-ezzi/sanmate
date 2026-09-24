import { ImagePlus, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { adminApi } from '../api'

type Props = {
  label?: string
  shownOn?: string
  value: string
  onChange: (url: string) => void
  /** Compact cell for import tables */
  compact?: boolean
}

/** File picker → upload → stores returned URL in parent form (DB field). */
export default function ImageUploadField({
  label = 'Image',
  shownOn = '',
  value,
  onChange,
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function onFile(file: File | undefined) {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const { url } = await adminApi.uploadImage(file)
      onChange(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  if (compact) {
    return (
      <div className="flex min-w-[9.5rem] flex-col items-start gap-1.5">
        <div className="h-14 w-14 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-[10px] text-slate-400">
              No img
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          disabled={uploading}
          onChange={(e) => void onFile(e.target.files?.[0])}
          className="block max-w-[9.5rem] text-[11px] file:mr-2 file:rounded-md file:border-0 file:bg-[#171c4e] file:px-2 file:py-1 file:text-[11px] file:font-semibold file:text-white"
        />
        <p className="text-[10px] text-slate-500">
          {uploading ? 'Uploading to R2…' : 'Upload image'}
        </p>
        {value && (
          <button
            type="button"
            className="text-[10px] font-medium text-red-600 hover:underline"
            onClick={() => onChange('')}
          >
            Remove
          </button>
        )}
        {error && <p className="text-[10px] text-red-600">{error}</p>}
      </div>
    )
  }

  return (
    <div className="sm:col-span-2 space-y-2">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {shownOn && (
          <p className="mt-0.5 text-xs text-slate-500">{shownOn}</p>
        )}
      </div>
      <div className="flex flex-wrap items-start gap-4">
        <div className="h-24 w-24 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center text-xs text-slate-400">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            'No image'
          )}
        </div>
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            disabled={uploading}
            onChange={(e) => void onFile(e.target.files?.[0])}
            className="block text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#171c4e] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <ImagePlus size={13} />
            {uploading
              ? 'Uploading… this image will appear on the storefront once saved.'
              : 'Choose a file. After upload, this picture is what customers see in the place described above.'}
          </p>
          {value && (
            <button
              type="button"
              className="admin-btn-danger"
              onClick={() => onChange('')}
            >
              <Trash2 size={13} /> Remove image
            </button>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}
