# 🏡 Sierra Blue — Master Project Handover
**Date:** 28 April 2026  
**Version:** V12.0 (Quiet Luxury / Base 44)  
**Status:** Infrastructure complete. Needs real API keys to go live.

---

## 📁 Project Structure

```
H:\Sierra Blue SaaS Program Locally V2\
│
├── my-app/                          ← Main Next.js 16 Platform (PORT 3000)
├── 11_Core_Intelligence/            ← Python WhatsApp Bot (6-Step Workflow)
├── sierra-blu-admin-portal/         ← Admin Dashboard (Vite/React)
├── my-app/apps/whatsapp-scraper-bot/← Node.js WhatsApp Message Scraper
├── GitNexus/                        ← Internal Dev Tool (separate project)
└── 16_Investigation_Report/         ← Audit scripts
```

---

## 🔑 Environment Variables — Current State

### `my-app/.env.local`
| Variable | Value | Status |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBZLN2jTTKV34Sne...` | ✅ Real |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `sierra-blu` | ✅ Real |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `sierra-blu.firebaseapp.com` | ✅ Real |
| `PROPERTY_FINDER_CLIENT_ID` | `tMlCs.H28cDCwm6YZXKc8P06...` | ✅ Real |
| `PROPERTY_FINDER_CLIENT_SECRET` | `xG7Ud54sQqDgX0hwcy0g54bf...` | ✅ Real |
| `TELEGRAM_BOT_TOKEN` | `8719045454:AAHzZ8SevO6GOs3k...` | ✅ Real |
| `TELEGRAM_CHAT_ID` | `7175892124` | ✅ Real |
| `OPENCLAW_BASE_URL` | `http://127.0.0.1:18789/v1` | ✅ Local |
| `OPENCLAW_TOKEN` | `02b25ffca992d11287...` | ✅ Real |
| `GOOGLE_AI_API_KEY` | `AIzaSyBFLZ6edyLeVu5a...` | ❌ **WRONG — This is a Google Maps key!** |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIzaSyBFLZ6edyLeVu5a...` | ✅ Maps key (correct here) |

### ⚠️ CRITICAL FIX NEEDED
```
GOOGLE_AI_API_KEY must be replaced with a real Gemini key.
Get it free at: https://aistudio.google.com/app/apikey
Then update: my-app/.env.local  →  GOOGLE_AI_API_KEY=AIzaSy...YOUR_REAL_KEY
```

### `11_Core_Intelligence/.env` (Python Bot — create from .env.example)
| Variable | What it does | Where to get it |
|---|---|---|
| `META_WA_PHONE_NUMBER_ID` | WhatsApp Business sender | Meta Developer Console |
| `META_WA_ACCESS_TOKEN` | WhatsApp API auth | Meta Developer Console |
| `HUBSPOT_API_KEY` | CRM contacts | app.hubspot.com → Settings → API |
| `GOOGLE_CALENDAR_CREDS_JSON` | Viewing appointments | Google Cloud Console |
| `MIXPANEL_TOKEN` | Analytics | mixpanel.com |
| `AGENT_PHONE` | Human agent WhatsApp | Your agent's number |

---

## ✅ What's Fully Built & Working

### 1. Next.js Platform (`my-app/`)
| Route/Feature | File | Status |
|---|---|---|
| Landing Page | `app/page.tsx` | ✅ |
| Admin Dashboard | `app/admin/` | ✅ |
| Concierge Selection (S8) | `app/concierge/[leadId]/page.tsx` | ✅ |
| Concierge API | `app/api/concierge/[leadId]/route.ts` | ✅ |
| WhatsApp Ingest | `app/api/ingest/whatsapp/route.ts` | ✅ |
| Agent Hub (Leila AI) | `app/api/agent/hub/route.ts` | ✅ |
| Proposals | `app/api/proposals/` | ✅ |
| Leads | `app/api/leads/` | ✅ |
| Matching Engine | `app/api/matching/` | ✅ |
| Property Finder Sync | `app/api/property-finder/` | ✅ |
| Telegram Alerts | `app/api/telegram/` | ✅ |
| Cron Jobs | `app/api/cron/` | ✅ |
| Webhooks | `app/api/webhooks/` | ✅ |
| OpenClaw OCR | `app/api/openclaw/` | ✅ |
| Orchestrator | `app/api/orchestrate/` | ✅ |

### 2. Intelligence Agents (`my-app/lib/agents/`)
| Agent | Stage | File | Status |
|---|---|---|---|
| Scribe | S1 + S2 | `scribe.ts` | ✅ Gemini 1.5-flash |
| Curator | S3 + S4 + S5 | `curator.ts` | ✅ Gemini 1.5-flash/pro |
| Matchmaker | S6 + S7 + S8 | `matchmaker.ts` | ✅ |
| Closer | S9 + S10 | `closer.ts` | ✅ |

### 3. Services (`my-app/lib/services/`)
All 30+ services built:
- `portfolio-engine.ts` — Stage 8 Concierge Selection
- `matching-engine.ts` — Neural property matching
- `WhatsAppParserService.ts` — Parses broker messages with Gemini
- `branding-service.ts` — Property copywriting (S3)
- `profiling-service.ts` — Client profiling (S6)
- `viewing-engine.ts` — Calendar booking (S5)
- `closing-engine.ts` — ROI + deal close (S9)
- `feedback-engine.ts` — Learning loop (S10)
- `firestore-service.ts` — All DB operations
- `telegram-alert-service.ts` — VIP/deal alerts
- `PropertyFinderService.ts` — Live market data
- `sheets-sync.ts` — Google Sheets export
- `vector-service.ts` — Semantic search embeddings
- + 17 more

### 4. Python Bot (`11_Core_Intelligence/`)
| File | Purpose | Status |
|---|---|---|
| `sierra_blue_bot_implementation.py` | 6-step WhatsApp workflow | ✅ All steps pass |
| `sierra_blue_api_integration.py` | Real API connectors | ✅ Ready (needs keys) |
| `requirements_bot.txt` | pip dependencies | ✅ |
| `.env.example` | Key template | ✅ |
| `QUICK_START_GUIDE.md` | Setup instructions | ✅ |
| `config.py` | Bot configuration | ✅ |

### 5. Python Bot — 6-Step Workflow (Arabic)
```
Step 1: Greeting  → "أهلاً بحضرتك في سييرا بلو..." + asks move-in date & rental duration
Step 2: Check     → Availability check via SBR Code
Step 3: Report    → Transparency report with last_updated date (28/04/2026)
Step 4: Discover  → Discovery pivot + 4 sequential questions (Q1→Q2→Q3→Q4)
Step 5: Propose   → Portfolio proposal + viewing slot confirmation
Step 6: Handover  → "المستشار هيكلم حضرتك خلال ساعة بالكتير... يومك سعيد مع سييرا بلو! 🏡"
```

### 6. Admin Portal (`sierra-blu-admin-portal/`)
- Vite + React
- Firebase env vars secured (`import.meta.env.VITE_*`)
- Builds clean (`npm run build` → exit 0)

### 7. WhatsApp Scraper (`my-app/apps/whatsapp-scraper-bot/`)
- Node.js + whatsapp-web.js
- Posts to `http://localhost:3000/api/ingest/whatsapp`
- Base64 image support, retry logic, 60s heartbeat
- Syntax fixed, passes `node --check`

