# 🛠️ SIERRA BLU BACKEND CONFIGURATION PLAN (V1.0)

This document outlines the strategic configuration of the Sierra Blue intelligence backend.

## 1. Environment Synchronization
The backend relies on three core pillars: **Firebase**, **Google AI (Gemini)**, and **Observability (Arize Phoenix)**.

### Action A: Local Secrets Initialization
Update your `.env.local` file based on the updated `.env.example`.
```bash
# Core Keys
GOOGLE_AI_API_KEY=YOUR_KEY_HERE
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_KEY_HERE
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sierra-blu
```

### Action B: Service Account Integration
To allow the **Matching Engine** and **WhatsApp Parser** to write to Firestore without client-side authentication, a Service Account is required.
1. Go to **Firebase Console** > Project Settings > Service Accounts.
2. Generate a new private key (JSON).
3. Copy the JSON content and set it as `FIREBASE_SERVICE_ACCOUNT_JSON` in your environment.

## 2. Automated Backend Audit
I have prepared a verification script to test connectivity to all services.

### Run Connectivity Test
```powershell
node scripts/verify-backend.mjs
```

## 3. Observability Layer (Stage 10 Feedback)
We are integrating **Arize Phoenix** to monitor the "Neural Matching" logic and catch hallucinations in Stage 2 (Parsing).

### Configuration Requirements:
- `ARIZE_SPACE_ID`: From your Arize dashboard.
- `ARIZE_API_KEY`: For trace ingestion.

## 4. Next Steps: Data Seeding
Once connectivity is verified, we will run the `seed-inventory.mjs` (to be created) to populate the **1,000+ unit inventory** mock data for Stage 6/7 testing.

---
> [!IMPORTANT]
> Without the `FIREBASE_SERVICE_ACCOUNT_JSON`, background processing (parsing/matching) will fail with "Missing Credentials".
