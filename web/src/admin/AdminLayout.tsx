import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Tags,
  Package,
  Image,
  FileText,
  ShoppingBag,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
} from 'lucide-react'
import { useAdminStore } from './store'
import './admin.css'

const nav = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/categories', label: 'Child brands', icon: Tags },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/banners', label: 'Banners', icon: Image },
  { to: '/admin/policies', label: 'Policies', icon: FileText },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { ready, user, bootstrap, logout } = useAdminStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  if (!ready) {
    return (
      <div className="admin-shell grid min-h-screen place-items-center bg-[#f4f5f8] text-slate-500">
        Loading admin…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  const sidebar = (
    <>
      <div className="admin-sidebar-brand">
        <img
          src="/images/sams-logo.jpg"
          alt=""
          className="h-10 w-10 rounded-full object-cover ring-1 ring-white/15"
        />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9aa3d1]">
            Admin
          </p>
          <p className="font-display text-sm font-extrabold tracking-[-0.03em] text-[#f4f5fb]">
            SAMS Enterprises
          </p>
        </div>
      </div>
      <nav className="admin-sidebar-nav">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `admin-nav-item${isActive ? ' is-active' : ''}`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar-foot">
        <a href="/" className="admin-nav-item quiet">
          <Store size={16} /> View storefront
        </a>
        <button
          type="button"
          className="admin-nav-item quiet"
          onClick={async () => {
            await logout()
            navigate('/admin/login')
          }}
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </>
  )

  return (
    <div className="admin-shell flex min-h-screen bg-[#f4f5f8] text-slate-900">
      <aside className="admin-sidebar hidden w-64 shrink-0 flex-col lg:flex">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="admin-sidebar relative flex h-full w-72 flex-col shadow-2xl">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-[#e6e8ee] bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="admin-icon-btn lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Company
              </p>
              <p className="font-display font-extrabold tracking-[-0.03em] text-[#171c4e]">
                SAMS Enterprises
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-sm sm:block">
              <p className="font-semibold text-[#171c4e]">{user.username}</p>
              <p className="text-xs capitalize text-slate-500">{user.role}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#171c4e] text-sm font-bold text-white">
              {user.username.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