### 8. UI Components (`my-app/components/`)
- `ConciergeGallery.tsx` — Mobile-first swipeable portfolio (framer-motion, dark navy/gold)
- Full admin UI, property cards, lead management

---

## ❌ What's Missing / Broken

### BLOCKER #1 — Wrong Gemini Key
```
File: my-app/.env.local
Line: GOOGLE_AI_API_KEY=AIzaSyBFLZ6edyLeVu5aXVgyaawBZqGSwwQvonA  ← Maps key!

Fix: Replace with real Gemini key from https://aistudio.google.com/app/apikey
```
**Impact:** ALL AI features fail — Scribe, Curator, Matchmaker, WhatsApp parsing, Leila bot.

### BLOCKER #2 — Python Bot needs real keys
```
File: 11_Core_Intelligence/.env  (copy from .env.example)
Missing: META_WA_ACCESS_TOKEN, META_WA_PHONE_NUMBER_ID
Impact: Bot sends mock messages only, not real WhatsApp
```

### MINOR — Next.js "Exit Code 1" in VS Code panel
This is **not a crash**. It means a second Next.js instance tried to start while PID 25536 was already running on port 3000. The server IS running at http://localhost:3000.
```
Fix if needed: taskkill /PID 25536 /F  → then npm run dev
```

---

## 🚀 To Go Live — Checklist (in order)

### Step 1: Fix Gemini Key (5 minutes)
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Open `my-app/.env.local`
4. Replace line: `GOOGLE_AI_API_KEY=AIzaSyBFLZ6...` with your new key
5. Restart Next.js

### Step 2: Test AI Pipeline (10 minutes)
```bash
# POST to local server
curl -X POST http://localhost:3000/api/ingest/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"message": "شقة 3 غرف في فيلايت 45000 جنيه", "from": "+201009876543"}'
```
Should return a parsed property with `sbr_code`.

