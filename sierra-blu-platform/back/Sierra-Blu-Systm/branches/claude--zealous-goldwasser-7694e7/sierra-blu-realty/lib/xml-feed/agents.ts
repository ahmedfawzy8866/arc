import { CONTACT } from "../site";

/**
 * Creates a Map for quick agent lookup
 * Linear flow for complexity score of 1.
 */
export interface AgentInput {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface ListingInput {
  price?: number | string;
  leadsCount?: number | string;
}

export interface AgentOutput {
  name: string;
  email: string;
  phone: string;
}


/**
 * Internal helpers to minimize complexity scores in main exports
 */
const mapAgent = (a: AgentInput) => ({
  name: a.name || "Sierra Blu Advisor",
  email: a.email || CONTACT.email,
  phone: a.phone || CONTACT.phoneDisplay,
});

const isVal = (a: AgentInput) => !!(a && a.id);
const toEnt = (a: AgentInput) => [a.id as string, mapAgent(a)];
const getP = (l: ListingInput) => Number(l.price || 0);
const getL = (l: ListingInput) => Number(l.leadsCount || 0);

/**
 * Creates a Map for quick agent lookup
 */
export const createAgentLookup = (agents: AgentInput[]): Record<string, AgentOutput> => 
  Object.fromEntries((agents || []).filter(isVal).map(toEnt));


/**
 * Stable Sort for Property Finder XML listings
 */
export const xmlSort = (a: ListingInput, b: ListingInput): number => 
  (getP(b) - getP(a)) || (getL(b) - getL(a));
