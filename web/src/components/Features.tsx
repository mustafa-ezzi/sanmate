import { Sparkles, Shield, CheckCircle2, Gem, Wrench, Layers } from 'lucide-react'
import FadeUp from './FadeUp'

const features = [
  { title: 'Precision Engineered', text: 'Tight tolerances. Silent performance.', Icon: Sparkles },
  { title: 'Corrosion Resistant', text: 'Chrome & ABS built to last.', Icon: Shield },
  { title: 'Leak Tested', text: 'Every seal factory verified.', Icon: CheckCircle2 },
  { title: 'Mirror Finish', text: 'Premium chrome that shines.', Icon: Gem },
  { title: 'Easy Install', text: 'Fast fit under any vanity.', Icon: Wrench },
  { title: 'Premium Materials', text: 'ABS strength. Chrome beauty.', Icon: Layers },
]

export default function Features() {
  return (
    <section id="features" className="section-pad bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <FadeUp className="mb-8 sm:mb-10">
          <p className="text-accent tracking-[0.2em] text-[10px] uppercase font-semibold mb-2">
            Features
          </p>
          <h2 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-navy">
            Built to perform
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.04}>
              <article className="h-full rounded-[1.5rem] bg-surface border border-border p-6 sm:p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center">
                    <f.Icon size={18} />
                  </div>
                  <span className="text-chrome font-display text-3xl font-extrabold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-display text-lg uppercase tracking-tight text-ink mb-2">
                  {f.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{f.text}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
