/**
 * SIERRA BLU — FIRESTORE DATA MODEL
 * Canonical type definitions for all collections.
 * This is the single source of truth for the database schema.
 */

import { Timestamp, FieldValue } from 'firebase/firestore';

// ─── Base Types ──────────────────────────────────────────────────────

export interface BaseDocument {
  id?: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  createdBy?: string;
  
  // Orchestration Metadata
  orchestrationState?: {
    stage: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    lastTriggeredAt?: Timestamp;
    engineVersion?: string;
    errors?: string[];
  };
}

export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'rented' | 'off-market';
export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'duplex' | 'penthouse' | 'studio' | 'chalet' | 'commercial' | 'land';
export type CRMStage = 'lead' | 'contact' | 'qualify' | 'present' | 'visit' | 'negotiate' | 'reserve' | 'contract' | 'handover' | 'closed-won';
export type LeadSource = 'property-finder' | 'olx' | 'website' | 'referral' | 'walk-in' | 'social-media' | 'whatsapp' | 'other';

// ─── Units (Listings) ───────────────────────────────────────────────

export interface Unit extends BaseDocument {
  // Identity
  title: string;
  titleAr?: string;
  referenceNumber?: string;
  code?: string;
  slug?: string;

  // Classification
  propertyType: PropertyType;
  category: 'residential' | 'commercial';
  status: PropertyStatus;

  // Location
  projectId?: string;       // FK to projects collection
  developerId?: string;     // FK to developers collection
  compound?: string;
  location?: string;
  city?: string;
  governorate?: string;
  coordinates?: { lat: number; lng: number };

  // Specifications
  area: number;             // in sqm
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  finishingType?: 'fully-finished' | 'semi-finished' | 'core-shell' | 'not-finished';
  view?: string;
  amenities?: string[];

  // Financial
  price: number;
  originalPrice?: number;
  pricePerSqm?: number;
  monthlyRent?: number;
  annualServiceCharge?: number;
  downPayment?: number;
  installmentYears?: number;
  monthlyInstallment?: number;

  // Media
  featuredImage?: string;
  images?: string[];        // Firebase Storage URLs
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlanUrl?: string;

  // Sync
  syncSource?: 'manual' | 'property-finder';
  pfReferenceNumber?: string;
  manualOverrides?: string[];   // Fields that should not be overwritten by sync
  lastSyncAt?: Timestamp | FieldValue | string;

  // Distribution & Automation
  automation?: {
    isBranded: boolean;
    isPublishedToPF: boolean;
    isPublishedToFB: boolean;
    whatsappAdGenerated: boolean;
    pfReference?: string;
  };

  // Lifecycle
  ownerType: 'owner' | 'broker' | 'internal';
  ownerContact?: string;
  dupeCheckHash?: string;

  // Metadata
  description?: string;
  descriptionAr?: string;
  isFeatured?: boolean;
  publishedAt?: Timestamp;
  archivedAt?: Timestamp | null;

  // Intelligence Layer
  intelligence?: {
    valuationScore: number;    // 0-100
    localityScore: number;     // 0-5 (Infrastructure quality)
    standard: 'luxury' | 'normal' | 'simple';
    condition: 'new' | 'good' | 'fair' | 'poor';
    legalRiskLevel: 'low' | 'medium' | 'high';
    legalFlags: string[];      // e.g. ["homestead_protection", "tax_lenient"]
    marketVelocity: 'fast' | 'stable' | 'slow';
    lastIntelligenceUpdate?: Timestamp;
  };
}

export type Property = Unit;

// ─── Projects (Developments) ────────────────────────────────────────

export interface Project extends BaseDocument {
  name: string;
  nameAr?: string;
  developerId: string;      // FK to developers collection
  slug?: string;

  // Location
  location: string;
  city: string;
  governorate?: string;
  coordinates?: { lat: number; lng: number };

  // Details
  description?: string;
  descriptionAr?: string;
  totalUnits?: number;
  availableUnits?: number;
  launchDate?: Timestamp;
  deliveryDate?: Timestamp;
  completionPercent?: number;

  // Financial
  priceRangeMin?: number;
  priceRangeMax?: number;
  paymentPlan?: string;

  // Media
  logo?: string;
  heroImage?: string;
  images?: string[];
  masterPlanUrl?: string;
  brochureUrl?: string;

  // Status
  status: 'pre-launch' | 'launching' | 'under-construction' | 'delivered' | 'resale';
  isFeatured?: boolean;
}

// ─── Developers ─────────────────────────────────────────────────────

export interface Developer extends BaseDocument {
  name: string;
  nameAr?: string;
  slug?: string;

  // Details
  description?: string;
  descriptionAr?: string;
  foundedYear?: number;
  headquarters?: string;
  website?: string;

  // Reputation
  rating?: number;          // 1-5
  totalProjects?: number;
  tier?: 'premium' | 'standard' | 'emerging';

  // Media
  logo?: string;
  coverImage?: string;

  // Contact
  contactEmail?: string;
  contactPhone?: string;
}

// ─── Media Assets ───────────────────────────────────────────────────

export interface MediaAsset extends BaseDocument {
  // Identity
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;

  // Storage
  storagePath: string;      // Firebase Storage path
  downloadUrl: string;      // Public download URL
  thumbnailUrl?: string;

  // Classification
  assetType: 'photo' | 'video' | 'floorplan' | 'brochure' | 'document' | 'logo';
  category?: 'exterior' | 'interior' | 'amenity' | 'location' | 'lifestyle';

  // Relations
  unitId?: string;          // FK to units
  projectId?: string;       // FK to projects
  developerId?: string;     // FK to developers

