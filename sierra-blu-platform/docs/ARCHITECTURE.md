# 🏛️ Sierra Blu Intelligence OS: Architecture & Design Standards

## ⚜️ Design Philosophy: "Quiet Luxury"

The Sierra Blu Intelligence OS is built on the principle of **Quiet Luxury**. This means visual excellence without unnecessary noise. Every interaction must feel premium, cinematic, and deliberate.

### 🎨 Visual Standards

- **Palette**: Deep Navy (`#050B14`), Antique Gold, and translucent Glassmorphism.
- **Typography**: Modern, wide-tracking headers (Inter/Roboto) and high-legibility body text.
- **Motion**: Smooth, eased transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) for all state changes.
- **Glassmorphism**: Subtle backgrounds with high blur (`20px+`) and low opacity (`0.1 - 0.2`).

---

## 🏗️ Technical Architecture

### 1. Unified Intelligence Core (`lib/`)

- **`AuthContext.tsx`**: Centralized Firebase Identity Management for **Investment Stakeholders**.
- **`WealthService.ts`**: Aggregated logic for Portfolio Valuations and ROI analysis.
- **`I18nContext.tsx`**: Dynamic localization (AR/EN) with RTL support.

### 2. Frontend Components (`components/`)

- **`UI/`**: Atomic, reusable elements (Glass buttons, premium skeletons, cinematic heroes).
- **`Admin/`**: The Command Center for board-level orchestration (CRM, Portfolio Assets).
- **`Operations/`**: Neural pipeline interfaces (Integration Hub, Market Intelligence).

### 3. Agentic Backend (`skills/`)

- **Expert Playbooks**: A repository of 1,453+ specialized skills that agents use to automate complex deal flows.
- **Trigger Protocol**: Agents activate specific skills based on task context (e.g., `stripe-integration` for payments).

### 4. Routing Strategy (`app/`)

- **App Router**: Optimized for Server Components and edge delivery.
- **Public**: Cinematic landing experiences (`/landing`, `/meridian`).
- **Private**: Secure admin and concierge portals (`/admin`, `/concierge`).

---

## 🚀 Deployment Strategy

- **Platform**: Vercel (Edge Functions + Global CDN).
- **Data**: Firebase (Real-time Firestore + Secure Storage).
- **Automation**: CI/CD integration with the **Strategic Pipeline**.

---

## 📜 Coding Mandates

- **Terminology**: Always use "Investment Stakeholders" (not leads), "Strategic Pipeline" (not CRM), and "Portfolio Assets" (not listings).
- **No Inline Styles**: All styling must reside in CSS Modules or the global Design System.
- **Accessibility**: Every image must have descriptive `alt` text; every interaction must be keyboard accessible.

---

### 🖋️ Authorization

*Signed by the Sierra Blu Engineering Board*
