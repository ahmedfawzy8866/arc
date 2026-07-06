/**
 * PROPERTY FINDER INTEGRATION SERVICE
 * Synchronizes leads and listings between Sierra Blu and Property Finder Enterprise.
 */

import { pfClient, PFListing, PFStakeholderProtocol } from '../property-finder-client';
import { db } from '../firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Unit, Lead, COLLECTIONS, UserProfile } from '../models/schema';

interface PFStakeholderRecord extends PFStakeholderProtocol {
  agent_id?: string;
}

interface AssignmentResolution {
  userId?: string;
  displayName?: string;
}

export interface PFLeadSyncSummary {
  created: number;
  updated: number;
  skipped: number;
}

export class PFIntegrationService {
  /**
   * Synchronize incoming leads from Property Finder into the local CRM.
   */
  static async syncIncomingLeads(): Promise<PFLeadSyncSummary> {
    const summary: PFLeadSyncSummary = { created: 0, updated: 0, skipped: 0 };
    const pfLeads = await pfClient.fetchInvestmentStakeholderRegistry();

    for (const lead of pfLeads.data as PFStakeholderRecord[]) {
      const assignment = await this.resolveAssignment(lead);
      const existingQuery = query(collection(db, COLLECTIONS.leads), where('pfLeadId', '==', lead.id));
      const existingSnapshot = await getDocs(existingQuery);

      const payload: Partial<Lead> & Record<string, unknown> = {
        name: lead.customer.name || 'Property Finder Lead',
        phone: lead.customer.phone || '',
        email: lead.customer.email || '',
        source: 'property-finder',
        stage: 'lead',
        phase: this.mapPFStatusToPhase(lead.status),
        originChannel: 'Property Finder',
        pfLeadId: lead.id,
        pfListingReferenceNumber: lead.listing_reference_number || '',
        notes: lead.message || '',
        assignedTo: assignment.userId || undefined,
        assignedPartnerId: assignment.userId || undefined,
        assignedPartnerName: assignment.displayName || '',
        automation: {
          botInitiated: false,
          scoringCompleted: false,
          whatsappFollowupSent: false,
          viewingReminderSent: false,
        },
        updatedAt: serverTimestamp(),
      };

      if (existingSnapshot.empty) {
        if (!payload.phone) {
          summary.skipped += 1;
          continue;
        }

        await addDoc(collection(db, COLLECTIONS.leads), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        summary.created += 1;
        continue;
      }

      await updateDoc(existingSnapshot.docs[0].ref, payload);
      summary.updated += 1;
    }

    return summary;
  }

  /**
   * Push a Sierra Blu unit to Property Finder.
   */
  static async publishListing(unitId: string) {
    const unitSnap = await getDoc(doc(db, COLLECTIONS.units, unitId));
    if (!unitSnap.exists()) {
      throw new Error('Unit not found');
    }

    const unit = { id: unitSnap.id, ...unitSnap.data() } as Unit;
    const locationId = await this.resolveLocationId(unit);

    const pfListing: PFListing = {
      reference_number: unit.referenceNumber || unit.code || `SB-${unitId.substring(0, 6).toUpperCase()}`,
      title: {
        en: unit.title,
        ar: unit.titleAr,
      },
      description: {
        en: unit.description || unit.title,
        ar: unit.descriptionAr || unit.titleAr,
      },
      price: {
        value: unit.price,
        currency: 'EGP',
      },
      type: this.mapPropertyType(unit.propertyType),
      offering_type: unit.status === 'rented' ? 'rent' : 'sale',
      status: 'published',
      bedrooms: unit.bedrooms || 0,
      bathrooms: unit.bathrooms || 0,
      size: {
        value: Math.max(unit.area || 0, 1),
        unit: 'sqm',
      },
      location: {
        id: locationId,
        name: unit.location || unit.compound || unit.city,
      },
      images: (unit.images || []).map((url, index) => ({
        url,
        is_main: index === 0,
      })),
    };

    const result = await pfClient.createListing(pfListing);

    await updateDoc(doc(db, COLLECTIONS.units, unitId), {
      automation: {
        ...(unit.automation || {
          isBranded: false,
          isPublishedToPF: false,
          isPublishedToFB: false,
          whatsappAdGenerated: false,
        }),
        isPublishedToPF: true,
        pfReference: result.reference_number,
      },
      pfReferenceNumber: result.reference_number,
      lastSyncAt: serverTimestamp(),
      syncSource: 'property-finder',
    });

    return result;
  }

  private static async resolveAssignment(lead: PFStakeholderRecord): Promise<AssignmentResolution> {
    if (lead.agent_id) {
      const userQuery = query(collection(db, COLLECTIONS.users), where('pfAgentId', '==', lead.agent_id));
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        const match = { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() } as UserProfile;
        return { userId: match.id, displayName: match.displayName };
      }
    }

    if (lead.customer.email) {
      const emailQuery = query(collection(db, COLLECTIONS.users), where('email', '==', lead.customer.email));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        const match = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() } as UserProfile;
        return { userId: match.id, displayName: match.displayName };
      }
    }

    return {};
  }

  private static async resolveLocationId(unit: Unit): Promise<number> {
    const lookup = unit.compound || unit.location || unit.city;
    if (!lookup) {
      return 1;
    }

    try {
      const result = await pfClient.searchLocations(lookup);
      return result.data[0]?.id || 1;
    } catch {
      return 1;
    }
  }

  private static mapPFStatusToPhase(status: PFStakeholderProtocol['status']) {
    switch (status) {
      case 'contacted':
        return 'consultation';
      case 'qualified':
        return 'inspection';
      case 'won':
        return 'settlement';
      case 'lost':
        return 'structuring';
      case 'new':
      default:
        return 'acquisition';
    }
  }

  private static mapPropertyType(type: string): PFListing['type'] {
    const mapping: Partial<Record<string, PFListing['type']>> = {
      apartment: 'apartment',
      villa: 'villa',
      townhouse: 'townhouse',
      penthouse: 'penthouse',
      duplex: 'duplex',
      chalet: 'villa',
      commercial: 'commercial',
      land: 'land',
    };

    return mapping[type.toLowerCase()] || 'apartment';
  }
}
