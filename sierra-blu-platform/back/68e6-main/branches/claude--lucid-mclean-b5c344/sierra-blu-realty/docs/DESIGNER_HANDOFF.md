# Sierra Blu Realty -- Designer Handoff Guide

Version 1.0 | Last Updated: 2026-05-16

---

## Project Overview

Sierra Blu Realty is a luxury AI-powered real estate advisory platform for the New Cairo, Egypt market. The web application serves as a high-end landing page and property discovery tool with plans to expand into a full CRM and employee dashboard.

### Tech Stack

| Layer           | Technology                        | Version  |
|-----------------|-----------------------------------|----------|
| Framework       | Next.js                           | 16       |
| UI Library      | React                             | Latest   |
| Animation       | Framer Motion                     | Latest   |
| Styling         | Tailwind CSS                      | v4       |
| Language        | TypeScript                        | 5.x      |
| Icons           | Lucide React                      | Latest   |
| Fonts           | Playfair Display, Inter           | Google Fonts |
| Deployment      | Vercel                            | --       |

### Key Constraints

- All styling uses Tailwind CSS utility classes and CSS custom properties -- no external CSS frameworks.
- Animations are implemented in Framer Motion, not CSS keyframes (except shimmer effects).
- Images are served through Next.js `Image` component with automatic optimization.
- The site must support RTL (Arabic) layout in a future phase.

---

## Figma Setup Guide

### Step 1: Create Variables Matching CSS Custom Properties

Map the following CSS custom properties to Figma variables. Create a variable collection named "Sierra Blu" with these modes: Light (unused, reserved), Dark (active).

**Color Variables**

| Variable Name       | Hex Value   | Category |
|---------------------|-------------|----------|
| `navy/900`          | `#050E1F`   | Navy     |
| `navy/800`          | `#0A1A3A`   | Navy     |
| `navy/700`          | `#122245`   | Navy     |
| `navy/surface-alt`  | `#1A2A4E`   | Navy     |
| `gold/700`          | `#A67C2E`   | Gold     |
| `gold/500`          | `#C9A24A`   | Gold     |
| `gold/400`          | `#D4B26A`   | Gold     |
| `neutral/foreground`| `#F8FAFC`   | Neutral  |
| `neutral/offwhite`  | `#F8F8F8`   | Neutral  |
| `neutral/mist`      | `#DFE3ED`   | Neutral  |
| `neutral/silver`    | `#8A93AB`   | Neutral  |
| `neutral/blue-gray` | `#4E5872`   | Neutral  |

**Effect Variables (for Figma effects panel)**

| Variable Name           | Value                              | Type        |
|-------------------------|------------------------------------|-------------|
| `glass/background`      | `rgba(10, 26, 58, 0.55)`          | Fill        |
| `glass/border`          | `rgba(201, 162, 74, 0.18)`        | Stroke      |
| `glass/border-hover`    | `rgba(201, 162, 74, 0.35)`        | Stroke      |
| `gold/glow`             | `rgba(201, 162, 74, 0.35)`        | Shadow      |
| `shadow/elevated`       | `0 8px 32px rgba(5, 14, 31, 0.4)` | Shadow      |

### Step 2: Use 8px Grid

Configure Figma's grid system to align with the development spacing.

| Grid Setting     | Value    |
|------------------|----------|
| Base unit        | 8px      |
| Nudge amount     | 8px      |
| Small nudge      | 4px      |

All spacing, padding, margins, and gaps should be multiples of 8px. The only exception is the 4px value used for tight inline spacing (icon gaps, label padding).

### Step 3: Create Component Frames at Standard Breakpoints

Set up the following frames for each page and component:

| Breakpoint   | Width   | Label       | Layout Grid                           |
|--------------|---------|-------------|----------------------------------------|
| Desktop      | 1440px  | Desktop     | 12 columns, 24px gutter, 80px margin  |
| Tablet       | 768px   | Tablet      | 8 columns, 16px gutter, 24px margin   |
| Mobile       | 375px   | Mobile      | 4 columns, 16px gutter, 16px margin   |

Content container max-width is **1280px** (max-w-7xl), centered within the frame.

---

## Color Variables to Import

