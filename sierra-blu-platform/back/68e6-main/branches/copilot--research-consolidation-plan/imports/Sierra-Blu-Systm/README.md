# 📦 Selective Consolidation Notes: `ahmedfawzy8866/Sierra-Blu-Systm`

This directory tracks selective import decisions from `ahmedfawzy8866/Sierra-Blu-Systm`.

## Classification

- **Relationship**: Related Sierra Blu variant (older/parallel app snapshot).
- **Import approach**: **Selective only** into the canonical destination app.
- **Excluded**: Full `my-app/` tree, standalone HTML prototypes, and large static bundles.

## Imported into the canonical app

- Jest test harness (`jest.config.js` at repository root).
- API auth smoke tests adapted to current routes (`__tests__/api-auth.test.ts`).
- Root npm test scripts and Jest dependencies.

## Document-only ideas retained

- UI/UX prototype concepts and design token experiments from `frontend-assets/` are retained as references, not direct code imports.

## Exclusions and safety guardrails

- Do not copy the full app snapshot from `my-app/` because destination is canonical.
- Do not merge unrelated or inaccessible repositories without legal and technical review.
