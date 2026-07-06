/**
 * SIERRA BLU — STAGE 7: SALES ENGINE
 * Orchestrates Strategic Proposals (Options Packages) and Automated Incentives.
 */

import { db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { COLLECTIONS, type Lead, type Proposal, type Unit, type Voucher } from '../models/schema';
import { getOpenClawGatewayConfig } from '@/lib/server/openclaw';

/**
 * Generate a Strategic Options Package (Proposal) for a lead.
 */
export async function generateOptionsPackage(leadId: string): Promise<string> {
  // 1. Fetch Lead
  const leadSnap = await getDoc(doc(db, COLLECTIONS.leads, leadId));
  if (!leadSnap.exists()) throw new Error('Lead not found');
  const lead = { id: leadSnap.id, ...leadSnap.data() } as Lead;

  if (!lead.aiProfiling?.topMatches || lead.aiProfiling.topMatches.length === 0) {
    throw new Error('No matches found for this lead. Run Stage 6 Matching first.');
  }

  // 2. Fetch Unit Details for the matches
  const unitsData: Proposal['units'] = [];
  for (const match of lead.aiProfiling.topMatches) {
    const unitSnap = await getDoc(doc(db, COLLECTIONS.units, match.unitId));
    if (unitSnap.exists()) {
      const unit = unitSnap.data() as Unit;
      unitsData.push({
        id: match.unitId,
        title: unit.title,
        price: unit.price,
        matchScore: match.matchScore,
        matchReason: match.matchReason,
      });
    }
  }

  // 3. AI Generation of Strategic Summary
  const summary = await generateAIPackageSummary(lead, unitsData);

  // 4. Create Proposal
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sierrablu.luxury';
  
  const proposalData: Partial<Proposal> = {
    leadId,
    leadName: lead.name,
    unitIds: unitsData.map(u => u.id),
    units: unitsData,
    strategicSummary: summary,
    status: 'draft',
    createdAt: serverTimestamp() as Timestamp,
    expiresAt: Timestamp.fromMillis(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 Days
  };

  const proposalRef = await addDoc(collection(db, COLLECTIONS.proposals), proposalData);
  
  // 4b. Update with public shareable URL
  const shareableUrl = `${siteUrl}/proposals/${proposalRef.id}`;
  await updateDoc(proposalRef, { shareableUrl });

  // 5. Automation Check: Trigger high-fidelity incentives
  const maxScore = Math.max(...unitsData.map(u => u.matchScore));
  if (maxScore >= 90) {
    await triggerIncentive(leadId, proposalRef.id);
  }

  return proposalRef.id;
}

/**
 * Uses Gemini/OpenClaw to write the strategic recommendation for the package.
 */
async function generateAIPackageSummary(lead: Lead, units: Proposal['units']): Promise<string> {
  const gateway = getOpenClawGatewayConfig();
  if (!gateway.configured) return "Strategic portfolio recommendation based on current market availability.";

  const systemPrompt = `You are the Sierra Blu Sales Strategic Advisor.
Task: Write a high-level executive summary for a property proposal.
Tone: Luxury, authoritative, clinical, yet inviting.
Instructions: Briefly justify why this specific set of assets (The Options Package) was curated for the stakeholder. 
Focus on investment velocity and portfolio alignment. Limit to 3-4 sentences.`;

  const promptContent = `Stakeholder: ${lead.name} (${lead.preferredPropertyType} in ${lead.preferredLocations?.join(', ')})
Matched Assets: ${units.map(u => `${u.title} (Match: ${u.matchScore}%)`).join('; ')}`;

  try {
    const response = await fetch(`${gateway.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gateway.token}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: promptContent }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content || "Analyzed portfolio recommendation.";
  } catch (err) {
    console.error("AI Summary generation failed:", err);
    return "Analyzed portfolio recommendation.";
  }
}

/**
 * Automates the creation of a 'Viewing Reward' voucher for high-match leads.
 */
async function triggerIncentive(leadId: string, proposalId: string) {
  const code = "SB-VIP-" + Math.random().toString(36).substring(2, 7).toUpperCase();
  
  const voucher: Partial<Voucher> = {
    code,
    type: 'viewing-reward',
    value: 5000,
    currency: 'EGP',
    leadId,
    status: 'active',
    createdAt: serverTimestamp() as Timestamp,
    expiresAt: Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    conditions: "Valid for site inspection bookings within 7 days of proposal deployment."
  };

  await addDoc(collection(db, COLLECTIONS.vouchers), voucher);

  // Log automation in lead
  await updateDoc(doc(db, COLLECTIONS.leads, leadId), {
    'automation.viewingRewardActive': true,
    'automation.lastIncentiveAt': serverTimestamp(),
  });
}
