# Sierra Blu Realty -- Animation Specifications

Version 1.0 | Last Updated: 2026-05-16

---

## Philosophy

The animation system follows two complementary schools of thought:

**Jakub Krehel "Production Polish"** -- First impressions and scroll-triggered entrances use cinematic blur-entrance animations. These moments are infrequent but high-impact, giving the interface a polished, editorial feel. Elements emerge from a soft blur with vertical displacement, creating depth and drawing the eye.

**Emil Kowalski "Restraint"** -- High-frequency interactions (button clicks, nav hovers, toggle states) stay fast and invisible. Users should never feel like the interface is slowing them down. These micro-interactions exist at 200ms or below and use simple opacity/transform changes with no blur.

The guiding rule: **the rarer the event, the more expressive the animation; the more frequent the interaction, the more restrained the motion.**

---

## Motion Variants

All motion variants are defined in `lib/motion.ts` and consumed via Framer Motion's `variants` prop.

### fadeInWithBlur

The primary entrance animation. Used for hero content, section headings, and first-load elements.

```typescript
const fadeInWithBlur = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    y: 20,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.32, 0.72, 0, 1],
    },
  },
};
```

| Property        | From          | To            |
|-----------------|---------------|---------------|
| `opacity`       | `0`           | `1`           |
| `filter`        | `blur(10px)`  | `blur(0px)`   |
| `y`             | `20px`        | `0px`         |
| Duration        | --            | 800ms         |
| Easing          | --            | `[0.32, 0.72, 0, 1]` |

### fadeIn

A lighter entrance animation without blur. Used for secondary content, metadata, and supporting elements.

```typescript
const fadeIn = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
```

| Property        | From          | To            |
|-----------------|---------------|---------------|
| `opacity`       | `0`           | `1`           |
| `y`             | `20px`        | `0px`         |
| Duration        | --            | 800ms         |
| Easing          | --            | `[0.22, 1, 0.36, 1]` |

### staggerContainer

Parent container variant that orchestrates child element stagger timing.

```typescript
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};
```

| Property           | Value         |
|--------------------|---------------|
| `staggerChildren`  | 0.1s (100ms)  |
| `delayChildren`    | 0.3s (300ms)  |

Usage: wrap a list of `motion.div` children that each use `fadeIn` or `fadeInWithBlur` as their individual variant.

### luxuryScale

A slow, subtle scale-up used for hero images and large visual elements on load.

```typescript
const luxuryScale = {
  hidden: {
    scale: 0.95,
  },
  visible: {
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.32, 0.72, 0, 1],
    },
  },
};
```

| Property        | From          | To            |
|-----------------|---------------|---------------|
| `scale`         | `0.95`        | `1`           |
| Duration        | --            | 1200ms        |
| Easing          | --            | `[0.32, 0.72, 0, 1]` |

### scrollIndicatorFloat

A delayed fade-in for scroll indicators and "scroll down" prompts.

```typescript
const scrollIndicatorFloat = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 2,
      duration: 0.6,
    },
  },
};
```

| Property        | From          | To            |
|-----------------|---------------|---------------|
| `opacity`       | `0`           | `1`           |
| Delay           | --            | 2000ms        |
| Duration        | --            | 600ms         |

---

## Timing Guidelines

### By Interaction Category

| Category                       | Duration  | Easing                    | Notes                                 |
|--------------------------------|-----------|---------------------------|----------------------------------------|
| Major section entrance         | ~800ms    | `[0.32, 0.72, 0, 1]`     | With blur. Scroll-triggered via `whileInView`. |
| High-frequency interactions    | 200ms     | `ease` or `ease-out`      | Buttons, nav links, toggles. No blur.  |
| Card hover effects             | 400ms     | `ease`                    | Border color, shadow, subtle lift.     |
| Image hover transitions        | 500--700ms | `ease`                   | Grayscale removal, scale-up.           |
| Glass card hover               | 400ms     | `ease`                    | Border opacity increase.               |
| Luxury scale entrance          | 1200ms    | `[0.32, 0.72, 0, 1]`     | Hero images, large media.              |
| Scroll indicator appearance    | 600ms     | `ease` (2s delay)         | Appears after page settles.            |
| Shimmer button sweep           | 600ms     | `ease`                    | Linear gradient position shift.        |

### Easing Reference

