import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, User } from 'lucide-react'
import { useAdminStore } from '../store'
import '../admin.css'

export default function LoginPage() {
  const { ready, user, bootstrap, login } = useAdminStore()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  if (ready && user) {
    return <Navigate to="/admin" replace />
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      await login(String(fd.get('username')), String(fd.get('password')))
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-shell relative min-h-screen overflow-hidden bg-[#171c4e] px-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#e8601c]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#0f4c81]/50 blur-3xl" />
      <div className="relative mx-auto grid min-h-screen max-w-5xl items-center gap-10 py-10 lg:grid-cols-2">
        <div className="hidden text-white lg:block">
          <img
            src="/images/sams-logo.jpg"
            alt="SAMS"
            className="h-16 w-16 rounded-2xl object-cover ring-1 ring-white/20"
          />
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            SAMS Enterprises
          </p>
          <h1 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.06em]">
            House admin
          </h1>
          <p className="mt-4 max-w-sm text-white/65">
            Catalogue, orders, banners, and settings — one panel for Sanmate and
            Wype.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="w-full rounded-[1.5rem] border border-white/15 bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
        >
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <img
              src="/images/sams-logo.jpg"
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
            <p className="font-display font-extrabold text-[#171c4e]">
              SAMS Admin
            </p>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8601c]">
            Sign in
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.04em] text-[#171c4e]">
            Welcome back
          </h2>
          <label className="mt-6 block">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm text-slate-600">
              <User size={14} /> Username
            </span>
            <input
              name="username"
              required
              defaultValue="admin"
              className="field"
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm text-slate-600">
              <Lock size={14} /> Password
            </span>
            <input
              name="password"
              type="password"
              required
              defaultValue="admin123"
              className="field"
            />
          </label>
          {error && (
            <p className="admin-alert admin-alert-error mt-4">{error}</p>
          )}
          <button type="submit" disabled={loading} className="btn mt-5 w-full">
            {loading ? 'Signing in…' : 'Sign in'}
            <ArrowRight size={16} />
          </button>
          <p className="mt-4 text-xs text-slate-500">
            Dev: <code>admin</code> / <code>admin123</code>
          </p>
        </form>
      </div>
    </div>
  )
}
