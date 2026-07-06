"use client";
import React from 'react';
import { Property, generateUnitCode } from '../../lib/firebase/inventory';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Ruler, Bed, Bath, Edit3, Globe, Star, Share2, Trash2 } from 'lucide-react';

interface PropertyDrawerProps {
  property: Property | null;
  onClose: () => void;
  onEdit: (prop: Property) => void;
  onDelete: (id: string) => void;
}

export default function PropertyDrawer({ property, onClose, onEdit, onDelete }: PropertyDrawerProps) {
  if (!property) return null;

  const statusColors = {
    available: 'bg-[#22C55E]',
    reserved: 'bg-[#F59E0B]',
    sold: 'bg-[#EF4444]',
    draft: 'bg-[#64748B]',
    archived: 'bg-[#94A3B8]'
  } as Record<string, string>;

  return (
    <AnimatePresence>
      <div 
        className="drawer-overlay fixed inset-0 bg-black/40 z-[1100] backdrop-blur-[4px] flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-[500px] max-w-[100vw] bg-white h-full shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Top Header / Close */}
          <div className="absolute top-6 left-6 z-10">
            <button 
              onClick={onClose}
              className="p-2.5 rounded-full bg-white border-none shadow-md cursor-pointer"
              title="Close Drawer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Hero Image */}
          <div className="h-[300px] bg-[#f0f0f0] relative overflow-hidden">
            {property.cover_image_url ? (
              <img src={property.cover_image_url} alt={property.title_en} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Globe size={64} />
              </div>
            )}
            <div className="absolute bottom-6 left-6 bg-[rgba(10,22,40,0.8)] px-4 py-1.5 rounded-lg text-[var(--gold)] font-mono text-sm tracking-[1px] backdrop-blur-lg">
              {property.unit_code}
            </div>
          </div>

          {/* Details Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-4">
              <div 
                className={`text-white px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-[0.5px] ${statusColors[property.status] || statusColors.draft}`}
              >
                {property.status}
              </div>
              <div className="flex gap-2">
                {property.is_featured && <Star size={18} color="var(--gold)" fill="var(--gold)" />}
                {property.is_public ? <Globe size={18} color="#22C55E" /> : <X size={18} color="#EF4444" />}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-[var(--navy)] mb-2">{property.title_en}</h1>
            <h2 dir="rtl" className="text-xl font-semibold text-slate-600 mb-6 font-[Cairo]">{property.title_ar}</h2>

            {/* Price section */}
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 flex items-baseline gap-2">
              <span className="text-[32px] font-bold text-[var(--navy)]">{property.price.toLocaleString()}</span>
              <span className="text-base font-semibold text-[var(--gold)]">{property.currency}</span>
              <span className="text-sm text-slate-400 ml-auto">
                {property.offer_type === 'sale' ? 'Total Value' : 'Per Month'}
              </span>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="spec-card">
                <Bed size={20} color="var(--gold)" />
                <div className="spec-val">{property.bedrooms}</div>
                <div className="spec-lab">Bedrooms</div>
              </div>
              <div className="spec-card">
                <Bath size={20} color="var(--gold)" />
                <div className="spec-val">{property.bathrooms}</div>
                <div className="spec-lab">Bathrooms</div>
              </div>
              <div className="spec-card">
                <Ruler size={20} color="var(--gold)" />
                <div className="spec-val">{property.bua_m2}</div>
                <div className="spec-lab">BUA sqm</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 mb-8">
              <MapPin size={18} color="var(--gold)" />
              <span className="font-semibold text-[var(--navy)]">{property.compound_name}</span>
              <span>•</span>
              <span>{property.area_slug.replace('_', ' ').toUpperCase()}</span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-[1px] text-slate-400 mb-3">Asset Description</h3>
              <p className="text-slate-600 leading-relaxed text-[15px] mb-4">{property.description_en || 'No English description provided.'}</p>
              <p dir="rtl" className="text-slate-600 leading-relaxed text-[15px] font-[Cairo]">{property.description_ar || 'لا يوجد وصف متاح.'}</p>
            </div>

            {/* Gallery */}
            {property.gallery_urls && property.gallery_urls.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-[1px] text-slate-400 mb-3">Visual Portfolio</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.gallery_urls.slice(0, 4).map((url, i) => (
                    <img key={i} src={url} alt="Gallery" className="w-full h-[100px] object-cover rounded-lg" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="p-6 border-t border-slate-200 bg-white flex gap-3">
            <button 
              onClick={() => onEdit(property)}
              className="flex-1 p-3 rounded-xl border border-[var(--gold)] bg-white text-[var(--navy)] font-semibold cursor-pointer flex items-center justify-center gap-2"
            >
              <Edit3 size={18} />
              Modify
            </button>
            <button 
              onClick={() => onDelete(property.id!)}
              className="p-3 rounded-xl border-none bg-red-50 text-red-500 cursor-pointer"
              title="Delete Asset"
              aria-label="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .spec-card {
          padding: 16px;
          background: #F8FAFC;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .spec-val {
          font-weight: 700;
          color: var(--navy);
          font-size: 18px;
        }
        .spec-lab {
          font-size: 11px;
          color: #94A3B8;
          text-transform: uppercase;
        }
      `}</style>
    </AnimatePresence>
  );
}
