/**
 * SIERRA BLU — STAGE 6: AI MATCHING ENGINE
 * Orchestrates cross-referencing Leads with Listings/Units
 * using high-fidelity NLP scoring.
 */

import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { COLLECTIONS, type Lead, type Unit } from '../models/schema';
import { getOpenClawGatewayConfig } from '@/lib/server/openclaw';

export interface MatchResult {
  unitId: string;
  matchScore: number;
  matchReason: string;
}

/**
 * Perform AI-driven matching for a specific lead.
 */
export async function runMatchingForLead(leadId: string): Promise<MatchResult[]> {
  // 1. Fetch the Lead
  const leadSnap = await getDoc(doc(db, COLLECTIONS.leads, leadId));
  if (!leadSnap.exists()) throw new Error('Lead not found');
  const lead = { id: leadSnap.id, ...leadSnap.data() } as Lead;

  // 2. Initial Filtered Search for potential units
  // We don't want to send 1000 listings to AI. We filter by basic criteria first.
  const unitsQuery = query(
    collection(db, COLLECTIONS.units),
    where('status', '==', 'available'),
    limit(20) // Heuristic limit for AI processing
  );
  
  const unitsSnap = await getDocs(unitsQuery);
  const candidateUnits = unitsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Unit));

  if (candidateUnits.length === 0) return [];

  // 3. AI Scoring Logic
  // We use the OpenClaw gateway to perform sophisticated comparison
  const matches = await scoreMatchesWithAI(lead, candidateUnits);

  // 4. Update Lead with new matches
  await updateDoc(doc(db, COLLECTIONS.leads, leadId), {
    'aiProfiling.topMatches': matches,
    'aiProfiling.lastMatchRunAt': serverTimestamp(),
  });

  return matches;
}

/**
 * Uses the OpenClaw / Gemini gateway to rank units against a lead's profile.
 */
async function scoreMatchesWithAI(lead: Lead, units: Unit[]): Promise<MatchResult[]> {
  const gateway = getOpenClawGatewayConfig();
  if (!gateway.configured) {
    console.warn('[MatchingEngine] No OpenClaw configuration. Using fallback scoring.');
    return fallbackScoring(lead, units);
  }

  const systemPrompt = `You are the Sierra Blu Strategic Intelligence Core (Neural Matching Unit).
Task: Rank high-value property assets against specific investment stakeholders based on strategic alignment.

Terminology Protocol:
- Property Listing -> Signature Asset
- Lead -> Investment Stakeholder
- Budget -> Capital Allocation
- Compound -> Master-planned Community

Scoring Metrics:
1. Portfolio Alignment (Type & Location) - 40%
2. Financial Feasibility (Allocation vs Price) - 40%
3. Strategic Nuance (Extracted interests from notes) - 20%

Output: Return ONLY a JSON array of objects: 
[{"unitId": "...", "matchScore": 0-100, "matchReason": "Professional clinical justification in English"}]`;

  const userPayload = {
    stakeholder: {
      interests: lead.aiProfiling?.interests || [],
      allocation: lead.budgetMax || lead.budget,
      preferredType: lead.preferredPropertyType,
      locations: lead.preferredLocations,
      strategicNotes: lead.notes,
    },
    assets: units.map(u => ({
      id: u.id,
      identity: u.title,
      type: u.propertyType,
      valuation: u.price,
      community: u.compound || u.location,
      footprint: u.area,
      specifications: `${u.bedrooms}BR / ${u.bathrooms}BA`
    }))
  };

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
          { role: 'user', content: `Analyze strategic matching for this stakeholder: ${JSON.stringify(userPayload)}` }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) throw new Error('Intelligence Gateway rejected matching request');

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return fallbackScoring(lead, units);

    const parsed = JSON.parse(jsonMatch[0]) as MatchResult[];
    return parsed.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);

  } catch (err) {
    console.error('[MatchingEngine] AI scoring failed:', err);
    return fallbackScoring(lead, units);
  }
}

/**
 * Heuristic fallback scoring if AI is unavailable.
 */
function fallbackScoring(lead: Lead, units: Unit[]): MatchResult[] {
  return units.map(u => {
    let score = 50; // Base score
    
    if (lead.preferredPropertyType === u.propertyType) score += 20;
    if (lead.budgetMax && u.price <= lead.budgetMax) score += 15;
    if (lead.preferredLocations?.includes(u.compound || u.location || '')) score += 15;
    
    return {
      unitId: u.id!,
      matchScore: Math.min(score, 100),
      matchReason: 'Heuristic match based on property type and budget.'
    };
  }).sort((a,b) => b.matchScore - a.matchScore).slice(0, 5);
}

/**
 * Generates a concise summary of matches for a lead (Operational Intelligence).
 */
export async function getMatchSummaryForLead(leadId: string): Promise<string> {
  const leadSnap = await getDoc(doc(db, COLLECTIONS.leads, leadId));
  if (!leadSnap.exists()) return "Stakeholder profile not found.";
  const lead = leadSnap.data() as Lead;

  if (!lead.aiProfiling?.topMatches || lead.aiProfiling.topMatches.length === 0) {
    return "No strategic matches detected. Initialize Neural Matching Engine.";
  }

  let summary = `<b>Matches for ${lead.name}:</b>\n`;
  for (const match of lead.aiProfiling.topMatches) {
    const unitSnap = await getDoc(doc(db, COLLECTIONS.units, match.unitId));
    if (unitSnap.exists()) {
      const unit = unitSnap.data() as Unit;
      summary += `💎 ${unit.title} (${match.matchScore}%)\n`;
    }
  }
  return summary;
}
