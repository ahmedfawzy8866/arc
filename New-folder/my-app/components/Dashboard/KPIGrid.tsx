"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useI18n } from '../../lib/I18nContext';
import { formatCompactEGP, calcROI, calcGrossYield } from '../../lib/financial-engine';
import { motion } from 'framer-motion';
import { Home, Users, BarChart3, ShieldCheck, TrendingUp, Activity, Target } from 'lucide-react';

interface KPIStats {
  listings: number;
  stakeholders: number;
  partners: number;
  totalVolume: number;
  hotLeads: number;
  avgROI: number;
  avgYield: number;
  avgPricePerSqm: number;
}

interface KPIGridProps {
  onNavigate: (screen: 'dashboard' | 'listings' | 'crm' | 'reports' | 'team') => void;
}

export default function KPIGrid({ onNavigate }: KPIGridProps) {
  const { locale } = useI18n();
  const [stats, setStats] = useState<KPIStats>({
    listings: 0,
    stakeholders: 0,
    partners: 0,
    totalVolume: 0,
    hotLeads: 0,
    avgROI: 0,
    avgYield: 0,
    avgPricePerSqm: 0,
  });

  useEffect(() => {
    const unsubListings = onSnapshot(collection(db, 'listings'), (snapshot) => {
      const docs = snapshot.docs.map(d => d.data());
      
      let totalROI = 0, totalYield = 0, totalPricePerSqm = 0, roiCount = 0, yieldCount = 0, priceCount = 0;
      docs.forEach(unit => {
        if (unit.purchasePrice && unit.currentValue) {
          const roi = calcROI({
            purchasePrice: unit.purchasePrice,
            currentMarketValue: unit.currentValue,
            monthlyRent: unit.monthlyRent || 0,
          });
          totalROI += roi;
          roiCount++;
        }
        if (unit.annualRent && unit.purchasePrice) {
          const y = calcGrossYield(unit.annualRent, unit.purchasePrice);
          totalYield += y;
          yieldCount++;
        }
        if (unit.price && unit.area) {
          totalPricePerSqm += unit.price / unit.area;
          priceCount++;
        }
      });
      
      setStats(s => ({
        ...s,
        listings: snapshot.size,
        avgROI: roiCount > 0 ? totalROI / roiCount : 0,
        avgYield: yieldCount > 0 ? totalYield / yieldCount : 0,
        avgPricePerSqm: priceCount > 0 ? totalPricePerSqm / priceCount : 0,
      }));
    });

    const unsubLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      const hotCount = snapshot.docs.filter(
        d => d.data().strategicIntensity === 'hot' || d.data().priority === 'hot'
      ).length;
      setStats(s => ({
        ...s,
        stakeholders: snapshot.size,
        hotLeads: hotCount,
      }));
    });

    const unsubPartners = onSnapshot(collection(db, 'partners'), (snapshot) => {
      setStats(s => ({ ...s, partners: snapshot.size }));
    });

    const unsubSales = onSnapshot(collection(db, 'sales'), (snapshot) => {
      let total = 0;
      snapshot.docs.forEach(d => { total += d.data().amount || 0; });
      setStats(s => ({ ...s, totalVolume: total }));
    });

    return () => {
      unsubListings();
      unsubLeads();
      unsubPartners();
      unsubSales();
    };
  }, []);

  const cards = useMemo(() => [
    {
      id: 'portfolio',
      label: locale === 'ar' ? 'أصول المحفظة' : 'Portfolio Assets',
      value: stats.listings.toLocaleString(),
      badge: locale === 'ar' ? 'مباشر' : 'Live Inventory',
      badgeIcon: <Activity size={12} />,
      color: 'var(--gold)',
      screen: 'listings' as const,
      icon: <Home size={22} />,
    },
    {
      id: 'stakeholders',
      label: locale === 'ar' ? 'المستثمرون النشطون' : 'Active Stakeholders',
      value: stats.stakeholders.toString(),
      badge: `${stats.hotLeads} ${locale === 'ar' ? 'أولوية' : 'Priority'}`,
      badgeIcon: <Target size={12} />,
      color: 'var(--blue-light)',
      screen: 'crm' as const,
      icon: <Users size={22} />,
    },
    {
      id: 'financial',
      label: locale === 'ar' ? 'رأس المال المنقول' : 'Capital Transacted',
      value: formatCompactEGP(stats.totalVolume),
      badge: `ROI ${stats.avgROI.toFixed(1)}%`,
      badgeIcon: <TrendingUp size={12} />,
      color: 'var(--gold)',
      screen: 'reports' as const,
      icon: <BarChart3 size={22} />,
    },
    {
      id: 'partners',
      label: locale === 'ar' ? 'الشركاء التنفيذيون' : 'Executive Partners',
      value: stats.partners.toString(),
      badge: locale === 'ar' ? 'مؤمن' : 'Secured',
      badgeIcon: <ShieldCheck size={12} />,
      color: 'var(--silver)',
      screen: 'team' as const,
      icon: <ShieldCheck size={22} />,
    },
  ], [stats, locale]);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
      gap: '20px',
      perspective: '1000px'
    }}>
      {cards.map((card, i) => (
        <motion.div 
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          whileHover={{ 
            y: -8, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            scale: 1.02
          }}
          onClick={() => onNavigate(card.screen as any)}
          style={{ 
            cursor: 'pointer',
            padding: '20px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '10px', 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color
            }}>
              {card.icon}
            </div>
            <div style={{ 
              fontSize: '11px', fontWeight: 600, color: card.color, 
              textTransform: 'uppercase', letterSpacing: '1px' 
            }}>
              {card.badge}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              {card.label}
            </div>
            <div className="serif text-white/95" style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px' }}>
              {card.value}
            </div>
          </div>

          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, height: '3px', 
            width: '100%', background: `linear-gradient(90deg, transparent, ${card.color}60, transparent)`,
            opacity: 0.5
          }} />
        </motion.div>
      ))}
    </div>
  );
}
