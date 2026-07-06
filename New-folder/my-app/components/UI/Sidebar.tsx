"use client";
import React from 'react';
import { useI18n } from '../../lib/I18nContext';
import BrandLogo from './BrandLogo';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Diamond, 
  BarChart3, 
  Group, 
  ShieldCheck, 
  Image as ImageIcon, 
  Sparkles, 
  Wallet, 
  RefreshCcw,
  Zap,
  Wand2,
  Cpu,
  TrendingUp
} from 'lucide-react';

type Screen = 'dashboard' | 'listings' | 'crm' | 'leads' | 'reports' | 'team' | 'clients' | 'protocols' | 'media' | 'experiences' | 'ledger' | 'sync' | 'processing' | 'nexus' | 'intelligence';

interface SidebarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
  userInitials?: string;
  displayName?: string;
}

interface NavItem {
  labelKey: string;
  icon: React.ReactNode;
  id: Screen;
  sectionKey: string;
}

const navItems: NavItem[] = [
  { labelKey: 'dashboard',   icon: <LayoutDashboard size={18} />, id: 'dashboard',   sectionKey: 'main' },
  { labelKey: 'listings',    icon: <Building2 size={18} />, id: 'listings',    sectionKey: 'main' },
  { labelKey: 'flow',        icon: <Zap size={18} />, id: 'leads',       sectionKey: 'main' },
  { labelKey: 'crm',         icon: <Users size={18} />, id: 'crm',         sectionKey: 'main' },
  { labelKey: 'clients',     icon: <Diamond size={18} />, id: 'clients',     sectionKey: 'main' },
  { labelKey: 'reports',     icon: <BarChart3 size={18} />, id: 'reports',      sectionKey: 'insights' },
  { labelKey: 'team',        icon: <Group size={18} />, id: 'team',         sectionKey: 'insights' },
  { labelKey: 'operations',  icon: <ShieldCheck size={18} />, id: 'protocols',    sectionKey: 'operations' },
  { labelKey: 'Media Hub',    icon: <ImageIcon size={18} />, id: 'media',        sectionKey: 'operations' },
  { labelKey: 'ai',          icon: <Sparkles size={18} />, id: 'experiences',  sectionKey: 'operations' },
  { labelKey: 'commissions', icon: <Wallet size={18} />, id: 'ledger',       sectionKey: 'operations' },
  { labelKey: 'sync',        icon: <RefreshCcw size={18} />, id: 'sync',         sectionKey: 'operations' },
  { labelKey: 'processing',  icon: <Wand2 size={18} />,     id: 'processing',   sectionKey: 'operations' },
  { labelKey: 'Intelligence', icon: <TrendingUp size={18} />, id: 'intelligence', sectionKey: 'insights' },
  { labelKey: 'Nexus Hub',    icon: <Cpu size={18} />,        id: 'nexus',        sectionKey: 'operations' },
];

const sectionLabels: Record<string, { en: string; ar: string }> = {
  main:       { en: 'Main', ar: 'الرئيسية' },
  insights:   { en: 'Insights', ar: 'التقارير' },
  operations: { en: 'Operations', ar: 'العمليات' },
};

export default function Sidebar({ 
  activeScreen, 
  onNavigate, 
  userInitials = 'AF', 
  displayName = 'Ahmed Fawzy' 
}: SidebarProps) {
  const { t, locale } = useI18n();
  const sections = [...new Set(navItems.map(i => i.sectionKey))];

  return (
    <aside className="sidebar" style={{ 
      background: 'var(--navy)', 
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '24px', marginBottom: '12px' }}>
        <BrandLogo size="md" />
      </div>

      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        {sections.map(section => (
          <div key={section} style={{ marginBottom: '24px' }}>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 700, 
              color: 'var(--text-secondary)', 
              textTransform: 'uppercase', 
              letterSpacing: '1.5px',
              padding: '0 12px 10px',
              opacity: 0.6
            }}>
              {sectionLabels[section]?.[locale] || section}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.filter(i => i.sectionKey === section).map(item => {
                const isActive = activeScreen === item.id;
                return (
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '10px 12px', 
                      borderRadius: '10px',
                      background: isActive ? 'rgba(200, 169, 110, 0.1)' : 'transparent',
                      border: 'none',
                      color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      position: 'relative',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 500,
                      transition: 'color 0.2s'
                    }}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeNav"
                        style={{ 
                          position: 'absolute', 
                          left: 0, 
                          width: '3px', 
                          height: '20px', 
                          background: 'var(--gold)',
                          borderRadius: '0 4px 4px 0'
                        }}
                      />
                    )}
                    <span style={{ color: isActive ? 'var(--gold)' : 'inherit', opacity: isActive ? 1 : 0.7 }}>
                      {item.icon}
                    </span>
                    <span style={{ flex: 1 }}>
                      {t('nav', item.labelKey)}
                    </span>
                    {isActive && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)' }} />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div style={{ 
        padding: '20px', 
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '10px', 
            background: 'var(--luxury-gradient)', color: 'var(--navy)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px'
          }}>
            {userInitials}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 500, opacity: 0.8 }}>
              {locale === 'ar' ? 'مستشار عقاري' : 'Executive Advisor'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

