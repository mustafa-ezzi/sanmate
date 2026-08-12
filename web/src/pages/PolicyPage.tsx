import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import type { Policy } from '../api/types'

const labels: Record<string, string> = {
  privacy: 'Privacy',
  return: 'Returns',
  exchange: 'Exchange',
  shipping: 'Shipping',
  terms: 'Terms',
}

export default function PolicyPage() {
  const { type = 'privacy' } = useParams()
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    api
      .policy(type)
      .then((p) => {
        if (!cancelled) setPolicy(p)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Not found')
      })
    return () => {
      cancelled = true
    }
  }, [type])

  return (
    <div className="page-shell max-w-3xl py-12 sm:py-16">
      <div className="mb-8 flex flex-wrap gap-2">
        {Object.keys(labels).map((key) => (
          <Link
            key={key}
            to={`/policies/${key}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              key === type
                ? 'bg-navy text-white'
                : 'bg-white text-navy border border-border'
            }`}
          >
            {labels[key]}
          </Link>
        ))}
      </div>

      {error && <p className="text-accent">{error}</p>}
      {!error && !policy && <p className="text-muted">Loading…</p>}
      {policy && (
        <>
          <h1 className="font-display text-3xl sm:text-4xl text-navy mb-2">
            {policy.title}
          </h1>
          <p className="text-xs text-muted mb-6">Version {policy.version}</p>
          <div className="prose-policy rounded-[1.5rem] border border-border bg-surface p-6 sm:p-8">
            {policy.body}
          </div>
        </>
      )}
    </div>
  )
}
