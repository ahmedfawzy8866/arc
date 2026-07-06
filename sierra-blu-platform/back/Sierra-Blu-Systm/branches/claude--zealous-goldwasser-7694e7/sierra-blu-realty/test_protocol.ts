import { runAdvisoryProtocol } from "./lib/advisory";
import { getProperties } from "./lib/firestore";

async function main() {
  console.log("--- TEST SESSION START ---");
  
  const properties = await getProperties();
  console.log(`Found ${properties.length} properties in Firestore.`);
  
  if (properties.length === 0) {
    console.log("No data found. Please seed the database first.");
    return;
  }

  console.log("Running Advisory Protocol...");
  const results = await runAdvisoryProtocol();
  
  console.log("--- RESULTS ---");
  results.forEach(r => {
    console.log(`[${r.status}] Ref: ${r.ref} | Price: ${r.price} | Leads: ${r.leads} | Action: ${r.action}`);
  });
  
  console.log("--- TEST SESSION END ---");
}

main().catch(console.error);
