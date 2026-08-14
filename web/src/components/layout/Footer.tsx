import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
  }

  return (
    <footer className="mt-16 bg-house text-white sm:mt-24">
      <div className="page-shell py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="font-mono-label text-white/45">SAMS Enterprises</p>
            <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[.92] tracking-[-0.08em]">
              Two collections. One house of considered products.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              Sanmate brings calm sanitary precision. Wyped brings charged
              cleaning energy. Both live under SAMS.
            </p>
          </div>

          <div>
            <p className="font-mono-label text-white/45">Stay in the loop</p>
            {done ? (
              <p className="mt-4 rounded-2xl bg-white/10 px-4 py-4 text-sm text-white/85">
                Thanks — you&apos;re on the list.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/45"
                />
                <button type="submit" className="btn-primary shrink-0 !bg-white !text-house">
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-t border-white/15 pt-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-1.5">
              <img
                src="/images/sams-logo.jpg"
                alt="SAMS Enterprises"
                className="h-10 w-10 rounded-lg object-cover"
              />
            </div>
            <div>
              <p className="font-display font-extrabold tracking-[-0.04em]">
                SAMS Enterprises
              </p>
              <a
                href="mailto:info.samsenterprise.pk@gmail.com"
                className="text-sm text-white/55 hover:text-white"
              >
                info.samsenterprise.pk@gmail.com
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {[
              ['/products', 'Shop'],
              ['/brands/sanmate', 'Sanmate'],
              ['/brands/wyped', 'Wyped'],
              ['/policies/privacy', 'Privacy'],
              ['/policies/return', 'Returns'],
              ['/policies/exchange', 'Exchange'],
              ['/policies/shipping', 'Shipping'],
              ['/policies/terms', 'Terms'],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="font-mono-label text-white/50 transition hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SAMS Enterprises</p>
          <p>
            Designed by{' '}
            <a
              href="https://www.trisitesolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#22C55E] hover:text-[#4ADE80]"
            >
              TrisiteSolutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
