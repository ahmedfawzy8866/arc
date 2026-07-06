/**
 * Sierra Blu Realty - Design Token System
 * ========================================
 * Single source of truth for all design values.
 * Used by components, Tailwind config, and exported for Figma Tokens plugin.
 *
 * All token groups use `as const` for full literal-type inference.
 */

// ---------------------------------------------------------------------------
// Color Tokens
// ---------------------------------------------------------------------------

export const colors = {
  navy: {
    900: "#050E1F",
    800: "#0A1A3A",
    700: "#122245",
  },
  surface: {
    default: "#122245",
    alt: "#1A2A4E",
  },
  gold: {
    700: "#A67C2E",
    500: "#C9A24A",
    400: "#D4B26A",
    glow: "rgba(201, 162, 74, 0.35)",
  },
  neutral: {
    foreground: "#F8FAFC",
    offwhite: "#F8F8F8",
    mist: "#DFE3ED",
    silver: "#8A93AB",
    blueGray: "#4E5872",
  },
  glass: {
    bg: "rgba(10, 26, 58, 0.55)",
    border: "rgba(201, 162, 74, 0.18)",
  },
} as const;

// ---------------------------------------------------------------------------
// Typography Tokens
// ---------------------------------------------------------------------------

export const typography = {
  fontFamily: {
    display: "Playfair Display, serif",
    body: "Inter, system-ui, sans-serif",
  },
  letterSpacing: {
    luxury: "0.12em",
    premium: "-0.02em",
    label: "0.45em",
    wide: "0.3em",
  },
  fontSize: {
    hero: "9rem",
    sectionTitle: "4.5rem",
    subSection: "3rem",
    cardTitle: "1.5rem",
    body: "1rem",
    label: "10px",
    micro: "9px",
    tiny: "8px",
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing Tokens
// ---------------------------------------------------------------------------

export const spacing = {
  sectionPadding: { sm: "7rem", md: "10rem" },
  containerMax: "80rem",
  cardRadius: "40px",
  borderRadius: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    card: "2.5rem",
  },
  glassBlur: "32px",
} as const;

// ---------------------------------------------------------------------------
// Shadow Tokens
// ---------------------------------------------------------------------------

export const shadows = {
  glass: "0 30px 100px rgba(0, 0, 0, 0.55)",
  glassHover: "0 40px 120px rgba(0, 210, 211, 0.08)",
  goldGlow: "0 0 20px rgba(200, 150, 26, 0.4)",
  goldGlowStrong: "0 0 35px rgba(201, 162, 74, 0.35)",
  cardHover: "0 40px 100px rgba(199, 159, 63, 0.25)",
  buttonGlow: "0 4px 20px rgba(201, 162, 74, 0.35)",
} as const;

// ---------------------------------------------------------------------------
// Motion Tokens  (values sourced from lib/motion.ts)
// ---------------------------------------------------------------------------

export const motion = {
  easing: {
    luxury: [0.32, 0.72, 0, 1] as const,
    smooth: [0.22, 1, 0.36, 1] as const,
  },
  duration: {
    sectionEntrance: 800,
    cardHover: 400,
    imageReveal: 700,
    buttonPress: 200,
    navTransition: 200,
    luxuryScale: 1200,
  },
  blur: {
    entrance: "10px",
    none: "0px",
  },
  scale: {
    hoverMax: 1.05,
    buttonHover: 1.03,
    buttonPress: 0.98,
  },
  stagger: {
    children: 0.1,
    delay: 0.3,
  },
} as const;

// ---------------------------------------------------------------------------
// Derived types
// ---------------------------------------------------------------------------

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Shadows = typeof shadows;
export type Motion = typeof motion;

// ---------------------------------------------------------------------------
// Figma Tokens export  (flat dot-notation for Figma Tokens plugin)
// ---------------------------------------------------------------------------

type Primitive = string | number | boolean | readonly number[];

/**
 * Recursively flatten a nested object into dot-notation keys.
 * `{ a: { b: 1 } }` becomes `{ "a.b": { value: 1 } }`.
 */
function flatten(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, { value: Primitive; type: string }> {
  const result: Record<string, { value: Primitive; type: string }> = {};

  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (
      val !== null &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      !(val instanceof Array)
    ) {
      Object.assign(result, flatten(val as Record<string, unknown>, path));
    } else {
      result[path] = {
        value: val as Primitive,
        type: inferTokenType(prefix, key, val),
      };
    }
  }

  return result;
}

/** Best-effort Figma Tokens type inference based on key ancestry. */
function inferTokenType(prefix: string, key: string, value: unknown): string {
  const full = `${prefix}.${key}`.toLowerCase();
  if (full.startsWith("colors") || full.startsWith("glass")) return "color";
  if (full.includes("fontfamily")) return "fontFamilies";
  if (full.includes("fontsize")) return "fontSizes";
  if (full.includes("letterspacing")) return "letterSpacing";
  if (full.includes("shadow")) return "boxShadow";
  if (full.includes("borderradius") || full.includes("cardradius") || full.includes("blur"))
    return "borderRadius";
  if (full.includes("spacing") || full.includes("padding") || full.includes("containermax"))
    return "spacing";
  if (full.includes("duration")) return "other";
  if (full.includes("easing")) return "other";
  if (full.includes("scale")) return "other";
  if (typeof value === "number") return "other";
  return "other";
}

export const figmaTokens = {
  ...flatten({ colors } as Record<string, unknown>),
  ...flatten({ typography } as Record<string, unknown>),
  ...flatten({ spacing } as Record<string, unknown>),
  ...flatten({ shadows } as Record<string, unknown>),
  ...flatten({ motion } as Record<string, unknown>),
};
