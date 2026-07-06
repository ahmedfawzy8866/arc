/**
 * SIERRA BLU — ANTIGRAVITY INTELLIGENCE AGENT
 * The neural bridge between the Telegram Bot and the Project Engines.
 */

import { getOpenClawGatewayConfig } from '@/lib/server/openclaw';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { COLLECTIONS, type Lead, type Unit } from '../models/schema';
import { generateOptionsPackage } from './sales-engine';
import { runMatchingForLead } from './matching-engine';
import { assessLegalRisk, generateLegalSummary } from './legal-brain';

export interface AgentResponse {
  message: string;
  actionTaken?: string;
  success: boolean;
}

export async function processAgentCommand(chatId: number, text: string): Promise<AgentResponse> {
  const gateway = getOpenClawGatewayConfig();
  if (!gateway.configured) {
    return { 
      message: "<b>Antigravity Operational Error:</b> Intelligence Gateway not configured.", 
      success: false 
    };
  }

  // 1. Detect Intent using AI
  const intent = await detectIntent(text);

  if (!intent || intent.type === 'unknown') {
    return {
      message: "I'm sorry, I couldn't understand that order. You can ask me to analyze leads, check listing status, or generate proposals.",
      success: false
    };
  }

  // 2. Execute Action based on Intent
  try {
    switch (intent.type) {
      case 'analyze_lead':
        return await handleAnalyzeLead(intent.params.name);
      case 'generate_proposal':
        return await handleGenerateProposal(intent.params.name);
      case 'check_listing':
        return await handleCheckListing(intent.params.identifier);
      case 'general_query':
        return await handleGeneralQuery(text);
      default:
        return { message: "Intent recognized but not yet implemented.", success: false };
    }
  } catch (err: any) {
    console.error("Agent execution failed:", err);
    return { message: `Operational Failure: ${err.message}`, success: false };
  }
}

/**
 * Uses Gemini to parse natural language into structured intent.
 */
async function detectIntent(text: string) {
  const gateway = getOpenClawGatewayConfig();
  
  const systemPrompt = `You are the Sierra Blu Intent Dispatcher.
Analyze the user's message and determine their intent.
Available Intents:
- analyze_lead: User wants to see a summary of a lead's profile/preferences. (Params: name)
- generate_proposal: User wants to create a new proposal/options package for a lead. (Params: name)
- check_listing: User wants status/legal info for a property/listing. (Params: identifier)
- general_query: User is asking a general question about the project or real estate.

Format: JSON only: {"type": "intent_name", "params": {}}`;

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
        { role: 'user', content: text }
      ],
      temperature: 0,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { type: 'unknown' };
  } catch {
    return { type: 'unknown' };
  }
}

async function handleAnalyzeLead(name: string): Promise<AgentResponse> {
  const q = query(collection(db, COLLECTIONS.leads), where('name', '>=', name), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return { message: `Stakeholder "${name}" not found.`, success: false };

  const lead = { id: snap.docs[0].id, ...snap.docs[0].data() } as Lead;
  
  // Trigger matching just in case
  await runMatchingForLead(lead.id!);
  
  // Re-fetch with matches
  const updatedSnap = await getDocs(query(collection(db, COLLECTIONS.leads), where('name', '==', lead.name)));
  const updatedLead = updatedSnap.docs[0].data() as Lead;

  const summary = `
<b>👤 Stakeholder Profile: ${updatedLead.name}</b>
<b>Budget:</b> ${updatedLead.budget} - ${updatedLead.budgetMax}
<b>Interests:</b> ${updatedLead.aiProfiling?.interests?.join(', ') || 'N/A'}
<b>Top Strategic Matches:</b> ${updatedLead.aiProfiling?.topMatches?.length || 0} assets.

<i>"Engagement velocity is high. Recommend immediate proposal deployment."</i>
  `;

  return { message: summary, success: true, actionTaken: 'analyze_lead' };
}

async function handleGenerateProposal(name: string): Promise<AgentResponse> {
  const q = query(collection(db, COLLECTIONS.leads), where('name', '>=', name), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return { message: `Stakeholder "${name}" not found.`, success: false };

  const leadId = snap.docs[0].id;
  const proposalId = await generateOptionsPackage(leadId);

  return {
    message: `
<b>✅ Proposal Deployed</b>
Strategic portfolio for <b>${name}</b> has been generated.
<b>Proposal ID:</b> <code>${proposalId}</code>
<b>Action:</b> Assets curated and incentives triggered.
    `,
    success: true,
    actionTaken: 'generate_proposal'
  };
}

async function handleCheckListing(id: string): Promise<AgentResponse> {
  // Search by code or title
  const q = query(collection(db, COLLECTIONS.units), limit(1)); // Simple search for demo
  const snap = await getDocs(q);
  if (snap.empty) return { message: `Listing "${id}" not found.`, success: false };

  const unit = snap.docs[0].data() as Unit;
  const legal = assessLegalRisk(unit);
  const legalSummary = generateLegalSummary(legal, 'en');

  return {
    message: `
<b>🏢 Asset Intel: ${unit.title}</b>
<b>Price:</b> ${unit.price} EGP
<b>Status:</b> ${unit.status.toUpperCase()}
<b>Legal Status:</b> ${legalSummary}
<b>Risk Level:</b> ${legal.riskLevel.toUpperCase()}
    `,
    success: true,
    actionTaken: 'check_listing'
  };
}

async function handleGeneralQuery(text: string): Promise<AgentResponse> {
  const gateway = getOpenClawGatewayConfig();
  
  const response = await fetch(`${gateway.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${gateway.token}`,
    },
    body: JSON.stringify({
      model: 'gemini-2.5-flash-lite',
      messages: [
        { role: 'system', content: "You are Antigravity, the Sierra Blu Intelligence Assistant. Answer real estate questions with authority and luxury tone." },
        { role: 'user', content: text }
      ],
    }),
  });

  const data = await response.json();
  return { message: data.choices[0].message.content, success: true };
}
