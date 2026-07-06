# Backend Finalization: Intelligence Orchestrator Implementation Plan

To finish the backend "priorities" as requested, I will implement the **Sierra Blu Intelligence Orchestrator**. This acts as the "Central Nervous System" of the platform, ensuring that every piece of incoming data is instantly processed by all specialized AI brains.

## Proposed Changes

### 1. New Service: Intelligence Orchestrator
I will create `lib/services/orchestrator.ts` with a `processNewUnit` master function.
- **Workflow**:
    1. **Financial Blast**: Runs `FinancialEngine.computeFullMetrics`.
    2. **Legal Filter**: Runs `LegalBrain.assessLegalRisk`.
    3. **Neural Matching**: Runs `MatchingEngine.matchUnitsToLeads`.
    4. **Sales Trigger**: If match > 90%, automatically prepares a draft `Proposal`.

### 2. Telegram Command OS (Finishing the Bot)
I will implement `lib/services/telegram-controller.ts` to handle:
- `/score [listing_id]`: Instantly returns the Investment + Legal score.
- `/matches [listing_id]`: Lists top interested stakeholders.
- `/approve [proposal_id]`: Deploys a proposal to a stakeholder.

### 3. Data Integrity & Sync
I will finalize the **Sync Gateway** to ensure that data from Property Finder and WhatsApp scrapers are automatically funneled through the orchestrator.

## Open Questions

1. **Automation Level**: Should the orchestrator **automatically** send the Telegram notification to you, or should it wait for a manual trigger in the CRM?
2. **Legal Brain**: Should we add an "Evidence" field to the Legal Brain where you can upload the PDF of the contract for AI validation?

## Next Steps
1. Create the Orchestrator.
2. Link the WhatsApp Scraper output to the Orchestrator.
3. Implement the Telegram command set.
