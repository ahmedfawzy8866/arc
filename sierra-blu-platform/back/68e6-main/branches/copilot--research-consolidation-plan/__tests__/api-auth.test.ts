/**
 * API auth smoke tests for server-to-server route boundaries.
 * External dependencies are mocked so credentials are not required.
 */

jest.mock('@/lib/services/orchestrator', () => ({
  OrchestratorService: { runPipeline: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('firebase-admin/app', () => ({ initializeApp: jest.fn(), getApps: jest.fn(() => []) }));
jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  Timestamp: { now: jest.fn(() => ({ toDate: () => new Date() })) },
}));
jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn(() => ({ verifyIdToken: jest.fn().mockRejectedValue(new Error('No token')) })),
}));

jest.mock('@/lib/services/WhatsAppParserService', () => ({
  WhatsAppParserService: { parseMessage: jest.fn() },
}));

jest.mock('@/lib/services/sheets-sync', () => ({
  GoogleSheetsSync: { appendRow: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('@/lib/services/coding-algorithm', () => ({
  buildSierraCodeMetadata: jest.fn(() => ({})),
}));

jest.mock('@/lib/server/firebase-admin', () => ({
  adminDb: new Proxy({}, { get: () => jest.fn() }),
  adminAuth: { verifyIdToken: jest.fn().mockRejectedValue(new Error('No token')) },
  isAdminInitialized: false,
}));

jest.mock('googleapis', () => ({
  google: {
    auth: { GoogleAuth: jest.fn() },
    sheets: jest.fn(() => ({
      spreadsheets: {
        values: {
          get: jest.fn(),
          update: jest.fn(),
        },
      },
    })),
  },
}));

const makeRequest = (method: string, path: string, headers: Record<string, string> = {}, body?: unknown) => {
  const request = new Request(`http://localhost:3000${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  return request as unknown as import('next/server').NextRequest;
};

describe('POST /api/orchestrate', () => {
  let POST: (req: import('next/server').NextRequest) => Promise<Response>;

  beforeAll(async () => {
    ({ POST } = await import('@/app/api/orchestrate/route'));
  });

  test('returns 401 when X-SBR-SECRET-KEY is missing', async () => {
    process.env.SBR_SECRET_KEY = 'expected-key';

    const req = makeRequest('POST', '/api/orchestrate', {}, { docId: 'abc', collection: 'listings' });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  test('returns 401 when X-SBR-SECRET-KEY is wrong', async () => {
    process.env.SBR_SECRET_KEY = 'expected-key';

    const req = makeRequest(
      'POST',
      '/api/orchestrate',
      { 'X-SBR-SECRET-KEY': 'wrong-key' },
      { docId: 'abc', collection: 'listings' }
    );
    const res = await POST(req);

    expect(res.status).toBe(401);
  });
});

describe('GET /api/cron/ingest-from-sheets', () => {
  let GET: (req: import('next/server').NextRequest) => Promise<Response>;

  beforeAll(async () => {
    ({ GET } = await import('@/app/api/cron/ingest-from-sheets/route'));
  });

  test('returns 401 when Authorization header is missing', async () => {
    process.env.CRON_SECRET = 'expected-cron-secret';

    const req = makeRequest('GET', '/api/cron/ingest-from-sheets');
    const res = await GET(req);

    expect(res.status).toBe(401);
  });

  test('returns 401 when Authorization header is wrong', async () => {
    process.env.CRON_SECRET = 'expected-cron-secret';

    const req = makeRequest('GET', '/api/cron/ingest-from-sheets', {
      authorization: 'Bearer wrong-secret',
    });
    const res = await GET(req);

    expect(res.status).toBe(401);
  });
});
