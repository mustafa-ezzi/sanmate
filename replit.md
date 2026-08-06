# SANMATE - Premium Sanitary Brand - Design Guide

## 1. Aesthetic Direction
- **Vibe:** Cinematic, minimal, premium, engineered. "Apple designed drain products."
- **Layout Paradigm:** Bold maximalism mixed with refined minimalism. Large typography, heavy use of whitespace, dramatic pacing. Scroll-storytelling.
- **Mood Aesthetic:** Industrial Elegance. Dark navy accents providing weight and trust, electric orange providing modern flair and technical precision.

## 2. Color System
Defined in `index.css` via HSL CSS custom properties.

- **Background (`#F7F7F5` / `60 14% 96%`):** Warm, off-white background ensuring it feels like a luxury physical product catalog, not a digital SaaS.
- **Surface/Card (`#FFFFFF` / `0 0% 100%`):** Pure white for cards to contrast against the off-white background.
- **Text (`#111111` / `0 0% 7%`):** Near black for stark contrast.
- **Secondary Text (`#666666` / `0 0% 40%`):** Soft gray for descriptions and body copy.
- **Primary / Accent Navy (`#0F4C81` / `208 79% 28%`):** Brand color. Used for massive typography, footers, primary buttons.
- **Accent Orange (`#E8601C` / `20 82% 51%`):** The "electric" highlight. Used for taglines, highlights, interactive hover states, and critical CTAs.
- **Border (`#E6E6E6` / `0 0% 90%`):** Subtle dividers.

## 3. Typography
Imported from Google Fonts.
- **Display / Heading:** `Manrope` (Weights: 400, 700, 800, 900). Chosen for its geometric, industrial yet highly legible structure. Huge sizes (up to 6rem/96px).
- **Body / Sans:** `Inter` (Weights: 400, 500, 600). Neutral, highly readable, standard digital typography.
- *Styling Note:* Headings often use `uppercase` and `tracking-tight` or `tracking-widest` to emphasize architectural scale.

## 4. Animations & Motion
Motion is a core part of the SANMATE aesthetic, driven by `framer-motion` and `gsap`.

- **Smooth Scrolling:** `@studio-freight/lenis` intercepts the scroll wheel for buttery smooth page navigation, essential for "cinematic" feel. Connected to GSAP's ticker.
- **Hero Intro:** Words "DRAIN", "YOUR", "WORRIES" fade up individually with a staggered delay using Framer Motion. 
- **Hero Image:** Infinite pure CSS/Framer floating (`translateY` -15px to 15px over 6s) combined with GSAP mouse parallax (`mousemove` tracking) shifting rotationX and rotationY based on cursor position.
- **Waste Pipe Section (GSAP Pin):** The product image is pinned (`ScrollTrigger pin: true`) on the left while the features list scrolls past on the right.
- **Bottle Trap Section (GSAP Scrub):** 3D rotation (`rotateY`, `rotateX`) is mapped directly to the scroll progress (`scrub: 1`).
- **Scroll Reveals:** Almost every element (text blocks, cards, images) uses Framer Motion's `whileInView` for a staggered fade-up entrance (`opacity 0 -> 1, y 30 -> 0`).
- **Stats Counter:** Custom React `useEffect` counter increments numbers from 0 to target value when scrolled into view.
- **Custom Cursor:** A custom trailing dot and ring (`mix-blend-difference`) replaces standard interaction, expanding and hiding when hovering over click targets (`a`, `button`, `.hover-target`).

## 5. UI Elements
- **Cards & Images:** Soft corners (`rounded-[2rem]`) contrast the industrial typography. Drop shadows (`shadow-2xl`) give physical depth to product images.
- **Buttons (Filled):** Navy background, white text, 30px pill radius. Hover state: `translateY(-4px)` with massive tinted shadow `shadow-[0_30px_60px_rgba(15,76,129,0.4)]`.
- **Buttons (Outline):** Transparent background, border matching the current section context (Navy or White). Hover state fills the background.
- **Icons:** `lucide-react`. Clean, stroke-based SVG icons.

## 6. Installed Libraries
- **Framer Motion (`framer-motion`):** For all standard entrance animations, state transitions (like FAQ accordions), and infinite loops.
- **GSAP (`gsap`):** For high-performance scroll-linked animations (`ScrollTrigger`), pinning, and mouse parallax.
- **Lenis (`@studio-freight/lenis`):** For hijacking and smoothing the native browser scroll.
- **Lucide React (`lucide-react`):** For UI iconography (no emojis used).