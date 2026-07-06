# Stage 9: Closer Agent — Implementation Roadmap

**Current Status**: Stage 8 (Concierge Selection) ✅ complete  
**Next**: Build Stage 9 (Deal Closing Logic) using extracted skills  
**Duration Estimate**: 2-3 intensive sessions

---

## 🎯 Stage 9 Overview

| Phase | Owner | Output | Status |
|-------|-------|--------|--------|
| **9.0** | Closer Agent | Lead accepts viewing → Offers to purchase | 🔴 To build |
| **9.1** | Closer Agent | Generate proposal & terms | 🔴 To build |
| **9.2** | Docusign MCP | Send for e-signature | 🔴 To build |
| **9.3** | Closer Agent | Process signed docs → Stage 10 | 🔴 To build |

---

## 📦 What You'll Build

### **1. CloserAgent.ts** (Core orchestrator)
```typescript
// Location: /agents/stage-9-closer/CloserAgent.ts
// Responsibilities:
// - Receive viewing request from Stage 8
// - Generate proposal/offer letter
// - Manage document signing workflow
// - Handle lead responses
// - Trigger Stage 10 on closing
```

**Key Methods**:
```typescript
class CloserAgent {
  async generateProposal(lead, property, offerTerms)
  async sendForSignature(proposalId, leadEmail)
  async handleSigningCallback(signedDoc)
  async processClosingDocuments(dealId)
  async recordClosedDeal(dealSnapshot)
}
```

---

### **2. MCP Servers** (External integrations)

#### **sierra-deals.mcp.ts**
```typescript
// Location: /mcp-servers/sierra-deals.mcp.ts
// Purpose: Deal state management & orchestration
// Tools:
// - create_deal(lead, property, terms) → dealId
// - update_deal_status(dealId, status) → confirmation
// - get_deal_terms(dealId) → offer details
// - record_closing(dealId, signedDocs) → completion
```

#### **whatsapp-messaging.mcp.ts**
```typescript
// Location: /mcp-servers/whatsapp-messaging.mcp.ts
// Purpose: Lead communication via WhatsApp Business API
// Tools:
// - send_message(leadPhone, template, variables)
// - send_document(leadPhone, documentUrl)
// - request_verification(leadPhone, code)
```

#### **docusign-signing.mcp.ts** (via Composio)
```typescript
// Location: /mcp-servers/docusign-signing.mcp.ts
// Purpose: Contract signing orchestration
// Tools:
// - initiate_envelope(doc, recipients, callback)
// - get_signature_status(envelopeId)
// - download_signed_document(envelopeId)
```

#### **stripe-payments.mcp.ts** (via Composio)
```typescript
// Location: /mcp-servers/stripe-payments.mcp.ts
// Purpose: Process commission/deposits
// Tools:
// - create_payment_intent(amount, leadId)
// - process_transaction(intentId)
// - refund_payment(transactionId)
```

---

### **3. Document Templates** (DOCX format)

**Using Document Skills + Theme Factory**

#### `proposal-template.docx`
```
[Header: Sierra Blu logo + Midnight Navy]
[Leila's greeting]
[Property details: address, price, specs]
[Offer summary: amount, earnest money, terms]
[Timeline: inspection, appraisal, closing]
[Next steps: signing link, contact info]
[Footer: Sierra Blu branding + Leila's signature]
```

#### `offer-letter.docx`
```
[Formal offer to seller]
[Lead name, contact, earnest money amount]
[Terms & contingencies]
[Financing details]
[Timeline]
[Signatures: Lead + Leila]
```

#### `closing-checklist.docx`
```
[Pre-closing walkthrough items]
[Final walkthrough tasks]
[Document review checklist]
[Key dates & milestones]
[Contact directory]
```

---

### **4. Message Templates** (WhatsApp + Email)

#### `stage-9-messages.ts`
```typescript
export const messages = {
  offerAccepted: `
    🎉 Congratulations, {leadName}!
    
    Your offer for {propertyName} has been accepted!
    
    Next: Let's prepare the agreements.
    
    📋 Review your proposal: {proposalLink}
    🖊️ E-sign here: {docusignLink}
    
    Questions? Reply here or call me: +20 XXX XXX XXXX
    
    — Leila
  `,
  documentReady: `
    Documents are ready to review! 📄
    
    {propertyName}
    Purchase Agreement
    Earnest Money: {earnestMoneyAmount}
    Target Closing: {closingDate}
    
    Review & sign: {docusignLink}
    Expires: {expirationDate}
    
    Let's close this! ✨
    — Leila
  `,
  signingComplete: `
    ✨ Congratulations!
    
    Your documents are signed. Moving to closing... 🏠
    
    Next steps:
    ✓ Appraisal scheduled for {date}
    ✓ Final walkthrough: {date}
    ✓ Closing day: {date}
    
    I'm here for everything. Reach out anytime!
    — Leila
  `
};
```

