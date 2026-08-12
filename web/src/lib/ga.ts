declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ''

export function initGA(id?: string) {
  const mid = id || MEASUREMENT_ID
  if (!mid || typeof document === 'undefined') return
  if (document.getElementById('ga4-script')) return

  const script = document.createElement('script')
  script.id = 'ga4-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${mid}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', mid)
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | undefined>,
) {
  if (!window.gtag) return
  window.gtag('event', name, {
    company: import.meta.env.VITE_COMPANY_SLUG || 'sams',
    ...params,
  })
}

export function trackPageView(path: string) {
  trackEvent('page_view', { page_path: path })
}
