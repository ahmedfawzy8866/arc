# back

Unified backend + agent code consolidation from 4 Sierra Blu repositories.

Date: 2026-06-04

## Structure

- `68e6-main/` → `ahmedfawzy8866/68e6464b99f91883e5fc1c2c2d41e34852b59d5460a7233cb507631612785c27` (`main`)
- `Sierra-Blu-Systm/` → `ahmedfawzy8866/Sierra-Blu-Systm` (`main`)
- `i-sierra-2027/` → `ahmedfawzy8866/i-sierra-2027` (`main`)
- `sierra-2026/` → `ahmedfawzy8866/sierra-2026` (`main`)

Each source folder contains `branches/<sanitized-branch>/` for non-main branch deltas.

## Refinement applied

- Removed obvious duplicates by skipping files identical to the corresponding `main` file.
- Removed build artifacts and logs (`*.log`, `build.log`, `build_output.log`).
- Removed lockfiles (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`).
- Kept source/documentation files: `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.sh`, `.json` (non-lock), `.md`, `.yaml`, `.yml`, `.rules`.
