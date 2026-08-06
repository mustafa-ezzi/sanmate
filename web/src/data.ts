import {
  ShieldCheck,
  Wrench,
  Droplets,
  Layers,
  Ruler,
  Ban,
  ArrowUpDown,
  CircleDot,
  Trash2,
  Gauge,
  MoveVertical,
  type LucideIcon,
} from 'lucide-react'

export const images = {
  logo: '/images/sanmate-logo.jpeg',
  wasteChrome: '/images/waste-pipe-chrome.jpeg',
  wasteWhite: '/images/waste-pipe-white.jpeg',
  bottleTrap: '/images/bottle-trap-white.jpeg',
  brandHero: '/images/brand-hero.jpeg',
  promoFlowing: '/images/promo-flowing.jpeg',
  wasteFeaturesWhite: '/images/waste-features-white.jpeg',
  wasteFeaturesChrome: '/images/waste-features-chrome.jpeg',
  bottleFeatures: '/images/bottle-trap-features.jpeg',
  bottleFeatures2: '/images/bottle-trap-features-2.jpeg',
  wasteExploded: '/images/waste-exploded.jpeg',
  wasteExploded2: '/images/waste-exploded-2.jpeg',
  marbleBath:
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80',
  darkStone:
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
  whiteSink:
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80',
  luxuryBath:
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
  hotelBath:
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80',
}

export const wasteFeatures: { title: string; text: string; Icon: LucideIcon }[] = [
  { title: 'No Screw Inside', text: 'Hassle-free design for a smooth experience.', Icon: Ban },
  { title: 'Rust Free', text: 'Built to last. Always corrosion-resistant.', Icon: ShieldCheck },
  { title: 'Easy to Install', text: 'Quick & simple installation for everyone.', Icon: Wrench },
  { title: 'Removable Basket', text: 'Keeps your drain hygienic & odor-free.', Icon: Droplets },
  { title: 'ABS / Chrome', text: 'Premium materials for unmatched performance.', Icon: Layers },
  { title: '30 Inch Pipe', text: 'Ideal length for maximum convenience.', Icon: Ruler },
]

export const bottleFeatures: { title: string; text: string; Icon: LucideIcon }[] = [
  { title: 'Adjustable Height', text: 'Easily adjusts to your installation needs.', Icon: ArrowUpDown },
  { title: 'Universal Trap Bowl', text: 'Universal design fits most basins seamlessly.', Icon: CircleDot },
  { title: 'Removable Base', text: 'Easy to remove and clean for a clog-free experience.', Icon: Trash2 },
  { title: '36L/min Flow', text: '32mm or 40mm waste inlet/outlet with high flow.', Icon: Gauge },
  { title: '6" Telescope', text: 'Flexible extension for the perfect fit.', Icon: MoveVertical },
]

export const specs = [
  { label: 'Pipe Length', value: 30, suffix: '"', detail: 'Waste pipe reach' },
  { label: 'Flow Rate', value: 36, suffix: 'L/min', detail: 'Bottle trap capacity' },
  { label: 'Inlet Options', value: 2, suffix: '', detail: '32mm & 40mm' },
  { label: 'Leak Tests', value: 100, suffix: '%', detail: 'Factory verified' },
]

export const faqs = [
  {
    q: 'What products does SANMATE offer?',
    a: 'We focus on two precision-engineered essentials: washbasin waste pipes and bottle traps — available in chrome and high-grade ABS finishes.',
  },
  {
    q: 'Are the products corrosion resistant?',
    a: 'Yes. Our chrome finishes are mirror-polished and corrosion resistant. ABS models are rust-free by design and built for long-term bathroom and kitchen use.',
  },
  {
    q: 'How difficult is installation?',
    a: 'Both products are designed for quick, tool-friendly installation under basins and vanities — suitable for homes, hotels, and professional fit-outs.',
  },
  {
    q: 'Can I order as a dealer or architect?',
    a: 'Absolutely. Use the dealer inquiry form in the contact section and our team will respond with pricing, samples, and lead times.',
  },
  {
    q: 'What is the bottle trap flow rate?',
    a: 'Our bottle trap supports 32mm or 40mm waste connections with a flow rate of 36 litres per minute, plus a 6-inch telescopic extension.',
  },
]
