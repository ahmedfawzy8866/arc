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
export type PipelineStage = 'inbound' | 'qualify' | 'engage' | 'proposal' | 'viewing' | 'negotiate' | 'reserve' | 'contract' | 'handover' | 'closed-won';
export type StakeholderAcquisitionSource = 'property-finder' | 'olx' | 'website' | 'referral' | 'walk-in' | 'social-media' | 'whatsapp' | 'other';
export type CurrencyCode = 'EGP' | 'USD';
export type FurnishingCode = 'F' | 'U' | 'K' | 'S';
export type SierraFeatureCode = 'G' | 'P' | 'R' | 'V';
export type ListingSentiment = 'positive' | 'neutral' | 'aggressive' | 'desperate';

export interface IntelligenceObject {
  code?: string;
  locationCode?: string;
  furnishingStatus?: FurnishingCode;
  normalizedPrice?: number;
  currency?: CurrencyCode;
  featureCodes?: SierraFeatureCode[];
  valuationScore?: number;
  localityScore?: number;
  standard?: 'luxury' | 'normal' | 'simple';
  condition?: 'new' | 'good' | 'fair' | 'poor';
  legalRiskLevel?: 'low' | 'medium' | 'high';
  legalFlags?: string[];
  marketVelocity?: 'fast' | 'stable' | 'slow';
  urgencyScore?: number;
  sentiment?: ListingSentiment;
  matchingKeywords?: string[];
  roi?: string;
  duplicateCandidateId?: string;
  duplicateConfidence?: number;
  parserVersion?: string;
  lastUpdatedAt?: Timestamp | FieldValue;
  building?: string;
  tower?: string;
  floor?: string;
  unitNumber?: string;
  manual_override?: boolean;
  finishingGrade?: string;
  paymentTerms?: {
    downpayment?: number;
    installmentsYears?: number;
  };
  valuation?: {
    appraisedValue: number;
    marketDifference: number;
    downpaymentRequired: number;
    installmentMonths: number;
    monthlyInstallment: number;
    valuationStatus: 'underpriced' | 'fair' | 'overpriced';
  };
}

export interface Unit extends BaseDocument {
  title: string;
  titleAr?: string;
  referenceNumber?: string;
  code?: string;
  slug?: string;
  propertyType: PropertyType;
  category: 'residential' | 'commercial';
  status: PropertyStatus;
  projectId?: string;
  developerId?: string;
  compound?: string;
  location?: string;
  city?: string;
  governorate?: string;
  coordinates?: { lat: number; lng: number };
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  finishingType?: 'fully-finished' | 'semi-finished' | 'core-shell' | 'not-finished';
  view?: string;
  amenities?: string[];
  price: number;
  originalPrice?: number;
  pricePerSqm?: number;
  monthlyRent?: number;
  annualServiceCharge?: number;
  downPayment?: number;
  installmentYears?: number;
  monthlyInstallment?: number;
  featuredImage?: string;
  images?: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  syncSource?: 'manual' | 'property-finder';
  pfReferenceNumber?: string;
  manualOverrides?: string[];
  lastSyncAt?: Timestamp | FieldValue | string;
  automation?: {
    isBranded: boolean;
    isPublishedToPF: boolean;
    isPublishedToFB: boolean;
    whatsappAdGenerated: boolean;
    pfReference?: string;
  };
  ownerType: 'owner' | 'broker' | 'internal';
  ownerContact?: string;
  dupeCheckHash?: string;
  description?: string;
  descriptionAr?: string;
  isFeatured?: boolean;
  publishedAt?: Timestamp;
  archivedAt?: Timestamp | null;
  intelligence?: IntelligenceObject;
}

export interface PortfolioAsset extends Unit {}
export type Property = PortfolioAsset;

