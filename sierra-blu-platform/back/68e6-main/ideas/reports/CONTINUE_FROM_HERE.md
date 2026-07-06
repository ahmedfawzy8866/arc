# SIERRA BLU REALTY — MASTER CONTINUATION DOCUMENT
**For any AI agent (Claude, Copilot, etc.) picking up this project**
**Last updated: April 29, 2026**
**Written by: GitHub Copilot (Claude Sonnet 4.6)**
**Current version: V12.2**

> **START HERE. This is the only handover file that is up to date.**
> Other files (`SUPER_MASTER_HANDOVER_V12.md`, `V12_FULL_HANDOVER.md`, `TECHNICAL_HANDOVER.md`, etc.) are **outdated** — ignore them.

---

## WHAT IS THIS PROJECT?

Sierra Blu Realty is a **fully automated real estate operating system** built in Next.js.
The core idea: a broker sends a WhatsApp message → Gemini AI reads it, extracts data, writes luxury marketing copy in Arabic AND English, auto-posts to Property Finder, matches waiting clients, and sends a personalized proposal page — all without human involvement.

**10 pipeline stages** (S1→S10) · **4 AI agents** (Scribe, Curator, Matchmaker, Closer) · **Telegram admin interface** (Gravity)

---

## WORKSPACE STRUCTURE

```
H:\Sierra Blue SaaS Program Locally V2\
├── my-app\                        ← MAIN NEXT.JS APP — work here 99% of the time
│   ├── app\                       ← Next.js App Router pages + API routes
│   │   ├── page.tsx               ← MAIN SPA entry (all screens live inside here)
│   │   ├── layout.tsx             ← Root layout: fonts, ThemeProvider, I18nProvider, AuthProvider
│   │   ├── globals.css            ← All CSS variables + dark/light theme blocks
│   │   ├── api\                   ← All server-side API routes
│   │   ├── concierge\[leadId]\    ← Stage 8 public client proposal page
│   │   ├── admin\                 ← Admin portal page
│   │   └── landing\               ← Public landing page route
│   ├── components\                ← All UI components (see full map below)
│   ├── lib\                       ← All business logic, AI agents, services
│   │   ├── agents\                ← 4 AI agents (scribe, curator, matchmaker, closer)
│   │   ├── firebase\              ← Client-side Firebase (NOT for server routes)
│   │   ├── hooks\                 ← React hooks
│   │   ├── models\                ← Firestore types + COLLECTIONS constant
│   │   ├── server\                ← Server-only: firebase-admin, google-ai, auth-guard
│   │   └── services\              ← Business services (orchestrator, matching, etc.)
│   ├── messages\                  ← ar.json + en.json translation files
│   ├── scripts\                   ← seed-inventory.mjs + other utility scripts
│   ├── apps\                      ← Subapps (whatsapp-scraper-bot)
│   ├── .env.local                 ← Environment variables (NEVER commit this)
│   ├── firestore.rules            ← Firestore security rules
│   └── package.json
├── sierra-blu-admin-portal\       ← Separate older React admin (mostly done, rarely touched)
├── 11_Core_Intelligence\          ← Python WhatsApp bots + AI logic
├── 02_Data_Ingestion\             ← Python ingestion scripts
└── CONTINUE_FROM_HERE.md          ← THIS FILE
```

**IMPORTANT:** All work goes on `H:` drive. Never `C:` (not enough space).

---

## HOW TO START THE APP

```powershell
cd "H:\Sierra Blue SaaS Program Locally V2\my-app"
npm run dev
# → http://localhost:3000
```

If port 3000 is busy it tries 3001. "Exit Code 1" in VS Code debug terminals is a **false alarm** — it's a duplicate instance message, not a real crash.

```powershell
# TypeScript check (should always exit 0)
cd "H:\Sierra Blue SaaS Program Locally V2\my-app"
npx tsc --noEmit 2>&1; echo "TSC_EXIT:$LASTEXITCODE"
```

---

## ENVIRONMENT VARIABLES

**File:** `H:\Sierra Blue SaaS Program Locally V2\my-app\.env.local`