### Full Palette Reference

| Swatch | Name             | Hex       | RGB                  | Figma Variable         |
|--------|------------------|-----------|----------------------|------------------------|
|        | Navy 900         | `#050E1F` | `5, 14, 31`         | `navy/900`             |
|        | Navy 800         | `#0A1A3A` | `10, 26, 58`        | `navy/800`             |
|        | Navy 700         | `#122245` | `18, 34, 69`        | `navy/700`             |
|        | Navy Surface Alt | `#1A2A4E` | `26, 42, 78`        | `navy/surface-alt`     |
|        | Gold 700         | `#A67C2E` | `166, 124, 46`      | `gold/700`             |
|        | Gold 500         | `#C9A24A` | `201, 162, 74`      | `gold/500`             |
|        | Gold 400         | `#D4B26A` | `212, 178, 106`     | `gold/400`             |
|        | Gold Glow        | `rgba(201, 162, 74, 0.35)` | -- | `gold/glow`      |
|        | Foreground       | `#F8FAFC` | `248, 250, 252`     | `neutral/foreground`   |
|        | Off-white        | `#F8F8F8` | `248, 248, 248`     | `neutral/offwhite`     |
|        | Mist             | `#DFE3ED` | `223, 227, 237`     | `neutral/mist`         |
|        | Silver           | `#8A93AB` | `138, 147, 171`     | `neutral/silver`       |
|        | Blue Gray        | `#4E5872` | `78, 88, 114`       | `neutral/blue-gray`    |

### Semantic Color Mapping

| Semantic Role        | Variable             | Usage                              |
|----------------------|----------------------|------------------------------------|
| Page background      | `navy/800`           | Default canvas color               |
| Card surface         | `navy/700`           | Glass card fill (with alpha)       |
| Primary accent       | `gold/500`           | CTAs, highlights, key elements     |
| Primary text         | `neutral/foreground`  | Headings, body text on dark       |
| Secondary text       | `neutral/silver`      | Metadata, placeholders            |
| Muted text           | `neutral/blue-gray`   | Captions, timestamps              |
| Dividers             | `neutral/mist`        | Borders, separators               |

---

## Typography Styles to Create

### Display Styles

| Style Name       | Font             | Size    | Weight    | Letter Spacing | Line Height |
|------------------|------------------|---------|-----------|----------------|-------------|
| Display / XL     | Playfair Display | 72px    | Bold (700)| 0.12em         | 110%        |
| Display / LG     | Playfair Display | 60px    | Bold (700)| 0.12em         | 110%        |
| Display / MD     | Playfair Display | 48px    | Bold (700)| 0.12em         | 115%        |

### Heading Styles

| Style Name       | Font             | Size    | Weight       | Letter Spacing | Line Height |
|------------------|------------------|---------|--------------|----------------|-------------|
| Heading / LG     | Playfair Display | 36px    | SemiBold (600)| 0.12em        | 120%        |
| Heading / MD     | Playfair Display | 30px    | SemiBold (600)| 0.12em        | 125%        |
| Heading / SM     | Playfair Display | 24px    | SemiBold (600)| 0.12em        | 130%        |

### Body Styles

| Style Name       | Font   | Size    | Weight       | Letter Spacing | Line Height |
|------------------|--------|---------|--------------|----------------|-------------|
| Body / LG        | Inter  | 18px    | Regular (400)| -0.02em        | 170%        |
| Body / MD        | Inter  | 16px    | Regular (400)| -0.02em        | 160%        |
| Body / SM        | Inter  | 14px    | Regular (400)| -0.02em        | 150%        |

### Label Styles

| Style Name          | Font   | Size    | Weight       | Letter Spacing | Line Height | Transform   |
|---------------------|--------|---------|--------------|----------------|-------------|-------------|
| Label / Default     | Inter  | 12px    | SemiBold (600)| 0.08em        | 140%        | None        |
| Label / Uppercase   | Inter  | 11px    | Bold (700)   | 0.15em         | 130%        | UPPERCASE   |

### Usage Rules

