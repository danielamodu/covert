---
name: Covert
description: Private agent commerce on Solana — sealed, confidential, zero metadata.
colors:
  ink: "oklch(0.145 0 0)"
  ink-faint: "oklch(0.205 0 0)"
  surface: "oklch(1 0 0)"
  surface-raised: "oklch(0.985 0 0)"
  surface-mid: "oklch(0.97 0 0)"
  border-strong: "oklch(0.145 0 0)"
  border-default: "oklch(0.922 0 0)"
  border-faint: "oklch(0.922 0 0 / 60%)"
  text-primary: "oklch(0.145 0 0)"
  text-secondary: "oklch(0.556 0 0)"
  text-ghost: "oklch(0.708 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
  private-surface: "oklch(0.145 0 0)"
  private-text: "oklch(0.985 0 0)"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8vw, 5rem)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.18em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: "0px"
  sm: "0px"
  md: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  "2xl": "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  button-destructive:
    backgroundColor: "transparent"
    textColor: "{colors.destructive}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.text-ghost}"
    rounded: "{rounded.none}"
    padding: "4px 0"
  nav-link-active:
    textColor: "{colors.ink}"
  chip-category:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  chip-category-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
  service-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "24px"
  private-card:
    backgroundColor: "{colors.private-surface}"
    textColor: "{colors.private-text}"
    rounded: "{rounded.none}"
    padding: "24px"
---

# Design System: Covert

## 1. Overview

**Creative North Star: "The Sealed Brief"**

Covert's visual language is borrowed from classified document design: dense
information without decoration, high contrast without flourish, hierarchy
expressed entirely through weight and tracking. Every element earns its place.
Nothing introduces itself; everything presents itself.

The system rejects crypto's standard aesthetic reflex — neon on black,
gradient text, glassmorphism as atmosphere — and refuses the inverse reflex
too: it is not trying to look like a friendly SaaS tool. It occupies a third
position: precision document. Think redacted government file, not dashboard.
The monochrome is not a limitation; it is the argument.

Color plays zero decorative role. The single chromatic exception is the
destructive (dispute/error) state: `oklch(0.577 0.245 27.325)` — a desaturated
red that appears only when something requires urgent attention. Its rarity is
structural. Everything else is achromatic.

**Key Characteristics:**
- Zero-radius borders on every interactive element (sharp = precise)
- All-caps labels with wide tracking (0.18–0.22em) as the primary labeling language
- Ink-on-white as the default surface; black-on-black for the private/shielded context
- Offset shadow (`4px 4px 0 0 #000`) on hover for service cards — tactile without softness
- `scale(0.97)` press feedback on all primary buttons — physical confirmation of intent

## 2. Colors: The Achromatic Signal

The palette is a controlled monochrome with one functional exception.

### Primary
- **Ink** (`oklch(0.145 0 0)` / near-black): The primary text color, active
  button fill, and strong border color. Used wherever authority and finality
  are required.
- **Private Surface** (`oklch(0.145 0 0)`): The background of the private
  balance card — same value as Ink, creating a black panel that signals the
  shielded/TEE context. This inversion (black card on white page) is the
  single structural signal of a separate trust boundary.

### Neutral
- **Surface** (`oklch(1 0 0)` / off-white, zero chroma): Page background.
- **Surface Raised** (`oklch(0.985 0 0)`): Table header backgrounds,
  input resting state. One step above white.
- **Surface Mid** (`oklch(0.97 0 0)`): Secondary backgrounds, muted surfaces.
- **Border Default** (`oklch(0.922 0 0)` / `border-black/10`): Table dividers,
  card boundaries at rest.
- **Border Strong** (`oklch(0.145 0 0)` / `border-black`): Active card hover,
  focused inputs, primary button borders.
- **Text Secondary** (`oklch(0.556 0 0)` / `text-neutral-500`): Labels,
  section headings, secondary metadata.
- **Text Ghost** (`oklch(0.708 0 0)` / `text-neutral-400`): Placeholder text,
  inactive nav links, tertiary metadata.

### Functional (exception only)
- **Destructive** (`oklch(0.577 0.245 27.325)`): Dispute buttons, error
  states, disputed deal status pills only. Never used decoratively.
- **Delivered/Info** (`oklch(0.6 0.15 240)` / blue-500 equivalent): Delivered
  deal status only. Not a palette color — it appears once, in one pill.

### Named Rules
**The One Chromatic Rule.** Color exists only to signal a state requiring
immediate attention (dispute, error) or a system boundary (private/shielded
context). It never appears for decoration, branding, or visual interest.
If you are adding color to make something look better, stop.

## 3. Typography: Tracked and Weighted

**Display/Headline Font:** Inter (with system-ui, sans-serif fallback)
**Body Font:** Inter
**Mono Font:** ui-monospace (SFMono-Regular, Menlo) for wallet addresses and
code values

**Character:** A single-family system that earns hierarchy through weight
contrast (400 vs 900) and tracking contrast (–0.02em headlines vs +0.18em
labels). The font itself is neutral; the application is not.