```env
# Firebase (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBZLN2jTTKV34SneGPoWRz1zoRpX5uODjs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sierra-blu.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sierra-blu
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sierra-blu.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=941030513456
NEXT_PUBLIC_FIREBASE_APP_ID=1:941030513456:web:56209a1495d69f217086f5

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBFLZ6edyLeVu5aXVgyaawBZqGSwwQvonA
GOOGLE_MAPS_API_KEY=AIzaSyBFLZ6edyLeVu5aXVgyaawBZqGSwwQvonA

# Gemini AI
GOOGLE_AI_API_KEY=AIzaSyArwaR7eiJmwcFUyUzV-vqVHnsyrt5HTZc

# OpenClaw local AI proxy
OPENCLAW_BASE_URL=http://127.0.0.1:18789/v1
OPENCLAW_TOKEN=02b25ffca992d1128741c5fb58a34f8b680cfef51bfbec02

# Property Finder API
PROPERTY_FINDER_API_GATEWAY=https://gateway.propertyfinder.com/v2
PROPERTY_FINDER_CLIENT_ID=tMlCs.H28cDCwm6YZXKc8P06DSIK3e9mRMOvDRsi
PROPERTY_FINDER_CLIENT_SECRET=xG7Ud54sQqDgX0hwcy0g54bfPWEzkcJW

# Telegram Bot
TELEGRAM_BOT_TOKEN=8719045454:AAHzZ8SevO6GOs3k_PZoBlhHhgwxPITFxO8
TELEGRAM_CHAT_ID=7175892124

# Cron security
CRON_SECRET=sierra_blu_dev_secret_2026
```

**Still missing — add before going live:**
```env
WHATSAPP_META_TOKEN=            ← Meta for Developers → WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=       ← Meta Business Manager
MASTER_SHEET_ID=                ← Google Sheets ID for data import
GOOGLE_APPLICATION_CREDENTIALS= ← Path to Firebase Admin JSON key (BLOCKER — see below)
```

---

## THE 10-STAGE PIPELINE

| Stage | Agent | Action | File |
|-------|-------|--------|------|
| S1 | Scribe | Receive raw broker WhatsApp message | `lib/agents/scribe.ts` |
| S2 | Scribe | Gemini extracts price, area, bedrooms, SBR code | `lib/agents/scribe.ts` |
| S3 | Curator | Gemini writes luxury AR+EN copywriting | `lib/agents/curator.ts` |
| S4 | Curator | Auto-post to Property Finder portal | `lib/agents/curator.ts` |
| S5 | Curator | Sync + duplicate check | `lib/agents/curator.ts` |
| S6 | Matchmaker | AI profiles the client | `lib/agents/matchmaker.ts` |
| S7 | Matchmaker | Scores units vs. client profile | `lib/agents/matchmaker.ts` |
| S8 | Matchmaker | Creates personalized Concierge Proposal page | `lib/agents/matchmaker.ts` |
| S9 | Closer | ROI analysis + closing simulation | `lib/agents/closer.ts` |
| S10 | Closer | Learn from outcome, feed back into system | `lib/agents/closer.ts` |

**Master controller:** `lib/services/orchestrator.ts`
- Runs S1→S10 with 3-attempt retry + exponential backoff (2s × attempt)
- On final failure: writes to `failed_orchestrations` Firestore collection (DLQ)
- On final failure: sends Telegram alert to admin via inline `fetch()` to Telegram API
- Human review pause point at S8 if `status === 'waiting_agent_review'`

---

## COMPLETE FILE MAP

### App Entry Points
```
app/page.tsx                  ← MAIN SPA — all screens via activeScreen state + switch()
app/layout.tsx                ← Root layout: ThemeProvider > I18nProvider > AuthProvider
app/globals.css               ← CSS variables: dark (:root default) + light ([data-theme="light"])
app/concierge/[leadId]/page.tsx ← Stage 8 public proposal page (shareable client URL)
app/admin/page.tsx            ← Admin panel entry
app/landing/page.tsx          ← Public landing page route
```

### API Routes (`app/api/`)
```
agent/hub/route.ts            ← Main AI agent entry point
ingest/whatsapp/route.ts      ← Receives broker WhatsApp messages → triggers pipeline
concierge/[leadId]/route.ts   ← Stage 8: fetch proposal data for a lead
concierge/analyze/route.ts    ← AI analysis of a proposal
concierge/complete/route.ts   ← Mark concierge session complete
concierge/send-whatsapp/route.ts ← Send proposal link via WhatsApp
orchestrate/route.ts          ← Manual pipeline trigger (use x-cron-secret header)
sync/route.ts                 ← Property Finder + Google Sheets sync
matching/route.ts             ← Neural matching API
leads/route.ts                ← Lead CRUD
leads/request-viewing/route.ts ← Schedule a property viewing
proposals/route.ts            ← Proposals CRUD
property-finder/route.ts      ← Property Finder API proxy
openclaw/route.ts             ← OpenClaw local AI proxy
telegram/webhook/route.ts     ← Telegram bot webhook receiver
telegram/setup/route.ts       ← Register Telegram webhook URL
webhooks/whatsapp/route.ts    ← WhatsApp Cloud API webhook
whatsapp/webhook/route.ts     ← WhatsApp web.js scraper webhook
whatsapp/heartbeat/route.ts   ← WhatsApp scraper health check
wealth/roi/route.ts           ← ROI analysis endpoint
cron/maintenance/route.ts     ← Scheduled maintenance tasks
cron/sync-leads/route.ts      ← Scheduled lead sync
admin/deploy/route.ts         ← Admin deployment trigger
```

