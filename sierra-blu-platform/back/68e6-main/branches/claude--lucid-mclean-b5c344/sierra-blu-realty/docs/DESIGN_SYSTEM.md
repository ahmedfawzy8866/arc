# Sierra Blu Realty -- Design System

Version 1.0 | Last Updated: 2026-05-16

---

## Brand Overview

Sierra Blu Realty is a luxury AI-powered real estate advisory platform operating in New Cairo, Egypt. The brand identity merges deep navy tones with warm gold accents to communicate trust, exclusivity, and technological sophistication. Every design decision should reinforce the position as a premium advisory service -- not a commodity listing portal.

---

## Color Palette

### Navy Family

| Token          | Role             | Hex       | Usage                                      |
|----------------|------------------|-----------|---------------------------------------------|
| `navy-900`     | Deepest navy     | `#050E1F` | Text overlays, maximum contrast backgrounds |
| `navy-800`     | Background       | `#0A1A3A` | Primary page background                     |
| `navy-700`     | Surface          | `#122245` | Card backgrounds, elevated surfaces         |
| `navy-surface-alt` | Surface Alt  | `#1A2A4E` | Alternate surface, hover states             |

### Gold Family

| Token          | Role             | Hex       | Usage                                       |
|----------------|------------------|-----------|----------------------------------------------|
| `gold-700`     | Dark gold        | `#A67C2E` | Borders, subtle accents                      |
| `gold-500`     | Primary gold     | `#C9A24A` | Primary accent, CTAs, key interactive elements |
| `gold-400`     | Light gold       | `#D4B26A` | Hover states, secondary accents              |

### Gold Glow

| Token          | Value                          | Usage                           |
|----------------|--------------------------------|----------------------------------|
| `gold-glow`    | `rgba(201, 162, 74, 0.35)`    | Box shadows, glow effects, focus rings |

### Neutrals

| Token          | Role             | Hex       | Usage                                       |
|----------------|------------------|-----------|----------------------------------------------|
| `foreground`   | Primary text     | `#F8FAFC` | Headings, body text on dark backgrounds      |
| `offwhite`     | Off-white        | `#F8F8F8` | Secondary text, subtle labels                |
| `mist`         | Mist             | `#DFE3ED` | Dividers, borders, low-emphasis text         |
| `silver`       | Silver           | `#8A93AB` | Placeholder text, disabled states            |
| `blue-gray`    | Blue Gray        | `#4E5872` | Muted text, metadata, captions               |

### CSS Custom Properties

```css
:root {
  --navy-900: #050E1F;
  --navy-800: #0A1A3A;
  --navy-700: #122245;
  --navy-surface-alt: #1A2A4E;
  --gold-700: #A67C2E;
  --gold-500: #C9A24A;
  --gold-400: #D4B26A;
  --gold-glow: rgba(201, 162, 74, 0.35);
  --foreground: #F8FAFC;
  --offwhite: #F8F8F8;
  --mist: #DFE3ED;
  --silver: #8A93AB;
  --blue-gray: #4E5872;
}
```

---

## Typography

### Typeface Pairing

| Typeface          | Role                     | Weight Range | Letter Spacing | CSS Import                                  |
|-------------------|--------------------------|--------------|----------------|----------------------------------------------|
| Playfair Display  | Display, luxury headings | 400--700     | `0.12em`       | `font-family: 'Playfair Display', serif`    |
| Inter             | Body, premium UI text    | 300--700     | `-0.02em`      | `font-family: 'Inter', sans-serif`          |

### Type Scale

| Style              | Typeface          | Size       | Weight | Tracking   | Line Height |
|--------------------|-------------------|------------|--------|------------|-------------|
| Display XL         | Playfair Display  | 4.5rem     | 700    | 0.12em     | 1.1         |
| Display LG         | Playfair Display  | 3.75rem    | 700    | 0.12em     | 1.1         |
| Display MD         | Playfair Display  | 3rem       | 700    | 0.12em     | 1.15        |
| Heading LG         | Playfair Display  | 2.25rem    | 600    | 0.12em     | 1.2         |
| Heading MD         | Playfair Display  | 1.875rem   | 600    | 0.12em     | 1.25        |
| Heading SM         | Playfair Display  | 1.5rem     | 600    | 0.12em     | 1.3         |
| Body LG            | Inter             | 1.125rem   | 400    | -0.02em    | 1.7         |
| Body MD            | Inter             | 1rem       | 400    | -0.02em    | 1.6         |
| Body SM            | Inter             | 0.875rem   | 400    | -0.02em    | 1.5         |
| Label              | Inter             | 0.75rem    | 600    | 0.08em     | 1.4         |
| Label Uppercase    | Inter             | 0.6875rem  | 700    | 0.15em     | 1.3         |

