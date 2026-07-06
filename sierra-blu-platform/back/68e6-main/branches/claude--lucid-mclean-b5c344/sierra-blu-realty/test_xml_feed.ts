import { getProperties, getAgents } from "./lib/firestore";
import { prioritizeProperties, createAgentMap, buildPropertyXml } from "./lib/xml-feed";

async function main() {
  console.log("--- XML FEED TEST START ---");
  
  const properties = await getProperties();
  const agents = await getAgents();
  
  console.log(`Analyzing ${properties.length} properties and ${agents.length} agents...`);
  
  const ranked = prioritizeProperties(properties);
  const map = createAgentMap(agents);
  
  console.log(`Ranked properties: ${ranked.length}`);
  
  if (ranked.length > 0) {
    const topXml = buildPropertyXml(ranked[0], map);
    console.log("--- TOP LISTING XML PREVIEW ---");
    console.log(topXml);
  } else {
    console.log("No published properties available for the feed.");
  }
  
  console.log("--- XML FEED TEST END ---");
}

main().catch(console.error);
