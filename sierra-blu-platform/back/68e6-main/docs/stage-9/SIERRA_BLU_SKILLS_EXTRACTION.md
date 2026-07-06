# Sierra Blu Realty V12.0 — Extracted Skills from awesome-claude-skills

## Overview
This document maps pre-built skills from `awesome-claude-skills` repository to Sierra Blu's Stage 8-10 pipeline (Concierge Selection → Closer).

---

## 🎯 High-Impact Skills for Stage 8-10

### **Stage 8: Concierge Selection (Portfolio Gallery)**
*Current state: ConciergeLeilaGallery.tsx + PortfolioEngine.ts → WhatsApp deep links*

#### 1. **MCP Builder** ⭐⭐⭐⭐⭐
**Relevance**: Critical for Stage 9-10 agent infrastructure  
**Use Case**: Build custom MCP servers for:
- Real estate transaction orchestration
- WhatsApp/Messaging API integration
- Document signing (esignature MCP)
- Payment processing (Stripe/QuickBooks MCP)

**From awesome-claude-skills**: `/mcp-builder/SKILL.md`
- Complete guide for building Python (FastMCP) or Node/TypeScript MCP servers
- Evaluation-driven development patterns
- Error handling for agent workflows
- Perfect for integrating Closer agent with external systems

**Action**: Create `mcp-servers/` folder in Sierra Blu to house:
```
mcp-servers/
├── sierra-deals.mcp.ts       # Deal orchestration
├── whatsapp-messaging.mcp.ts # Lead communication
├── docusign-signing.mcp.ts   # Contract execution
└── stripe-payments.mcp.ts    # Transaction processing
```

---

### **Stage 9: Closing Logic (Deal Orchestration)**

#### 2. **Document Skills** ⭐⭐⭐⭐
**Relevance**: Generate, sign, and manage proposal/contract documents  
**Use Case**:
- Auto-generate purchase agreements from lead + property data
- Merge proposal documents
- Extract signatures from Docusign
- Archive finalized contracts

**From awesome-claude-skills**: `/document-skills/`
- Subdirectories: `docx/`, `pdf/`, `pptx/`, `xlsx/`
- Handles DOCX creation/editing, PDF manipulation, form filling
- Perfect for generating Leila-signed proposal PDFs

**Action**: Use for Stage 9:
```typescript
// In CloserAgent.ts
const proposal = await generateProposalDocx({
  lead: leadData,
  property: propertyData,
  timeline: viewingDate,
  signature: "Leila Al-Masri, Lead Concierge"
});
// → proposal-LeadName-PropertyName.docx
```

---

#### 3. **Theme Factory** ⭐⭐⭐⭐
**Relevance**: Apply consistent Quiet Luxury branding to proposals  
**Use Case**:
- Style proposal PDFs with Sierra Blu's Midnight Navy + Gold palette
- Ensure consistent visual identity across documents
- Generate theme-compliant approval notifications

**From awesome-claude-skills**: `/theme-factory/SKILL.md`
- 10 pre-built themes OR generate custom theme
- Perfect for Quiet Luxury aesthetic consistency

**Action**: Create Sierra Blu custom theme:
```json
{
  "name": "Sierra Blu Quiet Luxury",
  "colors": {
    "primary": "#0A1628",      // Midnight Navy
    "accent": "#C9A84C",        // Gold
    "background": "#F5F3F0",    // Off-white
    "text": "#2C2C2A"            // Charcoal
  },
  "fonts": {
    "header": "Cormorant Garamond",
    "body": "Jost"
  }
}
```

---

### **Stage 8-9: Content & Communication**

#### 4. **Internal Comms** ⭐⭐⭐
**Relevance**: Leila's personalized messaging to leads  
**Use Case**:
- Template WhatsApp/email messages
- Viewing request confirmations
- Deal milestone announcements
- Thank you notes post-signing

**From awesome-claude-skills**: `/internal-comms/SKILL.md`
- 3P updates (Progress/Plans/Problems)
- FAQs for common lead questions
- General communication templates

**Adaptation for Sierra Blu**:
```
stage-8-messages.md
├── viewing-confirmation: "Leila here! I've reserved [property] for you on [date]..."
├── offer-proposal: "Your curated portfolio is ready. Here's why I think these 3..."
└── milestone-update: "Wonderful news! [Property] owner has received your offer..."

stage-9-messages.md
├── offer-accepted: "Congratulations! Your offer for [Property] has been accepted!"
├── next-steps: "Now, let's prepare the agreements. Here's our timeline..."
└── closing-reminder: "Final signatures due by [date]. All documents ready at [link]..."
```

---

#### 5. **Artifacts Builder** ⭐⭐⭐
**Relevance**: Generate visual proposal artifacts for WhatsApp  
**Use Case**:
- Create interactive property showcase cards
- Generate visual offer summaries
- Build interactive timeline for closing process
- Embed in WhatsApp messages

**From awesome-claude-skills**: `/artifacts-builder/`
- React/HTML component patterns
- PDF export capabilities
- Responsive design for mobile (crucial for WhatsApp on phones)

---

### **Stage 9-10: Transactions & Integration**

#### 6. **Invoice Organizer** ⭐⭐
**Relevance**: Organize deal documents + tax reporting  
**Use Case**:
- Extract commission amounts from deals
- Organize closing documents by date/property
- Generate tax summary for each closing
- Archive finalized deal files