export interface Project extends BaseDocument {
  name: string;
  nameAr?: string;
  developerId: string;
  slug?: string;
  location: string;
  city: string;
  governorate?: string;
  coordinates?: { lat: number; lng: number };
  description?: string;
  descriptionAr?: string;
  totalUnits?: number;
  availableUnits?: number;
  launchDate?: Timestamp;
  deliveryDate?: Timestamp;
  completionPercent?: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
  paymentPlan?: string;
  logo?: string;
  heroImage?: string;
  images?: string[];
  masterPlanUrl?: string;
  brochureUrl?: string;
  status: 'pre-launch' | 'launching' | 'under-construction' | 'delivered' | 'resale';
  isFeatured?: boolean;
}

export interface Developer extends BaseDocument {
  name: string;
  nameAr?: string;
  slug?: string;
  description?: string;
  descriptionAr?: string;
  foundedYear?: number;
  headquarters?: string;
  website?: string;
  rating?: number;
  totalProjects?: number;
  tier?: 'premium' | 'standard' | 'emerging';
  logo?: string;
  coverImage?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface MediaAsset extends BaseDocument {
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  downloadUrl: string;
  thumbnailUrl?: string;
  assetType: 'photo' | 'video' | 'floorplan' | 'brochure' | 'document' | 'logo';
  category?: 'exterior' | 'interior' | 'amenity' | 'location' | 'lifestyle';
  unitId?: string;
  projectId?: string;
  developerId?: string;
  altText?: string;
  altTextAr?: string;
  sortOrder?: number;
  isFeatured?: boolean;
  dimensions?: { width: number; height: number };
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
  moderatedAt?: Timestamp;
}

export interface InvestmentStakeholder extends BaseDocument {
  name: string;
  phone: string;
  email?: string;
  nationality?: string;
  stage: PipelineStage;
  source: StakeholderAcquisitionSource;
  assignedTo?: string;
  interestedUnitIds?: string[];
  interestedProjectIds?: string[];
  budget?: number;
  budgetMax?: number;
  preferredPropertyType?: PropertyType;
  preferredLocations?: string[];
  preferredBedrooms?: number;
  timeline?: 'immediate' | '1-3months' | '3-6months' | '6-12months' | '12+months';
  investmentGoal?: string;
  relocating?: boolean;
  preferencedCompounds?: string[];
  notes?: string;
  lastContactAt?: Timestamp;
  nextFollowUpAt?: Timestamp;
  interactionCount?: number;
  wonUnitId?: string;
  wonAmount?: number;
  lostReason?: string;
  closedAt?: Timestamp;
  aiProfiling?: {
    score: number;
    interests: string[];
    topMatches?: Array<{ unitId: string; matchScore: number; matchReason: string }>;
    lastMatchRunAt?: Timestamp;
  };
  interactionHistory?: Array<{
    unitId: string;
    action: 'click' | 'pass' | 'interested';
    timestamp: Timestamp | FieldValue;
    reason?: string;
  }>;
  automation?: {
    botInitiated: boolean;
    scoringCompleted: boolean;
    whatsappFollowupSent: boolean;
    viewingReminderSent: boolean;
    selectionUrlSent?: boolean;
    viewingRewardActive?: boolean;
    lastIncentiveAt?: Timestamp | FieldValue;
    feedbackRequested?: boolean;
    lastFeedbackAt?: Timestamp | FieldValue;
  };
  pfLeadId?: string;
  intelligence?: {
    closedAssetId?: string;
    lastFeedbackComment?: string;
    contractUrl?: string;
    profile?: {
      bedrooms?: number;
      budget?: number;
      location?: string;
      furnishingStatus?: 'furnished' | 'unfurnished' | 'any';
      moveInDate?: string;
      duration?: string;
      nationality?: string;
      familySize?: number;
    };
    memory?: {
      negativeSignals: Array<{
        category: 'price' | 'location' | 'finishing' | 'layout' | 'view';
        description: string;
        vector?: number[];
        importance: number;
      }>;
      positiveSignals: string[];
    };
    objections?: Array<{
      unitId: string;
      reason: string;
      category: string;
      sentiment?: ListingSentiment;
      timestamp: Timestamp | FieldValue;
    }>;
    matrix?: {
      lossAversionSensitivity: number;
      premiumTolerance: number;
    };
    preferences?: {
      likes?: string[];
      dislikes?: string[];
    };
  };
}

export interface Lead extends InvestmentStakeholder {}

export interface Sale extends BaseDocument {
  unitId: string;
  leadId: string;
  agentId: string;
  salePrice: number;
  commissionPercent: number;
  commissionAmount: number;
  closingDate: Timestamp;
  status: 'pending' | 'contracted' | 'completed' | 'cancelled';
  contractNumber?: string;
  notes?: string;
}

export interface InboundAssetSignal extends BaseDocument {
  rawMessage: string;
  sourceGroup?: string;
  sourcePlatform: 'whatsapp' | 'telegram' | 'other';
  senderInfo?: string;
  coordinates?: { lat: number; lng: number };
  extractedData: {
    compound?: string;
    propertyType?: PropertyType;
    bedrooms?: number;
    price?: number;
    currency?: CurrencyCode;
    area?: number;
    finishingType?: string;
    furnishingStatus?: FurnishingCode;
    paymentPlan?: { downpayment: number; installments: number; deliveryDate: string };
    phoneNumber?: string;
    urgencyScore?: number;
    valuationScore?: number;
    sentiment?: ListingSentiment;
    matchingKeywords?: string[];
    features?: SierraFeatureCode[];
    sierraCode?: string;
  };
  intelligence?: IntelligenceObject;
  status: 'new' | 'parsed' | 'validated' | 'duplicate' | 'archived';
  isVerified: boolean;
  duplicateOf?: string;
  portfolioAssetId?: string;
}

export interface BrokerListing extends InboundAssetSignal {}

export interface Voucher extends BaseDocument {
  code: string;
  type: 'discount' | 'commission-bonus' | 'viewing-reward';
  value: number;
  currency: string;
  leadId?: string;
  status: 'active' | 'redeemed' | 'expired';
  expiresAt: Timestamp;
  conditions?: string;
}

export interface Proposal extends BaseDocument {
  leadId: string;
  leadName?: string;
  unitIds: string[];
  units: Array<{
    id: string;
    title: string;
    price: number;
    matchScore: number;
    matchReason: string;
    images?: string[];
    area_name?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    financialAnalysis?: { projectedROI: number; annualYield: number };
  }>;
  strategicSummary?: string;
  strategicSummaryAr?: string;
  status: 'draft' | 'deployed' | 'accepted' | 'rejected';
  deployedAt?: Timestamp;
  expiresAt?: Timestamp;
  viewCount?: number;
  lastViewedAt?: Timestamp;
  shareableUrl?: string;
  financialAnalysis?: {
    projectedROI: number;
    annualYield: number;
    valuationAnalysis: string;
    totalPortfolioCapital?: number;
  };
}

export interface Viewing extends BaseDocument {
  leadId: string;
  unitId: string;
  agentId: string;
  scheduledAt: Timestamp;
  status: 'scheduled' | 'completed' | 'cancelled';
  location: string;
  notes?: string;
  reminderSent: boolean;
}

export interface UserProfile extends BaseDocument {
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'agent';
  pfUsername?: string;
  pfAgentId?: string;
  phoneNumber?: string;
  status: 'active' | 'inactive';
}

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

export const COLLECTIONS = {
  units: 'listings',
  projects: 'projects',
  developers: 'developers',
  mediaAssets: 'mediaAssets',
  stakeholders: 'leads',
  sales: 'sales',
  activities: 'activities',
  users: 'users',
  syncQueue: 'syncQueue',
  syncLog: 'syncLog',
  vouchers: 'vouchers',
  proposals: 'proposals',
  brokerListings: 'broker_listings',
  viewings: 'viewings',
  intelligence: 'intelligence',
  conciergeSelections: 'concierge_selections',
} as const;
