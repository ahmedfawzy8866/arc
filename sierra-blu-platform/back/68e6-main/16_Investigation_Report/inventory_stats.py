import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import json

def generate_inventory_report():
    print("Initiating Sierra Blu Institutional Portfolio Intelligence...")
    
    # Initialize Firestore
    # Note: Assumes GOOGLE_APPLICATION_CREDENTIALS is set or using default
    if not firebase_admin._apps:
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)
    
    db = firestore.client()
    
    # FETCH DATA
    units = db.collection('units').get()
    leads = db.collection('leads').get()
    
    stats = {
        "timestamp": datetime.now().isoformat(),
        "total_units": len(units),
        "total_leads": len(leads),
        "financials": {
            "total_value_egp": 0,
            "avg_unit_price": 0,
        },
        "geography": {},
        "compounds": {}
    }
    
    total_price = 0
    for unit in units:
        data = unit.to_dict()
        price = data.get('price_egp_normalized', data.get('price', 0))
        total_price += price
        
        # Geographics
        loc = data.get('area_slug', 'unknown')
        stats['geography'][loc] = stats['geography'].get(loc, 0) + 1
        
        # Compounds
        comp = data.get('compound_name', 'Direct')
        stats['compounds'][comp] = stats['compounds'].get(comp, 0) + 1
        
    if stats['total_units'] > 0:
        stats['financials']['total_value_egp'] = total_price
        stats['financials']['avg_unit_price'] = total_price / stats['total_units']
    
    # FORMAT MARKDOWN REPORT
    report_md = f"""# Sierra Blu Portfolio Intelligence Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 📊 High-Level Metrics
- **Total Injected Inventory:** {stats['total_units']:,} Units
- **Active Pipeline Leads:** {stats['total_leads']:,} Stakeholders
- **Gross Portfolio Value (EGP):** {stats['financials']['total_value_egp']:,.2f}
- **Average Unit Price (EGP):** {stats['financials']['avg_unit_price']:,.2f}

## 🌍 Geographic Distribution
"""
    for loc, count in sorted(stats['geography'].items(), key=lambda x: x[1], reverse=True):
        report_md += f"- **{loc.replace('_', ' ').title()}:** {count} units\n"
        
    report_md += "\n## 🏢 Leading Compounds\n"
    for comp, count in sorted(stats['compounds'].items(), key=lambda x: x[1], reverse=True)[:10]:
        report_md += f"- **{comp}:** {count} units\n"
        
    report_path = os.path.join(os.path.dirname(__file__), "PORTFOLIO_REPORT.md")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_md)
    
    print(f"Report successfully generated at: {report_path}")

if __name__ == "__main__":
    try:
        generate_inventory_report()
    except Exception as e:
        print(f"Fatal alignment error: {e}")