**From awesome-claude-skills**: `/invoice-organizer/SKILL.md`
- File naming convention: `YYYY-MM-DD Vendor - Invoice - Description`
- Adapt for deals: `YYYY-MM-DD [BuyerName] - Deal - [PropertyName].pdf`
- CSV export for deal summaries

---

#### 7. **Composio Skills** (Selective) ⭐⭐⭐
**Relevance**: Integrate third-party services for transactions  
**Key integrations** from `/composio-skills/`:
- **Docusign** (esignatures-io-automation) → Contract signing
- **Stripe/QuickBooks** → Payment processing & accounting
- **Slack** → Internal notifications for closed deals
- **Zapier** → Automate downstream workflows

**Action**: Create composio adapters:
```typescript
// closing/integrations/docusign.adapter.ts
export async function sendForSignature(proposalId, leadEmail) {
  return composio.call('docusign', 'send_for_signature', {
    document: `proposals/${proposalId}.pdf`,
    recipients: [{ email: leadEmail, role: 'signer' }],
    callback: 'https://sierra-blu.com/webhook/docusign'
  });
}
```

---

## 📋 Stage-by-Stage Implementation Plan

### **Stage 8 (Concierge Selection)**
✅ **Already Built**: ConciergeLeilaGallery.tsx, PortfolioEngine.ts
- **Add**: Artifacts Builder for WhatsApp-ready proposal previews
- **Add**: Internal Comms templates for viewing confirmations

### **Stage 9 (Closer Agent)**
🔨 **To Build**:
1. **MCP servers**:
   - `sierra-deals.mcp.ts` — Deal state orchestration
   - `whatsapp-messaging.mcp.ts` — Lead communication
   - Composio adapters for Docusign + Stripe

2. **Document generation**:
   - Use Document Skills (DOCX) to create proposals from templates
   - Apply Theme Factory (Quiet Luxury) to PDFs
   - Archive to `/deals/{dealId}/documents/`

3. **Messaging**:
   - Use Internal Comms templates for WhatsApp messages
   - Leila-signed messages at each milestone
   - Deep links to Docusign signing

### **Stage 10 (Post-Closing)**
🔨 **To Build**:
1. **Transaction recording**:
   - Extract signing data from Docusign webhook
   - Process payment via Stripe
   - Record deal in Firebase (Stage 10 completion)

2. **Document archival**:
   - Use Invoice Organizer logic to file closing docs
   - Generate CSV summary of closed deals
   - Create deal retrospective for Leila's learning

3. **Notifications**:
   - Internal Comms for team celebrations
   - Thank you artifacts for clients
   - Referral request template

---

## 🛠️ File Structure Template

Create this in Sierra Blu:

```
sierra-blu-realty/
├── agents/
│   ├── stage-8-matchmaker/     (existing)
│   │   └── ConciergeLeilaGallery.tsx
│   ├── stage-9-closer/         (new)
│   │   ├── CloserAgent.ts
│   │   ├── deal-orchestration.ts
│   │   └── messaging/
│   │       └── templates.ts
│   └── stage-10-post-closing/  (new)
│       └── PostClosingAgent.ts
│
├── mcp-servers/                (new)
│   ├── sierra-deals.mcp.ts
│   ├── whatsapp-messaging.mcp.ts
│   ├── docusign-signing.mcp.ts
│   └── stripe-payments.mcp.ts
│
├── documents/                  (new)
│   ├── templates/
│   │   ├── proposal-template.docx
│   │   ├── offer-letter.docx
│   │   └── closing-checklist.docx
│   ├── themes/
│   │   └── sierra-blu-quiet-luxury.json
│   └── archives/
│       └── deals/ (organized by date + property)
│
├── composio/                   (new - if using)
│   ├── docusign.adapter.ts
│   ├── stripe.adapter.ts
│   └── slack.adapter.ts
│
└── messages/                   (new)
    ├── stage-8-viewing.md
    ├── stage-9-offer.md
    └── stage-10-closing.md
```

---

## 📊 Extracted Skills Summary

| Skill | Relevance | Stage(s) | Status |
|-------|-----------|----------|--------|
| **MCP Builder** | Build Closer agent infrastructure | 9-10 | 🟢 Ready |
| **Document Skills** | Generate proposals, merge, sign | 9-10 | 🟢 Ready |
| **Theme Factory** | Apply Quiet Luxury styling | 8-10 | 🟢 Ready |
| **Internal Comms** | WhatsApp message templates | 8-10 | 🟡 Adapt needed |
| **Artifacts Builder** | Interactive proposal previews | 8-9 | 🟡 Adapt needed |
| **Invoice Organizer** | Deal filing + archival | 9-10 | 🟡 Adapt needed |
| **Composio Skills** | Docusign, Stripe, Slack | 9-10 | 🟡 Selective use |

---

## 🚀 Next Steps

1. **Create `/mcp-servers/` folder** with sierra-deals and messaging MCPs
2. **Build Stage 9 Closer agent** using MCP + Document Skills
3. **Generate proposal templates** (DOCX format) with Quiet Luxury theme
4. **Create message templates** adapted from Internal Comms
5. **Build Docusign + Stripe MCPs** for signing & payment
6. **Set up deal archival** using Invoice Organizer logic
7. **Test Stage 8 → 9 → 10 pipeline** end-to-end

---

**Ahmed's Next Session**: Stage 9 Deep Dive
- Build `CloserAgent.ts` with full deal orchestration
- Create MCP servers for external integrations
- Generate proposal templates & theme application
- Implement WhatsApp API integration with deep links
