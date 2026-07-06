/**
 * Fetch lead data from Property Finder CRM API
 * Uses cached data as a fallback to ensure system availability
 */
export async function fetchPropertyLeads(ref: string, fallback: number): Promise<number> {
  const apiKey = process.env.PF_API_KEY;
  if (!apiKey) return Number(fallback);

  try {
    const response = await fetch(`https://api.propertyfinder.eg/crm/leads?reference=${ref}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    
    if (response.status !== 200) return Number(fallback);
    const data = await response.json();
    return Number(data.total_leads || 0);
  } catch {
    return Number(fallback);
  }
}
