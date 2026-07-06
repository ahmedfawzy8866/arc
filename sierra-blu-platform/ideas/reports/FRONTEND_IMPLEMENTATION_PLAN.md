# 🔳 Sierra Blu: Frontend Implementation Plan (V12.0)
> **Mandate**: Cinematic Luxury, Institutional Precision.  
> **Theme**: "Quiet Luxury" (Deep Navy, Gold, Soft Ivory).

---

## 🎨 1. THE DESIGN SYSTEM (Tailwind / CSS)

Add these tokens to your `globals.css` or Tailwind config.

```css
:root {
  --sb-navy: #0A1628;
  --sb-gold: #C9A84C;
  --sb-gold-muted: #A68A3D;
  --sb-ivory: #F4F0E8;
  --sb-ivory-dark: #E8E2D2;
  --sb-glass: rgba(10, 22, 40, 0.7);
  --sb-border: rgba(201, 168, 76, 0.2);
}

.sb-gradient-gold {
  background: linear-gradient(135deg, #C9A84C 0%, #A68A3D 100%);
}

.sb-glass-card {
  background: var(--sb-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--sb-border);
  border-radius: 12px;
}
```

---

## 🏗️ 2. CORE COMPONENTS

### A. The Stage Tracker (`PipelineStatus.tsx`)
Visualizes the 10-stage orchestration status.
- **Visual**: A horizontal line with 10 dots.
- **Colors**: Navy dot (Pending), Gold dot (Active/Completed), Pulsing Gold (Processing).
- **Interaction**: Tooltip explaining each stage (e.g., S2: Normalization).

### B. The Strategic Unit Card (`UnitCard.tsx`)
- **Large Image**: High-res parallax if possible.
- **Overlays**:
    - Top-Left: Compound (e.g., "Mivida")
    - Top-Right: SBR Code (e.g., "MVD-3F-75K+G")
    - Bottom: ROI Highlight (e.g., "94% 3Y ROI") in Gold.
- **Border**: None. Minimal padding.

### C. The Leila Concierge Chat (`LeilaChat.tsx`)
- **Persona**: Warm, Levant-style Arabic/English.
- **UI**: Floating bubble or dedicated sidebar.
- **Logic**: S8 specific. Shows "Match Scores" for properties.

---

## 🗺️ 3. PAGE STRUCTURES

### 1. `/` (Cinematic Hero)
- Full-screen parallax video or image of New Cairo villas.
- Headline: "Sierra Blu: The Neural Core of Real Estate."
- Search bar: Minimalist, centered.

### 2. `/inventory` (The Grid)
- Infinite scroll of `UnitCard.tsx`.
- Filters: "Compound", "ROI > 80%", "Finishing Grade".

### 3. `/proposals/[id]` (The Wealth View)
- Header: Client Name + Portfolio Analysis.
- Body: 3-5 curated units.
- **Valuation Module**: Show the `marketDifference` (e.g., "Underpriced by 8.4%") in a clean chart.
- Call to Action: "Request Viewing" (Triggers S9 in backend).

### 4. `/admin` (The Control Tower)
- Real-time stream of incoming leads (S1).
- Single-click "Approve S7.5" to move to S8.

---

## 🚀 4. INSTRUCTIONS FOR CLAUDE/CURSOR
Copy/Paste this prompt to start building:

> "Build the Sierra Blu 'Quiet Luxury' frontend. Use Next.js 16 and Framer Motion. 
> Theme: Deep Navy (#0A1628), Gold (#C9A84C), Soft Ivory (#F4F0E8).
> Focus on a Cinematic Landing page with mouse-parallax and an Inventory Grid that feels like a luxury editorial magazine.
> Implement the Stage Tracker (S1-S10) to show backend progress. 
> Ensure all Typography uses 'Playfair Display' for headlines and 'Inter' for technical data."