- **Playfair Display** is strictly for display and heading text. Never use it for body copy, buttons, or labels.
- **Inter** handles all body text, buttons, navigation, form inputs, labels, and metadata.
- Gold-colored text should only appear on Playfair Display headings or uppercase Inter labels.
- Minimum body text size: 14px (Body SM).

---

## Component Checklist

Design each component as a Figma component with variants for state, breakpoint, and content variations.

### 1. Navbar

| Variant / State      | Description                                              |
|-----------------------|-----------------------------------------------------------|
| Default               | Transparent background, logo left, links center, CTA right |
| Scrolled              | Glass morphism background (blur 32px, navy-800/55 fill)  |
| Mobile (collapsed)    | Logo left, hamburger icon (Menu) right                   |
| Mobile (expanded)     | Full-width dropdown with stacked links and CTA           |
| Link: default         | `silver` text color, Inter 600                           |
| Link: hover           | `foreground` text color, 200ms transition                |
| Link: active          | `gold-500` text color                                    |

### 2. Hero Section

| Variant / State      | Description                                              |
|-----------------------|-----------------------------------------------------------|
| Desktop               | Full-viewport height, background image, centered text overlay |
| Tablet                | Reduced heading size (Display LG), stacked CTAs          |
| Mobile                | Display MD heading, single CTA, compact stats row        |
| Content elements      | Label tag, heading (Display XL), subtitle (Body LG), 2 CTA buttons, stats row |
| Background            | Full-bleed image with luxuryScale entrance (0.95 to 1)   |
| Scroll indicator      | Appears after 2s delay at bottom center                  |

### 3. Featured Listings

| Variant / State      | Description                                              |
|-----------------------|-----------------------------------------------------------|
| Section layout        | Section heading + gold line + 3-column card grid         |
| Card: default         | Glass card, grayscale image (4:3), title, price, metadata, footer |
| Card: hover           | Full-color image, gold border (0.35 opacity), 4px lift   |
| Card: mobile          | Full-width single column stack                           |
| Badge                 | `badge-gold` or `badge-navy` positioned on image         |
| Footer row            | Location (MapPin icon) + bed/bath/sqft metadata          |

### 4. Neighborhoods

| Variant / State      | Description                                              |
|-----------------------|-----------------------------------------------------------|
| Section layout        | Section heading + neighborhood card grid                 |
| Card: default         | Image with dark gradient overlay, neighborhood name, property count |
| Card: hover           | Full-color image, lighter overlay, MapPin icon visible   |
| Desktop               | 3-column grid                                            |
| Tablet                | 2-column grid                                            |
| Mobile                | Single column stack                                      |

### 5. Advisors

| Variant / State      | Description                                              |
|-----------------------|-----------------------------------------------------------|
| Section layout        | Section heading + advisor card grid                      |
| Card: default         | Grayscale photo (1:1), name (Heading SM), title, specialty badge |
| Card: hover           | Full-color photo, gold border glow, social links appear  |
| Desktop               | 3-4 column grid                                          |
| Mobile                | Single column, full-width cards                          |

### 6. Footer

| Variant / State      | Description                                              |
|-----------------------|-----------------------------------------------------------|
| Desktop               | 4-column layout: brand + description, link column, link column, contact info |
| Tablet                | 2x2 grid                                                |
| Mobile                | Single column, stacked sections                          |
| Link: default         | `silver` color                                           |
| Link: hover           | `gold-500` color, 200ms transition                       |
| Divider               | Gold line, full width                                    |
| Contact               | Mail icon + email, Phone icon + number                   |

---

## Responsive Breakpoints

| Name     | Min Width | Tailwind Prefix | Layout Changes                                  |
|----------|-----------|-----------------|--------------------------------------------------|
| Mobile   | 0px       | (default)       | Single column, stacked layout, hamburger nav     |
| Small    | 640px     | `sm:`           | Minor padding adjustments, wider gutters         |
| Medium   | 768px     | `md:`           | Tablet layout, 2-column grids, visible nav links |
| Large    | 1024px    | `lg:`           | Desktop layout, 3-column grids, full navigation  |

### Responsive Rules

