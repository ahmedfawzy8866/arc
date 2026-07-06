# Sierra Blu Admin Nexus — Refinement Plan

> Comprehensive audit and implementation roadmap for the admin dashboard at `/admin/*`
> Audited: 2026-05-15

---

## Table of Contents

1. [Architecture Decision: Unify the Two Admin Systems](#1-architecture-decision)
2. [Page-by-Page Audit & Refinement Spec](#2-page-by-page-spec)
3. [Missing Pages to Build](#3-missing-pages)
4. [Orphaned Components to Wire Up](#4-orphaned-components)
5. [Backend / API Fixes](#5-backend-fixes)
6. [Cross-Cutting UI Refinements](#6-cross-cutting-ui)
7. [Security Hardening](#7-security)
8. [Priority Roadmap](#8-priority-roadmap)

---

## 1. Architecture Decision: Unify the Two Admin Systems {#1-architecture-decision}

**Problem:** Two parallel admin systems coexist and conflict:

| System | Entry Point | Shell | Screens |
|---|---|---|---|
| **Old SPA** | `/admin` (root) | `AdminPortal.tsx` with its own Sidebar + Topbar | Dashboard, TeamCRM, PortfolioAssets, IntegrationHub, MarketIntelligence, DatabaseExplorer |
| **New App Router** | `/admin/dashboard`, `/admin/units`, `/admin/deals`, `/admin/sync` | `app/admin/layout.tsx` with its own Sidebar + Topbar | Dashboard, Units, Deals, Sync Center |

The `/admin` root page loads `AdminPortal` inside the new layout — creating a **double sidebar/topbar** situation. The old SPA has richer components (PortfolioAssets with full CRUD, CRMKanban with drag support, DatabaseExplorer) but the new route-based pages have cleaner architecture.

**Decision: Migrate everything to the new App Router system.** Port the best components from the old SPA into new route pages, then delete `AdminPortal` and its screen-switching logic.

### Migration Map

| Old SPA Screen | Best Component | New Route |
|---|---|---|
| Dashboard | Keep new `app/admin/dashboard/page.tsx` but enhance with KPIGrid metrics | `/admin/dashboard` |
| PortfolioAssets | Port `PortfolioAssets.tsx` (full CRUD + PropertyForm + PropertyDrawer + PasteUnit) | `/admin/units` (replace current) |
| TeamCRM | Port `TeamCRM.tsx` + `AddAdvisorModal.tsx` (fix auth gap) | `/admin/team` (new) |
| CRM / Deals | Port `CRMKanban.tsx` (most complete CRM component) | `/admin/deals` (replace current) |
| Sync Center | Keep new `app/admin/sync/page.tsx` + add `DedupeReviewQueue` | `/admin/sync` |
| DatabaseExplorer | Port `DatabaseExplorer.tsx` | `/admin/database` (new) |
| MediaHub | Port `MediaHub.tsx` | `/admin/media` (new) |
| MarketIntelligence | Port `ReportsScreen.tsx` | `/admin/reports` (new) |
| — | New build | `/admin/settings` (new) |

**After migration:** Delete `AdminPortal.tsx`, `AdminDashboard.tsx` (old), and the `/admin/page.tsx` root that loads it. The root `/admin` should redirect to `/admin/dashboard`.

---

## 2. Page-by-Page Audit & Refinement Spec {#2-page-by-page-spec}

### 2.1 `/admin/login` — Login Page

**Current state:** Functional Firebase email/password login.

**Issues found:**
- Raw Firebase error codes shown to users (e.g., `auth/user-not-found: There is no user record...`)
- No "Forgot password" flow
- Hardcoded placeholder email `admin@sierrablurealty.com` leaks expected admin domain
- No rate-limiting feedback

**Refinements needed:**
- [ ] Map Firebase error codes to friendly messages ("Invalid email or password", "Too many attempts, try again later")
- [ ] Add "Forgot password?" link → Firebase `sendPasswordResetEmail()` flow
- [ ] Remove hardcoded email placeholder or use a generic one
- [ ] Add subtle loading skeleton on the auth check before showing the form

---

### 2.2 `/admin/dashboard` — Intelligence Dashboard

**Current state:** 4 KPI cards + recent deals table, all from Firestore.

**Issues found:**
- Badge coloring bug: uses `deal.status` but color map is keyed by stage names — badges always fall to gray default
- "Recent Activity" KPI is always 0–8 (capped by `limit(8)`) — meaningless metric
- No error state UI — Firestore failures show nothing
- No refresh mechanism
- Deal rows not clickable (no detail view exists)

**What it SHOULD do:**
- [ ] **Fix badge bug:** Use `deal.stage` instead of `deal.status` for color lookup
- [ ] **Replace "Recent Activity" KPI** with a meaningful metric: "This Week's Deals" (count deals created in last 7 days) or "Conversion Rate" (deals closed / total leads)
- [ ] **Add error state** with retry button
- [ ] **Add auto-refresh** every 60 seconds + manual refresh button
- [ ] **Enhanced KPIs** (port best metrics from old KPIGrid):
  - Total Units → add available/reserved/sold breakdown
  - Active Deals → add pipeline value (sum of offer prices)
  - Add: Hot Leads count, PF Credits remaining, Monthly revenue
- [ ] **Quick actions row:** "Add Unit", "New Lead", "Sync PF", "View Reports"
- [ ] **Recent activity feed** (port `ActivityList.tsx` — live Firestore stream with contextual icons)
- [ ] **AI Insights panel** (port `AIPanel.tsx` — Gemini-powered business intelligence)
- [ ] **System health indicators:** PF API status, WhatsApp node status (port `ConnectionSentinel.tsx`), last sync timestamp
- [ ] Make deal rows clickable → navigate to deal detail (once built)

---

### 2.3 `/admin/units` — Units/Inventory Management

**Current state:** Paginated table with search, status filter, PF publish button.

**Issues found:**
- "Add Unit" links to `/admin/units/new` — **page does not exist** (404)
- Row clicks go to `/admin/units/[id]` — **page does not exist** (404)
- Uses `window.location.href` instead of `router.push()` (full page reload)
- Search is client-side on loaded 50-unit subset only
- `alert()` for errors instead of toast notifications
- No error state UI

**What it SHOULD do:**
- [ ] **Replace with `PortfolioAssets.tsx`** (or port its features): full CRUD, PropertyForm modal, PropertyDrawer slide-in, PasteUnit quick-add
- [ ] **Build `/admin/units/new` page** — or use PropertyForm as a modal (already built)
- [ ] **Build `/admin/units/[id]` page** — or use PropertyDrawer as a slide-in (already built)
- [ ] **Stats row at top:** Total / Available / Reserved / Sold / Published on PF
- [ ] **Bulk actions:** Select multiple → bulk publish to PF, bulk status change
- [ ] **Image thumbnails** in the table (hero image per unit)
- [ ] **PF sync status per unit:** Show last sync date, published URL, any sync errors
- [ ] **Export to CSV/Excel**
- [ ] Replace `alert()` with `react-hot-toast` notifications
- [ ] Use `router.push()` for all navigation
- [ ] Add proper error states with retry

---

### 2.4 `/admin/deals` — Deal Pipeline

**Current state:** Read-only Kanban board (5 columns) + list view, from `leads` collection.

**Issues found:**
- **Collection naming confusion:** Page is "deals" but queries `leads` collection. Dashboard queries `deals` collection. These are different data stores.
- Kanban cards cannot be dragged, clicked, or stage-updated
- Hard cap at 200 leads with no pagination
- A lead could appear in multiple columns (stage vs phase field overlap)
- No way to create, edit, or advance leads/deals
- No error state

**What it SHOULD do:**
- [ ] **Replace with `CRMKanban.tsx`** — the most complete CRM component in the codebase. It has:
  - Drag-and-drop stage advancement
  - Add prospect modal (9 fields)
  - PF lead sync button
  - AI neural matching
  - Proposal generation
  - Role-based filtering (agent sees only their leads)
  - Audit logging
- [ ] **Resolve data model:** Decide whether "deals" and "leads" are the same collection or different stages. Recommendation: single `leads` collection with a `stage` field that progresses through the pipeline.
- [ ] **Add lead detail view** — click a card to see full profile:
  - Contact info (name, phone, email, WhatsApp)
  - Source and channel (PF, WhatsApp, Website, Referral)
  - PF reference number and link
  - Activity timeline (calls, messages, viewings, proposals)
  - Matched units with AI match scores
  - Viewing history and upcoming viewings
  - Deal value and commission calculation
  - Notes and internal comments
- [ ] **Lead quick actions:** Call, WhatsApp, Email, Schedule Viewing, Generate Proposal, Assign Agent
- [ ] **Pipeline analytics** at top: leads per stage, avg time in each stage, conversion funnel, revenue pipeline value
- [ ] **PF lead auto-assignment** rules
- [ ] **Remove 200-lead cap** — paginate per column or use virtual scroll

---

### 2.5 `/admin/sync` — Sync Center

**Current state:** Manual sync triggers, PF credit check, webhook URL display, activity log.

**Issues found:**
- Activity log filters for `type === 'sync_completed'` — may not match actual activity types
- Success output shows raw JSON truncated at 120 chars
- Credit balance shows raw JSON in `<pre>` block
- `checkCredits` call has no auth header
- No auto-refresh after triggering a sync
- Hardcoded webhook event types

**What it SHOULD do:**
- [ ] **Fix activity type filter** — query all sync-related types or remove the type filter
- [ ] **Format sync results** with proper cards: X listings synced, Y leads imported, Z errors
- [ ] **Format credit balance** with labeled fields: available credits, used, expiry date
- [ ] **Add auth header** to credit balance check
- [ ] **Add `DedupeReviewQueue.tsx`** — already built, just needs to be wired in. Shows side-by-side PF vs Firestore comparison for merge conflicts
- [ ] **Auto-refresh** activity log after running a sync
- [ ] **Sync schedule display:** Show cron schedule (leads every 10 min, listings every 6 hours, maintenance daily)
- [ ] **Sync health dashboard:** Last successful sync per type, failure count, avg sync duration
- [ ] **Webhook management:** Register/unregister webhooks, view received events, retry failed deliveries

---

### 2.6 `/admin/layout.tsx` — Admin Shell

**Current state:** Sidebar + topbar with auth guard.

**Issues found:**
- **No admin role check** — any Firebase-authenticated user can access all admin pages. The auth guard only checks `onAuthStateChanged`, not whether the user has `role: 'admin'`.
- "Media" and "Settings" nav items link to pages that don't exist (404)
- Mobile bottom nav only shows first 5 items

**Refinements needed:**
- [ ] **Add admin role verification** in the layout auth guard — fetch user doc from Firestore, check `role === 'admin'`, redirect non-admins to a "Not Authorized" page or the public site
- [ ] **Update nav items** to match actual pages (add new routes, remove broken ones)
- [ ] **Add notification bell** in topbar with unread count (new leads, sync errors, system alerts)
- [ ] **Add user avatar/menu** in topbar with profile, preferences, sign out
- [ ] **Breadcrumbs** for nested pages (e.g., Units → Unit Detail)
- [ ] **Keyboard shortcuts** for power users (G+D = dashboard, G+U = units, G+L = leads)

---

## 3. Missing Pages to Build {#3-missing-pages}

### 3.1 `/admin/team` — Team Management (Priority: High)

Port `TeamCRM.tsx` + `AddAdvisorModal.tsx` with critical fixes.

**Features:**
- Agent/broker roster with role, status, contact info
- **Fix: Create Firebase Auth account** when adding a team member (not just a Firestore doc)
- Performance metrics per agent: leads assigned, deals closed, revenue generated, avg response time
- Role management: Admin, Manager, Agent — with corresponding permissions
- Activity log per team member
- Enable/disable agent accounts
- Commission tracking and payout history
- Lead assignment rules (round-robin, area-based, performance-based)

### 3.2 `/admin/media` — Media Hub (Priority: Medium)

Port `MediaHub.tsx` — already fully functional.

**Features:**
- Drag-and-drop image upload to Firebase Storage
- Gallery view with thumbnails
- Delete with confirmation (replace `confirm()` with proper modal)
- Associate images with units (tag by unit code or property)
- Image optimization on upload (resize, compress)
- Bulk upload support
- Usage tracking: which images are used in which listings

### 3.3 `/admin/reports` — Market Intelligence (Priority: Medium)

Port `ReportsScreen.tsx` — functional with live data.

**Features:**
- Conversion funnel: Leads → Engaged → Viewing → Negotiation → Closed (with percentages)
- Revenue dashboard: monthly, quarterly, yearly — with charts
- Top-performing agents/areas/compounds
- PF performance: published listings, views, inquiries, cost per lead
- Lead source analysis: PF vs WhatsApp vs Website vs Referral
- Average deal lifecycle (days per stage)
- **Add export:** PDF and Excel report generation
- **Add date range picker** for all metrics
- **Replace CSS bar chart** with Recharts (already a dependency)

### 3.4 `/admin/database` — Database Explorer (Priority: Low)

Port `DatabaseExplorer.tsx` — functional read-only tool.

**Features:**
- Browse any Firestore collection
- View document details in formatted JSON
- **Fix:** Remove non-functional "Commit Override" button, or implement document editing
- Add pagination (currently capped at 50 docs)
- Add collection stats (doc count, last updated)
- **Consider:** This is a developer/debug tool — gate behind a `role: 'superadmin'` check

### 3.5 `/admin/settings` — Settings (Priority: Medium)

New build — no existing component.

**Features:**
- **Company profile:** Business name, logo, contact info, social links
- **Integration settings:** PF API credentials status (connected/disconnected), WhatsApp node status, Telegram bot status, Google Sheets connection
- **Notification preferences:** Email alerts, Telegram alerts, in-app notifications — per event type
- **User management:** Change own password, update profile
- **System config:** Default currency, timezone, language (Arabic/English)
- **API keys management:** View/rotate webhook secrets
- **Audit log viewer:** Full activity history with filters

### 3.6 `/admin/leads/[id]` — Lead Detail Page (Priority: High)

New build — essential for CRM functionality.

**Features:**
- Full lead profile: name, phone, email, WhatsApp, PF reference
- Source tracking: where they came from, when, how
- AI profiling data: budget range, preferred areas, property preferences
- Matched units with scores (from matching API)
- Activity timeline: all interactions (calls, messages, viewings, proposals, notes)
- Viewing scheduler: book and track property viewings
- Proposal history: generated proposals with status
- Stage progression with timestamps
- Quick actions: Call, WhatsApp, Email, Assign, Generate Proposal, Schedule Viewing
- Deal value calculator: price, commission %, GCI

### 3.7 `/admin/units/[id]` — Unit Detail Page (Priority: High)

New build using `PropertyDrawer.tsx` as starting point.

**Features:**
- Full property details in tabbed layout (matches PropertyForm sections)
- Image gallery with lightbox
- PF listing status and link
- Edit in-place or open PropertyForm modal
- Viewing history for this unit
- Matched leads with AI scores
- Price history / changes
- Availability calendar
- Financial analysis: ROI, yield, price/sqm (port from `financial-engine`)

### 3.8 `/admin/notifications` — Notification Center (Priority: Low)

New build.

**Features:**
- Centralized feed of all system events: new leads, PF syncs, errors, deal updates
- Read/unread state
- Filter by type (leads, sync, system, deals)
- Click-through to relevant page
- Notification preferences (which events trigger alerts)

---

## 4. Orphaned Components to Wire Up {#4-orphaned-components}

| Component | Status | Action |
|---|---|---|
| `ConnectionSentinel.tsx` | Built, unused | Wire into Dashboard — shows WhatsApp node health |
| `DedupeReviewQueue.tsx` | Built, unused | Wire into `/admin/sync` as a tab or expandable section |
| `MediaHub.tsx` | Built, missing from AdminPortal switch | Create `/admin/media` page |
| `ClientsScreen.tsx` | Built, never mounted | Merge useful features into the CRM/Deals page (table view) |
| `LeadsFlow.tsx` | Built, appears unused | Evaluate if the workflow stepper + scripts are valuable; if so, integrate into lead detail page |
| `DashboardV4` components | Pure mockup, no data | **Delete** — design iteration that was abandoned. No data wiring, no value. |
| `AdvisorProfile.tsx` | 90% placeholder | Either wire real data or delete — currently misleading |

---

## 5. Backend / API Fixes {#5-backend-fixes}

### Critical (Fix Before Anything Else)

| Issue | Location | Fix |
|---|---|---|
| `/api/property-finder` has **zero auth** — exposes full PF API to the internet | `app/api/property-finder/route.ts` | Add auth guard (Firebase token verification) |
| `/api/admin/deploy` checks header presence but **not token validity** | `app/api/admin/deploy/route.ts` | Verify the Firebase ID token properly |
| `/api/seed/admin-setup` and `/api/seed/listings` are **still callable in production** | `app/api/seed/` | Delete these routes or gate behind `NODE_ENV === 'development'` |
| PF webhook signature verification **bypassed when secret is not set** | `app/api/webhooks/property-finder/route.ts` | Reject all requests when `PF_WEBHOOK_SECRET` is not configured |

### High Priority

| Issue | Location | Fix |
|---|---|---|
| `/api/leads` — no auth on lead creation (spam/abuse vector) | `app/api/leads/route.ts` | Add reCAPTCHA or rate limiting for public submissions; require auth for admin creation |
| `/api/listings` — no auth on public read of all inventory | `app/api/listings/route.ts` | Add auth for admin queries; create separate public endpoint with limited fields |
| `/api/matching` and `/api/proposals` — no auth | Multiple | Add auth guard |
| `/api/leads/request-viewing` writes to wrong collection | `app/api/leads/request-viewing/route.ts` | Change `'stakeholders'` to `COLLECTIONS.stakeholders` (which maps to `'leads'`) |
| Three duplicate WhatsApp webhook routes | `/api/ingest/whatsapp`, `/api/webhooks/whatsapp`, `/api/whatsapp/webhook` | Consolidate to one canonical route, redirect or delete others |
| `firebase-admin.ts` has `import 'server-only'` commented out | `lib/server/firebase-admin.ts` | Re-enable to prevent client-side bundling |

### Medium Priority

| Issue | Location | Fix |
|---|---|---|
| `@/agents/stage-9-closer/CloserAgent` import likely missing | `app/api/closer/initiate/route.ts` | Verify file exists or stub the import |
| `@/lib/propertyFinder-service` import likely missing | `app/api/properties/sync/route.ts` | Verify or consolidate with `PFIntegrationService` |
| `typescript.ignoreBuildErrors: true` | `next.config.ts` | Fix type errors and remove this flag |
| Telegram bot uses hardcoded collection names | `app/api/telegram/webhook/route.ts` | Use `COLLECTIONS` constants |

---

## 6. Cross-Cutting UI Refinements {#6-cross-cutting-ui}

### Error Handling
- [ ] Every page needs an error state component — not just console.error. Show a styled error card with retry button.
- [ ] Replace all `alert()` calls with `react-hot-toast` (already a dependency).
- [ ] Add global error boundary at the layout level.

### Loading States
- [ ] Deals page and sync activity log have no loading state — add skeleton loaders matching the dashboard pattern.
- [ ] Add shimmer/skeleton for all Firestore-loading sections.

### Empty States
- [ ] Design branded empty states for: no units, no leads, no sync activity, no team members.
- [ ] Include a CTA in each empty state ("Add your first unit", "Sync leads from Property Finder").

### Responsive Design
- [ ] Test all pages on mobile (375px), tablet (768px), desktop (1440px).
- [ ] The Kanban board needs horizontal scroll on mobile.
- [ ] Tables need card-view alternatives on mobile.
- [ ] PropertyForm needs single-column layout on mobile.

### Theme Consistency
- [ ] `PropertyDrawer.tsx` and `PasteUnit.tsx` use white backgrounds — convert to dark theme to match admin.
- [ ] Ensure all modals/drawers use the dark navy + gold brand palette.
- [ ] Standardize button styles: gold primary, outline secondary, red destructive.

### Performance
- [ ] Add virtual scrolling for large lists (leads, units) — consider `@tanstack/react-virtual`.
- [ ] Implement server-side search (Firestore queries) instead of client-side filtering.
- [ ] Add Firestore query indexes for common filter combinations.

### Accessibility
- [ ] Add keyboard navigation for the Kanban board.
- [ ] Ensure all interactive elements have proper `aria-label` attributes.
- [ ] Color contrast check: gold (#C9A84C) on dark backgrounds must meet WCAG AA (4.5:1 ratio).
- [ ] Focus indicators on all interactive elements.

### Internationalization
- [ ] Arabic RTL support for all admin pages (partially started with `useI18n` in some components).
- [ ] Ensure all user-facing strings go through the i18n system.
- [ ] Currency formatting: always show EGP with proper thousand separators.

---

## 7. Security Hardening {#7-security}

### Authentication & Authorization
- [ ] **Layout auth guard must check admin role** — not just Firebase auth status
- [ ] **Define role hierarchy:** SuperAdmin > Admin > Manager > Agent — each with specific page/action permissions
- [ ] **Server-side auth on ALL API routes** — currently 6+ routes have zero authentication
- [ ] **Session timeout** — auto-logout after 30 minutes of inactivity
- [ ] **Audit log** — track all admin actions (who did what, when)

### Data Security
- [ ] **Firestore Security Rules** — ensure admin role is verified server-side, not just client-side
- [ ] **Remove seed routes** from production
- [ ] **Rate limit** public-facing API routes (leads, viewing requests)
- [ ] **Input sanitization** on all form submissions
- [ ] **CSRF protection** on all mutation endpoints

---

## 8. Priority Roadmap {#8-priority-roadmap}

### Phase 0: Critical Fixes (1-2 days)
> Must-fix before any feature work.

1. **Add auth to unprotected API routes** (`/api/property-finder`, `/api/leads`, `/api/listings`, `/api/matching`, `/api/proposals`)
2. **Fix deploy auth** to verify token, not just check header presence
3. **Delete or gate seed routes** (`/api/seed/*`)
4. **Fix PF webhook secret bypass**
5. **Add admin role check** to `/admin/layout.tsx` auth guard
6. **Fix badge color bug** on dashboard (use `deal.stage` not `deal.status`)

### Phase 1: Unify Admin Architecture (3-5 days)
> Eliminate the dual admin system, establish the foundation.

1. Redirect `/admin` root to `/admin/dashboard`
2. Port `PortfolioAssets` + `PropertyForm` + `PropertyDrawer` + `PasteUnit` into `/admin/units`
3. Port `CRMKanban` into `/admin/deals`
4. Port `DedupeReviewQueue` into `/admin/sync`
5. Update nav items in layout to match real pages
6. Delete old `AdminPortal.tsx` and its `/admin/page.tsx` wrapper
7. Add error states, loading skeletons, and toast notifications across all pages

### Phase 2: Core CRM Features (5-7 days)
> Make the CRM actually usable for daily broker operations.

1. Build `/admin/leads/[id]` — lead detail page with full profile, timeline, matched units
2. Build `/admin/units/[id]` — unit detail page with gallery, financials, matched leads
3. Enhance dashboard: add activity feed, AI insights, system health, quick actions
4. Build `/admin/team` — team management with proper Firebase Auth account creation
5. Wire up `ConnectionSentinel` for WhatsApp health monitoring

### Phase 3: Intelligence & Reporting (3-5 days)
> Analytics and insights for informed decision-making.

1. Build `/admin/reports` — port `ReportsScreen` + add conversion funnel, revenue charts, agent performance
2. Add pipeline analytics to deals page header
3. Add date range picker and export (PDF/Excel) to reports
4. Enhance AI insights panel with actionable recommendations

### Phase 4: Polish & Secondary Features (3-5 days)
> Refinement, settings, and nice-to-haves.

1. Build `/admin/settings` — integrations status, notification preferences, company profile
2. Build `/admin/media` — port `MediaHub` with image-to-unit association
3. Build `/admin/database` — port `DatabaseExplorer` for debugging
4. Mobile responsiveness pass on all pages
5. Arabic RTL support
6. Keyboard shortcuts for power users

### Phase 5: Advanced Features (ongoing)
> Differentiation and automation.

1. Notification center with real-time push
2. Advanced lead assignment rules (round-robin, area-based, AI-recommended)
3. WhatsApp message templates and bulk messaging from admin
4. Automated follow-up scheduling
5. Commission calculator and payout management
6. PF listing performance analytics (views, inquiries, cost analysis)
7. AI-powered deal probability scoring
8. Mobile app or PWA for agents in the field

---

## Appendix A: Data Model Clarification Needed

The codebase uses inconsistent collection names for the same data:

| Concept | Collection used by... | Actual Firestore collection |
|---|---|---|
| Leads/Stakeholders | CRMKanban, deals page, LeadsFlow, ClientsScreen | `leads` |
| Deals | Dashboard page | `deals` |
| Units/Listings | Units page, PortfolioAssets | `listings` |
| Team/Partners | TeamScreen, KPIGrid | `partners` |
| Team/Users | TeamCRM, AdminDashboard, AddAdvisorModal | `users` (via COLLECTIONS) |
| Sales | KPIGrid, ReportsScreen | `sales` |

**Decisions needed:**
1. Are `leads` and `deals` the same thing? If leads progress to deals, should they share a collection with a `type` or `stage` field?
2. Are `partners` and `users` the same? Should team members be in one collection?
3. Is `sales` separate from `deals`? When a deal closes, does it create a `sales` doc?

**Recommendation:** Consolidate to: `leads` (all pipeline entries), `listings` (all inventory), `users` (all team members), `activities` (all events). Remove `deals`, `partners`, `sales` as separate collections — or define clear relationships between them.

---

## Appendix B: Component Inventory

### Keep & Port
- `CRMKanban.tsx` — best CRM component, port to `/admin/deals`
- `PortfolioAssets.tsx` + `PropertyForm.tsx` + `PropertyDrawer.tsx` + `PasteUnit.tsx` — best inventory CRUD, port to `/admin/units`
- `DedupeReviewQueue.tsx` — wire into `/admin/sync`
- `MediaHub.tsx` — wire into `/admin/media`
- `ReportsScreen.tsx` — port to `/admin/reports`
- `TeamCRM.tsx` + `AddAdvisorModal.tsx` — port to `/admin/team` (fix auth gap)
- `DatabaseExplorer.tsx` — port to `/admin/database`
- `KPIGrid.tsx` — port best metrics into `/admin/dashboard`
- `AIPanel.tsx` — port into `/admin/dashboard`
- `ActivityList.tsx` — port into `/admin/dashboard`
- `ConnectionSentinel.tsx` — wire into dashboard or layout topbar

### Delete
- `AdminPortal.tsx` — old SPA shell, replaced by App Router layout
- `AdminDashboard.tsx` — old dashboard, replaced by new dashboard page
- `DashboardV4/` — abandoned mockup with zero data wiring
- `DashboardScreen.tsx` — employee/advisor portal, not admin (keep but separate concern)
- `AdvisorProfile.tsx` — 90% hardcoded, not useful until real data is wired

### Evaluate
- `LeadsFlow.tsx` — workflow stepper may be useful in lead detail page
- `ClientsScreen.tsx` — table view may complement Kanban in the deals page (already has list view toggle)
