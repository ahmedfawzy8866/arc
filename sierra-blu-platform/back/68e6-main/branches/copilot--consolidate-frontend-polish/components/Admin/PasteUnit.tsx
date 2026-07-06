"use client";
import React, { useState } from 'react';
import { parseRawTextToProperty, Property } from '../../lib/firebase/inventory';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clipboard, CheckCircle2 } from 'lucide-react';
import PropertyForm from './PropertyForm';

interface PasteUnitProps {
  onSave: (prop: Partial<Property>) => Promise<void>;
  onClose: () => void;
}

export default function PasteUnit({ onSave, onClose }: PasteUnitProps) {
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<Partial<Property> | null>(null);
  const [step, setStep] = useState<'input' | 'review'>('input');

  const handleParse = () => {
    if (!rawText.trim()) return;
    const data = parseRawTextToProperty(rawText);
    setParsedData(data);
    setStep('review');
  };

  const examples = [
    "Apartment for rent in Mivida - 3 bedrooms - furnished - 85K EGP/month - 200 sqm",
    "فاريا ميفيدا للايجار 3 غرف مفروشة بـ 85 الف جنيه شهريا بمساحة 200 متر",
    "Hyde Park villa for sale - 5 bed - 350 sqm - price 25M EGP - semi furnished"
  ];

  if (step === 'review' && parsedData) {
    return (
      <PropertyForm 
        property={parsedData as Property} 
        onSave={onSave} 
        onClose={() => setStep('input')} 
      />
    );
  }

  return (
    <div className="modal-overlay flex items-center justify-center z-[1000]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="paste-container w-[600px] bg-white rounded-3xl p-8 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 bg-transparent border-none text-slate-400 cursor-pointer" title="Close Modal" aria-label="Close">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-[var(--navy)] text-[var(--gold)]">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="m-0 text-lg font-semibold">Intelligence Hub: Text Import</h2>
            <p className="m-0 text-[13px] text-slate-500">Paste raw property details to auto-parse asset attributes</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-[13px] font-semibold text-slate-600 block mb-2">Raw Intelligence Input</label>
          <div className="relative">
            <textarea 
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Paste WhatsApp listing or property description here..."
              className="w-full h-[240px] p-5 rounded-2xl border border-slate-200 text-[15px] leading-relaxed outline-none resize-none"
            />
            {!rawText && (
              <div className="absolute bottom-5 right-5 text-slate-300">
                <Clipboard size={48} opacity={0.2} />
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[1px] text-slate-400 mb-2">Sample Patterns Supported</p>
          <div className="flex flex-col gap-1">
            {examples.map((ex, i) => (
              <div key={i} onClick={() => setRawText(ex)} className="text-xs text-slate-500 cursor-pointer py-1 px-2 rounded border border-dashed border-slate-200 overflow-hidden text-ellipsis whitespace-nowrap">
                "{ex}"
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleParse}
          disabled={!rawText.trim()}
          className={`w-full p-4 rounded-xl border-none bg-[var(--navy)] text-white font-semibold cursor-pointer flex items-center justify-center gap-2.5 ${rawText.trim() ? 'opacity-100' : 'opacity-50'}`}
        >
          <CheckCircle2 size={18} color="var(--gold)" />
          Parse & Reconstruct Asset
        </button>
      </motion.div>
    </div>
  );
}
