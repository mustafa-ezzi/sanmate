import ScrollReveal from '../bits/ScrollReveal'

type Props = {
  eyebrow?: string
  title: string
  subtitle?: string
  light?: boolean
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light,
}: Props) {
  return (
    <div className="max-w-2xl mb-8 sm:mb-10">
      <ScrollReveal>
        {eyebrow && (
          <p
            className={`font-mono-label mb-3 ${
              light ? 'text-white/55' : 'text-[var(--brand-accent,#E8601C)]'
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={`font-display text-[clamp(1.85rem,4vw,3rem)] font-extrabold leading-[.95] tracking-[-0.07em] ${
            light ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-4 max-w-xl text-base leading-relaxed ${
              light ? 'text-white/65' : 'text-muted'
            }`}
          >
            {subtitle}
          </p>
        )}
      </ScrollReveal>
    </div>
  )
}
