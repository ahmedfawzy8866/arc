import pandas as pd
import os
import sys
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

# Add local path for Gravity Memory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../11_Core_Intelligence')))
try:
    from memory.gravity_core import GravityMemory
except ImportError:
    print("⚠️ GravityMemory import failed. Continuing without local memory vault.")
    GravityMemory = None

import google.generativeai as genai

# ---------------------------------------------------------
# 1. CONFIGURATION
# ---------------------------------------------------------
EXCEL_PATH = r'C:\Users\sierr\Downloads\3-9-2026 last.xlsx'
SERVICE_ACCOUNT_PATH = 'f:/Sierra_Blu_Master/my-app/config/service_account.json' 
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "") # From environment

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Target Firestore collection
COLLECTION_NAME = 'properties'

# ---------------------------------------------------------
# 2. INITIALIZATION
# ---------------------------------------------------------

def init_firebase():
    """Initializes Firebase Admin SDK."""
    if not os.path.exists(SERVICE_ACCOUNT_PATH):
        print(f"❌ Error: Service account key not found at {SERVICE_ACCOUNT_PATH}")
        print("Please place your 'service_account.json' in a 'config' folder or update SERVICE_ACCOUNT_PATH.")
        return None
    
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)
    return firestore.client()

# ---------------------------------------------------------
# 3. MAPPING LOGIC (V12.0)
# ---------------------------------------------------------

def map_row_to_property(row):
    """
    Maps 22-column Excel row to SIERRA BLU Property Schema.
    """
    # Heuristics for enums
    unit_type = str(row.get('Property Tybe', 'apartment')).lower().strip()
    if 'villa' in unit_type: ut = 'villa'
    elif 'town' in unit_type: ut = 'townhouse'
    elif 'pent' in unit_type: ut = 'penthouse'
    else: ut = 'apartment'

    # AI-Powered Comment Parsing
    comment = str(row.get('Comment 2', ''))
    features = []
    if len(comment) > 10:
        try:
            prompt = f"Extract real estate features as a comma-separated list from this Arabic/English comment: '{comment}'. Return only the list."
            response = model.generate_content(prompt)
            features = [f.strip() for f in response.text.split(',')]
        except:
            pass

    furnishing = 'unfurnished'
    cond = str(row.get('condition', '')).lower()
    if 'furnish' in cond or 'مفروش' in cond:
        furnishing = 'furnished'
    elif 'semi' in cond or 'نص' in cond:
        furnishing = 'semi-furnished'

    # Normalize Prices
    try:
        raw_price = float(str(row.get('Unit Price', 0)).replace(',', ''))
    except:
        raw_price = 0

    # Build Title
    beds = row.get('bedrooms', '0')
    location = row.get('Location', 'Unknown')
    title_en = f"{beds}BR {ut.title()} in {location}"
    
    # Extract Code
    code = str(row.get('Code', '')).strip()
    
    # Normalized Key (for dedup)
    compound_norm = str(location).lower().replace(' ', '')
    price_bucket = int(raw_price // 500000) if raw_price > 0 else 0
    norm_key = f"{compound_norm}_b{beds}_p{price_bucket}_f{furnishing[0]}"

    return {
        "unit_code": code,
        "title_en": title_en,
        "title_ar": str(row.get('Name', '')), # Placeholder for Arabic name if available
        "compound_name": location,
        "bedrooms": int(beds) if str(beds).isdigit() else 0,
        "unit_type": ut,
        "furnishing": furnishing,
        "price": raw_price,
        "price_egp_normalized": raw_price,
        "status": "available" if str(row.get('Availablty', '')).lower() == 'available' else 'draft',
        "offer_type": "rent" if str(row.get('Type', '')).lower() == 'rent' else 'sale',
        "source": "excel_ingestion_group3",
        "normalized_key": norm_key,
        "features": features,
        "internal_notes": f"AI Insight: {', '.join(features)} | Raw: {comment}",
        "created_at": firestore.SERVER_TIMESTAMP,
        "updated_at": firestore.SERVER_TIMESTAMP,
        "is_public": False,
        "is_featured": False,
        "stale_flag": False,
        "gallery_urls": []
    }

# ---------------------------------------------------------
# 4. EXECUTION
# ---------------------------------------------------------

def main():
    print(f"🚀 Starting Ingestion for Group 3: {EXCEL_PATH}")
    
    # Load Data
    try:
        df = pd.read_excel(EXCEL_PATH)
        print(f"📊 Loaded {len(df)} rows.")
    except Exception as e:
        print(f"❌ Failed to load Excel: {e}")
        return

    # Initialize Firebase
    db = init_firebase()
    if not db:
        print("⚠️ Proceeding in DRY RUN mode (no database connection).")
    
    # Initialize Memory
    gm = None
    if GravityMemory:
        gm = GravityMemory(vault_path="../11_Core_Intelligence/memory/vault.json")

    processed_count = 0
    for _, row in df.iterrows():
        prop_data = map_row_to_property(row)
        
        # Firestore Push
        if db:
            try:
                # Check for duplicate
                docs = db.collection(COLLECTION_NAME).where('normalized_key', '==', prop_data['normalized_key']).limit(1).get()
                if len(docs) > 0:
                    print(f"⏩ Skipping existing unit: {prop_data['unit_code']}")
                    continue
                
                db.collection(COLLECTION_NAME).add(prop_data)
                print(f"✅ Ingested: {prop_data['unit_code']}")
                processed_count += 1
            except Exception as e:
                print(f"❌ Firestore Error: {e}")
        else:
            # Dry run output
            if processed_count % 50 == 0:
                print(f"📝 [DRY RUN] At unit {processed_count}/{len(df)}: {prop_data['unit_code']} ({prop_data['title_en']})")
                if prop_data['features']:
                    print(f"   ✨ AI Features: {', '.join(prop_data['features'])}")
            processed_count += 1

        # Memory Update
        if gm:
            gm.ingest_fact("compounds", prop_data['compound_name'], {
                "code": prop_data['unit_code'],
                "price": prop_data['price'],
                "type": prop_data['unit_type']
            }, weight=2)

    print(f"\n✨ Ingestion Task Finished.")
    print(f"📈 Total units processed: {processed_count}")

if __name__ == "__main__":
    main()
