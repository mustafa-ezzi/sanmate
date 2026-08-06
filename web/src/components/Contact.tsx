import { type FormEvent } from 'react'
import { Mail, Send } from 'lucide-react'
import Logo from './Logo'
import FadeUp from './FadeUp'

export default function Contact() {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const subject = encodeURIComponent(`SANMATE Inquiry — ${data.get('interest')}`)
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nInterest: ${data.get('interest')}\n\n${data.get('message')}`,
    )
    window.location.href = `mailto:info.samsenterprise.pk@gmail.com?subject=${subject}&body=${body}`
    form.reset()
  }

  return (
    <section id="contact" className="relative py-16 sm:py-24 md:py-[140px] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(232,96,28,0.08),transparent_55%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <FadeUp className="mb-10 sm:mb-16 max-w-3xl">
          <Logo href="" imgClassName="h-14 w-auto sm:h-20 mb-6 sm:mb-8" />
          <p className="text-accent tracking-[0.25em] text-[10px] sm:text-xs uppercase font-semibold mb-4">
            Contact
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-7xl uppercase tracking-tight text-navy leading-[0.95] mb-5">
            Ready to specify
            <br />
            <span className="text-ink">SANMATE?</span>
          </h2>
          <p className="text-muted text-base sm:text-lg max-w-xl">
            Dealer inquiries, project samples, and architectural specifications — start the conversation.
          </p>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <FadeUp>
            <form
              onSubmit={onSubmit}
              className="rounded-[2rem] bg-surface border border-border p-5 sm:p-8 md:p-10 space-y-4 sm:space-y-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
            >
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
                  Name / Company
                </label>
                <input
                  required
                  name="name"
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 outline-none focus:border-accent transition-colors"
                  placeholder="Your name or dealership"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 outline-none focus:border-accent transition-colors"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
                  Interest
                </label>
                <select
                  name="interest"
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 outline-none focus:border-accent transition-colors"
                >
                  <option>Waste Pipe</option>
                  <option>Bottle Trap</option>
                  <option>Both / Full Collection</option>
                  <option>Dealer Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                <Send size={16} />
                Send Inquiry
              </button>
            </form>
          </FadeUp>

          <FadeUp delay={0.1} className="space-y-8 lg:pt-6">
            <div>
              <h3 className="font-display text-lg uppercase tracking-tight text-ink mb-3 flex items-center gap-2">
                <Mail size={18} className="text-accent" /> Email
              </h3>
              <a
                href="mailto:info.samsenterprise.pk@gmail.com"
                className="hover-target text-muted hover:text-accent transition-colors break-all text-sm sm:text-base"
              >
                info.samsenterprise.pk@gmail.com
              </a>
            </div>
            <div>
              <h3 className="font-display text-lg uppercase tracking-tight text-ink mb-3">Brand</h3>
              <Logo href="" imgClassName="h-14 w-auto sm:h-16" />
            </div>
            <div>
              <h3 className="font-display text-lg uppercase tracking-tight text-ink mb-3">Tagline</h3>
              <p className="font-display text-xl sm:text-2xl uppercase tracking-widest">
                Drain your <span className="text-accent">worries</span>
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