### Frontend Screens (`components/`)

**Landing & Auth**
```
Landing/LightLandingScreen.tsx    ← Public landing (light theme, cinematic hero, snap-scroll)
Landing/BeyondBrokerageLanding.tsx ← Dark landing variant
Auth/LoginScreen.tsx              ← Login: email/pass + Google SSO + Guest mode
```

**Dashboard & Reports**
```
Dashboard/DashboardScreen.tsx     ← Main dashboard: KPIs, activity, AI panel, map overview
Dashboard/KPIGrid.tsx             ← Key performance indicator cards
Dashboard/AIPanel.tsx             ← AI insight widget
Dashboard/ActivityList.tsx        ← Recent activity feed
Dashboard/ReportsScreen.tsx       ← Analytics + reports
Dashboard/TeamScreen.tsx          ← Team overview
Dashboard/AdvisorProfile.tsx      ← Individual advisor profile
Dashboard/ConnectionSentinel.tsx  ← Firebase connection status monitor
Dashboard/v4/DashboardV4.tsx      ← V4 experimental dashboard (not currently in SPA route)
Dashboard/v4/NeuralHubHeaderV4.tsx ← V4 header component
Dashboard/v4/StatCardV4.tsx       ← V4 stat cards
Dashboard/v4/StrategicIntelligenceV4.tsx ← V4 intel panel
Dashboard/v4/AssetFinalizationV4.tsx ← V4 asset finalization
```

**Listings & Inventory**
```
Listings/ListingsHub.tsx          ← Property listings grid with search/filter
Listings/AddListingModal.tsx      ← Add new listing form modal
Listings/InventoryShowcase.tsx    ← Visual inventory showcase
Listings/ShareListingModal.tsx    ← Share listing via WhatsApp/link
Listings/SyncWizard.tsx          ← Property Finder sync wizard
components/inventory.tsx          ← Inventory search + scroll list (used in other screens)
```

**CRM**
```
CRM/CRMKanban.tsx                 ← Sales pipeline kanban board (drag stages)
CRM/LeadsFlow.tsx                 ← Lead management + detail panel + call button
CRM/ClientsScreen.tsx             ← Client profiles list with search
```

**Operations**
```
Operations/LiveInventoryMap.tsx   ← Leaflet map: geographic zones (circles)
                                    Dynamic zones from Firestore 'zones' collection
                                    Fallback to hardcoded ZONES if Firestore empty
Operations/MapExplorer.tsx        ← Leaflet map: individual property pins + AR/EN filter
Operations/MarketIntelligence.tsx ← Market analytics: trends, AI focus recommendation
Operations/EasyListing.tsx        ← Quick listing entry form (phone → Firestore)
Operations/IntegrationHub.tsx     ← API integrations status + config
Operations/CommissionLedger.tsx   ← Commission tracking + calculations
Operations/BrokerFeed.tsx         ← Live broker message feed from WhatsApp/Telegram
Operations/ActionProtocols.tsx    ← Standard operating procedure flows
Operations/SiteExperiences.tsx    ← Viewing + site visit management
Operations/ViewingTerminal.tsx    ← Viewing session terminal
Operations/ClosingTerminal.tsx    ← Deal closing terminal
Operations/VoucherSystem.tsx      ← Voucher / discount management
Operations/StaleDataMonitor.tsx   ← Monitors old/stale listings
Operations/FeedbackPortal.tsx     ← Post-deal feedback collection
Operations/ImageLinkHub.tsx       ← Image URL batch upload tool
```

**Admin**
```
Admin/AdminDashboard.tsx          ← Admin overview with pipeline log
Admin/AdminPortal.tsx             ← Admin portal wrapper
Admin/PortfolioAssets.tsx         ← Full asset management (search, filter, status)
Admin/DatabaseExplorer.tsx        ← Browse Firestore collections live
Admin/MediaHub.tsx                ← Image + media management
Admin/TeamCRM.tsx                 ← Team member management + add advisor
Admin/AddAdvisorModal.tsx         ← Modal: add new advisor (form with validation)
Admin/DedupeReviewQueue.tsx       ← Review duplicate listing queue
Admin/PropertyDrawer.tsx          ← Property detail side drawer
Admin/PropertyForm.tsx            ← Property edit form
Admin/PasteUnit.tsx               ← Paste raw text → parse into unit
```

