import { NextResponse } from "next/server";
import { getProperties, getAgents } from "@/lib/firestore";

export async function GET() {
  try {
    const properties = await getProperties();
    const agents = await getAgents();
    
    // Create a dictionary for quick agent lookup
    const agentsMap = agents.reduce((acc, agent) => {
      if (agent.id) {
        acc[agent.id] = {
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
        };
      }
      return acc;
    }, {} as Record<string, { name: string; email: string; phone: string }>);

    // If there are no properties, we'll provide a dummy property so the feed isn't completely empty, 
    // or just return an empty <list> to avoid XML errors.
    const propertiesToRender = properties.length > 0 ? properties : [
      {
         referenceNumber: "SB-VI-001",
         title: "Luxury Golf Villa in Katameya",
         description: "A stunning, ultra-luxury modern villa overlooking a lush green golf course at sunset in Katameya, New Cairo. Features high-end architectural design, premium real estate finishing, and an infinity pool.",
         propertyType: "VI",
         offerType: "RS",
         price: 175000000,
         city: "Cairo",
         community: "New Cairo",
         subCommunity: "Katameya Heights",
         bedrooms: 6,
         bathrooms: 8,
         size: 1200,
         agentRef: "dummy",
         images: ["https://sierra-blu.com/hero-bg.png"], // Placeholder pointing to the existing site
         facilities: ["Private Pool", "Golf Course View", "Smart Home System", "Maid's Room", "Central A/C"],
         updatedAt: new Date().toISOString(),
      },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<list last_update="${new Date().toISOString()}">\n`;

    propertiesToRender.forEach((prop) => {
      const agent = (prop.agentRef ? agentsMap[prop.agentRef] : undefined) || {
        name: "Sierra Blu Advisory",
        email: "advisory@sierra-blu.com",
        phone: "+20 2 3333 7810"
      };

      xml += `  <property last_update="${prop.updatedAt}">\n`;
      xml += `    <reference_number>${prop.referenceNumber}</reference_number>\n`;
      xml += `    <permit_number>123456789</permit_number>\n`; // Required by some portals
      xml += `    <url>https://sierra-blu.com/listings/${prop.referenceNumber}</url>\n`;
      xml += `    <title><![CDATA[${prop.title}]]></title>\n`;
      xml += `    <description><![CDATA[${prop.description}]]></description>\n`;
      xml += `    <property_type>${prop.propertyType}</property_type>\n`;
      xml += `    <offer_type>${prop.offerType}</offer_type>\n`;
      xml += `    <price>${prop.price}</price>\n`;
      xml += `    <city><![CDATA[${prop.city}]]></city>\n`;
      xml += `    <community><![CDATA[${prop.community}]]></community>\n`;
      if (prop.subCommunity) {
        xml += `    <sub_community><![CDATA[${prop.subCommunity}]]></sub_community>\n`;
      }
      xml += `    <bedrooms>${prop.bedrooms}</bedrooms>\n`;
      xml += `    <bathrooms>${prop.bathrooms}</bathrooms>\n`;
      xml += `    <size>${prop.size}</size>\n`;
      
      // Agent Details
      xml += `    <agent>\n`;
      xml += `      <id>${prop.agentRef}</id>\n`;
      xml += `      <name><![CDATA[${agent.name}]]></name>\n`;
      xml += `      <email><![CDATA[${agent.email}]]></email>\n`;
      xml += `      <phone><![CDATA[${agent.phone}]]></phone>\n`;
      xml += `    </agent>\n`;

      // Facilities
      if (prop.facilities && prop.facilities.length > 0) {
        xml += `    <facilities>\n`;
        prop.facilities.forEach((fac) => {
          xml += `      <facility><![CDATA[${fac}]]></facility>\n`;
        });
        xml += `    </facilities>\n`;
      }

      // Photos
      if (prop.images && prop.images.length > 0) {
        xml += `    <photo>\n`;
        prop.images.forEach((img) => {
          xml += `      <url><![CDATA[${img}]]></url>\n`;
        });
        xml += `    </photo>\n`;
      }

      xml += `  </property>\n`;
    });

    xml += `</list>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("XML Feed Error:", error);
    return NextResponse.json({ error: "Failed to generate XML feed" }, { status: 500 });
  }
}
