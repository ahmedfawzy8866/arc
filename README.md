# arc — Merged Archive Repository

This repository merges **15 distinct GitHub repositories** from
`github.com/ahmedfawzy8866` into a single archive. Built on
**2026-07-06**.

## Properties

- **No duplicates**: cross-repo content-hash deduplication was applied.
  8216 duplicate files were removed.
- **No empty shells**: all empty directories were pruned
  (1461 removed).
- **No dead code**: build artifacts (`node_modules/`, `dist/`, `build/`,
  `.next/`, `__pycache__/`, etc.) and files >50 MB were excluded.

## Contents

| Repo                     | Files | Size      |
| ------------------------ | ----- | --------- |
| `Admin-Page-3.0` | 43 | 718.7KB |
| `New-folder` | 128 | 4.2MB |
| `RuView` | 1827 | 74.8MB |
| `final-frontend` | 224 | 51.5MB |
| `free-claude-code` | 304 | 3.0MB |
| `i-sierra-2027` | 8627 | 38.4MB |
| `key-key-` | 54 | 18.8MB |
| `knowledge-work-plugins` | 1134 | 6.5MB |
| `mempalace` | 479 | 59.4MB |
| `setup-node` | 156 | 1.2MB |
| `sf1` | 129 | 9.2MB |
| `sierra-2026` | 14845 | 240.2MB |
| `sierra-blu-platform` | 98807 | 1.4GB |
| `sierra-estates` | 4334 | 438.7MB |
| `taste-skill` | 39 | 2.8MB |
| **Total** | **131130** | **2.3GB** |

## How deduplication works

Each file in each repo subdir was hashed with SHA-256. If two repos
contained a file at the **same relative path** with the **same content**
(same hash), the copy in the alphabetically-later repo was deleted.

Files at *different* relative paths are NOT deduplicated across repos,
because they serve different purposes in their respective projects.

## Machine-readable manifest

See `ARC_MANIFEST.json` for the full per-repo stats, dedup counts, and
list of large files that were skipped.

## Regenerating this repo

```bash
git clone https://github.com/ahmedfawzy8866/Sierra-Estates-Final.git
cd Sierra-Estates-Final/_archived_repos
python3 scripts/merge_into_arc.py   # builds arc-merge/ locally
cd arc-merge
git init && git add -A && git commit -m 'Merge 15 archived repos'
git remote add origin https://github.com/ahmedfawzy8866/arc.git
git push -u origin main
```