### Hierarchy
- **Display** (900 weight, clamp(3rem, 8vw, 5rem), line-height 1.02, –0.02em
  tracking): Hero headlines only. Appears once per page.
- **Headline** (900 weight, clamp(2rem, 5vw, 3.5rem), line-height 1.05,
  –0.02em tracking): Marketplace hero h1. Never used mid-page.
- **Title** (600 weight, 1rem, line-height 1.4, –0.01em tracking): Service
  card names, dialog titles.
- **Body** (400 weight, 0.875rem / 0.9375rem, line-height 1.6–1.7): Prose,
  descriptions, secondary content. Max line length 65ch in editorial contexts.
- **Label** (400 weight, 0.6875rem, line-height 1, +0.18em tracking,
  ALL CAPS): The primary labeling language of the system. Used for section
  headings, table headers, badge text, button text, nav links, eyebrows. Never
  sentence case in a label context.
- **Mono** (ui-monospace, 0.75rem): Wallet addresses, transaction signatures,
  code values. Always truncated with `truncate()` in the UI.

### Named Rules
**The Label Law.** Every UI label — section headers, table columns, button
text, status chips, eyebrows, nav links — is ALL CAPS with tracking ≥0.15em.
No exceptions. This is not stylistic; it is the system's language for
"this text is UI, not content."

**The Weight-Only Hierarchy Rule.** Scale steps between label (11px) and body
(14px) and headline (clamp) are intentionally compressed. Hierarchy is carried
by weight contrast (400 vs 900), not by large size differences alone.

## 4. Elevation

Covert is flat by default. Surfaces do not layer; they divide. The border
is the separator, not the shadow.