### Step 3: Connect Python Bot to Real WhatsApp (1-2 hours)
1. Go to https://developers.facebook.com → Create WhatsApp Business app
2. Get `META_WA_PHONE_NUMBER_ID` and `META_WA_ACCESS_TOKEN`
3. Create `11_Core_Intelligence/.env` from `.env.example`
4. Fill in the Meta keys + your agent phone number
5. Run: `cd 11_Core_Intelligence && python sierra_blue_bot_implementation.py`

### Step 4: Connect HubSpot CRM (30 minutes)
1. Sign up at https://app.hubspot.com (free)
2. Settings → Integrations → API Key → Generate
3. Add to `11_Core_Intelligence/.env`: `HUBSPOT_API_KEY=your_key`

### Step 5: Deploy to Vercel (15 minutes)
```bash
cd my-app
npx vercel --prod
# Add all .env.local variables in Vercel dashboard → Settings → Environment Variables
```

---

## 🗺️ 10-Stage Intelligence Pipeline

```
S1  Intake          Scribe      Raw WhatsApp/Telegram → structured JSON
S2  Normalization   Scribe      JSON → SBR Code format
S3  Branding        Curator     SBR Code → luxury copywriting
S4  Distribution    Curator     Push to portals (Property Finder, etc.)
S5  Portal Sync     Curator     Sync availability status
S6  Profiling       Matchmaker  Customer intake → profile
S7  Neural Match    Matchmaker  Profile → top property matches
S8  Concierge ←     Matchmaker  Concierge Selection Page (DONE ✅)
S9  Finalization    Closer      ROI analysis, deal closing
S10 Feedback        Closer      Learning loop, optimization
```

---

## 💻 How to Run Everything

### Next.js Platform
```bash
cd "H:\Sierra Blue SaaS Program Locally V2\my-app"
npm run dev
# Runs at http://localhost:3000
```

### Python Bot (Demo Mode)
```bash
cd "H:\Sierra Blue SaaS Program Locally V2\11_Core_Intelligence"
pip install -r requirements_bot.txt
python sierra_blue_bot_implementation.py
```

### Admin Portal
```bash
cd "H:\Sierra Blue SaaS Program Locally V2\sierra-blu-admin-portal"
npm run dev
# Runs at http://localhost:5173
```

### WhatsApp Scraper
```bash
cd "H:\Sierra Blue SaaS Program Locally V2\my-app\apps\whatsapp-scraper-bot"
node index.js
# Requires Next.js running on port 3000
```

---

## 📊 Test Status

| Test Suite | Command | Status |
|---|---|---|
| TypeScript compile | `cd my-app && npx tsc --noEmit` | ✅ 0 errors |
| Admin portal build | `cd sierra-blu-admin-portal && npm run build` | ✅ Clean |
| Python bot demo | `python sierra_blue_bot_implementation.py` | ✅ All 6 steps |
| WhatsApp bot syntax | `node --check index.js` | ✅ Valid |
| GitNexus tests | `uv run pytest tests/test_tool_scripts.py` | ✅ 2/2 |

---

## 📦 Key Dependencies

### Next.js (`my-app/package.json`)
- `next` 16.2.4
- `@google/generative-ai` 0.24.1 — Gemini AI
- `firebase` / `firebase-admin` — Firestore database
- `framer-motion` — ConciergeGallery animations
- `@opentelemetry/*` — Arize AI tracing

### Python (`11_Core_Intelligence/requirements_bot.txt`)
- `requests` — HTTP calls to Meta WhatsApp API
- `python-dotenv` — Environment variables
- `google-generativeai` — Gemini (optional, for AI features)
- `firebase-admin` — Firestore sync
- `twilio` — Alternative WhatsApp provider
- `mixpanel` — Analytics

---

## 🔒 Security Notes
- All `.env` files are local only — never committed to Git
- Firebase keys are public-safe (`NEXT_PUBLIC_*` = client-side, no secrets)
- `GOOGLE_AI_API_KEY` is server-side only (not prefixed with `NEXT_PUBLIC_`)
- `CRON_SECRET` protects cron job endpoints
- Firestore rules enforce auth in `my-app/firestore.rules`

---

## 📞 One-Line Summary
> The entire Sierra Blue SaaS platform is architecturally complete across all 10 pipeline stages. The only thing between this local demo and a live product is replacing the wrong `GOOGLE_AI_API_KEY` with a real Gemini key from aistudio.google.com, and adding WhatsApp Meta API credentials to the Python bot's `.env` file.

---
*Generated: 28 April 2026 | Sierra Blue V12.0 | Base 44 Orchestration*