### Usage Rules

- **Playfair Display** is reserved for display headings and hero text. Never use it for body copy or UI labels.
- **Inter** is the workhorse typeface for all body text, buttons, navigation, form inputs, and metadata.
- Gold-colored text should only use Playfair Display or uppercase Inter labels.
- Minimum body text size: 14px (0.875rem) for readability.

---

## Glass Morphism

The glass effect is a core visual pattern used for cards, modals, and elevated surfaces.

### Glass Card Base

```css
.glass-card {
  background: rgba(10, 26, 58, 0.55);
  border: 1px solid rgba(201, 162, 74, 0.18);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border-radius: 40px;
}
```

### Properties

| Property           | Value                          |
|--------------------|--------------------------------|
| Background         | `rgba(10, 26, 58, 0.55)`      |
| Border             | `1px solid rgba(201, 162, 74, 0.18)` |
| Backdrop Blur      | `32px`                         |
| Border Radius      | `40px`                         |

### Layering Rules

- Glass cards sit on top of the `navy-800` page background.
- Never stack more than two glass layers (glass on glass causes readability issues).
- On hover, increase border opacity to `rgba(201, 162, 74, 0.35)` for subtle gold reveal.
- Drop shadow on elevated glass: `0 8px 32px rgba(5, 14, 31, 0.4)`.

---

## Button System

### Button Variants

| Variant            | Background                    | Text Color | Border                          | Hover Effect                          |
|--------------------|-------------------------------|------------|----------------------------------|----------------------------------------|
| `btn-gold`         | `gold-500` solid              | `navy-900` | None                             | Lighten to `gold-400`, subtle lift     |
| `btn-primary`      | Gold gradient with shimmer    | `navy-900` | None                             | Shimmer animation sweep                |
| `btn-ghost-glass`  | `transparent`                 | `foreground` | `1px solid rgba(201,162,74,0.18)` | Glass background fade-in             |
| `btn-outline`      | `transparent`                 | `gold-500` | `1px solid gold-500`            | Fill with `gold-500`, text to `navy-900` |

### Button Specifications

| Property           | Value                          |
|--------------------|--------------------------------|
| Height             | 44px (default), 36px (sm), 52px (lg) |
| Padding            | `0 24px` (default), `0 16px` (sm), `0 32px` (lg) |
| Border Radius      | `9999px` (fully rounded)       |
| Font               | Inter, 600 weight              |
| Font Size          | 0.875rem (default), 0.75rem (sm), 1rem (lg) |
| Letter Spacing     | `0.04em`                       |
| Transition         | `all 200ms ease`               |

### Shimmer Effect (btn-primary)

The primary button features a diagonal shimmer sweep on hover:

```css
.btn-primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transition: left 600ms ease;
}

.btn-primary:hover::after {
  left: 100%;
}
```

---

## Component Patterns

### Label Tag

Small uppercase labels used to categorize content.

```
Font: Inter, 700 weight, 0.6875rem
Letter Spacing: 0.15em
Text Transform: uppercase
Color: gold-500
Background: rgba(201, 162, 74, 0.12)
Padding: 4px 12px
Border Radius: 9999px
```

### Gold Line

Decorative horizontal rule used as a section divider or accent element.

```
Width: 48px (default), 64px (wide variant)
Height: 2px
Background: linear-gradient(90deg, gold-500, gold-400)
Border Radius: 1px
```

### Badge Gold

Status or category badge with gold styling.

```
Font: Inter, 600 weight, 0.75rem
Color: gold-500
Background: rgba(201, 162, 74, 0.15)
Border: 1px solid rgba(201, 162, 74, 0.25)
Padding: 4px 10px
Border Radius: 6px
```

### Badge Navy

Alternative badge for secondary categorization.

