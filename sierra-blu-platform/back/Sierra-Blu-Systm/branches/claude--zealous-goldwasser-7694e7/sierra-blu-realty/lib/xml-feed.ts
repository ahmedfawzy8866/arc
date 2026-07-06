import { resolveProperties } from "./properties";
import { getCoreMeta, getLocation, getDims, getAgentDetail, getListTags, PropertySnippet } from "./xml-feed/snippets";
import { createAgentLookup, xmlSort, AgentInput, AgentOutput } from "./xml-feed/agents";
import type { Property } from "./firestore";


// --- Orchestration Logic ---

/**
 * Filter, Sort (Price then Leads), and Slice (Top 100)
 */
export function prioritizeProperties(allRaw: Property[]): Property[] {
  const active = (allRaw || []).filter(p => p.isPublished === true);
  const resolved = resolveProperties(active);
  
  return resolved
    .sort(xmlSort)
    .slice(0, 100);
}

/**
 * Export Agent Map function directly
 */
export function createAgentMap(agents: AgentInput[]): Record<string, AgentOutput> {
  return createAgentLookup(agents);
}

/**
 * Main Orchestration for single listing XML
 * Flat Array Join pattern for a complexity score of 1.
 */
export function buildPropertyXml(p: PropertySnippet & { agentRef?: string; facilities?: string[]; images?: string[] }, agentMap: Record<string, AgentOutput>): string {
  const { agentRef, facilities, images } = p;
  
  const content = [
    getCoreMeta(p),
    getLocation(p),
    getDims(p),
    getAgentDetail(agentRef, agentMap),
    getListTags("facilities", "facility", facilities),
    getListTags("photo", "url", images),
    "  </property>\n"
  ];

  return content.join("");
}