**Proposals (Stage 8)**
```
Proposals/ConciergeGallery.tsx    ← Stage 8 client gallery (mobile-first, shareable)
Proposals/AssetProposalCard.tsx   ← Individual unit card in proposal
Proposals/ProposalView.tsx        ← Full proposal view with trust layer
```

**System**
```
System/SystemDashboard.tsx        ← System health: pipeline stages, agent status
System/MaintenanceMonitor.tsx     ← Maintenance mode + system alerts
```

**UI Components**
```
UI/Topbar.tsx                     ← Top navigation: theme toggle (useTheme), search, user info
UI/Sidebar.tsx                    ← Desktop left sidebar: navigation items
UI/MobileNav.tsx                  ← Bottom tab bar (mobile only, 5 tabs)
UI/SierraTerminal.tsx             ← AI chat terminal (Leila/Gravity interface)
UI/LeilaConcierge.tsx             ← Leila AI concierge floating button
UI/LanguageToggle.tsx             ← AR/EN language toggle button
UI/BrandLogo.tsx                  ← Sierra Blu logo component
UI/CinematicHero.tsx              ← Hero section component
UI/PremiumHero.tsx                ← Premium variant hero
UI/PropertyDetailModal.tsx        ← Property detail modal overlay
UI/LuxurySkeleton.tsx             ← Loading skeleton for luxury cards
UI/KPIProgressBar.tsx             ← Animated KPI progress bar
UI/TestimonialsCarousel.tsx       ← Testimonials section
Shared/VirtualTourViewer.tsx      ← 360° virtual tour viewer
Visuals.tsx                       ← Shared visual effects/animations
```

### AI Agents (`lib/agents/`)
```
lib/agents/scribe.ts              ← S1+S2: parse raw broker message with Gemini
lib/agents/curator.ts             ← S3+S4+S5: write copy + post to Property Finder
lib/agents/matchmaker.ts          ← S6+S7+S8: profile client + match units + proposal
lib/agents/closer.ts              ← S9+S10: ROI analysis + closing + feedback loop
lib/agents/index.ts               ← Re-exports all agents
```

### Server-only (`lib/server/`) — USE ONLY IN API ROUTES
```
lib/server/firebase-admin.ts      ← Firebase Admin SDK (adminDb, adminAuth, adminStorage)
lib/server/google-ai.ts           ← Gemini API wrapper — use this for ALL AI calls
lib/server/auth-guard.ts          ← verifyRequest() — required on every API route
lib/server/gravity.ts             ← Gravity agent server-side handler
lib/server/openclaw.ts            ← OpenClaw proxy client
lib/server/app-check.ts           ← Firebase App Check
```

### Services (`lib/services/`)
```
orchestrator.ts                   ← Pipeline master: runs S1→S10, retry, DLQ, Telegram alert
antigravity-agent.ts              ← "Gravity" Telegram AI interface (admin + client modes)
matching-engine.ts                ← Neural unit-to-client scoring (S7)
portfolio-engine.ts               ← Stage 8 concierge curation
financial-service.ts              ← Valuation, ROI, installment math
branding-service.ts               ← Luxury AR+EN copywriting generation
WhatsAppParserService.ts          ← Parse broker messages with Gemini
profiling-service.ts              ← Build client profiles from conversation
sales-engine.ts                   ← Options packages, negotiation logic
legal-brain.ts                    ← Legal risk assessment
roi-service.ts                    ← ROI analysis (S9)
closing-engine.ts                 ← Closing simulation (S9+S10)
ClosingSimulator.ts               ← Closing scenario simulator
SheetsIntegrationService.ts       ← Google Sheets CSV → Firestore import
PFIntegrationService.ts           ← Property Finder portal sync
PropertyFinderService.ts          ← Property Finder API client
sync-engine.ts                    ← Portal sync management
telegram-controller.ts            ← Telegram bot message controller
telegram-alert-service.ts         ← Telegram alert helper (NOTE: use inline fetch in server files)
vector-service.ts                 ← Semantic vector search
memory-service.ts                 ← Agent conversation memory
firestore-service.ts              ← Generic CRUD wrappers
handoff-service.ts                ← Stage handoff + state transitions
feedback-engine.ts                ← Post-deal feedback processor (S10)
viewing-engine.ts                 ← Viewing scheduling + confirmation
voice-service.ts                  ← Voice message processing
sheets-sync.ts                    ← Sheets sync helper
asset-encoding.ts                 ← Asset code generation (SBR format)
coding-algorithm.ts               ← Property coding algorithm
coding-service.ts                 ← Coding service wrapper
ImageLinkHub.ts                   ← Image link management
MaintenanceMonitor.ts             ← System maintenance monitor
StorageService.ts                 ← Firebase Storage operations
nexus-agent.ts                    ← Nexus integration agent
skill-loader.ts                   ← Dynamic skill loading
WhatsAppStatusService.ts          ← WhatsApp connection status
```

