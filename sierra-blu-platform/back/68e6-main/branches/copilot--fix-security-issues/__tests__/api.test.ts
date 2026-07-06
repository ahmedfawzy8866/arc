/**
 * API smoke tests — auth boundary checks for key routes.
 * All Firebase/external services are mocked so no real credentials needed.
 */

// Mock firebase-admin before any app code is imported
jest.mock('firebase-admin/app', () => ({ initializeApp: jest.fn(), getApps: jest.fn(() => []) }));
jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  Timestamp: { now: jest.fn(() => ({ toDate: () => new Date() })) },
}));
jest.mock('firebase-admin/auth', () => ({ getAuth: jest.fn(() => ({ verifyIdToken: jest.fn().mockRejectedValue(new Error('No token')) })) }));

// Mock heavy service modules so tests don't need their dependencies
jest.mock('@/lib/services/orchestrator', () => ({ OrchestratorService: { runPipeline: jest.fn().mockResolvedValue(undefined) } }));
jest.mock('@/lib/services/WhatsAppParserService', () => ({ WhatsAppParserService: { parse: jest.fn() } }));
jest.mock('@/lib/services/sheets-sync', () => ({ GoogleSheetsSync: jest.fn() }));
jest.mock('@/lib/services/coding-algorithm', () => ({ buildSierraCodeMetadata: jest.fn(() => ({})) }));
jest.mock('@/lib/server/firebase-admin', () => ({
  adminDb: new Proxy({}, { get: () => jest.fn() }),
  adminAuth: { verifyIdToken: jest.fn().mockRejectedValue(new Error('No token')) },
  isAdminInitialized: false,
}));
jest.mock('googleapis', () => ({ google: { auth: { GoogleAuth: jest.fn() }, sheets: jest.fn(() => ({ spreadsheets: { values: { get: jest.fn(), update: jest.fn() } } })) } }));

import { NextRequest } from 'next/server';
import crypto from 'crypto';

// --------------------------------------------------------------------------
// Helper: build a NextRequest-like object
// --------------------------------------------------------------------------
function makeReq(method: string, url: string, headers: Record<string, string> = {}, body?: unknown): NextRequest {
  const init: RequestInit = {
    method,
    headers: new Headers(headers),
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  return new NextRequest(new Request(`http://localhost:3000${url}`, init));
}

// --------------------------------------------------------------------------
// POST /api/orchestrate — requires X-SBR-SECRET-KEY
// --------------------------------------------------------------------------
describe('POST /api/orchestrate', () => {
  let POST: (req: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    process.env.SBR_SECRET_KEY = 'sierra_blu_route_secret';
    ({ POST } = await import('@/app/api/orchestrate/route'));
  });

  test('returns 401 when X-SBR-SECRET-KEY is missing', async () => {
    const req = makeReq('POST', '/api/orchestrate', {}, { docId: 'abc', collection: 'listings' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  test('returns 401 when X-SBR-SECRET-KEY is wrong', async () => {
    const req = makeReq('POST', '/api/orchestrate', { 'X-SBR-SECRET-KEY': 'wrong-key' }, { docId: 'abc', collection: 'listings' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});

// --------------------------------------------------------------------------
// GET /api/cron/ingest-from-sheets — requires Bearer CRON_SECRET
// --------------------------------------------------------------------------
describe('GET /api/cron/ingest-from-sheets', () => {
  let GET: (req: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    ({ GET } = await import('@/app/api/cron/ingest-from-sheets/route'));
  });

  test('returns 401 when Authorization header is missing', async () => {
    // CRON_SECRET must be set so the route enforces the check
    process.env.CRON_SECRET = 'sierra_blu_dev_secret_2026';
    const req = makeReq('GET', '/api/cron/ingest-from-sheets');
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  test('returns 401 when Bearer token is wrong', async () => {
    process.env.CRON_SECRET = 'sierra_blu_dev_secret_2026';
    const req = makeReq('GET', '/api/cron/ingest-from-sheets', { authorization: 'Bearer wrong-secret' });
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  test('returns 401 when CRON_SECRET is not configured', async () => {
    delete process.env.CRON_SECRET;
    const req = makeReq('GET', '/api/cron/ingest-from-sheets');
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});

// --------------------------------------------------------------------------
// POST /api/admin/deploy — requires Bearer SBR_SECRET_KEY
// --------------------------------------------------------------------------
describe('POST /api/admin/deploy', () => {
  let POST: (req: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    ({ POST } = await import('@/app/api/admin/deploy/route'));
  });

  test('returns 401 when Authorization header is missing', async () => {
    process.env.SBR_SECRET_KEY = 'deploy-secret';
    delete process.env.CRON_SECRET;
    const req = makeReq('POST', '/api/admin/deploy', {}, { type: 'patch' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  test('returns 401 when Authorization header is wrong', async () => {
    process.env.SBR_SECRET_KEY = 'deploy-secret';
    delete process.env.CRON_SECRET;
    const req = makeReq('POST', '/api/admin/deploy', { authorization: 'Bearer wrong-secret' }, { type: 'patch' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  test('returns 401 when SBR_SECRET_KEY is not configured', async () => {
    delete process.env.SBR_SECRET_KEY;
    delete process.env.CRON_SECRET;
    const req = makeReq('POST', '/api/admin/deploy', {}, { type: 'patch' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});

// --------------------------------------------------------------------------
// POST /api/webhooks/property-finder — requires PF webhook signature
// --------------------------------------------------------------------------
describe('POST /api/webhooks/property-finder', () => {
  let POST: (req: NextRequest) => Promise<Response>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    ({ POST } = await import('@/app/api/webhooks/property-finder/route'));
  });

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('returns 500 when PF_WEBHOOK_SECRET is not configured', async () => {
    delete process.env.PF_WEBHOOK_SECRET;
    const req = makeReq('POST', '/api/webhooks/property-finder', {}, { type: 'lead.created', data: { id: 'lead-1' } });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ error: 'Webhook secret is not configured' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('[PF Webhook] Missing PF_WEBHOOK_SECRET configuration');
  });

  test('returns 401 when signature is missing', async () => {
    process.env.PF_WEBHOOK_SECRET = 'pf-secret';
    const req = makeReq('POST', '/api/webhooks/property-finder', {}, { type: 'lead.created', data: { id: 'lead-1' } });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  test('accepts requests with a valid signature', async () => {
    process.env.PF_WEBHOOK_SECRET = 'pf-secret';
    const payload = JSON.stringify({ type: 'unhandled.event', data: { id: 'lead-1' } });
    const signature = crypto.createHmac('sha256', process.env.PF_WEBHOOK_SECRET).update(payload).digest('hex');
    const req = new NextRequest(new Request('http://localhost:3000/api/webhooks/property-finder', {
      method: 'POST',
      headers: new Headers({ 'X-Signature': signature }),
      body: payload,
    }));

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ received: true });
  });
});
