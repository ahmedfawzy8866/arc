import { NextResponse } from "next/server";
import { getProperties, getAgents } from "@/lib/firestore";
import { prioritizeProperties, createAgentMap, buildPropertyXml } from "@/lib/xml-feed";

/**
 * Property Finder XML Feed Protocol
 * Official strategic feed for top 100 listings sorted by price and lead interest.
 */
export async function GET() {
  try {
    // 1. Fetch raw data
    const rawProperties = await getProperties();
    const rankedProperties = prioritizeProperties(rawProperties);
    
    // 2. Setup agent lookup map
    const agents = await getAgents();
    const agentMap = createAgentMap(agents);

    // 3. Generate XML Header
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<list last_update="${new Date().toISOString()}">\n`;

    // 4. Populate each ranked listing (limited to top 100)
    for (const prop of rankedProperties) {
      xml += buildPropertyXml(prop, agentMap);
    }

    xml += `</list>`;

    // 5. Finalize response with proper headers for CRM consumption
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        "X-Listing-Count": rankedProperties.length.toString()
      },
    });

  } catch (error) {
    console.error("[Property Finder Feed] Error during generation:", error);
    return NextResponse.json({ 
      error: "Failed to generate XML feed",
      details: error instanceof Error ? error.message : "Internal Error" 
    }, { status: 500 });
  }
}