### Data Layer
```
lib/models/schema.ts              ← ALL Firestore types + COLLECTIONS constant — READ FIRST
lib/firebase/index.ts             ← Client-side Firebase (db, auth, storage) — client components only
lib/firebase/inventory.ts         ← Inventory-specific Firestore queries
lib/I18nContext.tsx               ← I18n context: useI18n() → { t, locale, setLocale, dir }
lib/AuthContext.tsx               ← Auth context: useAuth() → { user, isGuest, loading, signOut }
lib/hooks/useLeila.ts             ← Leila conversational UI hook
lib/i18n.ts                       ← next-intl config
lib/config.ts                     ← App-wide constants
lib/arize.ts                      ← Arize Phoenix tracing (instrumentAgent wrapper)
lib/audit.ts                      ← Audit log utilities
lib/animations.ts                 ← Framer Motion presets
lib/financial-engine.ts           ← Financial calculation engine
lib/gravity-warp.ts               ← Gravity UI effects
lib/property-finder-client.ts     ← Property Finder HTTP client
lib/prompts.ts                    ← Shared AI prompt templates
lib/prompts/leila.ts              ← Leila-specific prompts
lib/telegram.ts                   ← Telegram API helpers
lib/validation/matching-engine.test.ts ← Matching engine validation tests
lib/validation/roi-projections.test.ts ← ROI projection tests
```

---

## FIRESTORE DATABASE

**Project:** `sierra-blu` — https://console.firebase.google.com/project/sierra-blu

**Collections:**
| Collection | Description |
|------------|-------------|
| `listings` | Property units (also referenced as `units` in some older code) |
| `leads` | Client leads with pipeline stage, conversation history |
| `clients` | Client/stakeholder profiles |
| `concierge_selections` | Stage 8 curated proposals per lead |
| `users` | Platform users + roles |
| `broker_messages` | Raw ingested WhatsApp messages |
| `orchestration_logs` | Pipeline execution records per document |
| `failed_orchestrations` | DLQ — pipeline failures for manual review |
| `zones` | Leaflet map zones (LiveInventoryMap reads this) |
| `activities` | Activity log |
| `sales` | Completed deals |

**CRITICAL:** Always use `COLLECTIONS` from `lib/models/schema.ts` — never hardcode collection name strings.

---

## THEME SYSTEM (V12.2 — UPDATED)

- **Package:** `next-themes` (installed at `my-app/node_modules/next-themes`)
- **Provider:** `ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange` — wraps entire app in `app/layout.tsx`
- **`<html>`:** Has `suppressHydrationWarning` — no hardcoded `data-theme` attribute
- **Theme toggle:** `components/UI/Topbar.tsx` uses `useTheme()` from `next-themes`
  ```tsx
  const { theme, setTheme } = useTheme();
  // toggle: setTheme(theme === 'dark' ? 'light' : 'dark')
  ```
- **Persistence:** `next-themes` handles localStorage automatically — no manual code needed
- **CSS variables:** `app/globals.css`
  - Dark (default `:root`): Navy `#050B14`, Ivory `#F4F0E8`, Gold `#D4AF37`
  - Light (`[data-theme="light"]`): Ivory bg, Navy text

---

## ARABIC / ENGLISH (i18n) (V12.2 — UPDATED)

- **Library:** `next-intl` + custom `I18nContext`
- **Default locale:** `en` (set in `lib/I18nContext.tsx` useState initial value)
- **Translation files:** `messages/ar.json` + `messages/en.json`
- **Usage:** `const { t, locale, setLocale, dir } = useI18n()`
- **RTL:** `I18nContext.tsx` already sets `document.documentElement.dir` and `lang` in `setLocale()` — **this is already fixed, no action needed**
- **Arabic font:** Noto Sans Arabic, variable `--font-arabic`, loaded in `app/layout.tsx`
- **Language toggle:** `components/UI/LanguageToggle.tsx`

---

## TAILWIND CSS v4 (V12.2 — UPDATED)

