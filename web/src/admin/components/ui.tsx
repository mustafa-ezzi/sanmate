import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  icon?: LucideIcon
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#171c4e] text-white shadow-[0_10px_24px_rgba(23,28,78,0.22)]">
          <Icon size={18} />
        </div>
      )}
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8601c]">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-[#171c4e]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

export function Alert({
  tone = 'error',
  children,
}: {
  tone?: 'error' | 'ok' | 'warn'
  children: ReactNode
}) {
  return (
    <div className={`admin-alert admin-alert-${tone}`}>{children}</div>
  )
}

export function AdminFormStyles() {
  return null
}
