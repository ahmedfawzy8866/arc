import { Property } from "../firestore";

/**
 * Stable Sort for Advisory AI listings
 * Ranked by: 1. Price (Desc), 2. Leads (Desc)
 */

export function advisorySort(a: Property, b: Property): number {
  return (Number(b.price || 0) - Number(a.price || 0)) || 
         (Number(b.leadsCount || 0) - Number(a.leadsCount || 0));
}


/**
 * Filter predicate for published listings
 */
export const isListingActive = (p: Property): boolean => !!p?.id && p.isPublished !== false;