- **Version:** Tailwind CSS v4 — no `tailwind.config.ts` file; configured via `@import "tailwindcss"` in `globals.css`
- **Logical properties:** ALL components use RTL-safe logical properties:
  - `ms-*` / `me-*` instead of `ml-*` / `mr-*` (margin start/end)
  - `ps-*` / `pe-*` instead of `pl-*` / `pr-*` (padding start/end)
  - `start-*` / `end-*` instead of `left-*` / `right-*` (for `absolute` positioned icons)
  - `border-s` / `border-e` instead of `border-l` / `border-r`
  - These auto-flip in RTL — **no `rtl:` variant overrides needed anywhere**

---

## GEMINI AI — CRITICAL RULES

**ONLY use these two model names:**
- `"gemini-1.5-flash"` — text-only (fast, cheap, use by default)
- `"gemini-1.5-pro"` — tasks with images (slower)

**All AI calls go through:** `lib/server/google-ai.ts` → `GoogleAIService.generateContent()`

```typescript
import { GoogleAIService } from '@/lib/server/google-ai';

const result = await GoogleAIService.generateContent(
  'agentName',
  'stageName',
  { system: 'You are...', user: 'User prompt here' },
  { model: 'gemini-1.5-flash', jsonMode: true }
);
```

**Wrong names (fixed — do not reintroduce):** `gemini-flash-latest`, `gemini-pro-latest`, `gemini-2.0-flash`

---

## MAPS

Both maps use `react-leaflet` + `leaflet` v1.9.4. Dynamic import with `{ ssr: false }` is already set in `app/page.tsx`.

**`LiveInventoryMap.tsx`**
- Shows geographic zones (New Cairo, Admin Capital, Shorouk, Madinaty) as colored circles
- Zone data loaded dynamically from Firestore `zones` collection on mount
- Falls back to `DEFAULT_ZONES` hardcoded constants if Firestore is empty or unavailable
- Live unit counts from Firestore `listings` collection via `onSnapshot`
- Has loading skeleton: `loading: () => <div className="w-full h-full rounded-[2rem] bg-white/5 animate-pulse" />`

**`MapExplorer.tsx`**
- Shows individual property pins from Firestore `properties` collection
- Filter by type (resale/rent)
- AR/EN labels via `useI18n()`
- Centered on New Cairo `[30.0131, 31.5020]`

---

## SPA NAVIGATION (HOW SCREENS WORK)

The app is a **single page app**. There is only **one real Next.js page: `app/page.tsx`**.

```
Screen switching:
  Sidebar item clicked → setActiveScreen('listings')
  MobileNav tab clicked → setActiveScreen('map')
  app/page.tsx switch() → renders the right component

activeScreen values:
  'dashboard'      → DashboardScreen
  'listings'       → PortfolioAssets
  'crm'            → CRMKanban
  'leads'          → LeadsFlow
  'clients'        → ClientsScreen
  'reports'        → ReportsScreen
  'team'           → TeamScreen
  'protocols'      → ActionProtocols
  'media'          → MediaHub
  'experiences'    → SiteExperiences
  'ledger'         → CommissionLedger
  'sync'           → DedupeReviewQueue
  'processing'     → EasyListing
  'nexus'          → IntegrationHub
  'intelligence'   → MarketIntelligence
  'map'            → LiveInventoryMap
  'system'         → SystemDashboard

MobileNav tabs (5): dashboard, listings, map, crm, reports
Sidebar: all items (desktop only, hidden on mobile)
```

All screen components are loaded with `dynamic({ ssr: false })` — never remove this for anything that uses browser APIs.

---

## MOBILE LAYOUT

- **Sidebar:** `<div className="hidden md:block">` — only visible on tablet/desktop
- **MobileNav:** `components/UI/MobileNav.tsx` — fixed bottom bar, only on mobile (`md:hidden`)
- **Content area:** `<div className="main-content pb-[80px] md:pb-0">` — extra bottom padding on mobile to clear the nav bar

---

## PYTHON BOTS

**Customer WhatsApp Bot (6-step):**
```
H:\Sierra Blue SaaS Program Locally V2\11_Core_Intelligence\sierra_blue_bot_implementation.py
```
Run: `python sierra_blue_bot_implementation.py` — currently in mock mode (no Meta API keys yet)

**WhatsApp Scraper Bot (Node.js / Puppeteer):**
```
H:\Sierra Blue SaaS Program Locally V2\my-app\apps\whatsapp-scraper-bot\index.js
```
Run: `node index.js` — scrapes broker group → forwards to `/api/ingest/whatsapp`

---

## CONFIRMED WORKING ✅ (as of V12.2)