---

## 🔧 Implementation Sequence

### **Session 1: Architecture & Foundation**

**Goal**: Set up structure, create MCP servers skeleton, define data models

**Tasks**:
- [ ] Create `/agents/stage-9-closer/` directory
- [ ] Create `/mcp-servers/` directory
- [ ] Define TypeScript types for:
  - `Deal` (lead + property + terms)
  - `Proposal` (generated document metadata)
  - `SigningEnvelope` (Docusign state)
- [ ] Create `CloserAgent.ts` skeleton with method stubs
- [ ] Scaffold all 4 MCP servers (sierra-deals, whatsapp, docusign, stripe)
- [ ] Set up MCP server registration in `agent.yaml`

**Deliverable**: Compiling CloserAgent + 4 MCP servers (no logic yet)

---

### **Session 2: Document Generation & Messaging**

**Goal**: Generate proposals from templates + send WhatsApp messages

**Tasks**:
- [ ] Create DOCX proposal templates (using Document Skills)
- [ ] Create Theme Factory Sierra Blu custom theme
- [ ] Build `proposal-generator.ts`:
  - Load template DOCX
  - Inject lead + property + terms data
  - Apply Quiet Luxury theme
  - Export PDF + save to Firebase Storage
- [ ] Build message template system (Leila's WhatsApp messages)
- [ ] Implement `sendWhatsAppMessage()` in whatsapp-messaging.mcp
- [ ] Test: Generate proposal → Send WhatsApp link to test lead

**Deliverable**: Functional proposal generation + messaging

---

### **Session 3: Signing Workflow (Docusign MCP)**

**Goal**: Integrate Docusign for e-signatures

**Tasks**:
- [ ] Set up Docusign Composio adapter (or direct API)
- [ ] Implement `docusign-signing.mcp.ts`:
  - `initiate_envelope()` → Docusign envelope creation
  - Webhook callback for signing completion
  - `download_signed_document()`
- [ ] Create Docusign webhook handler:
  - Listen for `recipient_completed` event
  - Verify signature authenticity
  - Store signed docs in Firebase
  - Trigger Stage 10 handoff
- [ ] Build signing status page (optional: Artifact for lead tracking)
- [ ] Test: Send proposal → Lead signs → Docs downloaded

**Deliverable**: End-to-end signing workflow

---

### **Session 4: Payment Processing (Stripe MCP)**

**Goal**: Process earnest money & commissions

**Tasks**:
- [ ] Set up Stripe Composio adapter
- [ ] Implement `stripe-payments.mcp.ts`:
  - `create_payment_intent()` for earnest money
  - `process_transaction()` 
  - Error handling (insufficient funds, etc.)
- [ ] Add payment link to proposal (WhatsApp message)
- [ ] Implement webhook handler for payment confirmation
- [ ] Record transaction in Firestore (deal.payments array)
- [ ] Test: Create deal → Generate payment link → Process payment

**Deliverable**: Working payment processing

---

### **Session 5: Deal Orchestration & Stage 10 Handoff**

**Goal**: Tie everything together + transition to Stage 10

**Tasks**:
- [ ] Implement full `CloserAgent` workflow:
  - S8 → S9: Receive viewing request
  - Generate proposal + send WhatsApp
  - Lead accepts → Generate offer letter
  - Send for signing + payment
  - Monitor signing + payment status
  - On completion → Record deal in Firebase
  - On completion → Trigger Stage 10
- [ ] Implement `sierra-deals.mcp.ts`:
  - `create_deal()` → Initialize deal record
  - `update_deal_status()` → Track progress
  - `record_closing()` → Final deal snapshot
- [ ] Create deal archival logic (using Invoice Organizer pattern):
  - File naming: `YYYY-MM-DD [BuyerName] - Deal - [PropertyName]`
  - CSV export: `deals-summary-{month}.csv`
  - Store in `/deals/{dealId}/documents/`
- [ ] Implement Stage 9 → Stage 10 transition
- [ ] Test full pipeline: S8 request → Proposal → Sign → Pay → S10 record

**Deliverable**: Fully functional Stage 9 Closer Agent

---

### **Session 6: Testing, Refinement & Handover**

**Goal**: Polish, test, prepare handover to Stage 10

**Tasks**:
- [ ] Error handling for all workflows:
  - Signature rejection
  - Payment failure
  - Lead communication issues
- [ ] Leila's personalization:
  - Customize messages per lead/property
  - Add contextual humor/warmth (Leila's voice)
  - Handle edge cases (international buyers, etc.)
- [ ] Create evaluation scenarios (like claude-code-best):
  - Scenario 1: Happy path (accept → sign → pay → close)
  - Scenario 2: Offer rejection (decline → provide alternatives)
  - Scenario 3: Signature timeout (resend, extend deadline)
  - Scenario 4: Payment declined (retry, offer alternatives)
- [ ] Performance optimization:
  - Cache proposal templates
  - Batch WhatsApp messages
  - Optimize Firestore reads
- [ ] Documentation:
  - STAGE_9_ARCHITECTURE.md
  - Closing checklist for sales team
  - Integration guide for Stripe + Docusign API keys
- [ ] Create handover to Stage 10:
  - STAGE_9_COMPLETION_CHECKLIST.md
  - All Stage 9 data in consistent format
  - PostClosingAgent skeleton ready

**Deliverable**: Production-ready Stage 9 + handover to Stage 10

---

## 📊 Skills Mapping to Tasks

| Session | Primary Skill | Secondary Skills | MCP Output |
|---------|---------------|------------------|-----------|
| 1 | — | — | Scaffolding |
| 2 | **Document Skills** + **Theme Factory** | Internal Comms, Artifacts Builder | proposal-generator |
| 3 | **Composio (Docusign)** | MCP Builder | docusign-signing.mcp |
| 4 | **Composio (Stripe)** | MCP Builder | stripe-payments.mcp |
| 5 | **MCP Builder** | Internal Comms, Document Skills | sierra-deals.mcp, CloserAgent |
| 6 | — | All skills | Full Stage 9 |

---

## 🔑 Key Files to Create

### **Architecture**
- `/agents/stage-9-closer/CloserAgent.ts`
- `/agents/stage-9-closer/deal-orchestration.ts`
- `/agents/stage-9-closer/messaging/templates.ts`

### **MCP Servers**
- `/mcp-servers/sierra-deals.mcp.ts`
- `/mcp-servers/whatsapp-messaging.mcp.ts`
- `/mcp-servers/docusign-signing.mcp.ts`
- `/mcp-servers/stripe-payments.mcp.ts`

### **Documents**
- `/documents/templates/proposal-template.docx`
- `/documents/templates/offer-letter.docx`
- `/documents/templates/closing-checklist.docx`
- `/documents/themes/sierra-blu-quiet-luxury.json`

### **Configuration**
- `/composio/docusign.config.ts`
- `/composio/stripe.config.ts`
- `agent.yaml` (update with S9 MCP entries)

### **Documentation**
- `STAGE_9_ARCHITECTURE.md`
- `STAGE_9_IMPLEMENTATION_GUIDE.md` (for future teammates)

---

## 🚀 Ready to Start?

**Before Session 1:**
1. ✅ Read: `SIERRA_BLU_SKILLS_EXTRACTION.md` (you have this)
2. ✅ Review: MCP Builder skill (`awesome-claude-skills/mcp-builder/`)
3. ✅ Review: Document Skills (`awesome-claude-skills/document-skills/`)
4. ⏳ Gather: Stripe API key, Docusign API key, WhatsApp Business API key

**Session 1 Kicks Off When:**
- You're ready to start building Stage 9
- All API keys are set up
- You've scanned the MCP Builder + Document Skills guides

**Signal Ready**: Let me know "S9 ready" and we'll start Session 1!

---

## 📝 Notes

- **Leila's voice is critical**: All messages should feel warm, knowledgeable, luxury-aligned
- **Performance matters**: Closing documents < 5s to generate
- **Error handling is stage-critical**: A failed signature can't block the deal
- **Mobile-first always**: All WhatsApp interactions on phones, design accordingly
- **Audit trail essential**: Every action logged to Firestore for compliance

---

**Next Step**: Copy this roadmap + skills extraction to your local project. Whenever you're ready to start Stage 9, let me know! 🚀
