import type { Property, PropertyType, OfferType } from "./firestore";

/**
 * High-End Managed Assets
 * Revised for elite branding and emotive storytelling.
 */
export const FALLBACK_PROPERTIES: Property[] = [
  {
    id: "signature-palace-01",
    referenceNumber: "SB-001",
    title: "The Obsidian Palace",
    description:
      "A cinematic vertical estate designed with monolithic architecture and double-height glazing. Located in the most secluded enclave of Katameya Heights, offering panoramic horizons and signature privacy.",
    propertyType: "VI",
    offerType: "RS",
    price: 115000000,
    city: "Cairo",
    community: "Katameya Heights",
    subCommunity: "The Enclave",
    bedrooms: 7,
    bathrooms: 9,
    size: 1450,
    agentRef: "adviser-layla",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop",
    ],
    facilities: [
      "Private Wellness Suite",
      "Obsidian Infinity Pool",
      "Biometric Security Corridor",
      "Curated Master Suite",
    ],
    updatedAt: "2026-03-24T00:00:00.000Z",
  },
  {
    id: "azure-res-02",
    referenceNumber: "SB-005",
    title: "Azure Towers Residence",
    description:
      "A sculptural sky-residence with 360-degree views of the New Capital. Experience a fluid interior layout with hand-carved stone flooring and floor-to-ceiling glass systems.",
    propertyType: "AP",
    offerType: "RS",
    price: 28500000,
    city: "Cairo",
    community: "New Capital",
    subCommunity: "Financial District",
    bedrooms: 4,
    bathrooms: 4,
    size: 380,
    agentRef: "adviser-karim",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop",
    ],
    facilities: ["Smart Home OS", "Sky Garden Access", "Concierge 24/7", "Private Gallery"],
    updatedAt: "2026-03-24T00:00:00.000Z",
  },
  {
    id: "mivida-villa-03",
    referenceNumber: "SB-012",
    title: "Lumina Private Villa",
    description:
      "A light-filled sanctuary in Mivida, where indoor-outdoor living is perfected through pocket doors and central courtyard gardens. A masterpiece of minimal luxury and architectural symmetry.",
    propertyType: "VI",
    offerType: "RS",
    price: 42000000,
    city: "Cairo",
    community: "New Cairo",
    subCommunity: "Mivida",
    bedrooms: 5,
    bathrooms: 6,
    size: 580,
    agentRef: "adviser-nour",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2070&auto=format&fit=crop",
    ],
    facilities: ["Koi Pond Garden", "Chef Cabinet Kitchen", "Double Garage", "Staff Quarters"],
    updatedAt: "2026-03-24T00:00:00.000Z",
  },
];

const propertyTypeLabels: Record<PropertyType, string> = {
  AP: "Apartment",
  VI: "Villa",
  TH: "Townhouse",
  PH: "Penthouse",
};

const offerTypeLabels: Record<OfferType, string> = {
  RS: "For Sale",
  RR: "For Rent",
  CS: "Commercial Sale",
  CR: "Commercial Rent",
};

export const resolveProperties = (properties: Property[]): Property[] =>
  properties.length > 0 ? properties : FALLBACK_PROPERTIES;

export const normalizePropertyIdentifier = (value: string): string =>
  value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

export const findPropertyByIdentifier = (
  properties: Property[],
  identifier: string,
): Property | undefined => {
  const normalizedIdentifier = normalizePropertyIdentifier(identifier);

  return resolveProperties(properties).find((property) => {
    const candidates = [property.id, property.referenceNumber]
      .filter((candidate): candidate is string => Boolean(candidate))
      .map(normalizePropertyIdentifier);

    return candidates.includes(normalizedIdentifier);
  });
};

export const getPropertyHref = (property: Property): string =>
  `/listings/${encodeURIComponent(property.referenceNumber)}`;

export const getPrimaryPropertyImage = (property: Property): string =>
  property.images[0] ?? FALLBACK_PROPERTIES[0]!.images[0]!;

export const formatPropertyType = (type: PropertyType): string => propertyTypeLabels[type];
export const formatOfferType = (type: OfferType): string => offerTypeLabels[type];

/**
 * Currency Formatting for Luxury Scale
 */
export const formatPropertyPrice = (price: number): string => {
  if (price >= 1000000) {
    return `EGP ${(price / 1000000).toFixed(1)}M`;
  }
  return `EGP ${price.toLocaleString()}`;
};
