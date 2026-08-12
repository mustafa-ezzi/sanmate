# Sams Enterprises — UI Design & Motion Guide

This document records the visual system used by the Sams Enterprises storefront prototype. It is intended as a handoff for future UI work, production implementation, and brand-consistent extensions.

## Product direction

Sams Enterprises is a product house with two distinct collections:

- **Sanmate** — tactile, calm, considered, and catalog-like.
- **Wyped** — expressive, charged, sharper, and more energetic.

The shared Sams layer should feel editorial and confident rather than like a generic e-commerce dashboard. Product imagery, large typography, whitespace, and motion carry most of the storytelling.

The prototype is intentionally UI-only. The bag, search, favorites, newsletter, brand switcher, and navigation are presentational interface states rather than connected commerce flows.

## Type system

Fonts are loaded in `src/index.css` from Google Fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
```

| Use | Font | Notes |
| --- | --- | --- |
| Display headlines | Manrope | Heavy weights, tight negative tracking, compressed line-height |
| Body copy | DM Sans | Comfortable reading size, soft gray for secondary copy |
| Utility labels | DM Mono | Uppercase, widely tracked, used for navigation, metadata, prices, and overlines |

The theme aliases these as:

```css
--app-font-sans: 'DM Sans', sans-serif;
--app-font-serif: 'Manrope', sans-serif;
--app-font-mono: 'DM Mono', monospace;
```

`font-serif` is intentionally mapped to Manrope: it is the display face in this product, not a literal serif font.

### Type rules

- Use oversized display type to establish each section quickly.
- Keep display headlines between approximately `-.07em` and `-.1em` tracking.
- Use `leading-[.88]` to `leading-[.95]` for large editorial headlines.
- Keep utility labels small and uppercase with tracking between `.13em` and `.22em`.
- Use sentence case for body copy and product names.
- Avoid adding additional font families unless the brand system is intentionally revised.

## Shared color system

The shared house layer uses a mineral-neutral base and ink navy:

| Token | Hex | Role |
| --- | --- | --- |
| Mineral background | `#F7F7F5` | Main canvas and light surfaces |
| Surface | `#FFFFFF` | Cards, floating product callouts, overlays |
| Ink | `#111111` | Primary text and high-contrast controls |
| Secondary text | `#666666` | Descriptions, metadata, and supporting copy |
| Border | `#E6E6E6` | Quiet dividers and control outlines |
| House navy | `#171C4E` | Announcement bar, ticker, promotional block, footer |

Do not use pure white as the entire page background. The off-white mineral tone creates the physical catalog feeling and lets white cards float above it.

## Sanmate palette

Sanmate should feel restrained and tactile:

| Token | Hex | Role |
| --- | --- | --- |
| Background | `#F7F7F5` | Warm off-white canvas |
| Surface | `#FFFFFF` | Product cards and floating surfaces |
| Text | `#111111` | Headlines and primary copy |
| Secondary text | `#666666` | Body copy and supporting metadata |
| Navy | `#0F4C81` | Primary buttons, prices, active controls, key type |
| Orange | `#E8601C` | Eyebrows, highlights, active indicators, important accents |
| Border | `#E6E6E6` | Quiet structure |
| Soft navy tint | `#EAF1F5` | Success and selected states |

Sanmate image treatment is generally lower saturation (`saturate(.7)`) so the object photography feels calm and physical.

## Wyped palette

Wyped should feel more immediate and energetic while remaining part of the Sams house:

| Token | Hex | Role |
| --- | --- | --- |
| Ink navy | `#171C4E` | Primary Wyped brand tone |
| Signal orange-red | `#E94321` | Highlights, active accents, CTA emphasis |
| Soft warm tint | `#F6DDD6` | Brand card backgrounds and supporting surfaces |
| Mineral base | `#F3F1F0` | Wyped hero canvas |
| Shared text | `#111111` | Legible type and neutral content |

Wyped image treatment increases energy with `saturate(1.2)` to `saturate(1.35)` and a small contrast lift.

## Brand switching behavior

Brand state is controlled by the `Brand` union in `src/App.tsx`:

```ts
type Brand = 'sanmate' | 'wyped';
```

When the brand changes:

1. The hero headline, eyebrow, supporting copy, and featured product change.
2. Hero, category, product, and promotional imagery changes.
3. Active controls use the selected brand's ink.
4. Accent highlights use the selected brand's accent.
5. Product cards use the selected brand's product set.
6. The product rail scroll position resets and the shop section is brought into view.

Keep the shared Sams navigation, editorial structure, and interaction language stable. The difference should come from tone, color, imagery, copy, and product energy—not from creating two unrelated websites.

## Layout principles

### Page rhythm

- The page uses a wide editorial canvas capped at approximately `1440px`.
- Desktop content uses `px-10`; mobile content uses `px-5`.
- Major sections use generous vertical spacing, generally `py-24` to `py-36` on desktop.
- Avoid stacking every section inside a card. Use full-bleed color fields and image moments to create pacing.

### Hero

The hero uses a two-column desktop grid:

- Editorial copy and brand controls occupy the left side.
- A tall product/lifestyle image occupies the right side.
- A floating featured-product card overlaps the image near its lower edge.
- On mobile, copy comes first and the image becomes a full-width visual anchor.

