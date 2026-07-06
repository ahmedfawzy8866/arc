"use client";
import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { logAuditAction } from '../../lib/audit';

interface SyncWizardProps {
  onClose: () => void;
  onSuccess: (count: number) => void;
}

type SyncType = 'portfolio' | 'stakeholders';
type WizardStage = 'CHOOSE_TYPE' | 'CHOOSE_SOURCE' | 'UPLOAD' | 'PORTAL' | 'MAPPING' | 'PREVIEW' | 'SYNCING' | 'COMPLETE';

type ImportValue = string | number | boolean | null | undefined;
type ImportRow = Record<string, ImportValue>;

interface ImportedListing {
  title: string;
  location: string;
  price: string;
  type: string;
  status: 'Available';
  agent: string;
  listedDays: number;
  beds: number;
  baths: number;
  sqm: number;
  area: string;
}

const REQUIRED_FIELDS = [
  { key: 'title', label: 'Property Title' },
  { key: 'location', label: 'Location' },
  { key: 'price', label: 'Financial Valuation' },
  { key: 'type', label: 'Classification' },
] as const;

const STAGES: WizardStage[] = ['UPLOAD', 'MAPPING', 'PREVIEW', 'SYNCING', 'COMPLETE'];
const STEP_LABELS = ['Data Ingest', 'Schema Mapping', 'Integrity Check', 'Syncing'];

const isImportRow = (value: unknown): value is ImportRow =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeRows = (payload: unknown): ImportRow[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isImportRow);
  }

  return isImportRow(payload) ? [payload] : [];
};

const readString = (row: ImportRow, ...keys: string[]) => {
  for (const key of keys) {
    const value = row[key];
    if (value === undefined || value === null) {
      continue;
    }

    const normalized = String(value).trim();
    if (normalized) {
      return normalized;
    }
  }

  return '';
};

const readNumber = (row: ImportRow, ...keys: string[]) => {
  const value = readString(row, ...keys);
  if (!value) {
    return 0;
  }

  const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const safeUUID = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
};

const createListingId = () => `P-${safeUUID().replace(/-/g, '').slice(0, 6).toUpperCase()}`;

const parseCsvRows = (text: string) => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  const pushCell = () => {
    currentRow.push(currentCell.trim());
    currentCell = '';
  };

  const pushRow = () => {
    if (currentRow.some((value) => value.length > 0)) {
      rows.push(currentRow);
    }
    currentRow = [];
  };

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (char === '"') {
      if (inQuotes && text[index + 1] === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      pushCell();
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[index + 1] === '\n') {
        index += 1;
      }
      pushCell();
      pushRow();
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    pushCell();
    pushRow();
  }

  return rows;
};

