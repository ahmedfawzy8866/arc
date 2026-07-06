import { NextRequest, NextResponse } from 'next/server';
import { syncBatch, getPendingDedupeItems, resolveDedupeItem } from '@/lib/services/sync-engine';
import { pfClient } from '@/lib/property-finder-client';

/**
 * SYNC MANAGEMENT API
 * Handles PF ↔ Firestore sync operations and dedup queue management.
 */

// GET — Retrieve pending dedup queue items
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'pending-reviews':
        const pending = await getPendingDedupeItems();
        return NextResponse.json({ items: pending, count: pending.length });

      default:
        return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[SYNC_ERROR] Sync API GET:', error);
    return NextResponse.json({ error: 'Sync query failed' }, { status: 500 });
  }
}

// POST — Trigger a sync batch or resolve dedup items
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = new URL(request.url).searchParams.get('action');

    switch (action) {
      case 'run-sync': {
        // Fetch latest from Property Finder and sync
        const filters = body.filters || {};
        const pfResult = await pfClient.searchListings(filters);
        const listings = pfResult.data || [];
        const syncResult = await syncBatch(listings as unknown as Record<string, unknown>[]);
        return NextResponse.json(syncResult);
      }

      case 'resolve': {
        const { queueId, resolution, resolvedBy, firestoreDocId } = body;
        if (!queueId || !resolution || !resolvedBy) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        await resolveDedupeItem(queueId, resolution, resolvedBy, firestoreDocId);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Unsupported sync action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[SYNC_ERROR] Sync API POST:', error);
    return NextResponse.json({ error: 'Sync operation failed' }, { status: 500 });
  }
}
