import { useRef, type FormEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useMagnetic } from '../hooks/useMagnetic'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const { ref, onMove, onLeave } = useMagnetic(0.25)

  useGSAP(
    () => {
      gsap.from('.contact-reveal', {
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      })
    },
    { scope: root },
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    form.reset()
    alert('Thank you. Our dealer team will be in touch shortly.')
  }

  return (
    <section
      id="contact"
      ref={root}
      className="relative py-[120px] md:py-[160px] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(15,76,129,0.12),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        <div className="contact-reveal mb-16 max-w-3xl">
          <p className="text-navy tracking-[0.25em] text-xs uppercase font-semibold mb-4">
            Contact
          </p>
          <h2 className="font-display text-4xl md:text-7xl text-ink leading-tight mb-6">
            Ready to specify
            <br />
            SANMATE?
          </h2>
          <p className="text-muted text-lg max-w-xl">
            Dealer inquiries, project samples, and architectural specifications —
            start the conversation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <form
            onSubmit={onSubmit}
            className="contact-reveal rounded-[32px] bg-surface border border-border p-8 md:p-10 space-y-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
          >
            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">
                Name / Company
              </label>
              <input
                required
                name="name"
                className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 outline-none focus:border-navy transition-colors duration-500"
                placeholder="Your name or dealership"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 outline-none focus:border-navy transition-colors duration-500"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">
                Interest
              </label>
              <select
                name="interest"
                className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 outline-none focus:border-navy transition-colors duration-500"
              >
                <option>Waste Pipe</option>
                <option>Bottle Trap</option>
                <option>Both / Full Collection</option>
                <option>Dealer Partnership</option>
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-wide uppercase text-muted mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 outline-none focus:border-navy transition-colors duration-500 resize-none"
                placeholder="Tell us about your project..."
              />
            </div>
            <button
              ref={ref as React.RefObject<HTMLButtonElement>}
              type="submit"
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              className="magnetic-btn w-full rounded-full bg-navy text-white py-4 font-medium tracking-wide"
            >
              Send Inquiry
            </button>
          </form>

          <div className="contact-reveal space-y-10 lg:pt-8">
            <div>
              <h3 className="font-display text-xl text-ink mb-2">Email</h3>
              <a href="mailto:dealers@sanmate.com" className="text-muted hover:text-navy transition-colors">
                dealers@sanmate.com
              </a>
            </div>
            <div>
              <h3 className="font-display text-xl text-ink mb-2">Phone</h3>
              <p className="text-muted">+91 00000 00000</p>
            </div>
            <div>
              <h3 className="font-display text-xl text-ink mb-2">Tagline</h3>
              <p className="font-display text-2xl tracking-wide">
                Drain your <span className="text-accent">worries</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
