# 📦 Imported: `ahmedfawzy8866/New-folder`

This directory contains content imported from the `ahmedfawzy8866/New-folder` repository during the monorepo consolidation.

## Repository Contents (at time of import)

```
New-folder/
├── .agent_instructions.md      # AI agent instructions (not imported — agent-specific)
├── .agents/                    # Agent configs (not imported)
├── .gemini/                    # Gemini agent config (not imported)
├── .vscode/                    # VS Code settings (not imported)
├── CODEX.md                    # ✅ Imported → imports/New-folder/docs/CODEX.md
├── NEXUS_REGISTRY.md           # ✅ Imported → imports/New-folder/docs/NEXUS_REGISTRY.md
├── implementation_plan.md      # ✅ Imported → imports/New-folder/docs/implementation_plan.md
├── my-app/                     # ⚠️  See analysis below
└── whatsapp-scraper-bot/       # ✅ Imported → apps/whatsapp-scraper-bot/
```

## `my-app/` — Snapshot Analysis

The `my-app/` subdirectory is an **older iteration** of the Sierra Blu platform — the same `sierra-blu-platform` Next.js app that is the target monorepo.

### Comparison: `New-folder/my-app` vs Target Repo

| Aspect | `New-folder/my-app` | Target (this repo) |
|--------|--------------------|--------------------|
| Next.js version | 16.2.1 | 16.2.4 (newer) |
| React | 19.2.4 | 19.2.4 |
| OpenTelemetry | ❌ Not present | ✅ Full OTLP stack |
| gRPC | ❌ Not present | ✅ @grpc/grpc-js |
| Recharts | ❌ Not present | ✅ ^3.8.1 |
| animejs | ❌ Not present | ✅ ^4.3.6 |
| papaparse | ❌ Not present | ✅ ^5.5.3 |
| Google APIs (googleapis) | ❌ Not present | ✅ ^171.4.0 |
| App routes | leads, matching, openclaw, property-finder, proposals, sync, telegram, webhooks, whatsapp | **Superset**: + admin, agent, closer, concierge, cron, ingest, orchestrate, viewing-requests, wealth |
| Components | Admin, Auth, CRM, Dashboard, Listings, Operations, Proposals, Shared, UI | **Superset**: + Landing, Maps, System, Visuals, inventory |

**Conclusion**: The target repository is a **superset** of `New-folder/my-app`. All code that existed in `my-app` has been evolved and carried forward into this repo. No files from `my-app` need to be merged — they are already present in a more advanced form.

### If You Want to Review `my-app` Code

The full source is available at:
- **GitHub**: https://github.com/ahmedfawzy8866/New-folder/tree/main/my-app
- **Branch snapshot SHA**: `64226556c1ad6f54b06ecd2fba41911f86ab3f09`

## `whatsapp-scraper-bot/` — Imported

The WhatsApp scraper bot has been imported to `apps/whatsapp-scraper-bot/`. See `apps/whatsapp-scraper-bot/README.md` for usage instructions.

**Key improvement during import**: The `API_URL` is now configurable via the `SIERRA_BLU_API_URL` environment variable (previously hardcoded to `localhost:3001`).
