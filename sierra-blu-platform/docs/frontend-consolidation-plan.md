# Sierra Blu frontend integration plan

This branch consolidates selected frontend polish from `ahmedfawzy8866/Sierra-Blu-Systm` into the working base repository.

## Included donor assets
- `frontend-assets/colors_and_type.css` → design tokens reference
- `frontend-assets/tweaks-panel.jsx` → internal design tweak utility reference
- `my-app/landing-page-final.tsx` → primary landing-page reference for motion, bilingual UX, and luxury styling
- `my-app/sierra-blu-landing.jsx` → secondary landing-page reference for listing cards, market map, and dashboard ideas

## Excluded donor assets
- `frontend-assets/constants.tsx` (mock CRM/demo data not aligned with current app)
- secrets/service accounts
- setup noise and duplicated docs

## Integration rules
1. Winner repo remains the source of truth.
2. Sierra-Blu-Systm is frontend inspiration/donor only.
3. Only reusable motion, styling, and UI patterns should be adopted.
4. Experimental donor files should live under `docs/` or `archive/`, not production routes.

## Next implementation targets
- Extract design tokens into shared styling/docs
- Preserve donor landing pages as references under docs/archive
- Rebuild the canonical landing page inside the winner repo using the best applicable parts