```
Font: Inter, 600 weight, 0.75rem
Color: foreground (#F8FAFC)
Background: rgba(18, 34, 69, 0.8)
Border: 1px solid rgba(223, 227, 237, 0.15)
Padding: 4px 10px
Border Radius: 6px
```

### Glass Card

See Glass Morphism section above for base properties.

```
Padding: 32px (default), 24px (compact)
Inner Content Spacing: 16px gap
Hover: border-color transitions to rgba(201, 162, 74, 0.35)
Transition: border-color 400ms ease
```

### Card Listing

Property listing card built on the glass card foundation.

```
Base: Glass Card properties
Image Container: aspect-ratio 4/3, border-radius 24px, overflow hidden
Image Hover: grayscale(100%) -> grayscale(0%), scale(1) -> scale(1.05)
Image Transition: 700ms ease
Content Padding: 20px
Title: Heading SM (Playfair Display)
Price: Body LG (Inter), gold-500 color
Metadata: Body SM (Inter), silver color
Footer: border-top 1px solid rgba(201, 162, 74, 0.1), padding-top 16px
```

---

## Spacing System

### Base Unit

All spacing is built on an **8px grid**. Every margin, padding, and gap value should be a multiple of 8.

| Token   | Value  | Usage                                |
|---------|--------|---------------------------------------|
| `xs`    | 4px    | Icon gaps, tight inline spacing       |
| `sm`    | 8px    | Compact component internal padding    |
| `md`    | 16px   | Default component gaps                |
| `lg`    | 24px   | Card padding, section element spacing |
| `xl`    | 32px   | Large card padding, group spacing     |
| `2xl`   | 48px   | Section title to content gap          |
| `3xl`   | 64px   | Between major content blocks          |

### Section Layout

| Property              | Value                    |
|-----------------------|--------------------------|
| Section Padding Y     | `py-28` to `py-40` (112px--160px) |
| Container Max Width   | `max-w-7xl` (1280px)    |
| Container Padding X   | `px-4` (16px) mobile, `px-6` (24px) tablet, `px-8` (32px) desktop |

### Grid System

- Desktop: 12-column grid with 24px gap
- Tablet: 8-column grid with 16px gap
- Mobile: 4-column grid with 16px gap

---

## Icon Set

The project uses **Lucide React** as its icon library. Only the following icons are approved for use:

| Icon            | Usage                                        |
|-----------------|-----------------------------------------------|
| `MapPin`        | Location indicators, neighborhood markers     |
| `ChevronRight`  | Breadcrumbs, list navigation, "more" actions  |
| `Mail`          | Email contact, newsletter                     |
| `Phone`         | Phone contact, call-to-action                 |
| `ShieldCheck`   | Trust signals, verification badges            |
| `ExternalLink`  | Outbound links, "open in new tab"            |
| `TrendingUp`    | Market data, growth indicators                |
| `Menu`          | Mobile navigation hamburger                   |
| `X`             | Close buttons, dismiss actions                |
| `ChevronDown`   | Dropdown indicators, accordion toggles        |
| `ArrowUpRight`  | CTAs, directional navigation                  |

### Icon Specifications

| Property        | Value                          |
|-----------------|--------------------------------|
| Default Size    | 20px                           |
| Small Size      | 16px                           |
| Large Size      | 24px                           |
| Stroke Width    | 1.5 (default), 2 (emphasis)   |
| Color           | Inherits from parent `color`   |

### Usage Rules

- Icons always accompany text in buttons; never use icon-only buttons without an `aria-label`.
- Gold icons use `gold-500` color and are reserved for premium or highlighted elements.
- Navigation icons (ChevronRight, ChevronDown, ArrowUpRight) use `silver` or `foreground` color depending on context.

---

## Accessibility

- **Contrast Ratios**: All text on `navy-800` backgrounds meets WCAG AA. Gold text (`#C9A24A`) on `navy-800` (`#0A1A3A`) achieves a contrast ratio of approximately 5.2:1.
- **Focus States**: All interactive elements display a `2px solid gold-500` outline with `4px` offset on focus.
- **Touch Targets**: Minimum 44x44px for all interactive elements on mobile.
- **Reduced Motion**: All animations respect `prefers-reduced-motion: reduce`.