One shadow exists in the system, and it is structural: the 0-blur offset box
shadow on service card hover. It reads as a physical object lifting out of
the grid rather than as a soft ambient glow. It is the only depth signal.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 4px 4px 0 0 oklch(0.145 0 0)`): Applied on
  hover to service cards only. Hard-edged, zero blur, full Ink color. Signals
  interactivity through a physical metaphor: the card pushes off the grid.
- **Dialog** (`box-shadow: 8px 8px 0 0 oklch(0.145 0 0)`): Applied to modal
  dialog panels. Heavier than card lift; signals modal context and focus trap.

### Named Rules
**The Zero-Blur Rule.** No soft ambient shadows, no `blur` in any shadow
value. If depth is expressed, it is expressed through hard-edge offset
shadows only. Softness reads as approachability; this system is not
approachable.

**The Flat-By-Default Rule.** Surfaces rest flat. The card lift shadow
appears only on hover. The dialog shadow appears only in modal context.
Nothing is elevated at rest.

## 5. Components

### Buttons

Sharp, physical, binary. A button in Covert either fills with Ink on press
or inverts to white — there is no gradation.

- **Shape:** Zero border-radius (0px). No rounded corners anywhere in the
  system. Sharp = precise.
- **Primary** (Ink fill, white text): `background: oklch(0.145 0 0)`,
  `color: oklch(1 0 0)`, `border: 1px solid oklch(0.145 0 0)`,
  `padding: 10px 20px`, `font-size: 11px`, `letter-spacing: 0.18em`,
  ALL CAPS.
- **Primary Hover:** Full inversion — `background: oklch(1 0 0)`,
  `color: oklch(0.145 0 0)`. Border remains, making the button a visible
  frame. Transition: `colors 150ms cubic-bezier(0.23, 1, 0.32, 1)`.
- **Primary Active:** `scale(0.97)` via `.btn-press`. Physical confirmation.
- **Ghost** (transparent, border-faint, muted text): Used for secondary
  actions within the private balance card and deal action column. Hover
  sharpens the border to full Ink color.
- **Destructive** (transparent, border-destructive, destructive text): Dispute
  only. Never used for anything other than an irreversible or contested action.
- **Disabled:** `opacity: 0.5`. Shape and color do not change; the element
  recedes rather than transforms.

### Chips / Filter Pills

- **Style:** Zero-radius, 1px border. Resting: `border-black/20`, muted text.
- **Active state:** Full Ink fill, white text. The inversion mirrors the
  primary button pattern.
- **Context:** Category filters in the marketplace. Also used for Role badges
  (BUYER / SELLER) in the dashboard with `border-black/30`.

### Service Cards

The signature component. A flat white panel at rest that lifts with a hard
shadow on hover.

- **Corner Style:** Zero radius.
- **Background:** Surface white (`oklch(1 0 0)`).
- **Shadow Strategy:** None at rest; `4px 4px 0 0 oklch(0.145 0 0)` on hover.
- **Border:** `1px solid oklch(0.922 0 0)` at rest → `1px solid oklch(0.145 0 0)` on hover.
  Both borders change simultaneously with the shadow. The transition is the
  signal; the shadow is the emphasis.
- **Internal Padding:** 24px uniform.
- **Grid separator:** Cards are joined with `gap-px bg-black/10` — a 1px
  achromatic gap between cards forms a grid line without explicit borders.

### Private Balance Card

The inversion component. This is the only surface in the system that uses
the Ink color as a background.

- **Background:** `oklch(0.145 0 0)` (Private Surface). Signals TEE/shielded
  context without explanation.
- **Text:** `oklch(0.985 0 0)` (near-white). Labels use `text-white/60`;
  ghost text uses `text-white/40`.
- **Redacted state:** Blurred placeholder `██████` in `text-white/30`.
  The Lock icon at 20px (`strokeWidth: 1.75`) accompanies it.
- **Authenticate button:** Ghost on black — `border-white/20`, `text-white/60`.
  Hover sharpens to full white border and white text.

### Inputs / Fields

- **Style:** `1px solid border-black/20`, transparent background (or
  `bg-neutral-50` in dialogs). Zero radius.
- **Focus:** Border sharpens to full Ink (`border-black`). No ring, no glow.
  `focus:outline-none` — the border IS the focus signal.
- **Placeholder:** `text-neutral-400`.
- **Disabled:** `opacity: 0.5`, `pointer-events: none`.
- **Error:** Not yet systematized. Currently inline text in `text-red-500`.

### Navigation

- **Navbar height:** 56px (h-14). Fixed top, full width.
- **Background:** `bg-white/95 backdrop-blur-sm`. The only use of blur in the
  system — functional (context visibility) not decorative.
- **Wordmark:** `font-bold tracking-[0.2em] uppercase`, 14px. Links to
  `/marketplace`.
- **Nav links:** 11px, `tracking-[0.18em]`, ALL CAPS. Resting: `text-neutral-400`.
  Active: `text-black font-semibold`. Hover: `text-black`. Transition: 150ms.
- **Wallet button:** Primary button pattern in nav context. Inverts on hover;
  `scale(0.97)` on press.

### Data Tables (Active Deals / Transaction History)

- **Border:** `1px solid border-black/10` outer. Row dividers: `border-b border-black/10`.
- **Header row:** `bg-neutral-50`. ALL CAPS label text, `text-neutral-500`,
  `tracking-widest`.
- **Row hover:** `hover:bg-neutral-50`. Transition-colors.
- **Cell typography:** `text-xs` / `text-sm` for content; `text-[10px] tracking-widest
  uppercase` for status pills and secondary cells.

### Status Pills

Inline `<span>` elements, no background — border + text only.

- **Default:** `border-black/15 text-neutral-500`
- **Disputed:** `border-red-300 text-red-500`
- **Delivered:** `border-blue-300 text-blue-500`
- **Completed:** `border-black/15 text-neutral-500`

## 6. Do's and Don'ts

### Do:
- **Do** use zero border-radius on every interactive element: buttons,
  inputs, cards, chips, dialogs. Sharp edges are doctrine, not style.
- **Do** write every UI label in ALL CAPS with `letter-spacing: 0.18em`
  minimum. Section headings, table headers, button text, badge text, nav
  links — all caps, always.
- **Do** express button hover as a full fill-inversion (ink → white or
  white → ink). No partial tinting, no gradient, no opacity shift.
- **Do** use the hard-edge `4px 4px 0 0` offset shadow exclusively for card
  hover lift. Zero blur, full ink color. No other shadow pattern.
- **Do** use the Private Surface black (`oklch(0.145 0 0)`) only for the
  shielded/TEE balance context. It is a trust-boundary signal, not a style
  option.
- **Do** use `scale(0.97)` on `:active` for all primary buttons. Physical
  press confirmation.
- **Do** use `cubic-bezier(0.16, 1, 0.3, 1)` for entry animations (0.75s)
  and `cubic-bezier(0.23, 1, 0.32, 1)` for micro-interactions (150ms).
- **Do** cap body prose at 65–75ch. The system is information-dense; give
  reading lines room.

### Don't:
- **Don't** use gradient text (`background-clip: text`). Never. Forbidden.
  This is the most common crypto UI cliché and an absolute ban per the design
  laws. Use weight or scale for emphasis.
- **Don't** use neon, vivid color washes, or glow effects — the pump.fun /
  CoinGecko reflex. The system is achromatic except for functional exceptions.
- **Don't** use glassmorphism decoratively. The navbar `backdrop-blur` exists
  for functional context visibility. No other blur cards, frosted panels, or
  glass surfaces.
- **Don't** add soft ambient shadows (`box-shadow: 0 4px 12px rgba(0,0,0,0.1)`).
  The Zero-Blur Rule is absolute. Soft shadows read as SaaS friendliness.
- **Don't** use rounded corners. `rounded-lg`, `rounded-md`, `rounded-full` —
  none of these belong in this system. Every corner is 0px.
- **Don't** use color for decoration. No accent colors on headings, no colored
  icons, no tinted section backgrounds. Color appears only in destructive states.
- **Don't** add friendly onboarding language, empty-state illustrations, or
  reassurance copy. The users are operators; treat them as such.
- **Don't** animate layout properties (`height`, `width`, `padding`, `margin`).
  Animate `transform` and `opacity` only.
- **Don't** use `ease-in` or `linear` timing. Every transition uses an
  exponential ease-out curve.
- **Don't** use `transition: all`. Always declare specific properties:
  `transition-property: color, background-color, border-color, transform`.
