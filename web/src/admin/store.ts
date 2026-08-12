import { create } from 'zustand'
import {
  adminApi,
  clearToken,
  getToken,
  setCompanySlug,
  setToken,
  type AdminUser,
} from './api'

/** Admin panel is permanently scoped to SAMS Enterprises. */
const SAMS_SLUG = 'sams'

type AdminState = {
  ready: boolean
  token: string
  user: AdminUser | null
  bootstrap: () => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAdminStore = create<AdminState>((set) => ({
  ready: false,
  token: getToken(),
  user: null,
  bootstrap: async () => {
    const token = getToken()
    setCompanySlug(SAMS_SLUG)
    if (!token) {
      set({ ready: true, user: null, token: '' })
      return
    }
    try {
      const me = await adminApi.me()
      set({
        ready: true,
        token,
        user: me.user,
      })
    } catch {
      clearToken()
      set({ ready: true, token: '', user: null })
    }
  },
  login: async (username, password) => {
    const data = await adminApi.login(username, password)
    setToken(data.token)
    setCompanySlug(SAMS_SLUG)
    set({
      token: data.token,
      user: data.user,
      ready: true,
    })
  },
  logout: async () => {
    try {
      await adminApi.logout()
    } catch {
      /* ignore */
    }
    clearToken()
    set({ token: '', user: null })
  },
}))
