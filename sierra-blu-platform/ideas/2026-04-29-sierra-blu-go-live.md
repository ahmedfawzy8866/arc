# Sierra Blu Go-Live Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the final infrastructure setup, data seeding, and UI polish to launch the Sierra Blu PropTech OS.

**Architecture:** A state-driven 10-Stage Intelligence Pipeline (S1-S10) managed by an Orchestrator, leveraging Gemini 1.5 Pro for parsing and matching.

**Tech Stack:** Next.js 16 (App Router), Firebase (Auth/Firestore/Admin), Gemini 1.5 Pro, Arize Phoenix (Observability).

---

### Task 1: Infrastructure & Secret Management

**Goal:** Resolve API key blockers and enable server-side Firebase Admin operations.

**Files:**
- Modify: `my-app/.env.local`
- Create: `my-app/service-account.json` (placeholder for user to fill)

**Step 1: Verify and Update Gemini API Key**
Ensure `GOOGLE_AI_API_KEY` in `.env.local` is a valid Gemini key, not a Maps key.

**Step 2: Initialize Firebase Admin JSON**
Create a placeholder `service-account.json` and point `FIREBASE_ADMIN_KEY_PATH` to it.

**Step 3: Commit**
```bash
git add my-app/.env.local
git commit -m "infra: setup environment variables and service account placeholders"
```

---

### Task 2: Data Seeding (The 1,000+ Units)

**Goal:** Populate the Firestore database with initial property data to enable the Matching engine.

**Files:**
- Run: `my-app/scripts/seed-inventory.mjs`

**Step 1: Check script requirements**
Ensure `papaparse` and `axios` are available (already in package.json).

**Step 2: Execute Seeding**
Run: `node my-app/scripts/seed-inventory.mjs`
Expected: "Successfully seeded 1250 units to Firestore."

**Step 3: Verify in Firestore**
Use `firebase-mcp-server` to list documents in `units` collection.

---

### Task 3: UI Polish — Theme & RTL

**Goal:** Ensure a premium user experience with persistent settings and seamless Arabic support.

**Files:**
- Modify: `my-app/app/components/Navbar.tsx` (Theme Toggle)
- Modify: `my-app/lib/I18nContext.tsx` (RTL Logic)

**Step 1: Implement Theme Persistence**
Update the toggle to use `next-themes` properly with `mounted` check to avoid hydration mismatch.

**Step 2: Auto-RTL Detection**
Implement logic to switch `dir="rtl"` on the `html` tag based on the active language in `I18nContext`.

**Step 3: Commit**
```bash
git add my-app/app/components/Navbar.tsx my-app/lib/I18nContext.tsx
git commit -m "ui: implement theme persistence and auto-rtl detection"
```

---

### Task 4: AI Persona Tuning (Leila)

**Goal:** Refine the AI Concierge (Leila) to use the "Quiet Luxury" Levant persona.

**Files:**
- Modify: `my-app/lib/agents/matchmaker.ts`
- Modify: `my-app/lib/prompts.ts`

**Step 1: Update System Prompt**
Incorporate the Levant warmth and investment precision into the `Leila` system instruction.

**Step 2: Test Matching Logic**
Run a mock profile through the Matchmaker and verify the "Persona Tone."

---

### Task 5: Final E2E Pipeline Verification

**Goal:** Verify the full 10-stage flow from raw data to proposal.

**Files:**
- Run: `npm run test:pipeline` (or manual test via `/admin`)

**Step 1: Send Mock Message**
Simulate a Telegram message intake to trigger S1.

**Step 2: Track Progress**
Monitor the Orchestrator as it moves the document to S2 (Parsing) and S3 (Branding).

**Step 3: Generate S8 Proposal**
Verify the Concierge Selection Page (S8) generates a valid high-fidelity link.