| Name                | Value                    | Character                           |
|---------------------|--------------------------|--------------------------------------|
| Production Polish   | `[0.32, 0.72, 0, 1]`    | Smooth deceleration, luxury feel     |
| Smooth Out          | `[0.22, 1, 0.36, 1]`    | Fast start, gentle landing           |
| Default CSS         | `ease`                   | General-purpose, quick interactions  |

---

## Scale Guidelines

- **Maximum hover scale**: `1.05` (105%). Never use `1.1` (110%) -- it feels aggressive and breaks spatial consistency.
- **Entrance scale start**: `0.95` (95%). Subtle enough to feel intentional without being jarring.
- **Button active scale**: `0.98` (98%). A barely perceptible press-down on click.

---

## Glow Effects

### Gold Glow (Primary)

Applied to gold-accent elements (CTAs, featured badges, active states).

```css
filter: drop-shadow(0 0 20px rgba(200, 150, 26, 0.4));
```

| Property        | Value                                    |
|-----------------|------------------------------------------|
| X Offset        | `0`                                      |
| Y Offset        | `0`                                      |
| Blur Radius     | `20px`                                   |
| Color           | `rgba(200, 150, 26, 0.4)`               |

### Usage Rules

- Apply gold glow to primary CTAs and featured listing badges.
- Do not apply glow to more than two elements visible in the viewport simultaneously.
- Glow intensity can be reduced to `0.2` opacity for secondary emphasis.
- On hover, glow can increase to `0.6` opacity with a 400ms transition.

---

## Image Treatment

### Grayscale-to-Color Reveal

Property listing images and advisor photos use a grayscale-to-full-color transition on hover.

```css
.image-treatment {
  filter: grayscale(100%);
  transition: filter 700ms ease, transform 700ms ease;
}

.image-treatment:hover {
  filter: grayscale(0%);
  transform: scale(1.05);
}
```

| State     | `filter`           | `transform`    | Transition |
|-----------|--------------------|----------------|------------|
| Default   | `grayscale(100%)`  | `scale(1)`     | --         |
| Hover     | `grayscale(0%)`    | `scale(1.05)`  | 700ms ease |

### Rules

- Grayscale treatment is only applied to listing images and advisor portraits -- never to logos, icons, or UI elements.
- The scale transform on hover must not exceed `1.05`.
- Images inside cards must have `overflow: hidden` on the container to prevent scale bleed.

---

## Accessibility

### Reduced Motion

All animations must respect the user's system preference for reduced motion.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

In Framer Motion, use the `useReducedMotion` hook:

```typescript
import { useReducedMotion } from "framer-motion";

const shouldReduceMotion = useReducedMotion();

const variants = shouldReduceMotion
  ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  : fadeInWithBlur;
```

### GPU-Only Transforms

All animations should exclusively use GPU-composited properties to maintain 60fps:

| Allowed Properties    | Avoided Properties                   |
|-----------------------|---------------------------------------|
| `opacity`             | `width` / `height`                   |
| `transform`           | `top` / `left` / `right` / `bottom`  |
| `filter`              | `margin` / `padding`                 |
| `clip-path`           | `border-width`                       |

The `will-change` property should be applied sparingly and only to elements that will actually animate:

```css
.will-animate {
  will-change: transform, opacity;
}
```

Remove `will-change` after the animation completes on elements that animate only once (e.g., entrance animations).

---

## Per-Component Animation Map

### Navbar

| Element                 | Animation              | Trigger           | Duration | Notes                              |
|-------------------------|------------------------|--------------------|----------|------------------------------------|
| Logo                    | fadeIn                 | Page load          | 800ms    | Part of stagger sequence           |
| Nav links               | fadeIn (staggered)     | Page load          | 800ms    | 100ms stagger between items        |
| CTA button              | fadeIn                 | Page load          | 800ms    | Last in stagger sequence           |
| Nav link hover          | Color transition       | Hover              | 200ms    | `silver` to `foreground`           |
| Mobile menu open        | Slide down + fadeIn    | Menu toggle        | 300ms    | Height auto animation              |
| Scroll background       | Background opacity     | Scroll threshold   | 200ms    | Transparent to glass at 50px scroll |

### Hero Section

