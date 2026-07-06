'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useI18n } from '@/lib/I18nContext';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { InventoryService, Property } from '@/lib/services/InventoryService';

// ══════════════════════════════════════════════════════════
//  DYNAMIC IMPORTS (SSR Safety)
// ══════════════════════════════════════════════════════════
const LiveMap = dynamic(() => import('@/components/Maps/LiveMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-900/50 animate-pulse flex items-center justify-center text-slate-500 font-serif">Initializing Intelligence Map...</div>
});

// ══════════════════════════════════════════════════════════
//  COMPONENTS
// ══════════════════════════════════════════════════════════

/**
 * REFINED SEARCH BAR (V13.0 Digital Concierge Edition)
 */
function RefinedSearchBar({ onSearch }: { onSearch?: () => void }) {
  const [activeFilter, setActiveFilter] = useState('For Sale');
  const filters = ['For Sale', 'For Rent', 'New Listing', 'Signature'];

  return (
    <div className="w-full max-w-4xl mx-auto reveal reveal-d2">
      <div className="glass shadow-ambient flex flex-wrap lg:flex-nowrap divide-y lg:divide-y-0 lg:divide-x divide-black/5 overflow-hidden rounded-lg">
        {[
          { label: 'Market', val: 'New Cairo', placeholder: 'Area or Compound' },
          { label: 'Category', val: 'Signature Villas', placeholder: 'Asset Type' },
          { label: 'Budget', val: 'EGP 10M - 25M', placeholder: 'Target Range' }
        ].map((item, i) => (
          <div key={i} className="flex-1 p-6 flex flex-col justify-center text-left hover:bg-black/5 transition-colors cursor-text">
            <span className="label-sm text-on-surface-variant mb-1">{item.label}</span>
            <input 
              type="text" 
              defaultValue={item.val} 
              placeholder={item.placeholder}
              className="bg-transparent border-none outline-none font-display font-medium text-sm text-on-surface w-full"
            />
          </div>
        ))}
        <button 
          onClick={onSearch}
          className="w-full lg:w-48 bg-primary text-on-primary font-display font-bold text-[11px] tracking-widest uppercase py-6 lg:py-0 hover:bg-primary-container transition-all"
        >
          Discover
        </button>
      </div>
      
      <div className="flex gap-3 mt-6 flex-wrap justify-center">
        {filters.map(f => (
          <button 
            key={f} 
            onClick={() => setActiveFilter(f)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
              activeFilter === f 
                ? 'bg-secondary/10 text-secondary border border-secondary/30' 
                : 'bg-white/5 text-on-surface-variant border border-outline-variant hover:border-secondary/40'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * REFINED SHIELD LOGO (V13.0)
 */
function ShieldLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 120 138" fill="none">
      <defs>
        <linearGradient id="sbl-gold-v13" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E9C176" /><stop offset="50%" stopColor="#C8961A" /><stop offset="100%" stopColor="#987734" />
        </linearGradient>
      </defs>
      <path d="M60 2L112 21V79Q112 122 60 138Q8 122 8 79V21Z" fill="url(#sbl-gold-v13)" />
      <path d="M60 8L106 25V78Q106 114 60 130Q14 114 14 78V25Z" fill="#031632" />
      <path d="M14 100 Q35 84 58 72 Q80 58 108 46" stroke="white" strokeWidth="2" opacity="0.1" fill="none" />
      <rect x="52" y="30" width="16" height="50" fill="url(#sbl-gold-v13)" rx="1" opacity="0.8" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════
//  MAIN LANDING PAGE
// ══════════════════════════════════════════════════════════

export default function RefinedLandingPage() {
  const { locale, setLocale, dir, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [featured, setFeatured] = useState<Property[]>([]);
  const listingsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setIsVisible(true), 100);

    // Fetch real inventory
    InventoryService.getFeaturedListings(3).then(setFeatured);

    // ✅ Observer initialized ONCE — not inside scroll handler
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    // Observe after a short delay so elements are rendered
    const observeTimer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 200);

    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(observeTimer);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (!mounted) return null;

  const isAr = locale === 'ar';
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';

  return (
    <div className="min-h-screen transition-colors duration-1000 bg-surface text-on-surface" dir={dir}>
      
      {/* ══ NAV ══ */}
      <nav className={`fixed top-0 inset-x-0 z-[1000] h-[76px] flex items-center justify-between px-8 md:px-16 transition-all duration-700 ${
        scrolled ? 'glass shadow-ambient' : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-4 cursor-pointer">
          <ShieldLogo size={36} />
          <div className="flex flex-col">
            <span className="font-display text-xl font-extrabold tracking-tight text-primary leading-none uppercase">{t('landing.brand')}</span>
            <span className="label-sm text-primary/40 mt-0.5">{t('landing.sub')}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          {['Portfolio', 'Intelligence', 'Concierge', 'Nexus'].map(link => (
            <button key={link} className="label-sm text-on-surface-variant hover:text-secondary transition-colors">{link}</button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} className="px-3 py-1.5 border border-outline-variant rounded text-[10px] font-bold text-secondary uppercase tracking-widest hover:border-secondary/50 transition-all">{locale === 'ar' ? 'EN' : 'AR'}</button>
          <button onClick={() => setTheme(mode === 'dark' ? 'light' : 'dark')} className="w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:border-secondary/50 transition-all">{mode === 'dark' ? '☀️' : '🌙'}</button>
          <button className="hidden sm:inline-flex px-7 py-3 bg-primary text-on-primary rounded font-display font-bold text-[10px] tracking-widest uppercase shadow-ambient hover:bg-primary-container transition-all">Enter Portal</button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-32 px-8 bg-surface-container-low overflow-hidden">
        {/* Architectural Decorative Lines (From UI Kit) */}
        <div className="absolute top-[20%] left-[5%] w-1/4 h-px bg-secondary/10 rotate-[-15deg] pointer-events-none" />
        <div className="absolute top-[60%] right-[10%] w-1/6 h-px bg-secondary/5 rotate-[20deg] pointer-events-none" />
        
        <div className={`relative z-10 max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-px bg-secondary/30" />
            <span className="label-sm text-secondary">{t('landing.heroTag')}</span>
            <div className="w-10 h-px bg-secondary/30" />
          </div>

          <h1 className="display-lg mb-8 text-on-surface">
            {t('landing.heroH1.0')}<br />
            <span className="gold-gradient">{t('landing.heroH1.1')}</span>
          </h1>

          <p className="text-md font-light text-on-surface-variant max-w-2xl mx-auto mb-16 leading-relaxed">
            {t('landing.heroDesc')}
          </p>

          <RefinedSearchBar />
        </div>
      </section>

      {/* ══ STATS (Tonal Layering) ══ */}
      <section className="bg-surface-container-lowest py-16 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            ['1,200+', 'Assets'],
            ['98%', 'Fidelity'],
            ['8+', 'Sectors'],
            ['4s', 'Relay Time']
          ].map(([val, label], i) => (
            <div key={i} className="reveal text-center border-r last:border-0 border-outline-variant">
              <div className="font-display text-3xl font-extrabold text-primary mb-1">{val}</div>
              <div className="label-sm text-secondary">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ LISTINGS (Refined Grid) ══ */}
      <section ref={listingsRef} className="py-32 px-8 md:px-16 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="label-sm text-secondary mb-4 block">Institutional Portfolio</span>
              <h2 className="display-lg text-3xl md:text-5xl">Vetted Luxury Assets.</h2>
            </div>
            <button className="label-sm border-b border-secondary pb-1 text-secondary hover:text-primary transition-all">Full Inventory Access →</button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featured.map((p, i) => (
              <Link 
                href={`/listings/${p.id}`}
                key={p.id} 
                className="reveal group cursor-pointer block"
              >
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-8 shadow-ambient transition-transform duration-700 group-hover:scale-[1.02]">
                  <img 
                    src={p.propertyType === 'villa' ? '/villa.png' : '/penthouse.png'} 
                    alt={p.title} 
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-8 left-8">
                    <div className="label-sm text-secondary-container mb-1">{p.compound} · {p.location}</div>
                    <div className="font-display text-2xl font-bold text-white">{p.title}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center px-2">
                  <div className="font-mono text-lg text-primary font-medium">EGP {p.price.toLocaleString()}</div>
                  <div className="w-10 h-[1px] bg-outline-variant group-hover:w-16 group-hover:bg-secondary transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAP (Geospatial Hub) ══ */}
      <section className="py-32 px-8 md:px-16 bg-surface-container-low border-y border-outline-variant">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-24 items-center">
            <div>
              <span className="label-sm text-secondary mb-4 block">Spatial Intelligence</span>
              <h2 className="display-lg text-4xl mb-10 leading-tight">Investment<br /><span className="gold-gradient">Corridor Mapping</span></h2>
              <p className="text-on-surface-variant font-light leading-relaxed mb-12">Real-time geographic distribution of active resale and rental units. Monitor ROI velocity across premium sectors.</p>
              
              <div className="space-y-4">
                {[
                  { area: 'Fifth Settlement', stat: '+12.4%', color: '#C9A84C' },
                  { area: 'Madinaty', stat: 'High Velocity', color: '#031632' },
                  { area: 'Mountain View', stat: '8.2% Yield', color: '#3a5570' }
                ].map((z, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded bg-surface-container-lowest hover:shadow-ambient transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color }} />
                      <span className="font-display font-bold text-sm text-primary">{z.area}</span>
                    </div>
                    <span className="font-mono text-xs text-secondary">{z.stat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[600px] relative reveal">
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-ambient border border-outline-variant">
                <LiveMap mode={mode} />
                <div className="absolute top-8 right-8 z-[400] glass p-5 rounded shadow-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="label-sm text-primary">Live Nexus Feed</span>
                  </div>
                  <div className="text-[9px] text-primary/40 uppercase tracking-tighter font-mono">Sync: Operational v13.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ AI ADVISOR ══ */}
      <section className="py-32 px-8 md:px-16 bg-surface-container-lowest">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-10 relative">
             <span className="text-secondary text-3xl">◈</span>
             <div className="absolute inset-0 rounded-full border border-secondary/40 animate-ping opacity-20" />
          </div>
          <h2 className="display-lg text-4xl mb-8">The First Neural Concierge<br />in the Region</h2>
          <p className="text-on-surface-variant font-light max-w-2xl mx-auto mb-16 leading-relaxed">
            Sierra is not a chatbot. It is an investment reconstruction engine that processes legislative, economic, and spatial data to find your optimum match.
          </p>
          <button className="px-12 py-5 bg-primary text-on-primary rounded font-display font-bold text-xs tracking-[0.2em] uppercase shadow-ambient hover:scale-[1.02] transition-all">Activate Advisor</button>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-24 px-8 md:px-16 bg-primary text-on-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-4 mb-10">
                <ShieldLogo size={48} />
                <div className="flex flex-col">
                  <span className="font-display text-3xl font-extrabold tracking-tight uppercase text-secondary">SIERRA BLU</span>
                  <span className="label-sm text-secondary/40">The Digital Concierge</span>
                </div>
              </div>
              <p className="text-on-primary/40 text-sm font-light leading-relaxed max-w-sm italic">"Beyond Brokerage. Built for those who demand precision and expect excellence."</p>
            </div>
            {['Intelligence', 'Protocols'].map(title => (
              <div key={title}>
                <h4 className="label-sm text-secondary mb-10">{title}</h4>
                <ul className="space-y-5">
                  {['Sector Analysis', 'Yield Ledger', 'Concierge Sync', 'Nexus Relay'].map(link => (
                    <li key={link} className="text-xs text-on-primary/40 hover:text-secondary transition-colors cursor-pointer">{link}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-wrap justify-between items-center gap-8">
            <span className="label-sm text-on-primary/30">© 2026 Sierra Blu Realty · Digital Concierge V13.0</span>
            <div className="flex gap-10">
              {['Privacy', 'Legal', 'Advisory'].map(link => (
                <span key={link} className="label-sm text-on-primary/30 hover:text-secondary cursor-pointer transition-colors">{link}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}