  // Metadata
  altText?: string;
  altTextAr?: string;
  sortOrder?: number;
  isFeatured?: boolean;
  dimensions?: { width: number; height: number };

  // Moderation
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
  moderatedAt?: Timestamp;
}

// ─── CRM Leads ──────────────────────────────────────────────────────

export interface Lead extends BaseDocument {
  // Contact Info
  name: string;
  phone: string;
  email?: string;
  nationality?: string;

  // Pipeline
  stage: CRMStage;
  source: LeadSource;
  assignedTo?: string;      // User ID

  // Interest
  interestedUnitIds?: string[];
  interestedProjectIds?: string[];
  budget?: number;
  budgetMax?: number;
  preferredPropertyType?: PropertyType;
  preferredLocations?: string[];
  preferredBedrooms?: number;
  timeline?: 'immediate' | '1-3months' | '3-6months' | '6-12months' | '12+months';

  // Activity
  notes?: string;
  lastContactAt?: Timestamp;
  nextFollowUpAt?: Timestamp;
  interactionCount?: number;

  // Outcome
  wonUnitId?: string;
  wonAmount?: number;
  lostReason?: string;
  closedAt?: Timestamp;

  // AI Matching & Intelligence
  aiProfiling?: {
    score: number;             // Importance score
    interests: string[];       // NLP extracted interests
    topMatches?: Array<{
      unitId: string;
      matchScore: number;
      matchReason: string;
    }>;
    lastMatchRunAt?: Timestamp;
  };

  // Automation Status
  automation?: {
    botInitiated: boolean;
    scoringCompleted: boolean;
    whatsappFollowupSent: boolean;
    viewingReminderSent: boolean;
  };

  // PF Sync
  pfLeadId?: string;
}

// ─── Sales / Transactions ───────────────────────────────────────────

export interface Sale extends BaseDocument {
  unitId: string;
  leadId: string;
  agentId: string;

  // Financial
  salePrice: number;
  commissionPercent: number;
  commissionAmount: number;
  closingDate: Timestamp;

  // Status
  status: 'pending' | 'contracted' | 'completed' | 'cancelled';
  contractNumber?: string;

  // Notes
  notes?: string;
}

// ─── Broker Listings (Stage 1) ──────────────────────────────────────

export interface BrokerListing extends BaseDocument {
  // Source Information
  rawMessage: string;
  sourceGroup?: string;
  sourcePlatform: 'whatsapp' | 'telegram' | 'other';
  senderInfo?: string; // Phone or Name
  coordinates?: { lat: number; lng: number };

  // NLP Extracted Data
  extractedData: {
    compound?: string;
    propertyType?: PropertyType;
    bedrooms?: number;
    price?: number;
    area?: number;
    finishingType?: string;
    phoneNumber?: string;
    urgencyScore?: number;
    sentiment?: 'positive' | 'neutral' | 'aggressive' | 'desperate';
  };

  // Processing
  status: 'new' | 'parsed' | 'validated' | 'duplicate' | 'archived';
  isVerified: boolean;
  duplicateOf?: string; // ID of existing unit

  // Link to canonical unit if converted
  unitId?: string; 
}

// ─── Vouchers / Incentives ──────────────────────────────────────────

export interface Voucher extends BaseDocument {
  code: string;
  type: 'discount' | 'commission-bonus' | 'viewing-reward';
  value: number;
  currency: string;
  leadId?: string;          // Assigned lead
  status: 'active' | 'redeemed' | 'expired';
  expiresAt: Timestamp;
  conditions?: string;
}

// ─── Proposals / Options Packages (Stage 7) ──────────────────────────

export interface Proposal extends BaseDocument {
  leadId: string;
  leadName?: string;
  
  // Selection
  unitIds: string[];
  units: Array<{
    id: string;
    title: string;
    price: number;
    matchScore: number;
    matchReason: string;
  }>;

  // AI Insights
  strategicSummary?: string;
  strategicSummaryAr?: string;
  
  // Lifecycle
  status: 'draft' | 'deployed' | 'accepted' | 'rejected';
  deployedAt?: Timestamp;
  expiresAt?: Timestamp;
  
  // Analytics
  viewCount?: number;
  lastViewedAt?: Timestamp;
  shareableUrl?: string;

  // Strategic Insights
  financialAnalysis?: {
    projectedROI: number;
    annualYield: number;
    valuationAnalysis: string; // Brief reasoning for the deal quality
    totalPortfolioCapital?: number;
  };
}

// ─── Users / Staff Profiles ──────────────────────────────────────────
export interface UserProfile extends BaseDocument {
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'agent';
  pfUsername?: string;
  pfAgentId?: string;
  phoneNumber?: string;
  status: 'active' | 'inactive';
}

// ─── Activities / Audit Log ─────────────────────────────────────────

export interface Activity extends BaseDocument {
  type: 'lead_created' | 'lead_stage_changed' | 'listing_added' | 'listing_updated' |
        'sale_closed' | 'sync_completed' | 'note_added' | 'assignment_changed';
  actorId: string;
  actorName: string;
  description: string;
  relatedId?: string;
  relatedType?: 'unit' | 'lead' | 'sale' | 'project';
  metadata?: Record<string, unknown>;
}

// ─── Collection Names (Constants) ───────────────────────────────────

export const COLLECTIONS = {
  units: 'listings',        // keeping backward compat with existing 'listings' collection
  projects: 'projects',
  developers: 'developers',
  mediaAssets: 'mediaAssets',
  leads: 'leads',
  sales: 'sales',
  activities: 'activities',
  users: 'users',
  syncQueue: 'syncQueue',
  syncLog: 'syncLog',
  vouchers: 'vouchers',
  proposals: 'proposals',
  brokerListings: 'broker_listings',
} as const;
