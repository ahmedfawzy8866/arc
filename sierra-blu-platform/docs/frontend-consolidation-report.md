# Sierra Blu frontend consolidation report

## Scope
This pass keeps the target repository as the source of truth and selectively consolidates the strongest useful Sierra Blu frontend polish that is already present in the repo.

## What was integrated into production
- `colors_and_type.css` remains the active design-token layer imported by `app/globals.css`.
- `app/page.tsx` remains the canonical public landing page because it already contains the strongest donor-inspired mix of:
  - luxury bilingual hero structure
  - premium listing-card presentation
  - market intelligence / map section
  - Sierra AI section
  - CTA flow and motion polish
- `/landing` now reuses the same canonical landing page as `/` so the public experience is consistent.
- `components/Landing/PropCard.tsx` now links to the real listing detail route at `/listings/[id]`.
- `lib/AuthContext.tsx` now degrades gracefully when Firebase client env vars are absent so the public landing does not crash in local validation environments.

## What was archived instead of kept in production
The following donor or snapshot files were preserved only as reference material under `docs/archive/frontend-experiments/` because they are no longer the canonical runtime implementation:
- `landing-page-final.donor.tsx`
- `landing-page-final.donor.css`
- `sierra-blu-landing.donor.jsx`
- `app-landing-page-final.snapshot.tsx`
- `app-landing-route-legacy.snapshot.tsx`

## What was intentionally skipped
- Mock/demo CRM sample data from donor `constants.tsx`
- Secrets, service accounts, backend setup noise, and duplicate repo clutter
- Public exposure of `tweaks-panel.jsx` because it is not needed in the production UI

## Current repo status
Validation completed successfully from the repository root:
- `npm run lint` ✅
- `npm run test` ✅
- `npm run build` ✅

## Recommendations
1. Keep `app/page.tsx` as the single source of truth for the public landing experience.
2. If more donor ideas are explored later, adapt them into shared components first instead of adding new page copies.
3. Consider replacing remaining `<img>` usage in landing-related UI with optimized `next/image` where practical.
4. Add a lightweight browser-level landing smoke test once the repo adopts a frontend test runner.
