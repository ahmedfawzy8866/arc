import { getProperties, unpublishProperty, Property } from "./firestore";
import { evaluatePropertyPerformance } from "./advisory/decision";
import { fetchPropertyLeads } from "./advisory/fetcher";
import { advisorySort, isListingActive } from "./advisory/logic";

// --- Types ---

export interface ProcessResult {
  ref: string;
  price: number;
  leads: number;
  status: string;
  isHighValue: boolean;
  action: string;
}

// --- Protocol Orchestration ---

/**
 * Perform individual property analysis
 * Refactored to reduce complexity by consolidating decision points.
 */
async function analyzeListing(p: Property): Promise<ProcessResult> {
  const { referenceNumber: ref, leadsCount = 0, price = 0, id } = p;
  const currentLeads = await fetchPropertyLeads(ref, leadsCount);
  const evaluation = evaluatePropertyPerformance(price, currentLeads);
  
  const { shouldUnpublish, leadsFound, isHighValue } = evaluation;

  if (id && shouldUnpublish) {
    await unpublishProperty(id, leadsFound);
  }

  const logStatus = shouldUnpublish ? "Unpublished" : "Published";
  const logAction = `${logStatus} ${ref} (Leads: ${leadsFound})`;

  return {
    ref,
    price,
    leads: leadsFound,
    status: logStatus,
    isHighValue,
    action: logAction
  };
}

/**
 * Advisory AI Protocol Entry Point
 * Final Refactor: Uses a flat, functional chain with imported predicates
 * This eliminates the need for separate prioritization logic and reduces complexity to 1.
 */
export async function runAdvisoryProtocol(): Promise<ProcessResult[]> {
  const allProperties = await getProperties();
  const prioritizedListings = (allProperties || [])
    .filter(isListingActive)
    .sort(advisorySort);
  
  const tasks = prioritizedListings
    .filter(p => !!p.id)
    .map(p => analyzeListing(p));
    
  return Promise.all(tasks);
}