- All components are designed **mobile-first**. The default state is always the mobile layout.
- Font sizes scale up at `md` and `lg` breakpoints.
- Section vertical padding increases: `py-20` (mobile) to `py-28` (tablet) to `py-40` (desktop).
- Card grids transition: 1 column (mobile) to 2 columns (tablet) to 3 columns (desktop).
- Navigation switches from hamburger menu to horizontal link bar at `md` (768px).
- Hero heading scales: Display MD (mobile), Display LG (tablet), Display XL (desktop).

---

## RTL / Arabic Layout Considerations

While the initial release is LTR English-only, the design must be structured for future Arabic RTL support.

### Design Requirements

| Concern                  | Guideline                                                    |
|--------------------------|---------------------------------------------------------------|
| Text alignment           | Use `start` / `end` instead of `left` / `right` in designs  |
| Icon direction           | Directional icons (ChevronRight, ArrowUpRight) must flip in RTL |
| Layout mirroring         | Entire layout mirrors horizontally -- nav, cards, grids      |
| Typography               | Arabic font TBD (likely Noto Sans Arabic or Cairo)           |
| Number formatting        | Property prices use Western Arabic numerals in both LTR and RTL |
| Padding and margins      | Use logical properties: `margin-inline-start` not `margin-left` |
| Form inputs              | Text inputs align to the `end` side in RTL                   |

### Figma Preparation

- Build components using Auto Layout with "start" alignment rather than fixed positions.
- Avoid placing elements with absolute X coordinates.
- Create an RTL variant for each component (can be done after initial release).
- Playfair Display does not support Arabic glyphs -- an alternative serif must be selected for Arabic headings.

---

## Animation Prototyping Notes

For designers prototyping interactions in Figma, the following timing values match the production implementation.

### Key Timing Curves

| Name                | Cubic Bezier             | Figma Equivalent        | Use Case                    |
|---------------------|--------------------------|-------------------------|-----------------------------|
| Production Polish   | `0.32, 0.72, 0, 1`      | Custom ease             | Section entrances, hero     |
| Smooth Out          | `0.22, 1, 0.36, 1`      | Custom ease             | Secondary content fade-in   |
| Default             | `ease`                   | Ease In and Out         | Hovers, micro-interactions  |

### Duration Reference

| Animation Type              | Duration | Notes                          |
|-----------------------------|----------|--------------------------------|
| Section entrance (scroll)   | 800ms    | Use Smart Animate in Figma     |
| Button hover                | 200ms    | Use Smart Animate              |
| Card hover (border + lift)  | 400ms    | Use Smart Animate              |
| Image grayscale reveal      | 700ms    | Use Smart Animate              |
| Hero image scale            | 1200ms   | Use Smart Animate              |
| Stagger between items       | 100ms    | Use After Previous delay       |
| Shimmer button sweep        | 600ms    | 3-frame interaction sequence   |

### Prototyping Tips

- Use **Smart Animate** for all transitions between component variants.
- For stagger effects, duplicate frames with incremental delays using **After Previous** triggers.
- Blur entrance effects cannot be natively prototyped in Figma -- annotate these with a note layer referencing the ANIMATION_SPECS.md document.
- For the shimmer button effect, create a 3-frame interaction: default, hover-start (shimmer midpoint), hover-end (shimmer complete).
- Maximum hover scale is **105%** (never 110%).

---

## Asset Handoff Format

### Icons

| Format   | Source        | Delivery Method                              |
|----------|---------------|----------------------------------------------|
| SVG      | Lucide React  | Exported from Lucide icon set at 24px, stroke 1.5 |

All icons are pulled from the **Lucide React** library at runtime. Designers should use the same icon names when placing icons in Figma.

**Approved Icon Set**

| Icon            | Usage                                        |
|-----------------|-----------------------------------------------|
| `MapPin`        | Location indicators, neighborhood markers     |
| `ChevronRight`  | Breadcrumbs, list navigation                  |
| `Mail`          | Email contact, newsletter                     |
| `Phone`         | Phone contact, call-to-action                 |
| `ShieldCheck`   | Trust signals, verification badges            |
| `ExternalLink`  | Outbound links, "open in new tab"            |
| `TrendingUp`    | Market data, growth indicators                |
| `Menu`          | Mobile navigation hamburger                   |
| `X`             | Close buttons, dismiss actions                |
| `ChevronDown`   | Dropdown indicators, accordion toggles        |
| `ArrowUpRight`  | CTAs, directional navigation                  |