| Item | Status |
|------|--------|
| TypeScript `npx tsc --noEmit` | ✅ 0 errors |
| next-themes installed + wired | ✅ ThemeProvider in layout.tsx |
| Theme toggle (Moon/Sun) | ✅ useTheme() in Topbar.tsx, persists to localStorage |
| Tailwind logical properties | ✅ All 36 LTR class occurrences replaced across 18 files |
| RTL auto-switch (html dir) | ✅ Already in I18nContext.tsx setLocale() |
| Orchestrator DLQ + Telegram | ✅ failed_orchestrations collection + inline Telegram alert |
| LiveInventoryMap dynamic zones | ✅ Reads Firestore 'zones', falls back to hardcoded |
| Map loading skeleton | ✅ animate-pulse div while map loads |
| Mobile bottom nav (MobileNav) | ✅ 5 tabs, gold active pill, safe-area padding |
| Cinematic landing page | ✅ Light theme, Framer Motion hero, snap-scroll |
| Admin portal build | ✅ Clean build |
| Gemini model names | ✅ Only gemini-1.5-flash and gemini-1.5-pro used |
| Stage 8 (Concierge page) | ✅ portfolio-engine + gallery + API + public page complete |
| AR/EN i18n | ✅ ar.json + en.json, next-intl wired |
| Login flows | ✅ Email/pass + Google SSO + Guest mode |

---

## BLOCKERS ❌

### BLOCKER #1 — No Firebase Admin service account (CRITICAL)
The pipeline orchestrator, sync engine, and all server-side writes use `firebase-admin`. Without a service account JSON, every pipeline run fails.

**Fix (5 minutes):**
1. Go to https://console.firebase.google.com/project/sierra-blu
2. Project Settings → Service Accounts → Generate new private key
3. Save JSON to: `H:\Sierra Blue SaaS Program Locally V2\my-app\config\service_account.json`
4. Add to `.env.local`:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./config/service_account.json
   ```

### BLOCKER #2 — Firestore is empty
All screens show empty state. The database has no real or test data.

**Fix Option A — Seed test data (5 minutes):**
```powershell
cd "H:\Sierra Blue SaaS Program Locally V2\my-app"
node scripts/seed-inventory.mjs
# Creates 1,000 units across Mivida, Mountain View iCity, Hyde Park, Palm Hills, ZED East
```

**Fix Option B — Import from Google Sheets:**
1. Prepare a Google Sheet with columns: `Title | Price | Type | Status | Area | Bedrooms | Bathrooms | Compound | Location | Description | Featured Image | Reference Number`
2. File → Share → Publish to web → CSV format → copy URL
3. Add `MASTER_SHEET_ID` to `.env.local`
4. `POST /api/sync` with `{ "action": "sheets", "csvUrl": "YOUR_URL" }`

Service: `lib/services/SheetsIntegrationService.ts`

### BLOCKER #3 — WhatsApp Meta API not configured
Live broker message ingestion is not active. Bot is in mock mode.

**Fix:**
1. Go to https://developers.facebook.com → Create app → WhatsApp Business
2. Get `WHATSAPP_META_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` → add to `.env.local`
3. Set webhook to: `https://yourdomain.com/api/ingest/whatsapp`

---

## DEFERRED (DO NOT IMPLEMENT WITHOUT DISCUSSION)

These were intentionally left out — they require major structural changes:

- **App Router SPA refactor** — converting `switch(activeScreen)` to `app/(authenticated)/[screen]/page.tsx`. Would break too many things at once.
- **`app/[locale]/layout.tsx` server-side RTL** — requires adding next-intl routing middleware and restructuring all routes.
- **URL-based filter state** — e.g. `?compound=mivida` in inventory. Deferred pending SPA refactor decision.
- **Arize Phoenix tracing** — no API key configured yet. The `instrumentAgent()` wrapper is a no-op without it; app works fine.

---

## NEXT STEPS (DO IN THIS ORDER)

### 1. Get Firebase service account (5 min) — FIRST
```
Firebase Console → Project Settings → Service Accounts → Generate new private key
Save to: my-app/config/service_account.json
Add GOOGLE_APPLICATION_CREDENTIALS to .env.local
```

### 2. Seed the database (5 min)
```powershell
cd "H:\Sierra Blue SaaS Program Locally V2\my-app"
node scripts/seed-inventory.mjs
```

### 3. Test pipeline end-to-end (15 min)
```
POST http://localhost:3000/api/orchestrate
Headers: { "x-cron-secret": "sierra_blu_dev_secret_2026" }
Body: { "action": "run", "collection": "listings", "docId": "ANY_SEEDED_DOC_ID" }
```

### 4. Seed Firestore zones collection (for LiveInventoryMap)
The map shows live unit counts per zone. Seed the `zones` collection with:
```json
{
  "name_ar": "القاهرة الجديدة",
  "name_en": "New Cairo",
  "coordinates": { "lat": 30.0131, "lng": 31.5020 },
  "radius": 8000,
  "color": "#D4AF37",
  "compounds": ["Mivida", "Mountain View iCity", "Hyde Park", "Palm Hills"]
}
```

