# SAMS Animations Plan — React Bits

Source: [reactbits.dev](https://reactbits.dev/)  
Philosophy: **Subtle and premium** — the brand is Laufen/Duravit-level. We pick a handful of effects that add depth without distraction.

---

## What we are picking (5 things)

---

### 1. `ScrollReveal` — section headings
**Page:** Home, Products, Brand pages, Policy pages  
**Where exactly:** Every `<SectionHeading>` component and major `<h1>` / `<h2>` blocks  
**What it does:** Text gently un-blurs and lifts into view as the user scrolls past it. Starts invisible and slightly downward-offset, resolves to sharp + in-place.  
**Why it fits:** Laufen.com and Duravit use this exact pattern. It feels editorial, not gimmicky.  
**How it will look:**

```
User scrolls ↓

  [blurred, shifted down]               →   "Premium Sanitary Fittings"
  "Premium Sanitary Fittings"                 (sharp, in place)
```

**Dependencies:** None (pure CSS). Install:
```bash
npx shadcn@latest add https://reactbits.dev/r/ScrollReveal-TS-TW
```

---

### 2. `BlurText` — hero tagline words
**Page:** Home (`CinematicHero`), Brand pages (Sanmate, Wyped hero section)  
**Where exactly:** The main one-liner below the hero slide title — e.g. *"Designed for Pakistani homes."*  
**What it does:** Each word fades in sharp from a blurred state, staggered left → right. Fires once on page load.  
**Why it fits:** Gives the cinematic hero a cinematic opening without touching the slide imagery. The rest of the hero (image pan, progress bar) stays untouched.  
**How it will look:**

```
Page loads:
  [blur]DESIGNED [blur]FOR [blur]PAKISTANI [blur]HOMES.
                   ↓ (stagger, ~80ms per word)
  DESIGNED FOR PAKISTANI HOMES.
```

**Dependencies:** None.  
```bash
npx shadcn@latest add https://reactbits.dev/r/BlurText-TS-TW
```

---

### 3. `AnimatedContent` — product cards and feature blocks
**Page:** Home (product grid, brand strip), Products page (grid), Brand pages  
**Where exactly:** Wrap every `<ProductCard>` and every "feature" or "stat" block in an `AnimatedContent` with `direction="vertical"` and a small `distance` (e.g. 24 px).  
**What it does:** Children slide + fade in when they enter the viewport. Stagger is set per row so the grid feels alive without being loud.  
**Why it fits:** Dead-simple — pure CSS, no GSAP. Works on everything from a card to a banner image. Already the most-used React Bits component.  
**How it will look:**

```
(scroll to product grid)

  Row 1: [hidden] [hidden] [hidden]
             ↓ 0.1 s stagger ↓
  Row 1:  Card ↑  Card ↑  Card ↑   (slide up 24 px + fade in)
```

**Dependencies:** None.
```bash
npx shadcn@latest add https://reactbits.dev/r/AnimatedContent-TS-TW
```

---

### 4. `ScrollVelocity` — ticker / marquee strip
**Page:** Home (existing ticker strip between hero and brands)  
**Where exactly:** Replace the current CSS `tickerItems` marquee with `ScrollVelocity`. The text already says "SAMS Enterprises · House of Sanmate & Wyped · …"  
**What it does:** Horizontal marquee where speed and slight warp scale with how fast the user is scrolling — fast scroll = fast marquee, idle = slow drift.  
**Why it fits:** The ticker is already there; this just makes it reactive to scroll so it feels physically alive. Very on-brand for a premium house.  
**How it will look:**

```
Slow scroll:   ← SAMS Enterprises · House of Sanmate & Wyped · Designed for Pakistani homes · ←  (gentle)
Fast scroll:   ← SAMS Enterprises · House of Sanmate & Wyped · Designed for Pakistani homes · ←←← (fast + slight skew)
```

**Dependencies:** None.
```bash
npx shadcn@latest add https://reactbits.dev/r/ScrollVelocity-TS-TW
```

---

### 5. `GlareHover` — primary CTA buttons and product cards
**Page:** Home (hero CTA, brand cards), Products page cards  
**Where exactly:** Wrap `btn-primary` / "Shop now" / "Explore Sanmate" calls-to-action. Optionally wrap `<ProductCard>` too.  
**What it does:** A moving light-glare highlight sweeps across the element on hover — like a torch held over a glossy surface. No movement of the element itself.  
**Why it fits:** Adds premium tactility to the CTAs without any animation on idle. Very similar to what Apple and high-end retail sites do on their cards.  
**How it will look:**

```
Before hover: [  Shop Sanmate  ]
Hover (move mouse across):
              [  Shop ✦ Sanmate  ]   (glare moves with pointer)
```

**Dependencies:** None.
```bash
npx shadcn@latest add https://reactbits.dev/r/GlareHover-TS-TW
```

---

## What we are NOT using (and why)

| Component | Reason skipped |
|---|---|
| `SplashCursor`, `BlobCursor` | Too playful, kills premium feel |
| `ParticleText`, `GlitchText` | Wrong tone — sanitary fittings ≠ gaming |
| `Aurora`, `Ballpit` backgrounds | Too decorative for a product storefront |
| `DepthText`, `WarpText` | Require WebGL, heavy, overkill |
| `FlyingPosters`, `DomeGallery` | Heavy 3D — not justified for product pages |
| `TrueFocus`, `DecryptedText` | Interesting but tech-demo vibes, not retail |

---

## Implementation order

1. **`AnimatedContent`** — most impact, zero risk. Wrap existing cards.
2. **`ScrollReveal`** — drop into `SectionHeading` component once.
3. **`BlurText`** — one line in `CinematicHero` tagline.
4. **`ScrollVelocity`** — replace ticker in `HomePage.tsx`.
5. **`GlareHover`** — last, purely cosmetic enhancement.

---

## Pages affected

| Page | Components used |
|---|---|
| `HomePage.tsx` | `BlurText` (hero tagline), `ScrollVelocity` (ticker), `AnimatedContent` (product grid, brand cards), `GlareHover` (CTAs) |
| `CinematicHero.tsx` | `BlurText` (subtitle) |
| `BrandPage.tsx` | `BlurText` (hero), `ScrollReveal` (description), `AnimatedContent` (product grid) |
| `ProductsPage.tsx` | `AnimatedContent` (card grid), `GlareHover` (cards) |
| `PolicyPage.tsx` | `ScrollReveal` (headings) |
| `SectionHeading.tsx` | `ScrollReveal` (global) |

---

## Notes on installation

All five components are TypeScript + Tailwind variants. Install via shadcn CLI into `web/src/components/bits/` (create the folder). No extra npm packages needed for any of the five above. GSAP / Three.js are only required by the Pro or 3D variants we are not using.
