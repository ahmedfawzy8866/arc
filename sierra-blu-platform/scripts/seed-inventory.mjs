/**
 * SIERRA BLU — INVENTORY SEEDING ENGINE (V13.0 ADMIN)
 * Generates 1,000+ strategic units across high-value New Cairo compounds.
 *
 * Uses Firebase ADMIN SDK for privileged database access.
 * Requires service-account.json in the project root.
 */
import admin from 'firebase-admin';
import fs from 'node:fs';
import path from 'node:path';

// Load Service Account
const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ Error: service-account.json not found in project root.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const COMPOUNDS = [
  { name: "Mivida", location: "Fifth Settlement", lat: 30.015, lng: 31.490 },
  { name: "Mountain View iCity", location: "New Cairo", lat: 30.035, lng: 31.470 },
  { name: "Hyde Park", location: "Fifth Settlement", lat: 30.005, lng: 31.480 },
  { name: "CFC", location: "Ring Road", lat: 30.010, lng: 31.510 },
  { name: "Palm Hills New Cairo", location: "New Cairo", lat: 30.025, lng: 31.460 },
  { name: "Sodic Villette", location: "Fifth Settlement", lat: 30.020, lng: 31.495 },
  { name: "Marakez District 5", location: "Katameya", lat: 29.980, lng: 31.450 },
  { name: "ZED East", location: "New Cairo", lat: 30.012, lng: 31.520 }
];

const PROPERTY_TYPES = ["apartment", "villa", "townhouse", "duplex", "penthouse"];
const FINISHING_TYPES = ["fully-finished", "semi-finished", "core-shell"];

async function seed() {
  console.log("🚀 Initializing Sierra Blu Inventory Seeding (Admin Mode)...");

  // Admin SDK allows larger batches if needed, but we stick to 500 for safety
  const batchLimit = 500;
  let batch = db.batch();
  let count = 0;
  const now = new Date().toISOString();

  for (let i = 0; i < 1000; i++) {
    const compound = COMPOUNDS[Math.floor(Math.random() * COMPOUNDS.length)];
    const type = PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)];
    const finishing = FINISHING_TYPES[Math.floor(Math.random() * FINISHING_TYPES.length)];
    const price = Math.floor(Math.random() * 20000000) + 5000000;
    const area = Math.floor(Math.random() * 400) + 100;
    const bedrooms = Math.floor(Math.random() * 5) + 1;

    const unit = {
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} in ${compound.name}`,
      propertyType: type,
      status: "available",
      compound: compound.name,
      location: compound.location,
      city: "New Cairo",
      coordinates: {
        lat: compound.lat + (Math.random() - 0.5) * 0.01,
        lng: compound.lng + (Math.random() - 0.5) * 0.01,
      },
      area: area,
      bedrooms: bedrooms,
      finishingType: finishing,
      price: price,
      pricePerSqm: Math.floor(price / area),
      createdAt: now,
      updatedAt: now,
      syncSource: "manual",
      intelligence: {
        valuationScore: Math.floor(Math.random() * 100),
        urgencyScore: Math.floor(Math.random() * 100),
        standard: price > 15000000 ? "luxury" : "normal",
      },
    };

    const docRef = db.collection('listings').doc();
    batch.set(docRef, unit);
    count++;

    if (count % batchLimit === 0) {
      await batch.commit();
      console.log(`✅ Seeded ${count} units...`);
      batch = db.batch();
    }
  }

  if (count % batchLimit !== 0) {
    await batch.commit();
  }

  console.log(`🎉 Success! Total units seeded: ${count}`);
}

seed().catch(console.error);