| Element                 | Animation              | Trigger           | Duration | Notes                              |
|-------------------------|------------------------|--------------------|----------|------------------------------------|
| Label tag               | fadeInWithBlur         | Page load          | 800ms    | First element in stagger           |
| Main heading            | fadeInWithBlur         | Page load          | 800ms    | Stagger delay from label           |
| Subtitle                | fadeInWithBlur         | Page load          | 800ms    | Stagger delay from heading         |
| CTA buttons             | fadeInWithBlur         | Page load          | 800ms    | Stagger delay from subtitle        |
| Background image        | luxuryScale            | Page load          | 1200ms   | Scale 0.95 to 1                    |
| Scroll indicator        | scrollIndicatorFloat   | Page load + 2s     | 600ms    | Delayed appearance                 |
| Stats counters          | fadeIn (staggered)     | Page load          | 800ms    | Separate stagger container         |

### Featured Listings

| Element                 | Animation              | Trigger           | Duration | Notes                              |
|-------------------------|------------------------|--------------------|----------|------------------------------------|
| Section heading         | fadeInWithBlur         | Scroll into view   | 800ms    | `whileInView`, `once: true`        |
| Gold line               | fadeIn + scaleX        | Scroll into view   | 800ms    | Width expansion effect             |
| Listing cards           | fadeIn (staggered)     | Scroll into view   | 800ms    | 100ms stagger between cards        |
| Card image              | Grayscale to color     | Hover              | 700ms    | With scale(1.05)                   |
| Card border             | Border color change    | Hover              | 400ms    | Gold border opacity increase       |
| Card lift               | translateY             | Hover              | 400ms    | -4px lift                          |
| Price badge glow        | Gold glow              | Hover              | 400ms    | `drop-shadow` addition             |

### Neighborhoods

| Element                 | Animation              | Trigger           | Duration | Notes                              |
|-------------------------|------------------------|--------------------|----------|------------------------------------|
| Section heading         | fadeInWithBlur         | Scroll into view   | 800ms    | --                                 |
| Neighborhood cards      | fadeIn (staggered)     | Scroll into view   | 800ms    | 100ms stagger                      |
| Card image              | Grayscale to color     | Hover              | 700ms    | With scale(1.05)                   |
| Card overlay            | Opacity transition     | Hover              | 400ms    | Gradient overlay darken            |
| Location pin icon       | fadeIn + bounce         | Hover              | 300ms    | Subtle vertical bounce             |

### Advisors

| Element                 | Animation              | Trigger           | Duration | Notes                              |
|-------------------------|------------------------|--------------------|----------|------------------------------------|
| Section heading         | fadeInWithBlur         | Scroll into view   | 800ms    | --                                 |
| Advisor cards           | fadeIn (staggered)     | Scroll into view   | 800ms    | 100ms stagger                      |
| Advisor photo           | Grayscale to color     | Hover              | 700ms    | With scale(1.05)                   |
| Social links            | fadeIn                 | Card hover         | 200ms    | Appear on card hover               |
| Card border glow        | Gold glow              | Hover              | 400ms    | Subtle gold border glow            |

### Footer

| Element                 | Animation              | Trigger           | Duration | Notes                              |
|-------------------------|------------------------|--------------------|----------|------------------------------------|
| Logo + description      | fadeIn                 | Scroll into view   | 800ms    | --                                 |
| Link columns            | fadeIn (staggered)     | Scroll into view   | 800ms    | 100ms stagger between columns      |
| Social icons            | fadeIn (staggered)     | Scroll into view   | 800ms    | --                                 |
| Link hover              | Color transition       | Hover              | 200ms    | `silver` to `gold-500`             |
| Divider line            | scaleX                 | Scroll into view   | 600ms    | Width expansion from center        |

### Shared Patterns

| Pattern                 | Animation              | Trigger           | Duration | Notes                              |
|-------------------------|------------------------|--------------------|----------|------------------------------------|
| Button hover            | Background transition  | Hover              | 200ms    | Color shift or shimmer sweep       |
| Button active           | scale(0.98)            | Click/press        | 100ms    | Subtle press feedback              |
| Glass card hover        | Border color change    | Hover              | 400ms    | Gold border opacity 0.18 to 0.35  |
| Tooltip                 | fadeIn                 | Hover              | 150ms    | Quick appear, no blur              |
| Page transition         | fadeIn                 | Route change       | 300ms    | Framer Motion `AnimatePresence`    |
