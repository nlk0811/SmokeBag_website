# DESIGN.md — Higgsfield Ad Creatives Portfolio

## Visual Theme & Atmosphere
**Archetype:** Cinematic dark + Technical precision  
**Philosophy:** Radical subtraction. Every element earns its place. The ads are the product — let them breathe.  
**Mood:** Premium, dark-studio, editorial. Feels like a high-end creative agency showreel, not a freelancer portfolio.

---

## Color Palette & Roles

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#070707` | Page background |
| `--surface` | `#0f0f0f` | Card surfaces |
| `--surface-2` | `#1a1a1a` | Elevated surfaces, overlays |
| `--border` | `#242424` | Subtle borders |
| `--text` | `#f0f0f0` | Primary text |
| `--text-2` | `#888888` | Secondary / meta text |
| `--text-3` | `#444444` | Muted / placeholder |
| `--accent` | `#c8ff00` | Electric lime — CTAs, hover states, accents only |
| `--accent-dim` | `#8aaf00` | Dimmed accent for hover |

**Rules:**
- Accent (`--accent`) is reserved exclusively for the highest-priority CTAs and hover highlights
- Never use accent for decorative purpose
- White text on dark bg — no off-white except `--text-2`

---

## Typography Rules

| Role | Size | Weight | Letter-spacing |
|---|---|---|---|
| Hero headline | 88px / 72px (tablet) / 48px (mobile) | 900 | -0.03em |
| Section heading | 40px / 32px | 700 | -0.02em |
| Card label | 14px | 600 | 0.04em uppercase |
| Body | 16px | 400 | normal |
| Meta / caption | 13px | 400 | normal |
| CTA button | 14px | 600 | 0.06em uppercase |

**Font stack:** `'Inter', system-ui, -apple-system, sans-serif`  
**Display weight:** Use font-weight 900 with tight letter-spacing for maximum impact.

---

## Component Styling

**Cards (portfolio items):**
- Background: `--surface`
- Aspect ratio: 4/5 (portrait — matching Meta ad format)
- Radius: 6px
- Hover: `transform: scale(1.01)` + overlay reveal (brand name + view button)
- No border by default; subtle 1px `--border` on hover

**Buttons:**
- Primary: `background: --accent; color: #000; border-radius: 4px; padding: 12px 24px`
- Secondary: `background: transparent; border: 1px solid --border; color: --text`
- Hover primary: `background: --accent-dim`
- No pill shapes — zero or minimal radius only

**Filter pills:**
- Inactive: `background: --surface; border: 1px solid --border; color: --text-2`
- Active: `background: --accent; color: #000`
- Size: small, compact

**Lightbox:**
- Backdrop: `rgba(7, 7, 7, 0.95)` with `backdrop-filter: blur(8px)`
- Content: image fills viewport with 40px padding
- Close: top-right X, text style

**Navigation:**
- Sticky, translucent dark background
- Logo left, CTA right
- No hamburger on desktop

---

## Layout Principles

**Spacing scale:** 4px base unit — 8, 16, 24, 32, 48, 64, 96, 128px  
**Container:** max-width 1320px, centered, 32px horizontal padding  
**Grid:** CSS auto-fill grid, `minmax(280px, 1fr)`, 16px gap  
**Whitespace:** Generous — hero section has breathing room above/below headline  
**Alignment:** Left-aligned text throughout (except hero which is centered)

---

## Depth & Elevation

- Level 0: Background `--bg`
- Level 1: Cards `--surface`
- Level 2: Overlays, nav `--surface-2`
- Level 3: Lightbox `rgba(7,7,7,0.95)`

Shadows: Avoid decorative drop shadows. Use z-index and background layers only.

---

## Do's and Don'ts

**Do:**
- Let the ad images be the primary visual element
- Use whitespace generously
- Keep the UI invisible — it serves the content
- High contrast: near-black bg, pure white text

**Don't:**
- No rounded mega-corners (max 6px)
- No gradient backgrounds or colored sections
- No decorative micro-labels, badges, or status pills
- No filler copy ("seamless", "revolutionize", "next-gen")
- No card shadows with blur
- No light mode

---

## Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| Desktop (1200px+) | 4-column grid |
| Tablet (768–1199px) | 2–3 column grid |
| Mobile (<768px) | 1–2 column grid, hero text 48px |

Touch targets: min 44px height on interactive elements.

---

## Agent Prompt Guide

**Quick ref for future builds:**
- Dark bg: `#070707`
- Accent: `#c8ff00`
- Font: Inter 900 for display
- Cards: `aspect-ratio: 4/5`, no heavy shadows
- Images from: `https://drive.google.com/thumbnail?id=FILE_ID&sz=w600`