export default function SyncWizard({ onClose, onSuccess }: SyncWizardProps) {
  const [syncType, setSyncType] = useState<SyncType>('portfolio');
  const [rawData, setRawData] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [mappedData, setMappedData] = useState<any[]>([]);
  const [stage, setStage] = useState<WizardStage>('CHOOSE_TYPE');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let data: ImportRow[] = [];
        if (file.name.endsWith('.json')) {
          data = normalizeRows(JSON.parse(text));
        } else if (file.name.endsWith('.csv')) {
          const rows = parseCsvRows(text);
          if (rows.length < 2) {
            throw new Error('Incompatible format: Schema header missing.');
          }

          const [headers, ...records] = rows;
          data = records.map((record) => {
            return headers.reduce<ImportRow>((acc, header, index) => {
              acc[header] = record[index] ?? '';
              return acc;
            }, {});
          });
        }

        if (data.length === 0) {
          throw new Error('Data payload empty.');
        }

        setRawData(data);
        const initialMap: Record<string, string> = {};
        const sourceKeys = Object.keys(data[0] || {});
        REQUIRED_FIELDS.forEach(f => {
          const match = sourceKeys.find(sk => sk.toLowerCase() === f.key.toLowerCase());
          if (match) initialMap[f.key] = match;
        });
        setMappings(initialMap);
        setStage('MAPPING');
      } catch {
        alert('Data recognition error. Please provide a validated CSV or JSON dataset.');
      }
    };
    reader.readAsText(file);
  };

  const startMapping = () => {
    const processed = rawData.map((item) => {
      const mappedItem: any = {
        title_en: 'Pending identification',
        title_ar: 'قيد التحديد',
        compound_name: 'Pending identification',
        compound_code: 'IMP',
        area_slug: 'unspecified_sector',
        price: 0,
        currency: 'EGP',
        unit_type: 'apartment',
        offer_type: 'sale',
        listing_type: 'primary',
        status: 'available',
        bedrooms: readNumber(item, 'beds', 'Bedrooms', 'Rooms'),
        bathrooms: readNumber(item, 'baths', 'Bathrooms', 'WC'),
        bua_m2: readNumber(item, 'sqm', 'Area', 'Size', 'Footprint'),
        furnishing: 'unfurnished',
        gallery_urls: [],
        is_featured: false,
        is_public: true,
        stale_flag: false,
        created_by: 'Systems Integrator',
        normalized_key: `import_${safeUUID().slice(0, 8)}`,
      };

      REQUIRED_FIELDS.forEach((field) => {
        const val = readString(item, mappings[field.key]) || '';
        if (field.key === 'title') mappedItem.title_en = val || 'Pending identification';
        if (field.key === 'location') mappedItem.compound_name = val || 'Pending identification';
        if (field.key === 'price') mappedItem.price = Number(val.replace(/[^0-9.-]+/g, '')) || 0;
        if (field.key === 'type') mappedItem.unit_type = val.toLowerCase().includes('villa') ? 'villa' : 'apartment';
      });

      return mappedItem;
    });
    setMappedData(processed);
    setStage('PREVIEW');
  };

  const handleSync = async () => {
    setStage('SYNCING');
    try {
      const batch = writeBatch(db);
      const collectionName = syncType === 'portfolio' ? 'listings' : 'leads';
      
      mappedData.forEach(item => {
        const newDocRef = doc(collection(db, collectionName));
        const finalData = syncType === 'portfolio' 
          ? { ...item, id: createListingId(), unit_code: createListingId(), createdAt: serverTimestamp(), created_at: serverTimestamp() }
          : { ...item, createdAt: serverTimestamp() };
          
        batch.set(newDocRef, finalData);
      });
      
      await batch.commit();

      await logAuditAction({
        action: syncType === 'portfolio' ? 'LISTING_SYNC' : 'STAKEHOLDER_SYNC',
        performer: 'Systems Integrator',
        performerId: 'system-sync-wizard',
        targetId: 'multiple-records',
        targetType: syncType === 'portfolio' ? 'listing' : 'stakeholder',
        details: `Synchronized ${mappedData.length} ${syncType} records via internal gateway protocol.`
      });

      setStage('COMPLETE');
      setTimeout(() => onSuccess(mappedData.length), 1500);
    } catch (err) {
      console.error("Integration Failure:", err);
      alert("Synchronization protocol interrupted. Please verify connectivity.");
      setStage('PREVIEW');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-zoom-in max-w-[720px] w-[95%] border border-[var(--gold)]" onClick={e => e.stopPropagation()}>
        <div className="modal-header border-b-0 pb-0">
          <div>
            <h2 className="serif text-[var(--navy)] text-2xl">Strategic Synchronization</h2>
            <p className="text-[12px] opacity-60">Multi-modal enterprise data ingestion engine</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="sync-steps mt-5">
            {STEP_LABELS.map((step, i) => (
              <div 
                key={step} 
                className={`sync-step ${STAGES.indexOf(stage) >= i ? 'active' : ''}`}
              >
                <div className="step-num">{i + 1}</div>
                <div className="step-name">{step}</div>
              </div>
            ))}
          </div>

          <div className="wizard-container min-h-[340px] py-5">
            {(stage === 'CHOOSE_TYPE' || stage === 'CHOOSE_SOURCE') && stage === 'CHOOSE_TYPE' && (
              <div className="choice-grid animate-fade-in grid grid-cols-2 gap-5 py-10">
                <div 
                  className="choice-card glass hover-lift p-8 text-center cursor-pointer border border-[var(--border)] rounded-2xl" 
                  onClick={() => { setSyncType('portfolio'); setStage('CHOOSE_SOURCE'); }}
                >
                  <div className="text-[40px] mb-4">🏰</div>
                  <h3 className="serif text-lg text-[var(--navy)]">Signature Portfolio</h3>
                  <p className="text-[12px] opacity-60">Synchronize high-fidelity listing assets</p>
                </div>
                <div 
                  className="choice-card glass hover-lift gold-border p-8 text-center cursor-pointer border border-[var(--gold)] rounded-2xl bg-[rgba(212,175,55,0.03)]" 
                  onClick={() => { setSyncType('stakeholders'); setStage('CHOOSE_SOURCE'); }}
                >
                  <div className="text-[40px] mb-4">🤝</div>
                  <h3 className="serif text-lg text-[var(--gold)]">Investment Stakeholders</h3>
                  <p className="text-[12px] opacity-60">Ingest prospective capital partners and stakeholders</p>
                </div>
              </div>
            )}

            {stage === 'CHOOSE_SOURCE' && (
              <div className="choice-grid animate-fade-in grid grid-cols-2 gap-5 py-10">
                <div 
                  className="choice-card glass hover-lift p-8 text-center cursor-pointer border border-[var(--border)] rounded-2xl" 
                  onClick={() => setStage('UPLOAD')}
                >
                  <div className="text-[40px] mb-4">📁</div>
                  <h3 className="serif text-lg text-[var(--navy)]">Legacy Ingest</h3>
                  <p className="text-[12px] opacity-60">Synchronize via local JSON or CSV protocols</p>
                </div>
                <div 
                  className="choice-card glass hover-lift gold-border p-8 text-center cursor-pointer border border-[var(--gold)] rounded-2xl bg-[rgba(212,175,55,0.03)]" 
                  onClick={() => setStage('PORTAL')}
                >
                  <div className="text-[40px] mb-4">🌐</div>
                  <h3 className="serif text-lg text-[var(--gold)]">{syncType === 'portfolio' ? 'Property Finder' : 'Stakeholder Gateway'}</h3>
                  <p className="text-[12px] opacity-60">Direct enterprise gateway synchronization</p>
                </div>
                <div className="col-span-2 text-center">
                  <button className="btn-ghost text-[12px]" onClick={() => setStage('CHOOSE_TYPE')}>Back to Specifications</button>
                </div>
              </div>
            )}

            {stage === 'PORTAL' && (
              <div className="portal-sync-zone animate-fade-in text-center py-10 px-5">
                <div className="mb-8">
                  <img src="https://www.propertyfinder.ae/blog/wp-content/uploads/2018/12/Logo_Propertyfinder_red.png" alt="Property Finder" className="h-10 mb-3 grayscale brightness-50" />
                  <p className="text-[13px] opacity-70">Secure enterprise synchronization protocol active</p>
                </div>
                <div className="form-group max-w-[400px] mx-auto">
                  <label className="form-label text-left">Portfolio Reference / Filter Query</label>
                  <input 
                    type="text" 
                    className="form-input mb-6" 
                    placeholder="Enter reference ID or search criteria..." 
                  />
                  <button 
                    className="btn btn-primary w-full p-3.5"
                    onClick={async () => {
                      setStage('SYNCING');
                      try {
                        const action = syncType === 'portfolio' ? 'search-listings' : 'fetch-leads';
                        const res = await fetch(`/api/property-finder?action=${action}`);
                        const result = await res.json();
                        
                        // Handle both 'data' (leads) and 'results' (listings) from normalized API
                        const sourceData = result.data || result.results;

                        if (!sourceData || !Array.isArray(sourceData)) {
                          throw new Error("Invalid portal data structure");
                        }

                        if (syncType === 'portfolio') {
                          const mappedFromPF = sourceData.map((pf: any) => {
                            const pfPrice = pf.price?.value || 0;
                            return {
                              id: pf.reference_number || `PF-${pf.id}`,
                              unit_code: pf.reference_number || `PF-${pf.id}`,
                              title_en: pf.title?.en || 'Untitled Signature Asset',
                              title_ar: pf.title?.ar || pf.title?.en || 'بدون عنوان',
                              description_en: pf.description?.en || '',
                              description_ar: pf.description?.ar || '',
                              compound_name: pf.location?.name || 'Property Finder Location',
                              compound_code: 'PF',
                              area_slug: (pf.location?.name || 'PF').toLowerCase().replace(/\s+/g, '_'),
                              unit_type: pf.type === 'apartment' ? 'apartment' : 'villa',
                              offer_type: pf.offering_type === 'rent' ? 'rent' : 'sale',
                              listing_type: 'primary',
                              status: pf.status === 'published' ? 'available' : 'draft',
                              price: pfPrice,
                              currency: pf.price?.currency || 'AED',
                              price_egp_normalized: pfPrice,
                              bedrooms: pf.bedrooms || 0,
                              bathrooms: pf.bathrooms || 0,
                              bua_m2: pf.size?.unit === 'sqm' ? pf.size.value : Math.round((pf.size?.value || 0) * 0.092903),
                              furnishing: 'unfurnished',
                              gallery_urls: pf.images?.map((img: any) => img.url) || [],
                              cover_image_url: pf.images?.find((img: any) => img.is_main)?.url || pf.images?.[0]?.url || '',
                              is_featured: false,
                              is_public: true,
                              stale_flag: false,
                              created_by: 'Property Finder Gateway',
                              normalized_key: `pf_${pf.id}`,
                            };
                          });
                          setMappedData(mappedFromPF);
                        } else {
                          const mappedLeadsFromPF = sourceData.map((pf: any) => ({
                            name: pf.customer?.name || 'Anonymous Stakeholder',
                            phone: pf.customer?.phone || 'N/A',
                            email: pf.customer?.email || 'N/A',
                            portfolioPreference: pf.listing_reference_number || 'General Interest',
                            capitalAllocation: 'To be determined',
                            strategicIntensity: 'warm',
                            phase: 'acquisition',
                            stage: 'lead',
                            originChannel: 'Property Finder',
                            originalReference: pf.id,
                            pfLeadId: pf.id,
                            assignedPartnerId: pf.agent?.id || pf.user?.id || '', 
                            message: pf.message || '',
                            automation: {
                              botInitiated: false,
                              scoringCompleted: false,
                              whatsappFollowupSent: false
                            }
                          }));
                          setMappedData(mappedLeadsFromPF);
                        }

                        setStage('PREVIEW');
                      } catch (err) {
                        console.error("Portal Ingest Error:", err);
                        alert("Gateway synchronization protocol failed. Verify credentials in environmental vault.");
                        setStage('PORTAL');
                      }
                    }}
                  >
                    Initiate Portal Ingest
                  </button>
                  <button className="btn-ghost mt-4 text-[12px]" onClick={() => setStage('CHOOSE_SOURCE')}>Back to Origins</button>
                </div>
              </div>
            )}

            {stage === 'UPLOAD' && (
              <div className="upload-zone ripple border-2 border-dashed border-[var(--gold)] rounded-xl py-[60px] px-10 text-center cursor-pointer relative bg-[rgba(200,169,110,0.02)]">
                <input 
                  type="file" 
                  accept=".json,.csv" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  title="Upload structured protocol file"
                  aria-label="Upload source file"
                />
                <div className="text-[48px] mb-5 sepia-[0.5]">⚜️</div>
                <h3 className="serif text-[var(--navy)] mb-3">Ingest Dataset</h3>
                <p className="text-[13px] opacity-70 max-w-[400px] mx-auto">
                  Deploy Portfolio Asset exports from professional portals as structured JSON or CSV protocols.
                </p>
                <div className="btn btn-primary mt-6">Select Source File</div>
                <div className="mt-4">
                  <button className="btn-ghost text-[12px]" onClick={() => setStage('CHOOSE_SOURCE')}>Back to Origins</button>
                </div>
              </div>
            )}


            {stage === 'MAPPING' && (
              <div className="mapping-engine animate-fade-in">
                <div className="mb-5 p-4 bg-[var(--surface-2)] rounded-lg border border-[var(--border)] flex justify-between items-center">
                  <div>
                    <strong className="text-[12px] opacity-50 uppercase">Active Dataset:</strong> 
                    <div className="text-sm font-semibold">{fileName}</div>
                  </div>
                  <div className="badge badge-navy">{rawData.length} Entries Detected</div>
                </div>
                <div className="mapping-grid grid gap-4">
                  {REQUIRED_FIELDS.map(field => (
                    <div key={field.key} className="flex items-center justify-between gap-5 p-3 rounded-lg border border-[var(--border)]">
                      <div className="flex-1">
                        <div className="font-bold text-sm text-[var(--navy)]">{field.label}</div>
                        <div className="text-[11px] opacity-50">Target Parameter</div>
                      </div>
                      <div className="source-select flex-[1.5]">
                        <select 
                          className={`form-select w-full border ${mappings[field.key] ? 'border-[var(--gold)]' : 'border-[var(--border)]'}`}
                          value={mappings[field.key] || ''} 
                          onChange={e => setMappings({ ...mappings, [field.key]: e.target.value })}
                          title={`Map ${field.label} to source field`}
                          aria-label={`Select source field for ${field.label}`}
                        >
                          <option value="">-- Connect Source Parameter --</option>
                          {Object.keys(rawData[0] || {}).map(sk => <option key={sk} value={sk}>{sk}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary mt-[30px] w-full p-3.5" onClick={startMapping} disabled={Object.keys(mappings).length < 4}>
                  Validated Data Structure →
                </button>
              </div>
            )}

            {stage === 'PREVIEW' && (
              <div className="sync-preview animate-fade-in">
                <div className="text-[13px] mb-4 flex justify-between items-center">
                   <span className="font-semibold">Verification Phase: {mappedData.length} records staged</span>
                   <button className="btn-ghost btn-sm" onClick={() => setStage('MAPPING')}>Modify Alignment</button>
                </div>
                <div className="table-wrap max-h-[300px] overflow-y-auto border border-[var(--border)] rounded-lg">
                  <table>
                    <thead>
                      <tr>
                        <th>{syncType === 'portfolio' ? 'Reference Title' : 'Stakeholder Identity'}</th>
                        <th>{syncType === 'portfolio' ? 'Valuation' : 'Origin'}</th>
                        <th>{syncType === 'portfolio' ? 'Sector' : 'Contact'}</th>
                        <th>State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappedData.slice(0, 10).map((row, i) => (
                        <tr key={i}>
                          <td className="font-medium">{syncType === 'portfolio' ? row.title_en : row.name}</td>
                          <td className="text-[var(--gold)] font-bold">{syncType === 'portfolio' ? `${row.currency} ${Number(row.price).toLocaleString()}` : row.originChannel}</td>
                          <td>{syncType === 'portfolio' ? row.compound_name : row.phone}</td>
                          <td className="text-center"><span className="text-[var(--success)]">Ready</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {mappedData.length > 10 && <div className="text-center p-3 text-[11px] opacity-50 tracking-[1px]">+ {mappedData.length - 10} ADDITIONAL ASSETS DETECTED</div>}
                <button className="btn btn-gold mt-6 w-full p-3.5" onClick={handleSync}>
                  Execute Global Portfolio Integration
                </button>
              </div>
            )}

            {stage === 'SYNCING' && (
              <div className="text-center py-20 px-5">
                <div className="pulse-shimmer text-[64px] mb-6">🕊️</div>
                <h3 className="serif text-2xl text-[var(--navy)]">Integrating Portfolio Assets</h3>
                <p className="text-sm opacity-60 mt-2">Optimizing data structures and establishing permanent cloud records...</p>
                <div className="sync-progress mt-10 h-[3px] bg-[var(--border)] rounded-[2px] overflow-hidden max-w-[300px] mx-auto">
                    <div className="sync-progress-bar active h-full w-full bg-[var(--gold)]"></div>
                </div>
              </div>
            )}

            {stage === 'COMPLETE' && (
              <div className="text-center py-20 px-5">
                <div className="text-[64px] mb-6">👑</div>
                <h3 className="serif gold-text text-[28px]">Integration Successful</h3>
                <p className="text-sm opacity-60 mt-2">
                  The {syncType === 'portfolio' ? 'Signature Portfolio' : 'Strategic Pipeline'} has been expanded with {mappedData.length} premium records.
                </p>
                <button className="btn btn-primary mt-8 min-w-[160px]" onClick={onClose}>Dashboard Access</button>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer justify-center border-t-0 bg-[rgba(0,0,0,0.02)] p-4">
          <div className="opacity-50 text-[11px] tracking-[1px] font-semibold">SIERRA BLU REALTY OPERATIONAL INTELLIGENCE</div>
        </div>
      </div>

      <style>{`
        .sync-steps { display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 10px; }
        .sync-step { display: flex; flex-direction: column; align-items: center; opacity: 0.3; transition: all 0.4s ease; transform: scale(0.9); }
        .sync-step.active { opacity: 1; color: var(--navy); transform: scale(1); }
        .sync-step.active .step-num { border-color: var(--gold); color: var(--gold); background: var(--navy); }
        .step-num { width: 28px; height: 28px; border: 1px solid currentColor; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; margin-bottom: 8px; font-weight: 700; transition: all 0.3s; }
        .step-name { font-size: 9px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
      `}</style>
    </div>
  );
}
