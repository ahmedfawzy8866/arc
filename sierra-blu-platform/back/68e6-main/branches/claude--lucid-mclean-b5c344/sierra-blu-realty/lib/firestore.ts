import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseApp } from "./firebase";

const app = getFirebaseApp();
export const db = getFirestore(app);

export interface Agent {
  id?: string;
  name: string;
  role: string;
  image: string;
  phone: string;
  email: string;
  specialties: string[];
  bio: string;
  createdAt?: Timestamp;
}

const asString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const mapAgent = (id: string, data: Record<string, unknown>): Agent => ({
  id,
  name: asString(data.name, "Advisor"),
  role: asString(data.role, "Private Advisor"),
  image: asString(data.image),
  phone: asString(data.phone),
  email: asString(data.email),
  specialties: asStringArray(data.specialties),
  bio: asString(data.bio),
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
});

export const getAgents = async () => {
  const agentsCol = collection(db, "agents");
  const agentsQuery = query(agentsCol, orderBy("name", "asc"));
  const agentsSnapshot = await getDocs(agentsQuery);
  return agentsSnapshot.docs.map((doc) =>
    mapAgent(doc.id, doc.data() as Record<string, unknown>),
  );
};

export const addAgent = async (agent: Omit<Agent, "id">) => {
  const agentsCol = collection(db, "agents");
  return await addDoc(agentsCol, {
    ...agent,
    createdAt: Timestamp.now(),
  });
};

export type PropertyType = "AP" | "VI" | "TH" | "PH";
export type OfferType = "RS" | "RR" | "CS" | "CR";

export interface Property {
  id?: string;
  code?: string;
  referenceNumber: string;
  source?: string;
  title: string;
  description: string;
  compound?: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  price: number;
  currency?: string;
  furnished?: string; // Updated to string to match mockup (e.g., "Fully Furnished")
  garden?: boolean;
  pool?: boolean; // Added
  view?: boolean; // Added
  smartHome?: boolean; // Added
  status?: string;
  isPublished?: boolean;
  leadsCount?: number;
  unpublishReason?: string;
  whatsappContent?: string;
  propertyFinderContent?: string;
  advisorChecked?: boolean;
  updatedAt: string;
  createdAt?: Timestamp | string;
  location?: string;
  landmarks?: string[];
  images: string[];
  video?: string;
  hasVirtualTour?: boolean;
  virtualTourStatus?: "Live" | "Soon" | "None";
  virtualTourUrl?: string;
  has3DMedia?: boolean;
  threeDPreviewImage?: string;
  // Metadata for tracking
  createdBy?: string;
  createdByEmail?: string;
  ownerName?: string;
  phoneNumber?: string;
  // Legacy fields retained for safety
  propertyType?: PropertyType;
  offerType?: OfferType;
  size?: number;
  agentRef?: string;
  facilities?: string[];
  publishedAt?: Timestamp | string;
  city?: string;
  community?: string;
  subCommunity?: string;
}

const isPropertyType = (value: unknown): value is PropertyType =>
  value === "AP" || value === "VI" || value === "TH" || value === "PH";

const isOfferType = (value: unknown): value is OfferType =>
  value === "RS" || value === "RR" || value === "CS" || value === "CR";

const mapProperty = (id: string, data: Record<string, unknown>): Property => ({
  id,
  code: asString(data.code),
  referenceNumber: asString(data.referenceNumber, id),
  title: asString(data.title, "Untitled Property"),
  description: asString(data.description, "Property details are being prepared."),
  compound: asString(data.compound),
  propertyType: isPropertyType(data.propertyType) ? data.propertyType : "AP",
  offerType: isOfferType(data.offerType) ? data.offerType : "RS",
  price: asNumber(data.price),
  city: asString(data.city),
  community: asString(data.community),
  subCommunity: asString(data.subCommunity),
  bedrooms: asNumber(data.bedrooms),
  bathrooms: asNumber(data.bathrooms),
  size: asNumber(data.size),
  agentRef: asString(data.agentRef),
  images: asStringArray(data.images),
  facilities: asStringArray(data.facilities),
  updatedAt: asString(data.updatedAt, new Date().toISOString()),
  isPublished: typeof data.isPublished === "boolean" ? data.isPublished : true,
  leadsCount: asNumber(data.leadsCount, 0),
  publishedAt: data.publishedAt as Timestamp | string | undefined,
  createdBy: asString(data.createdBy),
  createdByEmail: asString(data.createdByEmail),
  ownerName: asString(data.ownerName),
  phoneNumber: asString(data.phoneNumber),
  furnished: asString(data.furnished),
  garden: !!data.garden,
  pool: !!data.pool,
  view: !!data.view,
  smartHome: !!data.smartHome,
});

export const getProperties = async (): Promise<Property[]> => {
  try {
    const propertiesCol = collection(db, "properties");
    const propertiesQuery = query(propertiesCol, orderBy("updatedAt", "desc"));
    const propertiesSnapshot = await getDocs(propertiesQuery);
    return propertiesSnapshot.docs.map((doc) =>
      mapProperty(doc.id, doc.data() as Record<string, unknown>),
    );
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};

export const addProperty = async (property: Omit<Property, "id">) => {
  const propertiesCol = collection(db, "properties");
  return await addDoc(propertiesCol, {
    ...property,
    updatedAt: new Date().toISOString(),
    createdAt: Timestamp.now(),
  });
};

export const unpublishProperty = async (propertyId: string, leadsFound: number) => {
  const propertyRef = doc(db, "properties", propertyId);
  await updateDoc(propertyRef, {
    isPublished: false,
    leadsCount: leadsFound,
    unpublishReason: "Low performance (Under 2 leads automatically detected by Advisory AI)",
    updatedAt: new Date().toISOString(),
  });
};

