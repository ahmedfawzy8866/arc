"use client";
import React, { useState } from 'react';
import { useProperties, usePropertyStats } from '../../hooks/useProperties';
import { 
  Property, 
  addProperty, 
  updateProperty, 
  deleteProperty, 
  PropertyStatus, 
  OfferType 
} from '../../lib/firebase/inventory';
import { 
  Plus, 
  MapPin, 
  DollarSign,
  Search, 
  Filter, 
  Download, 
  Import, 
  MoreHorizontal, 
  Star, 
  Globe, 
  Clock, 
  LayoutGrid, 
  List,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyForm from './PropertyForm';
import PropertyDrawer from './PropertyDrawer';
import PasteUnit from './PasteUnit';
import toast from 'react-hot-toast';

export default function PortfolioAssets() {
  const [filters, setFilters] = useState({ 
    search: '', 
    status: '' as PropertyStatus | '', 
    offer_type: '' as OfferType | '' 
  });
  
  const { properties, loading, refetch } = useProperties({
    status: filters.status || undefined,
    offer_type: filters.offer_type || undefined
  });

  const { stats, loading: statsLoading } = usePropertyStats();

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPasteOpen, setIsPasteOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(undefined);

  // Filtered properties (local search)
  const filteredProperties = properties.filter(p => {
    const s = filters.search.toLowerCase();
    return (
      p.title_en.toLowerCase().includes(s) || 
      p.title_ar.toLowerCase().includes(s) || 
      p.unit_code.toLowerCase().includes(s) ||
      p.compound_name.toLowerCase().includes(s)
    );
  });

  const handleCreate = async (data: Partial<Property>) => {
    try {
      await addProperty(data as any);
      toast.success("Asset successfully incorporated into portfolio.");
      setIsFormOpen(false);
      setIsPasteOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to synchronize asset data.");
    }
  };

  const handleUpdate = async (data: Partial<Property>) => {
    if (!editingProperty?.id) return;
    try {
      await updateProperty(editingProperty.id, data);
      toast.success("Asset intelligence updated.");
      setIsFormOpen(false);
      setEditingProperty(undefined);
      refetch();
    } catch (err) {
      toast.error("Update synchronization failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This action will permanently remove the asset from the strategic inventory.")) return;
    try {
      await deleteProperty(id);
      toast.success("Asset removed from portfolio.");
      setSelectedProperty(null);
      refetch();
    } catch (err) {
      toast.error("Asset termination failed.");
    }
  };

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case 'available': return '#22C55E';
      case 'reserved': return '#F59E0B';
      case 'sold': return '#EF4444';
      default: return '#64748B';
    }
  };

  return (
    <div className="portfolio-container" style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>Portfolio Assets</h1>
          <p style={{ color: '#64748B', fontSize: '16px' }}>Executive command center for luxury inventory management and strategic asset deployment.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setIsPasteOpen(true)}
            style={{ 
              padding: '12px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', 
              background: 'white', color: 'var(--navy)', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <Import size={18} color="var(--gold)" />
            Import Intelligence
          </button>
          <button 
            onClick={() => {
              setEditingProperty(undefined);
              setIsFormOpen(true);
            }}
            style={{ 
              padding: '12px 24px', borderRadius: '12px', border: 'none', 
              background: 'var(--navy)', color: 'white', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(10, 22, 40, 0.2)'
            }}
          >
            <Plus size={20} color="var(--gold)" />
            Incorporate Asset
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F0F9FF', color: '#0EA5E9' }}><Package size={20} /></div>
          <div>
            <div className="stat-lab">Total Assets</div>
            <div className="stat-val">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F0FDF4', color: '#22C55E' }}><CheckCircle2 size={20} /></div>
          <div>
            <div className="stat-lab">Currently Available</div>
            <div className="stat-val">{stats.available}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FFFBEB', color: '#F59E0B' }}><Star size={20} /></div>
          <div>
            <div className="stat-lab">Featured Portfolio</div>
            <div className="stat-val">{stats.featured}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FFF7ED', color: '#F97316' }}><Clock size={20} /></div>
          <div>
            <div className="stat-lab">Stale Intelligence</div>
            <div className="stat-val">{stats.stale}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ 
        background: 'white', padding: '16px 24px', borderRadius: '20px', 
        border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', 
        justifyContent: 'space-between', alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
              placeholder="Search assets, codes, or compounds..."
              style={{ padding: '10px 12px 10px 40px', width: '100%', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }}
            />
          </div>
          <select 
            value={filters.status} 
            onChange={e => setFilters({...filters, status: e.target.value as any})}
            style={{ padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', color: '#475569' }}
          >
            <option value="">All Statuses</option>
            <option value="available">Available Assets</option>
            <option value="reserved">Reserved Units</option>
            <option value="sold">Closed Sales</option>
          </select>
          <select 
            value={filters.offer_type} 
            onChange={e => setFilters({...filters, offer_type: e.target.value as any})}
            style={{ padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', color: '#475569' }}
          >
            <option value="">All Offers</option>
            <option value="sale">Resale/Primary</option>
            <option value="rent">Rental Inventory</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="icon-btn active"><List size={18} /></button>
          <button className="icon-btn"><LayoutGrid size={18} /></button>
        </div>
      </div>

      {/* Asset Table */}
      <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Asset Code</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Primary Descriptor</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Compound</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Valuation</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Freshness</th>
              <th style={{ textAlign: 'right', padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>Incurring intelligence data...</td></tr>
            ) : filteredProperties.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No assets matched your search parameters.</td></tr>
            ) : filteredProperties.map(prop => (
              <tr 
                key={prop.id} 
                className="asset-row" 
                onClick={() => setSelectedProperty(prop)}
                style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ 
                    fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, padding: '4px 8px',
                    background: '#F1F5F9', borderRadius: '4px', display: 'inline-block',
                    color: prop.is_featured ? 'var(--gold)' : 'var(--navy)'
                  }}>
                    {prop.unit_code}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '14px' }}>{prop.title_en}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{prop.bedrooms} BR • {prop.furnishing}</div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--gold)" />
                    {prop.compound_name}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '14px' }}>{prop.price.toLocaleString()} {prop.currency}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>{prop.offer_type}</div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px', 
                    fontSize: '11px', fontWeight: 700, color: getStatusColor(prop.status),
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(prop.status) }} />
                    {prop.status}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>
                      {prop.freshness_date?.toDate ? prop.freshness_date.toDate().toLocaleDateString() : 'Recent'}
                    </span>
                    {prop.stale_flag && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F97316' }} />}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    {prop.is_featured && <Star size={16} fill="var(--gold)" color="var(--gold)" />}
                    {prop.is_public && <Globe size={16} color="#22C55E" />}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProperty(prop);
                        setIsFormOpen(true);
                      }}
                      className="row-action-btn"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals & Drawings */}
      <AnimatePresence>
        {isFormOpen && (
          <PropertyForm 
            property={editingProperty}
            onSave={editingProperty ? handleUpdate : handleCreate}
            onClose={() => setIsFormOpen(false)}
          />
        )}
        
        {isPasteOpen && (
          <PasteUnit 
            onSave={handleCreate}
            onClose={() => setIsPasteOpen(false)}
          />
        )}

        {selectedProperty && (
          <PropertyDrawer 
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            onEdit={(p) => {
              setSelectedProperty(null);
              setEditingProperty(p);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 24px;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-lab {
          font-size: 13px;
          color: #64748B;
          font-weight: 500;
        }
        .stat-val {
          font-size: 24px;
          font-weight: 800;
          color: var(--navy);
        }
        .icon-btn {
          padding: 10px;
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
        }
        .icon-btn.active {
          background: var(--navy);
          color: var(--gold);
          border-color: var(--navy);
        }
        .asset-row:hover {
          background: #F8FAFC !important;
        }
        .row-action-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
        }
        .row-action-btn:hover {
          background: #F1F5F9;
          color: var(--navy);
        }
      `}</style>
    </div>
  );
}
