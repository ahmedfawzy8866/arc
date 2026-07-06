# Sierra Blu Realty V12.0 — Libs Integration Guide

Three design-quality libraries integrated under `./libs`, mapped to the Sierra Blu pipeline.

## Library Overview

| Alias | Source | What It Provides |
|-------|--------|-----------------|
| `@motion/*` | `./libs/motion-principles` | Per-designer motion audit configs (Emil / Jakub / Jhey) |
| `@taste/*` | `./libs/taste-skill` | Design variance dials, premium frontend skill paths |
| `@impeccable/*` | `./libs/impeccable` | Anti-pattern detection (24 rules, Node + browser) |

---

## Stage Integration Map

| Stage | Name | Primary Agent | @motion | @taste | @impeccable |
|-------|------|---------------|---------|--------|-------------|
| 1 | Intake | Scribe | Emil (restraint) | onboarding dials | run on forms |
| 2 | Client Profile | Scribe | Emil | onboarding dials | run on forms |
| 3 | Brief | Scribe | Emil | onboarding dials | run on data entry |
| 4 | Search | Curator | Jakub (polish) | propertySearch dials | run on listings |
| 5 | Filter | Curator | Jakub | propertySearch dials | run on listings |
| 6 | Shortlist | Matchmaker | Jakub + Emil | matching dials | run on cards |
| 7 | Compare | Matchmaker | Jakub | matching dials | run on tables |
| 8 | Concierge Gallery | All | Jakub + Jhey (showcase) | conciergeGallery dials (9/8/5) | run — skip bounce |
| 9 | Offer | Closer | Emil | closing dials | run on forms |
| 10 | Close | Closer | Emil | closing dials | run on final screens |

---

## Usage Examples

### Stage 8 — Concierge Gallery

```tsx
import { getAuditConfigForStage } from "@motion/index";
import { getTasteConfigForStage } from "@taste/index";
import { detectAntiPatterns } from "@impeccable/index";

const motionConfig = getAuditConfigForStage(8);
// → { primaryDesigner: "jakub", secondaryDesigner: "jhey", context: "concierge gallery showcase" }

const tasteConfig = getTasteConfigForStage(8);
// → { DESIGN_VARIANCE: 9, MOTION_INTENSITY: 8, VISUAL_DENSITY: 5 }

// In CI or dev script — scan the gallery component
const findings = await detectAntiPatterns(["src/components/ConciergeGallery.tsx"]);
```

### Agent-specific motion guidance (Curator at Stage 4)

```tsx
import { getAuditConfigForStage, designers } from "@motion/index";

const config = getAuditConfigForStage(4);
const primary = designers[config.primaryDesigner];
// → { name: "Jakub Krehel", philosophy: "Production Polish", ... }
```

### Anti-pattern scan across all listing components

```tsx
import { detectAntiPatterns, sierraBluChecks } from "@impeccable/index";

const findings = await detectAntiPatterns(["src/components/listings/"]);
```

---

## Dependency Conflicts

| Lib | Peer Dependencies | Conflict Risk |
|-----|-------------------|---------------|
| `@motion/*` | None (skills only) | None |
| `@taste/*` | None (skills only) | None |
| `@impeccable/*` | `jsdom@29`, optional `puppeteer@^24` | `jsdom` may conflict if project pins an older version |

**Resolution:** `impeccable` uses `jsdom@29.0.0` pinned. If your project requires a different jsdom version, isolate the anti-pattern check in a separate script rather than importing it in the app bundle.

---

## Path Aliases (tsconfig.json)

```json
{
  "paths": {
    "@motion/*": ["./libs/motion-principles/src/*"],
    "@taste/*":  ["./libs/taste-skill/src/*"],
    "@impeccable/*": ["./libs/impeccable/src/*"]
  }
}
```

For Next.js, add the same paths to `next.config.ts` via `webpack.resolve.alias` or use the built-in `experimental.typedRoutes`.

---

## Config Notes

- `design-motion-principles` and `taste-skill` are skill collections (SKILL.md files), not runtime code libraries. Their `src/index.ts` files expose metadata and path helpers; they carry zero runtime overhead.
- `impeccable` ships real JS (`detect-antipatterns.mjs`) — keep it in dev/CI scripts, not in the client bundle.
- All three libs are MIT/Apache-2.0 licensed — compatible with Sierra Blu's commercial use.