Do not create custom icons without coordinating with development. All icons must exist in the Lucide library.

### Images

| Type               | Format    | Delivery                                     |
|--------------------|-----------|-----------------------------------------------|
| Hero backgrounds   | WebP/AVIF | Responsive via Next.js Image (srcset auto)   |
| Listing photos     | WebP/AVIF | 4:3 aspect ratio, min 800px wide             |
| Advisor portraits  | WebP/AVIF | 1:1 aspect ratio, min 400px wide             |
| Neighborhood shots | WebP/AVIF | 16:9 aspect ratio, min 800px wide            |
| Logo               | SVG       | Inline SVG component                         |

### Image Notes

- All images pass through Next.js `Image` component, which handles lazy loading, responsive srcset, and format optimization.
- Provide images at **2x resolution** for Retina displays.
- Listing and neighborhood images will have CSS `filter: grayscale(100%)` applied by default -- provide full-color originals.

---

## QA Checklist for Design Review

Use this checklist before handing designs to development or during design review sessions.

### Visual Consistency

- [ ] All colors reference the approved palette (no one-off hex values)
- [ ] All text uses defined typography styles (no freestyle fonts or sizes)
- [ ] Spacing between elements follows the 8px grid
- [ ] Glass morphism cards use consistent blur (32px), background (navy-800/55), and border (gold/18) values
- [ ] Gold accents are used sparingly -- no more than 2-3 gold elements per viewport
- [ ] Border radius on glass cards is 40px; on images inside cards is 24px

### Component Integrity

- [ ] Every component has Desktop (1440px), Tablet (768px), and Mobile (375px) variants
- [ ] All interactive elements have Default, Hover, Active, and Focus states
- [ ] Buttons follow the defined button system (btn-gold, btn-primary, btn-ghost-glass, btn-outline)
- [ ] Cards follow the glass card pattern with correct border radius (40px)
- [ ] Badges use either `badge-gold` or `badge-navy` -- no custom badge styles

### Typography

- [ ] Playfair Display is only used for headings and display text
- [ ] Inter is used for all body, label, button, and UI text
- [ ] Minimum text size is 14px (Body SM)
- [ ] Letter spacing matches the spec: 0.12em for Playfair, -0.02em for Inter body, 0.08em for labels
- [ ] Gold-colored text uses only Playfair Display or uppercase Inter labels

### Responsive Design

- [ ] Mobile layout tested at 375px width
- [ ] Tablet layout tested at 768px width
- [ ] Desktop layout tested at 1440px width
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets are minimum 44x44px on mobile
- [ ] Navigation collapses to hamburger at mobile breakpoint (below 768px)
- [ ] Card grids collapse from 3 columns to 2 to 1 at appropriate breakpoints

### Accessibility

- [ ] Text contrast meets WCAG AA (4.5:1 for body text, 3:1 for large text)
- [ ] Gold text (#C9A24A) on navy backgrounds (#0A1A3A) meets minimum 4.5:1 ratio
- [ ] Interactive elements have visible focus states (2px solid gold-500, 4px offset)
- [ ] No information conveyed by color alone
- [ ] Alt text annotations present for all images
- [ ] Reading order (layer order in Figma) matches visual order

### Animation Annotations

- [ ] Entrance animations annotated with duration (800ms) and easing (0.32, 0.72, 0, 1)
- [ ] Hover states prototyped with Smart Animate at correct durations
- [ ] Stagger timing (100ms between items, 300ms initial delay) noted on list/grid components
- [ ] Reduced motion fallback documented (opacity-only transitions, no blur or scale)
- [ ] Maximum hover scale confirmed at 105% (not 110%)

### RTL Readiness

- [ ] Auto Layout uses start/end alignment (not left/right)
- [ ] No fixed X positions for text elements
- [ ] Directional icons (ChevronRight, ArrowUpRight) noted for RTL flipping
- [ ] Component structure supports horizontal mirroring
- [ ] Arabic font alternative noted for Playfair Display headings
