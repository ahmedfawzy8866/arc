"use client";
import React, { useState, useEffect, useId } from 'react';
import { 
  Property, 
  generateUnitCode, 
  generateNormalizedKey, 
  COMPOUND_CODES 
} from '../../lib/firebase/inventory';
import { X, Save, Home, MapPin, DollarSign, Ruler, Images, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PropertyForm.module.css';

interface PropertyFormProps {
  property?: Property;
  onSave: (prop: Partial<Property>) => Promise<void>;
  onClose: () => void;
}

export default function PropertyForm({ property, onSave, onClose }: PropertyFormProps) {
  const formId = useId();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<Partial<Property>>(property || {
    status: 'draft',
    offer_type: 'sale',
    listing_type: 'resale',
    currency: 'EGP',
    furnishing: 'unfurnished',
    bedrooms: 1,
    bathrooms: 1,
    bua_m2: 0,
    price: 0,
    is_public: true,
    is_featured: false,
    stale_flag: false,
    gallery_urls: [],
    compound_name: '',
    compound_code: ''
  });

  const [saving, setSaving] = useState(false);

  // Auto-generate Unit Code
  useEffect(() => {
    const code = generateUnitCode(formData);
    setFormData(prev => ({ ...prev, unit_code: code }));
  }, [formData.compound_name, formData.bedrooms, formData.furnishing, formData.price, formData.currency, formData.offer_type]);

  const handleChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-set compound code
    if (field === 'compound_name') {
      const code = COMPOUND_CODES[value.toLowerCase()] || value.substring(0, 2).toUpperCase();
      setFormData(prev => ({ ...prev, compound_name: value, compound_code: code }));
    }
  };

  const handleSave = async () => {
    if (!formData.title_en || !formData.compound_name || !formData.price) {
      alert("Please fill in main fields (Title, Compound, Price)");
      return;
    }
    
    try {
      setSaving(true);
      const normalizedKey = generateNormalizedKey(formData);
      await onSave({ ...formData, normalized_key: normalizedKey });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 0, label: 'Vital Identity', icon: <Home size={16} /> },
    { id: 1, label: 'Strategic Location', icon: <MapPin size={16} /> },
    { id: 2, label: 'Specifications', icon: <Ruler size={16} /> },
    { id: 3, label: 'Valuation', icon: <DollarSign size={16} /> },
    { id: 4, label: 'Visual Media', icon: <Images size={16} /> },
    { id: 5, label: 'Strategic Flags', icon: <Flag size={16} /> }
  ];

  return (
    <div className={styles.modalOverlay}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={styles.formContainer}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h2>{property ? 'Refine Portfolio Asset' : 'Incorporate New Portfolio Asset'}</h2>
            <div className={styles.unitCode}>IDENTIFIER: {formData.unit_code}</div>
          </div>
          <button 
            onClick={onClose} 
            className={styles.closeButton}
            title="Close Protocol" 
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Sidebar & Content */}
        <div className={styles.mainArea}>
          {/* Tabs Navigation */}
          <div className={styles.sidebar} role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={styles.contentArea}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 0 && (
                  <div className={styles.inputGrid}>
                    <div className={styles.row2}>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-title-en`} className={styles.inputLabel}>Nomenclature (English)</label>
                        <input 
                          id={`${formId}-title-en`}
                          className={styles.inputField}
                          value={formData.title_en || ''} 
                          onChange={e => handleChange('title_en', e.target.value)} 
                          placeholder="e.g. Modern Apartment with Lake View" 
                        />
                      </div>
                      <div className={styles.inputGroup} dir="rtl">
                        <label htmlFor={`${formId}-title-ar`} className={styles.inputLabel}>التسمية (العربية)</label>
                        <input 
                          id={`${formId}-title-ar`}
                          className={`${styles.inputField} ${styles.inputFieldAr}`}
                          value={formData.title_ar || ''} 
                          onChange={e => handleChange('title_ar', e.target.value)} 
                          placeholder="مثلاً: شقة مودرن بفيو بحيرة" 
                        />
                      </div>
                    </div>
                    <div className={styles.row3}>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-offer-type`} className={styles.inputLabel}>Offer Type</label>
                        <select 
                          id={`${formId}-offer-type`}
                          className={styles.selectField}
                          value={formData.offer_type} 
                          onChange={e => handleChange('offer_type', e.target.value)}
                        >
                          <option value="sale">Acquisition (Sale)</option>
                          <option value="rent">Lease (Rent)</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-listing-type`} className={styles.inputLabel}>Asset Classification</label>
                        <select 
                          id={`${formId}-listing-type`}
                          className={styles.selectField}
                          value={formData.listing_type} 
                          onChange={e => handleChange('listing_type', e.target.value)}
                        >
                          <option value="resale">Secondary Market</option>
                          <option value="primary">Primary Market</option>
                          <option value="landlord_direct">Strategic Direct</option>
                          <option value="developer_inventory">Developer Portfolio</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-status`} className={styles.inputLabel}>Market Status</label>
                        <select 
                          id={`${formId}-status`}
                          className={styles.selectField}
                          value={formData.status} 
                          onChange={e => handleChange('status', e.target.value)}
                        >
                          <option value="draft">Pending Verification</option>
                          <option value="available">Market Active</option>
                          <option value="reserved">Under Negotiation</option>
                          <option value="sold">Strategic Exit (Sold)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className={styles.inputGrid}>
                    <div className={styles.row2}>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-compound`} className={styles.inputLabel}>Strategic Development</label>
                        <input 
                          id={`${formId}-compound`}
                          className={styles.inputField}
                          value={formData.compound_name || ''} 
                          onChange={e => handleChange('compound_name', e.target.value)} 
                          placeholder="e.g. Mivida" 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-area`} className={styles.inputLabel}>Geographic Sector</label>
                        <select 
                          id={`${formId}-area`}
                          className={styles.selectField}
                          value={formData.area_slug} 
                          onChange={e => handleChange('area_slug', e.target.value)}
                        >
                          <option value="new_cairo">New Cairo</option>
                          <option value="fifth_settlement">Fifth Settlement</option>
                          <option value="sheikh_zayed">Sheikh Zayed</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor={`${formId}-address`} className={styles.inputLabel}>Precise Location Data</label>
                      <textarea 
                        id={`${formId}-address`}
                        className={styles.textareaField}
                        value={formData.address_text || ''} 
                        onChange={e => handleChange('address_text', e.target.value)} 
                      />
                    </div>
                  </div>
                )}

                {activeTab === 2 && (
                  <div className={styles.inputGrid}>
                    <div className={styles.row3}>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-bedrooms`} className={styles.inputLabel}>Sleeping Quarters</label>
                        <input 
                          id={`${formId}-bedrooms`}
                          type="number" 
                          className={styles.inputField}
                          value={formData.bedrooms || 0} 
                          onChange={e => handleChange('bedrooms', parseInt(e.target.value))} 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-bathrooms`} className={styles.inputLabel}>Restorative Spaces</label>
                        <input 
                          id={`${formId}-bathrooms`}
                          type="number" 
                          className={styles.inputField}
                          value={formData.bathrooms || 0} 
                          onChange={e => handleChange('bathrooms', parseInt(e.target.value))} 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-bua`} className={styles.inputLabel}>Total Area (SQM)</label>
                        <input 
                          id={`${formId}-bua`}
                          type="number" 
                          className={styles.inputField}
                          value={formData.bua_m2 || 0} 
                          onChange={e => handleChange('bua_m2', parseInt(e.target.value))} 
                        />
                      </div>
                    </div>
                    <div className={styles.row2}>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-furnishing`} className={styles.inputLabel}>Furnishing Status</label>
                        <select 
                          id={`${formId}-furnishing`}
                          className={styles.selectField}
                          value={formData.furnishing} 
                          onChange={e => handleChange('furnishing', e.target.value)}
                        >
                          <option value="unfurnished">Unfurnished</option>
                          <option value="semi-furnished">Semi-Furnished</option>
                          <option value="furnished">Fully Furnished</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-finishing`} className={styles.inputLabel}>Finishing Standard</label>
                        <select 
                          id={`${formId}-finishing`}
                          className={styles.selectField}
                          value={formData.finishing} 
                          onChange={e => handleChange('finishing', e.target.value)}
                        >
                          <option value="core">Core & Shell</option>
                          <option value="semi">Semi Finished</option>
                          <option value="fully">Fully Finished</option>
                          <option value="ultra-luxury">Ultra Luxury</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 3 && (
                  <div className={styles.inputGrid}>
                    <div className={styles.row2}>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-price`} className={styles.inputLabel}>Asset Valuation</label>
                        <input 
                          id={`${formId}-price`}
                          type="number" 
                          className={`${styles.inputField} ${styles.priceInput}`}
                          value={formData.price || 0} 
                          onChange={e => handleChange('price', parseFloat(e.target.value))} 
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-currency`} className={styles.inputLabel}>Capital Currency</label>
                        <select 
                          id={`${formId}-currency`}
                          className={styles.selectField}
                          value={formData.currency} 
                          onChange={e => handleChange('currency', e.target.value)}
                        >
                          <option value="EGP">EGP</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.row2}>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-payment-type`} className={styles.inputLabel}>Capital Transfer Mode</label>
                        <select 
                          id={`${formId}-payment-type`}
                          className={styles.selectField}
                          value={formData.payment_type} 
                          onChange={e => handleChange('payment_type', e.target.value)}
                        >
                          <option value="cash">Lump Sum (Cash)</option>
                          <option value="installment">Deferred Structure</option>
                          <option value="both">Hybrid Allocation</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor={`${formId}-installments`} className={styles.inputLabel}>Strategic Horizon (Years)</label>
                        <input 
                          id={`${formId}-installments`}
                          type="number" 
                          className={styles.inputField}
                          value={formData.installment_years || 0} 
                          onChange={e => handleChange('installment_years', parseInt(e.target.value))} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 4 && (
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                      <label htmlFor={`${formId}-cover-url`} className={styles.inputLabel}>Prime Visual Reference (URL)</label>
                      <input 
                        id={`${formId}-cover-url`}
                        className={styles.inputField}
                        value={formData.cover_image_url || ''} 
                        onChange={e => handleChange('cover_image_url', e.target.value)} 
                        placeholder="https://..." 
                      />
                    </div>
                    {formData.cover_image_url && (
                      <div className={styles.previewImage}>
                        <img src={formData.cover_image_url} alt="Cover Preview" />
                      </div>
                    )}
                    <div className={styles.inputGroup}>
                      <label htmlFor={`${formId}-gallery`} className={styles.inputLabel}>Supplementary Portfolio Gallery (CSV URLs)</label>
                      <textarea 
                        id={`${formId}-gallery`}
                        className={`${styles.textareaField} ${styles.galleryTextArea}`}
                        value={formData.gallery_urls?.join(', ') || ''} 
                        onChange={e => handleChange('gallery_urls', e.target.value.split(',').map(s => s.trim()))} 
                      />
                    </div>
                  </div>
                )}

                {activeTab === 5 && (
                  <div className={styles.inputGrid}>
                    <div className={styles.flagCard}>
                      <div className={styles.flagInfo}>
                        <div className={styles.flagTitle}>Featured Portfolio Asset</div>
                        <div className={styles.flagDesc}>Highlight within the elite collection and prioritize in search results</div>
                      </div>
                      <input 
                        id={`${formId}-is-featured`}
                        type="checkbox" 
                        className={styles.checkbox}
                        checked={formData.is_featured} 
                        onChange={e => handleChange('is_featured', e.target.checked)} 
                        aria-label="Mark as Featured"
                      />
                    </div>
                    <div className={styles.flagCard}>
                      <div className={styles.flagInfo}>
                        <div className={styles.flagTitle}>Market Visibility</div>
                        <div className={styles.flagDesc}>Synchronize to public interfaces; if disabled, asset remains in strategic dark mode</div>
                      </div>
                      <input 
                        id={`${formId}-is-public`}
                        type="checkbox" 
                        className={styles.checkbox}
                        checked={formData.is_public} 
                        onChange={e => handleChange('is_public', e.target.checked)} 
                        aria-label="Public Visibility"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button 
            onClick={onClose}
            className={styles.discardBtn}
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className={styles.saveBtn}
          >
            {saving ? 'Synchronizing Pipeline...' : (
              <>
                <Save size={18} color="var(--gold)" />
                Finalize Asset Integration
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

