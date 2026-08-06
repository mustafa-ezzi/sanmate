import { images } from '../data'

type LogoProps = {
  className?: string
  imgClassName?: string
  href?: string
}

export default function Logo({
  className = '',
  imgClassName = 'h-12 w-auto md:h-14',
  href = '#hero',
}: LogoProps) {
  const img = (
    <img
      src={images.logo}
      alt="SANMATE — Drain Your Worries"
      className={`object-contain ${imgClassName}`}
    />
  )

  if (!href) {
    return <div className={className}>{img}</div>
  }

  return (
    <a href={href} className={`inline-flex items-center ${className}`} aria-label="SANMATE home">
      {img}
    </a>
  )
}
