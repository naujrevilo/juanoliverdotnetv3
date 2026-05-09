# Design System — juanoliver.net

## Identity

- **Brand:** Juan Oliver · Ciberseguridad
- **Domain:** juanoliver.net
- **Tone:** Technical, authoritative, precise. No decorative excess.
- **Mode:** Dark-first. All video compositions use dark mode palette.

---

## Colors

### Brand palette

| Token           | Hex       | Use                                      |
|-----------------|-----------|------------------------------------------|
| security-blue   | `#001A5A` | Primary brand — headlines, key elements |
| security-blue-light | `#4A72B2` | Secondary blue, hover states        |
| security-green  | `#00A88E` | Success, positive indicators            |
| security-red    | `#981628` | Danger, alerts, critical warnings       |
| security-yellow | `#D19219` | Caution, warnings, accent highlights    |

### Dark mode palette (video default)

| Token            | Hex       | Tailwind equiv | Use                        |
|------------------|-----------|----------------|----------------------------|
| bg-start         | `#0f172a` | slate-900      | Background gradient start  |
| bg-end           | `#1e293b` | slate-800      | Background gradient end    |
| surface-50       | `#020617` | slate-950      | Deepest surfaces           |
| surface-100      | `#1e293b` | slate-800      | Cards, containers          |
| surface-200      | `#334155` | slate-700      | Elevated surfaces, borders |
| stroke-300       | `#475569` | slate-600      | Subtle borders, dividers   |
| stroke-400       | `#64748b` | slate-500      | Visible borders            |
| accent-primary   | `#38bdf8` | sky-400        | **Main accent — CTAs, highlights, glows** |
| accent-secondary | `#0ea5e9` | sky-500        | Supporting accent          |
| text-main        | `#cbd5e1` | slate-300      | Body copy                  |
| text-heading     | `#f1f5f9` | slate-100      | Headings, titles           |
| success          | `#34d399` | emerald-400    | Positive states            |
| warning          | `#fbbf24` | amber-400      | Caution states             |
| danger           | `#f87171` | red-400        | Error, critical            |

### Gradients

- **Background:** `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`
- **Accent glow:** `radial-gradient` from `#38bdf8` at 12% opacity, feathered to transparent
- **Brand overlay:** `radial-gradient` from `#001A5A` at 15% opacity

---

## Typography

- **Font family:** System sans-serif stack (Tailwind default: `ui-sans-serif, system-ui, -apple-system`)
- **Headings:** `font-bold`, `tracking-tight` (letter-spacing: -0.025em)
- **Body:** Regular weight, `tracking-normal`
- **Code/mono:** System monospace (`ui-monospace, SFMono-Regular, Menlo`)

### Scale guidance for video

| Role         | Size guidance | Weight |
|--------------|---------------|--------|
| Hero title   | 96–120px      | Bold   |
| Section head | 56–72px       | Bold   |
| Subtitle     | 36–48px       | Regular/Medium |
| Body copy    | 28–36px       | Regular |
| Label/badge  | 18–24px       | Medium, tracking-wide |
| Caption      | 20–24px       | Regular |

---

## Patterns & Textures

Two background patterns are available. Use sparingly — one per composition maximum.

- **pattern-grid-lg:** 40×40px grid, lines at 3% white opacity. Good for tech/infrastructure scenes.
- **pattern-circuit:** Repeating orthogonal lines at 50px spacing, 3% white opacity. Cybersecurity scenes.

Apply at low opacity (0.05–0.15) over the background gradient. Never over text.

---

## Motion

- **Entry default:** `fade-in-up` — opacity 0→1, translateY 20px→0, duration 0.8s, ease-out
- **Feel:** Deliberate, not playful. Avoid bounces and elastic easing.
- **Preferred easings:** `power2.out`, `power3.out`, `expo.out`
- **Avoid:** `back.out`, `elastic`, `bounce` — too casual for the brand

---

## Corners & Depth

- **Border radius:** Subtle — `4px` for badges/chips, `8px` for cards, `0` for hero frames
- **Shadows:** Functional, not decorative. Glow effects only on `accent-primary` elements
- **Glow pattern:** `0 0 24px rgba(56,189,248,0.3)` — sky-400 at 30% for highlighted elements

---

## What NOT to Do

- No purple gradients or generic AI aesthetics
- No white backgrounds in video compositions
- No neon/gaming color schemes — this is enterprise security, not esports
- No playful or rounded typography choices
- Never invent colors outside the palette
- Never mix light and dark mode values in the same composition
- No decorative emojis in titles or overlays
