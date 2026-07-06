import { CONTACT } from "../site";
import { AgentOutput } from "./agents";

export interface PropertySnippet {
  updatedAt?: string;
  referenceNumber: string;
  title?: string;
  description?: string;
  propertyType?: string;
  offerType?: string;
  price?: number | string;
  city?: string;
  community?: string;
  subCommunity?: string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  size?: number | string;
}


/**
 * Generate specific XML snippets to keep complexity low
 */
export function getCoreMeta(p: PropertySnippet): string {
  return `  <property last_update="${p.updatedAt || new Date().toISOString()}">
    <reference_number>${p.referenceNumber}</reference_number>
    <permit_number>123456789</permit_number>
    <url>https://sierra-blu.com/listings/${encodeURIComponent(p.referenceNumber)}</url>
    <title><![CDATA[${p.title || ""}]]></title>
    <description><![CDATA[${p.description || ""}]]></description>
    <property_type>${p.propertyType || ""}</property_type>
    <offer_type>${p.offerType || ""}</offer_type>
    <price>${p.price}</price>\n`;
}

export function getLocation(p: PropertySnippet): string {
  let xml = `    <city><![CDATA[${p.city}]]></city>
    <community><![CDATA[${p.community}]]></community>\n`;
  if (p.subCommunity) {
    xml += `    <sub_community><![CDATA[${p.subCommunity}]]></sub_community>\n`;
  }
  return xml;
}

export function getDims(p: PropertySnippet): string {
  return `    <bedrooms>${p.bedrooms || 0}</bedrooms>
    <bathrooms>${p.bathrooms || 0}</bathrooms>
    <size>${p.size || 0}</size>\n`;
}

export function getAgentDetail(id: string | undefined | null, map: Record<string, AgentOutput>): string {
  const a = (id ? map[id] : undefined) || {
    name: "Sierra Blu Advisory",
    email: CONTACT.email,
    phone: CONTACT.phoneDisplay,
  };
  return `    <agent>
      <id>${id || "admin"}</id>
      <name><![CDATA[${a.name}]]></name>
      <email><![CDATA[${a.email}]]></email>
      <phone><![CDATA[${a.phone}]]></phone>
    </agent>\n`;
}

export function getListTags(tag: string, it: string, items?: string[]): string {
  if (!items || items.length === 0) return "";
  let xml = `    <${tag}>\n`;
  for (const i of items) {
    xml += `      <${it}><![CDATA[${i}]]></${it}>\n`;
  }
  xml += `    </${tag}>\n`;
  return xml;
}
