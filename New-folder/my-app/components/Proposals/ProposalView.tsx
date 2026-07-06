"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Proposal, Unit } from '@/lib/models/schema';
import { MapPin, Bed, Bath, Maximize2, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface ProposalViewProps {
  proposal: Proposal;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 50 } 
  }
};

export default function ProposalView({ proposal }: ProposalViewProps) {
  return (
    <div className="proposal-public-view min-h-screen bg-navy text-white selection:bg-gold selection:text-navy">
      {/* Cinematic Background Gradient */}
      <div className="fixed inset-0 bg-radial-gradient from-blue-900/20 via-navy to-navy -z-10" />
      <div className="mouse-glow opacity-30" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 py-16 lg:py-24"
      >
        {/* Header Section */}
        <motion.header variants={itemVariants} className="text-center mb-16">
          <div className="sb-logo-luxury mb-6 mx-auto">SB</div>
          <h1 className="serif text-4xl lg:text-6xl mb-4 tracking-tight">
            Strategic Options Package
          </h1>
          <div className="text-gold uppercase tracking-[0.2em] text-sm lg:text-base mb-8">
            Specially Curated for {proposal.leadName}
          </div>
          <p className="max-w-2xl mx-auto text-silver/80 text-lg leading-relaxed">
            {proposal.strategicSummary || "An exclusive selection of premium assets analyzed for their investment potential and lifestyle alignment."}
          </p>
        </motion.header>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proposal.units.map((unit, index) => (
            <motion.div 
              key={unit.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="glass-card-luxury overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent z-10 opacity-60" />
                <div className="absolute top-4 right-4 z-20">
                  <div className="badge-luxury">
                    <Zap size={12} className="text-gold mr-1" />
                    {unit.matchScore}% Match
                  </div>
                </div>

                {/* Legal Verifier Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="flex items-center space-x-1 bg-green-900/40 backdrop-blur-md px-3 py-1 border border-green-500/30 rounded-full">
                    <ShieldCheck size={12} className="text-green-400" />
                    <span className="text-[10px] uppercase tracking-wider text-green-100 font-medium">Safe-Gate Verified</span>
                  </div>
                </div>
                <div className="w-full h-full bg-blue-900/30 flex items-center justify-center animate-pulse">
                   <Maximize2 size={40} className="text-white/20" />
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="serif text-2xl group-hover:text-gold transition-colors">{unit.title}</h3>
                </div>
                
                <div className="flex items-center text-silver/60 text-sm mb-6">
                  <MapPin size={14} className="mr-1" />
                  <span>Strategic Community Location</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8 py-4 border-y border-white/5">
                   <div className="text-center">
                     <Bed size={16} className="mx-auto mb-2 text-gold/60" />
                     <div className="text-sm font-sans">BR</div>
                   </div>
                   <div className="text-center">
                     <Bath size={16} className="mx-auto mb-2 text-gold/60" />
                     <div className="text-sm font-sans">BA</div>
                   </div>
                   <div className="text-center">
                     <Maximize2 size={16} className="mx-auto mb-2 text-gold/60" />
                     <div className="text-sm font-sans">SQM</div>
                   </div>
                </div>

                {/* Intelligence Layer: Financials */}
                <div className="mb-6 p-4 bg-white/5 border border-white/5 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-silver/40 uppercase tracking-widest">Projected ROI</span>
                    <span className="text-gold text-lg font-medium">+14.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-silver/40 uppercase tracking-widest">Net Annual Yield</span>
                    <span className="text-silver/80 text-sm">6.2%</span>
                  </div>
                </div>

                <div className="mt-auto">
                   <div className="text-2xl gold-text mb-6">Price on Inquiry</div>
                   <button className="btn-luxury-full w-full group">
                     Request Private Tour
                     <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer & Trust Layer */}
        <motion.footer variants={itemVariants} className="mt-24 pt-16 border-t border-white/5 text-center">
          <div className="flex items-center justify-center mb-8 text-silver/40">
            <ShieldCheck size={20} className="mr-2" />
            <span className="uppercase text-xs tracking-widest">Secured by Sierra Blu Intelligence</span>
          </div>
          <div className="serif text-xl mb-4 italic text-silver/60">
            "We do not just find properties; we secure your architectural legacy."
          </div>
          <div className="text-xs text-silver/30 mt-12 pb-8">
            &copy; {new Date().getFullYear()} Sierra Blu Realty. All rights reserved. Selective Private Disclosure.
          </div>
        </motion.footer>
      </motion.div>

      <style jsx>{`
        .bg-navy { background-color: #0A1A3A; }
        .text-navy { color: #0A1A3A; }
        .text-silver { color: #E2E8F0; }
        .text-gold { color: #C9A24A; }
        .gold-text { color: #C9A24A; }
        
        .glass-card-luxury {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
        }

        .badge-luxury {
          background: rgba(10, 26, 58, 0.8);
          backdrop-filter: blur(4px);
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid rgba(201, 162, 74, 0.3);
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          color: white;
        }

        .btn-luxury-full {
          background: none;
          border: 1px solid #C9A24A;
          color: #C9A24A;
          padding: 12px 24px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-luxury-full:hover {
          background: #C9A24A;
          color: #0A1A3A;
        }

        .sb-logo-luxury {
          width: 60px;
          height: 60px;
          border: 1px solid #C9A24A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: #C9A24A;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </div>
  );
}