The hero should remain the strongest moment on the page. If adding content, preserve the oversized headline and image contrast rather than pushing them below the fold.

### Product rail

The current product edit is a horizontal snap-scrolling rail:

```tsx
<div id="product-rail" className="scrollbar-none mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
```

- Cards remain readable at mobile widths with a minimum width.
- Desktop arrow controls scroll by roughly `330px`.
- Product images zoom subtly on hover.
- Add-to-bag appears on hover on desktop; the card remains usable without hover on touch devices.
- Favorite buttons are always visible.

### Responsive behavior

- Desktop navigation is hidden below `lg`; the menu button appears on mobile.
- Hero type uses `clamp()` to scale without requiring many breakpoints.
- Product rails stay horizontal rather than forcing a cramped grid.
- Promotional and editorial two-column sections collapse into a natural vertical order.
- Tap targets should remain at least around `40px` for icon controls.

## Motion recipes

Motion is used to make the storefront feel like a product film, not to decorate every element. Respect `prefers-reduced-motion` when adding future animation.

### Rise-in entrance

Used for the hero control, eyebrow, headline, copy, and CTA group:

```css
@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rise-in {
  animation: rise-in .8s cubic-bezier(.22, .8, .26, 1) both;
}

.rise-delay-1 { animation-delay: .08s; }
.rise-delay-2 { animation-delay: .16s; }
.rise-delay-3 { animation-delay: .24s; }
```

Use this for initial hierarchy, not for every card on the page.

### Product elevation

The featured product callout uses a gentle vertical drift:

```css
@keyframes drift {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

.product-float {
  animation: drift 5s ease-in-out infinite;
}
```

The movement is deliberately slow so the floating card feels physical rather than attention-seeking.

### Statement ticker

The navy statement band duplicates its content so it can loop without a visible seam:

```css
@keyframes ticker {
  to { transform: translateX(-50%); }
}

.ticker-track {
  animation: ticker 25s linear infinite;
}
```

When changing ticker content, keep the duplicated groups the same width and preserve `whitespace-nowrap`.

### Soft pulse

Use for low-priority decorative indicators only:

```css
@keyframes soft-pulse {
  0%, 100% { opacity: .65; }
  50% { opacity: 1; }
}

.soft-pulse {
  animation: soft-pulse 2.8s ease-in-out infinite;
}
```

### Interaction transitions

- Hero buttons: expand the right padding slightly and move the arrow diagonally.
- Product cards: scale the image to approximately `1.045` over `700ms`.
- Brand cards: active card lifts slightly; inactive card lowers opacity.
- Category tiles: lift by about `1px` on hover and move the corner arrow.
- Overlays: use backdrop blur with a dark translucent tint.
- Drawers: use a shadowed surface that slides in from the right without obscuring the entire page on desktop.

Prefer transforms and opacity over animating layout properties. Keep transitions between `300ms` and `700ms` unless the movement is a continuous loop.

### Reduced motion

Future motion additions should include:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
}
```

## Image treatment and assets

Current visual assets live in `public/`:

- `sanmate-hero.png` — warm Sanmate hero/product world
- `wyped-hero.png` — energetic Wyped hero/product world
- `editorial-room.png` — shared lifestyle/editorial scene

Image guidelines:

- Always provide descriptive alt text.
- Use `object-cover` for editorial panels and product-led image moments.
- Apply the brand-specific saturation treatment through CSS rather than duplicating assets.
- Keep image overlays subtle; products should remain the focal point.
- Prefer original or licensed photography for production.
- If replacing generated imagery, preserve the crop ratios used by the hero and product rail so responsive composition does not change unexpectedly.

## Interaction states included

The UI prototype includes these presentational states:

- Sanmate / Wyped brand switcher
- Desktop and mobile navigation
- Search overlay
- Empty shopping bag drawer
- Added-to-bag confirmation state
- Favorite toggles
- Product rail arrow controls
- Newsletter input success state
- Anchor-style section navigation
- Back-to-top control

Keep controls visually consistent with the utility-label language and always provide an accessible label for icon-only actions.

## Accessibility checklist

- Use semantic `main`, `header`, `nav`, `section`, `article`, `aside`, `form`, and `footer`.
- Maintain visible keyboard focus states when custom styling controls.
- Use `aria-label` on icon-only buttons.
- Use `role="tablist"`, `role="tab"`, and `aria-selected` for the brand switcher.
- Keep body copy at a readable contrast against mineral surfaces.
- Do not use color alone to communicate selected or successful states.
- Preserve motion reduction support for production.
- Keep the mobile menu and overlays dismissible with a clear close button.

## Implementation map

| File | Responsibility |
| --- | --- |
| `src/App.tsx` | Storefront composition, brand data, UI state, section structure, product cards, overlays |
| `src/index.css` | Theme variables, font loading, base styles, animation keyframes, utility motion classes |
| `public/sanmate-hero.png` | Sanmate visual asset |
| `public/wyped-hero.png` | Wyped visual asset |
| `public/editorial-room.png` | Shared editorial visual asset |

The storefront intentionally has no API, authentication, database, or checkout integration. Any future production commerce work should preserve the current visual states while replacing the local arrays and `cartCount` UI state with real data contracts.