### 5. Test Gravity (Telegram AI interface)
Once Firestore has data, message the bot on Telegram:
- Admin commands: "analyze lead Ahmed", "show available listings in Mivida"
- The `antigravity-agent.ts` processes natural language → executes pipeline stages → replies

### 6. Get WhatsApp Meta API credentials
Then test full pipeline: send WhatsApp message → appears in Firestore as new listing in ~30 seconds

---

## THE GRAVITY AGENT

`lib/services/antigravity-agent.ts` — the central AI command interface.

**Admin mode** (Telegram chat ID `7175892124`):
- Natural language → AI detects intent → runs: analyze lead / generate proposal / check listing / general query
- Example: "generate a proposal for Ahmed" → runs S6+S7+S8 → sends proposal URL back

**Client/Stakeholder mode** (any other chat ID):
- Runs the Matchmaker interview (S6-S8)
- Collects: budget, area preference, property type
- Returns: `https://yourdomain.com/concierge/LEAD_ID`

---

## TECH STACK

| Technology | Version | Usage |
|------------|---------|-------|
| Next.js | 16.2.4 | Full-stack (App Router) |
| TypeScript | 5.x | All code |
| React | 19.2.4 | UI |
| Firebase client | 12.x | Database + Auth + Storage (client components) |
| Firebase admin | 13.x | Server-side writes (API routes only) |
| next-themes | latest | Theme persistence + FOUC prevention |
| Gemini AI | @google/generative-ai 0.24.1 | All AI features |
| react-leaflet | 5.0 | Interactive maps |
| framer-motion | 12.x | Animations (use `[0.16, 1, 0.3, 1]` easing — no bouncy springs) |
| next-intl | 4.9 | AR/EN i18n |
| Tailwind CSS | 4.x | Styling (logical properties throughout) |
| Recharts | 3.x | Dashboard charts |
| googleapis | 171.x | Google Sheets sync |
| papaparse | 5.x | CSV parsing |

---

## CRITICAL RULES FOR NEXT AGENT

1. **Gemini model names:** only `gemini-1.5-flash` and `gemini-1.5-pro` — no variations
2. **`COLLECTIONS` constant:** always use from `lib/models/schema.ts` — never hardcode collection strings
3. **`ssr: false`:** required for all Leaflet components and any browser-only APIs — already in `app/page.tsx`
4. **`lib/server/` files:** only import in API routes / server components — never in client components
5. **`verifyRequest()`:** from `lib/server/auth-guard.ts` — required on every API route
6. **`telegram-controller.ts`:** DO NOT import in server files like `orchestrator.ts` — it uses client Firebase SDK. Use inline `fetch()` to Telegram API directly (already done in orchestrator)
7. **Tailwind logical properties:** use `ms/me/ps/pe/start/end` — not `ml/mr/pl/pr/left/right`
8. **Theme:** use `useTheme()` from `next-themes` — not `document.documentElement.setAttribute`
9. **Screen navigation:** set `activeScreen` state in `app/page.tsx` — the app is a SPA, not multi-page
10. **Drive:** work on `H:` only — never `C:`

---

## QUICK REFERENCE COMMANDS

```powershell
# Start dev server
cd "H:\Sierra Blue SaaS Program Locally V2\my-app"; npm run dev

# TypeScript check
cd "H:\Sierra Blue SaaS Program Locally V2\my-app"; npx tsc --noEmit 2>&1; echo "TSC_EXIT:$LASTEXITCODE"

# Seed Firestore with 1,000 test units
cd "H:\Sierra Blue SaaS Program Locally V2\my-app"; node scripts/seed-inventory.mjs

# Build admin portal
cd "H:\Sierra Blue SaaS Program Locally V2\sierra-blu-admin-portal"; npm run build

# Check WhatsApp scraper syntax
node --check "H:\Sierra Blue SaaS Program Locally V2\my-app\apps\whatsapp-scraper-bot\index.js"

# Run Python bot
cd "H:\Sierra Blue SaaS Program Locally V2\11_Core_Intelligence"; python sierra_blue_bot_implementation.py

# Scan for any remaining LTR Tailwind classes (should return nothing)
cd "H:\Sierra Blue SaaS Program Locally V2\my-app"
Select-String -Recurse -Path ".\components" -Pattern "\bml-|\bmr-|\bpl-|\bpr-" -Include "*.tsx"
```

---

*Single source of truth — last verified April 29, 2026 — TSC_EXIT:0*
