# Sierra Blu Intelligence OS — Production Deployment Checklist

This document outlines the final steps and environment configurations required to successfully deploy the Sierra Blu Intelligence OS to Vercel and verify the end-to-end S1–S10 pipeline.

## 1. Vercel Environment Variables

Ensure the following variables are set in your Vercel Project Settings (Production).

### Firebase (Client & Admin)

| Variable | Value/Source |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console > Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g., `sierra-blu.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `sierra-blu` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `sierra-blu.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `941030513456` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:941030513456:web:56209a1495d69f217086f5` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-ZP054BPJ8Q` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | **CRITICAL**: The full JSON from Firebase Admin SDK service account key. |
| `FIREBASE_PROJECT_ID` | Alternative to JSON (extract from service account) |
| `FIREBASE_CLIENT_EMAIL` | Alternative to JSON (extract from service account) |
| `FIREBASE_PRIVATE_KEY` | Alternative to JSON (extract from service account) |

### Property Finder (Atlas Enterprise API)

| Variable | Value |
| --- | --- |
| `PROPERTY_FINDER_API_KEY` | `YHDNf.LadthM6TyLlAOs8fqQu8IpTt65yhzXE9ae` |
| `PROPERTY_FINDER_API_SECRET` | `GBuxCDac4pZ6GEFaTq4crIBNR7YXILon` |
| `PF_WEBHOOK_SECRET` | Create a random 32-character string (used for HMAC) |
| `SYNC_API_KEY` | Create a random string for `properties/sync` auth |

### AI & Communications

| Variable | Value |
| --- | --- |
| `GEMINI_API_KEY` | `AIzaSyCj_1gwVdbmu9qJxrfDBpztlLI4h07WVH8` |
| `TELEGRAM_BOT_TOKEN` | Your Bot Token |
| `TELEGRAM_CHAT_ID` | Your Chat ID |

---

## 2. Integrated Services Verification

### Property Finder Integration

- [x] **TypeScript Types**: Standardized in `lib/property-finder/types.ts`.
- [x] **Pre-Publish Validation**: Logic implemented in `lib/property-finder/validation.ts` (Egypt-specific).
- [x] **Webhook Pipeline**: Robust HMAC verification and `listing.action` rejection handling in `app/api/webhooks/property-finder/route.ts`.
- [x] **Client Refresh**: `PropertyFinderClient` updated to use Atlas V1 schema.

### S1–S10 Intelligence Pipeline

- [x] **S1-S2 (Scribe)**: Handles normalization and automated valuation using Gemini Pro.
- [x] **S3-S5 (Curator)**: Generates premium descriptions and luxury taglines.
- [x] **S6-S8 (Matchmaker)**: Cross-references units with stakeholders (Human-in-the-loop at S8).
- [x] **S9-S10 (Closer)**: Finalizes the transaction state and logs the success.

---

## 3. Post-Deployment Verification Steps

Once the build is live on Vercel:

1. **Health Check**: Visit `/api/vercel-status` to verify build and environment injection.
2. **Webhook Registration**: Use a script or Postman to register your Vercel URL as a webhook in Property Finder Atlas using your API Key/Secret.
3. **Manual Sync**: Trigger a sync via POST to `/api/properties/sync` with your `SYNC_API_KEY`.
4. **Pipeline Test**: Create a "Draft" unit in the Admin Panel and verify that the "Intelligence" toggle starts the S1-S10 orchestration.

---

## 4. Final Git Synchronization

Run the following locally to ensure the latest Property Finder hardening is on GitHub:

```bash
git add .
git commit -m "chore: hardens Property Finder integration and Egypt compliance logic"
git push origin main
```
