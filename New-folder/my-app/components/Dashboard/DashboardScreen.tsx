"use client";
import React from 'react';
import { useI18n } from '../../lib/I18nContext';
import KPIGrid from './KPIGrid';
import ActivityList from './ActivityList';
import AIPanel from './AIPanel';
// import { ConnectionSentinel } from './ConnectionSentinel';
import { motion, Variants } from 'framer-motion';
import { Plus, Home, Users, Zap, BarChart3, ChevronRight, Sparkles, Command, ShieldCheck, Target, Layers } from 'lucide-react';

interface DashboardScreenProps {
  greeting: string;
  firstName: string;
  dateString: string;
  onNavigate: (screen: 'dashboard' | 'listings' | 'crm' | 'reports' | 'team') => void;
}

export default function DashboardScreen({ 
  greeting, 
  firstName, 
  dateString, 
  onNavigate 
}: DashboardScreenProps) {
  const { t, locale } = useI18n();

  const greetingAr = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard', 'morning');
    if (hour < 18) return t('dashboard', 'afternoon');
    return t('dashboard', 'evening');
  })();

  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{ padding: '40px' }}
    >
      {/* Minimalist Header */}
      <motion.div variants={itemVariants} style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="serif" style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              {locale === 'ar' ? greetingAr : greeting}, {firstName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5, fontSize: '13px' }}>
              <span>{dateString}</span>
              <span className="text-white/20">•</span>
              <span className="text-emerald-500 font-medium">Platform Synchronized</span>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('listings')}
            style={{ 
              background: 'var(--luxury-gradient)', border: 'none', padding: '14px 28px', 
              borderRadius: '14px', color: 'var(--navy)', fontWeight: 700, fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(200, 169, 110, 0.2)'
            }}
          >
            <Plus size={18} strokeWidth={3} />
            INCORPORATE ASSET
          </motion.button>
        </div>
      </motion.div>

      {/* Primary Metrics Layer */}
      <motion.div variants={itemVariants} style={{ marginBottom: '40px' }}>
        <KPIGrid onNavigate={onNavigate} />
      </motion.div>

      {/* Activity & Intelligence Layer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        <motion.div variants={itemVariants}>
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="serif text-white/90 text-xl tracking-tight">Recent Interactions</h3>
            <button 
              onClick={() => onNavigate('crm')}
              className="text-xs uppercase tracking-widest text-gold/60 hover:text-gold transition-colors"
            >
              View All Leads
            </button>
          </div>
          <ActivityList />
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-6">
          <AIPanel />
          
          <div className="glass-panel-luxury p-6 rounded-2xl border border-white/5 bg-white/2">
            <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-3">System Health</h4>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
              <span className="text-sm text-white/70">Neural Nodes Active</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProtocolItem({ icon, label, onClick, color }: { icon: React.ReactNode, label: string, onClick: () => void, color: string }) {
  return (
    <motion.div 
      whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.03)' }}
      className="protocol-card-refined"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '14px 16px',
        borderRadius: '12px',
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.2s ease',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <span style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)', opacity: 0.9 }}>{label}</span>
      </div>
      <ChevronRight size={16} style={{ opacity: 0.3 }} />
    </motion.div>
  );
}

