import { type FormEvent } from 'react'
import { Mail, Send, ShoppingBag } from 'lucide-react'
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
    <section id="contact" className="relative section-pad overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,99,13,0.07),transparent_55%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <FadeUp className="mb-8 max-w-2xl">
          <Logo href="" imgClassName="h-12 w-auto sm:h-14 mb-5" />
          <p className="text-accent tracking-[0.2em] text-[10px] uppercase font-semibold mb-2">Contact</p>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-navy leading-tight mb-3">
            Order or inquire
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-md">
            Dealer or retail — we respond quickly.
          </p>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          <FadeUp>
            <form
              onSubmit={onSubmit}
              className="rounded-[1.75rem] bg-surface border border-border p-5 sm:p-7 space-y-3.5 shadow-[0_16px_40px_rgba(27,29,99,0.06)]"
            >
              <input
                required
                name="name"
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
                placeholder="Name / Company"
              />
              <input
                required
                type="email"
                name="email"
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
                placeholder="Email"
              />
              <select
                name="interest"
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
              >
                <option>Buy Waste Pipe</option>
                <option>Buy Bottle Trap</option>
                <option>Buy Both</option>
                <option>Dealer Partnership</option>
              </select>
              <textarea
                name="message"
                rows={3}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none focus:border-accent resize-none"
                placeholder="Quantity, city, phone..."
              />
              <button type="submit" className="btn-primary w-full">
                <Send size={15} /> Send
              </button>
            </form>
          </FadeUp>

          <FadeUp delay={0.08} className="space-y-6 lg:pt-2">
            <div>
              <h3 className="font-display text-sm uppercase tracking-tight text-ink mb-2 flex items-center gap-2">
                <Mail size={16} className="text-accent" /> Email
              </h3>
              <a
                href="mailto:info.samsenterprise.pk@gmail.com"
                className="hover-target text-muted hover:text-accent transition-colors break-all text-sm"
              >
                info.samsenterprise.pk@gmail.com
              </a>
            </div>
            <a href="#buy" className="btn-accent inline-flex">
              <ShoppingBag size={15} /> Buy Products
            </a>
            <p className="font-display text-lg uppercase tracking-widest">
              Drain your <span className="text-accent">worries</span>
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
