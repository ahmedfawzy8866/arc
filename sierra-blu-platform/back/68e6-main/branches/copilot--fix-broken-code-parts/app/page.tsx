'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useI18n } from '@/lib/I18nContext';
import { useTheme } from 'next-themes';
import { InventoryService, Property } from '@/lib/services/InventoryService.client';
import ShieldLogo from '@/components/Landing/ShieldLogo';
import PropCard from '@/components/Landing/PropCard';

const ParticleCanvas = dynamic(() => import('@/components/Landing/ParticleCanvas'), { ssr: false });
const LiveMap = dynamic(() => import('@/components/Maps/LiveMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-900/50 animate-pulse flex items-center justify-center text-slate-500 font-serif">Initializing Intelligence Map...</div>,
});

// ══════════════════════════════════════════════════════════
//  DESIGN TOKENS & CONSTANTS
// ══════════════════════════════════════════════════════════
const G = 'var(--gold-prime)';
const G2 = 'var(--sierra-blue)';

const THEMES = {
  dark: {
    bg: 'var(--night-navy)', 
    bgAlt: 'var(--deep-navy)', 
    bg2: 'var(--mid-navy)',
    surface: 'var(--surface)', 
    surfaceHover: 'var(--surface-hover)',
    card: 'var(--bg-card)', 
    cardBorder: 'var(--border-card)',
    border: 'var(--border)', 
    borderHover: 'var(--gold-prime)',
    text: 'var(--text)', 
    textSub: 'var(--text-sub)', 
    textMuted: 'var(--text-muted)',
    navBg: 'var(--bg-nav)', 
    footerBg: 'var(--night-navy)', 
    heroBg: 'var(--night-navy)',
  },
  light: {
    bg: 'var(--bg)', 
    bgAlt: 'var(--bg-surface)', 
    bg2: 'var(--bg-surface)',
    surface: 'var(--surface)', 
    surfaceHover: 'var(--surface-hover)',
    card: 'var(--bg-card)', 
    cardBorder: 'var(--border-card)',
    border: 'var(--border)', 
    borderHover: 'var(--gold-prime)',
    text: 'var(--text)', 
    textSub: 'var(--text-sub)', 
    textMuted: 'var(--text-muted)',
    navBg: 'var(--bg-nav)', 
    footerBg: 'var(--deep-navy)', 
    heroBg: 'var(--bg)',
  },
};

// ══════════════════════════════════════════════════════════
//  COPY (BILINGUAL)
// ══════════════════════════════════════════════════════════
const COPY = {
  en: {
    dir: 'ltr' as const,
    brand: 'SIERRA BLU', sub: 'REALTY',
    tagline: 'AI‑POWERED REAL ESTATE INTELLIGENCE',
    nav: ['Portfolio', 'Intelligence', 'About', 'Contact'],
    cta: 'Explore Portfolio',
    heroTag: 'Beyond Brokerage',
    heroH1: ['Smarter', 'Real Estate.'],
    heroItalic: 'Powered by AI intelligence.',
    heroSub: 'New Cairo\'s Premier Rent & Resale Platform',
    heroDesc: 'We combine advanced AI with an exclusive network of 1,500+ elite brokers across New Cairo, Madinaty, and El Shorouk to deliver unmatched value tailored to your needs.',
    btnDiscover: 'Explore Portfolio',
    btnView: 'Talk to Sierra AI',
    stats: [['1,200+', 'Portfolio Assets'], ['98%', 'Match Rate'], ['8+', 'Compounds'], ['4s', 'Response Time']],
    scroll: 'Scroll',
    secListings: 'Strategic Pipeline',
    h2Listings: 'Portfolio Assets.',
    viewAll: 'Explore All →',
    searchType: 'Asset Type', searchCompound: 'Zone', searchBudget: 'Capital', searchBtn: 'Search Now',
    beds: 'beds', baths: 'baths',
    secWhy: 'The Sierra Blu Distinction',
    h2Why: 'Why stakeholders choose us.',
    whyDesc: 'We don\'t just search the market — we analyze it. Powered by AI and 1,500+ trusted brokers, we scan every corner of New Cairo to bring you only the highest-value portfolio assets that meet your exact needs.',
    why: [
      { icon: '◆', title: 'Curated Selection', stat: '1,200+', statLabel: 'vetted assets', desc: 'Every asset is hand-checked by our investment stakeholders. We reject overpriced inventory so you only see what\'s worth your time and capital.' },
      { icon: '◈', title: 'AI-Powered Matching', stat: '98%', statLabel: 'match accuracy', desc: 'Our AI cross-references your criteria against live market data, price history, and ROI projections to surface the best deals first.' },
      { icon: '◉', title: 'Dedicated Advisor', stat: '4s', statLabel: 'avg response', desc: 'One advisor from first call to final signature. They know your budget, your preferences, and the market — no handoffs, no repeating yourself.' },
    ],
    bannerH: 'Exceptional Assets, Intelligent Matching',
    bannerSub: 'أصول استثنائية، مطابقة ذكية',
    bannerBtn: 'View Portfolio',
    secMap: 'Market Intelligence',
    mapH1: 'New Cairo', mapH2: 'Strategic Pipeline',
    mapDesc: 'Real-time data across New Cairo\'s premium zones. Track growth corridors, rental yields, and exclusive off-market signals.',
    zones: [
      { area: 'Fifth Settlement', stat: 'Growth +12%', color: '#4ECDC4' },
      { area: 'Madinaty', stat: 'High Demand', color: 'var(--gold-prime)' },
      { area: 'MV iCity', stat: 'Yield 8%', color: '#7EA8B4' },
      { area: 'Mostakbal City', stat: 'Off‑Market', color: '#C084FC' },
      { area: 'Hyde Park', stat: 'Premium', color: '#F97316' },
      { area: 'Mivida', stat: 'Yield 7.5%', color: '#22D3EE' },
    ],
    mapBtn: 'Explore AI Insights →',
    secAI: 'Meet Sierra',
    aiH: 'Your AI Investment Consultant',
    aiSub: 'First Official AI Real Estate Bot Consultant in Egypt',
    aiDesc: 'Sierra is always on — analyzing market data, answering your questions, and matching you with portfolio assets that fit your exact criteria. Start a conversation and see the difference intelligence makes.',
    aiCTA: 'Start on Telegram →',
    aiFeatures: ['Instant asset matching', 'Market analytics & ROI', 'Arabic & English support', '24/7 availability'],
    aiChat: [
      { from: 'user', text: 'Looking for a 4‑bed villa under 15M EGP in Fifth Settlement' },
      { from: 'bot', text: 'Found 7 matching portfolio assets. Top pick: Villa Lumière — 5 beds, 480 m², EGP 14.2M. ROI: 8.3% annual yield. Shall I send the full report?' },
    ],
    secTesti: 'Investment Success Stories',
    h2Testi: 'What our stakeholders say',
    testimonials: [
      { q: 'I used to spend weeks searching the New Cairo market. Sierra Blu changed everything. Their AI matched me with the exact villa I wanted at the best price available. One platform, zero wasted time.', name: 'Omar T.', role: 'Investment Stakeholder', i: 'OT' },
      { q: 'Finding the right home in New Cairo seemed impossible until Sierra Blu. Their system understood our exact needs and filtered out the noise to deliver the perfect portfolio asset. Smartest decision we made.', name: 'Sarah & Michael V.', role: 'Strategic Partners', i: 'SMV' },
      { q: 'Sierra Blu found me a portfolio asset that wasn\'t even on my radar. The AI scans the entire market and delivers the best value. Exact match, zero guesswork.', name: 'Karim H.', role: 'CEO, Apex Holdings', i: 'KH' },
    ],
    ctaTag: 'Secure Your Asset',
    ctaH: 'Secure Your Position in New Cairo',
    ctaSub: 'Leave your details — a Sierra advisor reaches out within 4 seconds.',
    formName: 'Full Name', formPhone: 'Mobile number', formSubmit: 'Get Exclusive Access',
    formSuccess: 'We\'re on it. A Sierra advisor will reach out within 4 seconds.',
    footDesc: 'Beyond Brokerage. AI-powered real estate intelligence for discerning investment stakeholders in New Cairo and beyond.',
    footNav: 'Strategic Navigation', footNavLinks: ['Portfolio Assets', 'Intelligence', 'About Us', 'Careers', 'Contact'],
    footMarkets: 'Strategic Zones', footMarketLinks: ['New Cairo', 'Fifth Settlement', 'Madinaty', 'Mostakbal City', 'Mountain View'],
    footContact: 'Contact',
    copyright: '© 2026 Sierra Blu Realty. All rights reserved.',
    legal: ['Privacy Policy', 'Terms of Service', 'Cookies'],
  },
  ar: {
    dir: 'rtl' as const,
    brand: 'سييرا بلو', sub: 'للعقارات',
    tagline: 'ذكاء عقاري مدعوم بالذكاء الاصطناعي',
    nav: ['المحفظة الاستثمارية', 'الذكاء العقاري', 'عنّا', 'اتصل'],
    cta: 'استكشف المحفظة',
    heroTag: 'أبعد من الوساطة',
    heroH1: ['عقارات', 'أذكى.'],
    heroItalic: 'مدعومة بالذكاء الاصطناعي.',
    heroSub: 'منصة القاهرة الجديدة للبيع والإيجار',
    heroDesc: 'نجمع بين الذكاء الاصطناعي وشبكة حصرية من ١٥٠٠+ وسيط عقاري في القاهرة الجديدة ومدينتي والشروق لنوفر لك أفضل قيمة تلبي احتياجاتك بالضبط.',
    btnDiscover: 'تصفح العقارات',
    btnView: 'تحدّث مع سييرا',
    stats: [['١٢٠٠+', 'أصول المحفظة'], ['٩٨٪', 'نسبة المطابقة'], ['٨+', 'كمباوند'], ['٤ث', 'زمن الرد']],
    scroll: 'اسحب',
    secListings: 'محفظة استراتيجية',
    h2Listings: 'أصول استثنائية.',
    viewAll: '← استكشاف الكل',
    searchType: 'نوع الأصل', searchCompound: 'المنطقة', searchBudget: 'رأس المال', searchBtn: 'ابحث الآن',
    beds: 'غرف', baths: 'حمامات',
    secWhy: 'تميّز سييرا بلو',
    h2Why: 'لماذا يختارنا عملاؤنا.',
    why: [
      { icon: '◆', title: 'اختيار منتقى', stat: '١٢٠٠+', statLabel: 'عقار موثق', desc: 'كل عقار يتم فحصه يدوياً. نرفض المبالغ في سعره لتشاهد فقط ما يستحق وقتك ومالك.' },
      { icon: '◈', title: 'مطابقة بالذكاء الاصطناعي', stat: '٩٨٪', statLabel: 'دقة المطابقة', desc: 'ذكاؤنا الاصطناعي يقارن معاييرك ببيانات السوق الحية وتاريخ الأسعار وتوقعات العائد ليظهر لك أفضل الصفقات أولاً.' },
      { icon: '◉', title: 'مستشار مخصص', stat: '٤ث', statLabel: 'متوسط الرد', desc: 'مستشار واحد من أول اتصال لآخر توقيع. يعرف ميزانيتك وتفضيلاتك والسوق — بدون تحويلات أو تكرار.' },
    ],
    bannerH: 'أصول استثنائية، مطابقة ذكية',
    bannerSub: 'Exceptional Assets, Intelligent Matching',
    bannerBtn: 'عرض المحفظة',
    secMap: 'ذكاء السوق',
    mapH1: 'القاهرة الجديدة', mapH2: 'خريطة الاستثمار',
    mapDesc: 'بيانات فورية عبر مناطق الاستثمار المميزة في القاهرة الجديدة. تتبع ممرات النمو وعوائد الإيجار والإشارات الحصرية خارج السوق.',
    zones: [
      { area: 'التجمع الخامس', stat: 'نمو +١٢٪', color: '#4ECDC4' },
      { area: 'مدينتي', stat: 'طلب مرتفع', color: G },
      { area: 'ماونتن فيو', stat: 'عائد ٨٪', color: '#7EA8B4' },
      { area: 'مستقبل سيتي', stat: 'خارج السوق', color: '#C084FC' },
      { area: 'هايد بارك', stat: 'بريميوم', color: '#F97316' },
      { area: 'ميفيدا', stat: 'عائد ٧.٥٪', color: '#22D3EE' },
    ],
    mapBtn: '← استكشف رؤى الذكاء الاصطناعي',
    secAI: 'تعرّف على سييرا',
    aiH: 'مستشارتك العقارية الذكية',
    aiSub: 'أول بوت استشاري عقاري رسمي بالذكاء الاصطناعي في مصر',
    aiDesc: 'سييرا تعمل على مدار الساعة — تحلل بيانات السوق، تجيب أسئلتك، وتطابقك مع عقارات تناسب معاييرك بالضبط. ابدأ محادثة واشعر بالفرق.',
    aiCTA: 'ابدأ على تيليجرام ←',
    aiFeatures: ['مطابقة فورية للعقارات', 'تحليلات السوق وعائد الاستثمار', 'دعم عربي وإنجليزي', 'متاح ٢٤/٧'],
    aiChat: [
      { from: 'user', text: 'بدور على فيلا ٤ غرف أقل من ١٥م في التجمع الخامس' },
      { from: 'bot', text: 'وجدت ٧ عقارات تطابق معاييرك. أفضل خيار: فيلا لوميير — ٥ غرف، ٤٨٠م²، ١٤.٢م ج.م. عائد: ٨.٣٪ سنوياً. أرسل لك التقرير الكامل؟' },
    ],
    secTesti: 'قصص عملائنا',
    h2Testi: 'ماذا يقول عملاؤنا',
    testimonials: [
      { q: 'كنت أقضي أسابيع في البحث. سييرا بلو غيّرت كل شيء. ذكاؤهم الاصطناعي طابقني مع الفيلا المثالية بأفضل سعر متاح. منصة واحدة، صفر وقت ضائع.', name: 'عمر ت.', role: 'مستثمر عقاري', i: 'OT' },
      { q: 'إيجاد منزل مناسب في القاهرة الجديدة بدا مستحيل حتى سييرا بلو. نظامهم فهم احتياجاتنا بالضبط وأزال الضوضاء ليوصلنا للعقار المثالي. أذكى قرار اتخذناه.', name: 'سارة وميشيل ف.', role: 'عائلة ناقلة', i: 'SMV' },
      { q: 'سييرا بلو وجدت لي عقار لم يكن حتى على بالي. الذكاء الاصطناعي يفحص السوق بالكامل ويقدم أفضل قيمة. مطابقة مثالية، صفر تخمين.', name: 'كريم ح.', role: 'الرئيس التنفيذي، أبكس هولدينغز', i: 'KH' },
    ],
    ctaTag: 'ابحث عن مكانك',
    ctaH: 'ابحث عن مكانك في القاهرة الجديدة',
    ctaSub: 'اترك بياناتك — مستشار سييرا سيتواصل معك خلال ٤ ثوانٍ.',
    formName: 'الاسم بالكامل', formPhone: 'رقم الجوال', formSubmit: 'احصل على وصول حصري',
    formSuccess: 'نحن على الموضوع. مستشار سييرا سيتواصل معك خلال ٤ ثوانٍ.',
    footDesc: 'أبعد من الوساطة. ذكاء عقاري مدعوم بالذكاء الاصطناعي للمستثمرين في القاهرة الجديدة.',
    footNav: 'روابط التنقل', footNavLinks: ['أصول المحفظة', 'الذكاء العقاري', 'عنّا', 'الوظائف', 'اتصل'],
    footMarkets: 'الأسواق', footMarketLinks: ['القاهرة الجديدة', 'التجمع الخامس', 'مدينتي', 'مستقبل سيتي', 'ماونتن فيو'],
    footContact: 'تواصل معنا',
    copyright: '© ٢٠٢٦ سييرا بلو للعقارات. جميع الحقوق محفوظة.',
    legal: ['سياسة الخصوصية', 'شروط الخدمة', 'ملفات الارتباط'],
  },
};

// ══════════════════════════════════════════════════════════
//  STATIC LISTINGS (fallback while Firebase loads)
// ══════════════════════════════════════════════════════════
const STATIC_LISTINGS = [
  { id: 1, title: 'Aurora Penthouse', titleAr: 'بنتهاوس أورورا', location: 'Madinaty · New Cairo', locationAr: 'مدينتي · القاهرة الجديدة', price: 8500000, beds: 4, baths: 3, sqft: '320 m²', badge: 'Hidden Gem', badgeColor: '#7C3AED', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80' },
  { id: 2, title: 'Villa Lumière', titleAr: 'فيلا لوميير', location: 'Mountain View · 5th Settlement', locationAr: 'ماونتن فيو · التجمع الخامس', price: 14200000, beds: 5, baths: 4, sqft: '480 m²', badge: 'Featured', badgeColor: '#C8961A', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80' },
  { id: 3, title: 'The Boulevard', titleAr: 'ذا بوليفار', location: 'Mostakbal City · Future', locationAr: 'مستقبل سيتي · المستقبل', price: 3800000, beds: 3, baths: 2, sqft: '185 m²', badge: 'New', badgeColor: '#1B6CA8', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80' },
  { id: 4, title: 'Emirates Crown', titleAr: 'إيمارتس كراون', location: 'Fifth Settlement · Cairo', locationAr: 'التجمع الخامس · القاهرة', price: 22000000, beds: 6, baths: 5, sqft: '650 m²', badge: 'Off Market', badgeColor: '#059669', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80' },
  { id: 5, title: 'Palm Residences', titleAr: 'بالم ريزيدنسز', location: 'Madinaty · Block 7', locationAr: 'مدينتي · بلوك ٧', price: 5900000, beds: 3, baths: 3, sqft: '240 m²', badge: 'High ROI', badgeColor: '#DC2626', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80' },
  { id: 6, title: 'Sky Tower Penthouse', titleAr: 'بنتهاوس سكاي تاور', location: 'Downtown New Cairo', locationAr: 'وسط القاهرة الجديدة', price: 11500000, beds: 4, baths: 4, sqft: '380 m²', badge: 'Price Reduced', badgeColor: '#D97706', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80' },
];

const ZONE_COORDS: [number, number][] = [
  [30.0071, 31.4345],
  [30.0972, 31.6314],
  [30.0320, 31.4720],
  [30.1400, 31.7400],
];

// ══════════════════════════════════════════════════════════
//  MAIN LANDING PAGE
// ══════════════════════════════════════════════════════════
export default function LandingPage() {
  const { locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const [listingsDealt, setListingsDealt] = useState(false);
  const [featured, setFeatured] = useState<Property[]>([]);
  const [filterType, setFilterType] = useState('');
  const [filterCompound, setFilterCompound] = useState('');
  const [filterBedrooms, setFilterBedrooms] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const listingsSectionRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  }, []);

  const lang = locale === 'ar' ? 'ar' : 'en';
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];
  const T = COPY[lang];
  const isAr = lang === 'ar';

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setLoaded(true), 80);

    InventoryService.getFeaturedListings(6)
      .then((listings) => {
        if (listings && Array.isArray(listings)) {
          setFeatured(listings);
        }
      })
      .catch(() => {});

    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [mounted, lang, mode]);

  useEffect(() => {
    if (!listingsSectionRef.current || listingsDealt) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setListingsDealt(true); obs.disconnect(); } }),
      { threshold: 0.12 }
    );
    obs.observe(listingsSectionRef.current);
    return () => obs.disconnect();
  }, [listingsDealt]);

  useEffect(() => { setListingsDealt(false); setTimeout(() => setListingsDealt(true), 100); }, [lang, mode]);

  if (!mounted) return null;

  // Removed sec variable in favor of .lux-container class

  const handleSearch = () => {
    const filtered = featured.filter((p) => {
      if (filterType && p.propertyType !== filterType) return false;
      if (filterCompound && p.compound !== filterCompound) return false;
      if (filterBedrooms && p.bedrooms !== parseInt(filterBedrooms)) return false;
      if (filterPrice && p.price > parseInt(filterPrice)) return false;
      return true;
    });
    if (filtered.length > 0) {
      setFeatured(filtered);
      setTimeout(() => listingsSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  const listings = featured.length > 0
    ? featured.map((p) => ({
        id: p.id,
        title: p.title,
        titleAr: p.title,
        location: `${p.compound} · ${p.location}`,
        locationAr: `${p.compound} · ${p.location}`,
        price: `EGP ${p.price.toLocaleString(isAr ? 'ar-EG' : 'en-US')}`,
        beds: p.bedrooms || 3,
        baths: p.bathrooms || 2,
        sqft: `${p.area || 200} m²`,
        badge: p.status || 'Available',
        badgeColor: G2,
        img: STATIC_LISTINGS[Math.min(STATIC_LISTINGS.length - 1, featured.indexOf(p))].img,
      }))
    : STATIC_LISTINGS.map(p => ({
        ...p,
        price: `EGP ${p.price.toLocaleString(isAr ? 'ar-EG' : 'en-US')}`,
      }));

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] transition-colors duration-500" dir={T.dir}>

      {/* ══ NAV ══ */}
      <nav className={`fixed top-0 left-0 right-0 z-[300] h-[68px] flex items-center justify-between px-12 transition-all duration-700 cubic-bezier(0.16,1,0.3,1) ${scrolled ? 'lux-glass border-b border-white/10' : 'bg-transparent border-b border-transparent'}`} dir={T.dir}>
        <div className="flex items-center gap-3 cursor-pointer group">
          <ShieldLogo size={38} />
          <div className="flex flex-col">
            <div className="lux-gold-text text-lg leading-tight tracking-[0.2em] font-serif uppercase">
              {T.brand}
            </div>
            <div className="text-[8px] tracking-[0.38em] text-white/40 uppercase font-body mt-0.5">
              {T.sub}
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          {T.nav.map((n, i) => (
            <span 
              key={n} 
              onClick={() => scrollTo(['listings', 'intelligence', 'about', 'contact'][i])} 
              className={`text-[11px] font-medium tracking-[0.13em] uppercase transition-all duration-300 cursor-pointer text-[var(--text-sub)] hover:text-[var(--gold-prime)] ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}
            >
              {n}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} 
            className="lux-button-outline !px-3 !py-1.5 !text-[10px]"
          >
            {lang === 'en' ? 'AR' : 'EN'}
          </button>
          <button 
            onClick={() => setTheme(mode === 'dark' ? 'light' : 'dark')} 
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/5 border border-white/10 text-white/60 hover:text-white"
          >
            {mode === 'dark' ? '☀' : '🌙'}
          </button>
          <button 
            onClick={() => scrollTo('listings')} 
            className="hidden sm:lux-button-outline !px-4 !py-2 !text-[10px]"
          >
            {T.cta}
          </button>
        </div>
      </nav>

      {/* Smart filter moved into listings section below */}

      {/* ══ HERO ══ */}
      <section className="lux-hero-section bg-[var(--hero-bg)]">
        <div 
          className={`lux-hero-bg bg-[url('https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=1800&q=80')] ${loaded ? 'scale-100' : 'scale-[1.06]'} transition-transform duration-1000 ${mode === 'dark' ? 'opacity-[0.55]' : 'opacity-[0.15]'}`}
        />
        <div 
          className={`lux-hero-overlay ${mode === 'dark' ? 'bg-[linear-gradient(105deg,rgba(10,21,32,.97)_0%,rgba(13,32,53,.85)_45%,rgba(10,21,32,.4)_100%)]' : 'bg-[linear-gradient(105deg,rgba(192,214,212,.98)_0%,rgba(213,232,230,.95)_50%,rgba(192,214,212,.7)_100%)]'}`}
        />
        <ParticleCanvas />

        <div className="lux-container relative z-10 w-full">
          <div className="grid md:grid-cols-[55%_45%] gap-14 items-center py-[80px]">
            <div className={isAr ? 'order-2' : 'order-1'}>
              <div 
                className={`inline-flex items-center gap-[10px] ${isAr ? 'flex-row-reverse' : 'flex-row'} ${loaded ? 'animate-[fadeUp_.6s_ease_.1s_both]' : 'opacity-0'}`}
              >
                <div className="w-[28px] h-[1px] bg-[var(--gold-prime)]" />
                <span className="lux-section-subtitle !mb-0">{T.tagline}</span>
              </div>

              <h1 
                className={`lux-section-title !text-[clamp(32px,4vw,56px)] !mb-4 mt-5 ${isAr ? 'text-right' : 'text-left'} ${loaded ? 'animate-[fadeUp_.7s_ease_.2s_both]' : 'opacity-0'}`} 
              >
                {isAr ? T.heroH1.slice().reverse().join(' ') : T.heroH1.join(' ')} <br />
                <em className="lux-gold-text italic">{T.heroItalic}</em>
              </h1>

              <div className={`text-[11px] tracking-[0.2em] uppercase text-[var(--gold-prime)] font-medium mb-4 ${loaded ? 'animate-[fadeUp_.7s_ease_.3s_both]' : 'opacity-0'}`}>{T.heroSub}</div>

              <p 
                className={`text-sm font-light leading-relaxed mb-8 max-w-lg text-[var(--text-sub)] ${isAr ? 'text-right' : 'text-left'} ${loaded ? 'animate-[fadeUp_.7s_ease_.38s_both]' : 'opacity-0'}`} 
              >
                {T.heroDesc}
              </p>

              <div className={`flex gap-4 mb-12 ${isAr ? 'flex-row-reverse' : 'flex-row'} ${loaded ? 'animate-[fadeUp_.7s_ease_.46s_both]' : 'opacity-0'}`}>
                <Link href="/listings" className="lux-button lux-button-primary shadow-gold">
                  {T.btnDiscover}
                </Link>
                <Link href="/contact" className="lux-button lux-button-outline">
                  {T.btnView}
                </Link>
              </div>

              {/* Stats */}
              <div className={`grid grid-cols-4 lux-glass rounded-xl overflow-hidden ${loaded ? 'animate-[fadeUp_.7s_ease_.56s_both]' : 'opacity-0'}`}>
                {T.stats.map(([val, lbl], i) => (
                  <div key={i} className={`text-center py-5 px-3 ${i < T.stats.length - 1 ? 'border-r border-white/10' : ''}`}>
                    <div className="font-mono text-2xl font-medium lux-gold-text leading-none mb-1.5">{val}</div>
                    <div className="text-[9px] tracking-widest uppercase text-white/40 font-body">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero card stack */}
            <div 
              className={`hidden md:block relative h-[520px] ${isAr ? 'order-1' : 'order-2'} ${loaded ? 'animate-[fadeUp_.9s_ease_.45s_both]' : 'opacity-0'}`}
            >
              <div className={`absolute inset-0 flex items-center justify-center ${mode === 'dark' ? 'opacity-[0.03]' : 'opacity-[0.025]'}`}>
                <ShieldLogo size={340} />
              </div>
              {[{ off: 2, op: 0.4 }, { off: 1, op: 0.65 }, { off: 0, op: 1 }].map(({ off, op }, idx) => (
                <div 
                  key={idx} 
                  className="absolute rounded-[18px]"
                  style={{ 
                    top: off * 20, 
                    left: off * 20, 
                    right: -(off * 20), 
                    bottom: -(off * 20), 
                    background: off === 0 ? 'var(--bg-card)' : 'var(--surface)', 
                    overflow: off === 0 ? 'hidden' : undefined, 
                    border: off > 0 ? '1px solid var(--border)' : undefined, 
                    opacity: op, 
                    boxShadow: off === 0 ? '0 40px 80px rgba(0,0,0,.4)' : undefined, 
                    zIndex: 3 - off 
                  }}
                >
                  {off === 0 && (
                    <>
                      <img src={STATIC_LISTINGS[1].img} alt="" className="w-full h-[62%] object-cover" />
                      <div className="absolute top-4 left-4 lux-glass !bg-[var(--gold-prime)] !text-[#071422] text-[10px] font-bold tracking-wider px-3 py-1 rounded-full font-body uppercase">{STATIC_LISTINGS[1].badge}</div>
                      <div className="p-6">
                        <div className="text-[10px] font-medium tracking-[0.15em] uppercase lux-gold-text mb-1.5 font-body">{isAr ? STATIC_LISTINGS[1].locationAr : STATIC_LISTINGS[1].location}</div>
                        <div className="font-serif text-2xl font-semibold mb-3 text-white">{isAr ? STATIC_LISTINGS[1].titleAr : STATIC_LISTINGS[1].title}</div>
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-xl font-medium lux-gold-text">{STATIC_LISTINGS[1].price}</span>
                          <span className="text-[11px] text-white/40 font-mono font-light uppercase tracking-tight">{STATIC_LISTINGS[1].beds} {T.beds} · {STATIC_LISTINGS[1].baths} {T.baths}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-[28px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[6px] opacity-40 z-10">
          <span className="text-[9px] tracking-[.24em] uppercase text-[var(--text-muted)] font-body">{T.scroll}</span>
          <div className="animate-shimmer w-[1px] h-[32px] bg-gradient-to-b from-[var(--gold-prime)] to-transparent" />
        </div>
      </section>

      {/* ══ LISTINGS ══ */}
      <section id="listings" ref={listingsSectionRef} className={`lux-section-padding ${mode === 'dark' ? 'bg-[#0A1520]' : 'bg-[var(--bg-alt)]'}`}>
        <div className="lux-container">
          <div className={`reveal flex justify-between items-end mb-12 flex-wrap gap-6 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={isAr ? 'text-right' : 'text-left'}>
              <div className="lux-section-subtitle">{T.secListings}</div>
              <h2 className="lux-section-title">{T.h2Listings}</h2>
            </div>
            <Link href="/listings" className="lux-button lux-button-outline !px-5 !py-2.5 !text-[10px]">{T.viewAll}</Link>
          </div>

          {/* Smart Filters */}
          <div className="reveal grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-0 rounded-xl overflow-hidden mb-12 lux-glass !border-white/5 shadow-2xl">
            {[
              { val: filterType, set: setFilterType, label: T.searchType, opts: [{ v: '', l: T.searchType }, { v: 'villa', l: 'Villa' }, { v: 'apartment', l: 'Apartment' }, { v: 'penthouse', l: 'Penthouse' }, { v: 'townhouse', l: 'Townhouse' }] },
              { val: filterCompound, set: setFilterCompound, label: T.searchCompound, opts: [{ v: '', l: T.searchCompound }, { v: 'Fifth Settlement', l: 'Fifth Settlement' }, { v: 'New Cairo', l: 'New Cairo' }, { v: 'Madinaty', l: 'Madinaty' }, { v: 'Sheikh Zayed', l: 'Sheikh Zayed' }] },
              { val: filterBedrooms, set: setFilterBedrooms, label: isAr ? 'غرف' : 'Rooms', opts: [{ v: '', l: isAr ? 'غرف' : 'Rooms' }, { v: '1', l: `1 ${T.beds}` }, { v: '2', l: `2 ${T.beds}` }, { v: '3', l: `3 ${T.beds}` }, { v: '4', l: `4 ${T.beds}` }, { v: '5', l: `5+ ${T.beds}` }] },
              { val: filterPrice, set: setFilterPrice, label: T.searchBudget, opts: [{ v: '', l: T.searchBudget }, { v: '2000000', l: 'Under 2M' }, { v: '5000000', l: 'Under 5M' }, { v: '10000000', l: 'Under 10M' }, { v: '15000000', l: 'Under 15M' }] },
            ].map((seg, i) => (
              <div key={i} className="px-6 py-4 border-r border-white/5">
                <div className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/40 mb-1.5 font-body">{seg.label}</div>
                <select 
                  value={seg.val} 
                  onChange={(e) => seg.set(e.target.value)} 
                  title={seg.label}
                  className="bg-transparent border-none outline-none text-white font-serif text-sm font-light w-full cursor-pointer focus:lux-gold-text transition-all appearance-none"
                >
                  {seg.opts.map((o) => <option key={o.v} value={o.v} className="bg-[#0A1520] text-white">{o.l}</option>)}
                </select>
              </div>
            ))}
            <button onClick={handleSearch} className="lux-button-primary !rounded-none !px-8 border-none !text-[11px]">{T.searchBtn}</button>
          </div>

          {/* Listing cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((p, i) => (
              <PropCard
                key={p.id}
                id={p.id}
                title={isAr ? p.titleAr : p.title}
                location={isAr ? p.locationAr : p.location}
                price={p.price}
                beds={p.beds}
                baths={p.baths}
                sqft={p.sqft}
                badge={p.badge}
                badgeColor={p.badgeColor}
                img={p.img}
                dealDelay={i * 0.09}
                dealt={listingsDealt}
                isAr={isAr}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY SIERRA BLU ══ */}
      <section id="about" className="relative py-24 overflow-hidden bg-[var(--bg)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] dark:opacity-[0.025]">
          <ShieldLogo size={600} />
        </div>
        <div className="relative z-10 mx-auto px-6 md:px-12 max-w-7xl">
          <div className="reveal text-center mb-16">
            <div className="lux-section-subtitle mx-auto">{T.secWhy}</div>
            <h2 className="lux-section-title">{T.h2Why}</h2>
            {'whyDesc' in T && <p className={`text-sm font-light leading-relaxed max-w-xl mx-auto opacity-70 ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}>{(T as any).whyDesc}</p>}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {T.why.map((w: any, i: number) => (
              <div key={i} className={`reveal lux-glass p-8 rounded-2xl border border-white/5 transition-all duration-500 hover:-translate-y-2 group ${isAr ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center justify-between mb-6 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="text-3xl lux-gold-text opacity-50 group-hover:opacity-100 transition-opacity font-serif">{w.icon}</div>
                  {w.stat && (
                    <div className="text-center">
                      <div className="font-mono text-2xl font-medium lux-gold-text leading-none">{w.stat}</div>
                      <div className="text-[8px] tracking-widest uppercase opacity-40 font-body mt-1">{w.statLabel}</div>
                    </div>
                  )}
                </div>
                <h3 className="font-serif text-xl font-medium mb-3 text-white">{w.title}</h3>
                <div className={`h-0.5 w-10 lux-gold-gradient rounded-full mb-4 ${isAr ? 'ml-auto' : ''}`} />
                <p className={`text-xs font-light leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}>{w.desc}</p>
              </div>
            ))}
          </div>

          {/* Banner */}
          <div className={`reveal mt-16 p-8 rounded-2xl lux-glass border border-[var(--gold-prime)]/20 flex items-center justify-between flex-wrap gap-8 ${isAr ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
            <div className="flex-1 min-w-[300px]">
              <div className="font-serif text-2xl font-light text-white mb-2">{T.bannerH}</div>
              <div className="text-xs lux-gold-text tracking-widest uppercase opacity-70 font-body">{T.bannerSub}</div>
            </div>
            <Link href="/listings" className="lux-button lux-button-primary !py-3 !px-8">
              {T.bannerBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* ══ INTELLIGENCE MAP ══ */}
      <section id="intelligence" className={`lux-section-padding ${mode === 'dark' ? 'bg-[#091828]' : 'bg-[var(--bg-alt)]'}`}>
        <div className="lux-container">
          <div className={`flex flex-col md:flex-row gap-16 items-center ${isAr ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <div className={isAr ? 'text-right' : 'text-left'}>
                <div className="lux-section-subtitle">{T.secMap}</div>
                <h2 className="lux-section-title">
                  {T.mapH1}<br /><em className="lux-gold-text italic">{T.mapH2}</em>
                </h2>
                <div className={`h-0.5 w-12 lux-gold-gradient rounded-full my-6 ${isAr ? 'ml-auto' : ''}`} />
                <p className={`text-sm font-light leading-relaxed opacity-70 ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}>{T.mapDesc}</p>
              </div>
              
              <div className="flex flex-col gap-3">
                {T.zones.map((z, i) => (
                  <div
                    key={i}
                    className={`reveal flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 lux-glass border border-white/5 hover:border-[var(--gold-prime)]/30 ${activeZone === i ? 'border-[var(--gold-prime)]/50 bg-white/5' : ''} ${isAr ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
                    onClick={() => setActiveZone(activeZone === i ? null : i)}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: z.color, boxShadow: `0 0 10px ${z.color}` }} />
                    <div className={`flex-1 text-sm font-medium text-white opacity-80 ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}>{z.area}</div>
                    <span className="font-mono text-[10px] font-bold py-1 px-3 rounded-full" style={{ color: z.color, background: `${z.color}15`, border: `1px solid ${z.color}30` }}>{z.stat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`reveal h-[520px] relative ${isAr ? 'order-1' : 'order-2'}`}>
              <div className="h-full rounded-2xl overflow-hidden lux-glass border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                <LiveMap mode={mode} />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] text-[8px] tracking-[0.4em] lux-gold-text opacity-40 font-body pointer-events-none">SIERRA BLU INTELLIGENCE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SIERRA AI ══ */}
      <section className={`lux-section-padding border-y border-white/5 ${mode === 'dark' ? 'bg-gradient-to-br from-[#0A1520] via-[#0D2035] to-[#122A47]' : 'bg-gradient-to-br from-[var(--bg-alt)] via-[var(--bg)] to-[var(--bg-2)]'}`}>
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className={`reveal ${isAr ? 'order-2 text-right' : 'order-1 text-left'}`}>
              <div className="lux-section-subtitle">{T.secAI}</div>
              <h2 className="lux-section-title">{T.aiH}</h2>
              <div className="text-[10px] font-bold tracking-widest text-[#1B6CA8] uppercase mb-6 font-body">{T.aiSub}</div>
              <div className={`h-0.5 w-12 lux-gold-gradient rounded-full mb-8 ${isAr ? 'ml-auto' : ''}`} />
              <p className={`text-sm font-light leading-relaxed opacity-70 mb-10 ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}>{T.aiDesc}</p>
              
              <div className="flex flex-col gap-4 mb-10">
                {T.aiFeatures.map((f, i) => (
                  <div key={i} className={`flex items-center gap-3 text-sm opacity-80 ${isAr ? "flex-row-reverse font-['Cairo',sans-serif]" : "flex-row font-['Jost',sans-serif]"}`}>
                    <div className="w-1.5 h-1.5 rounded-full lux-gold-gradient" />
                    {f}
                  </div>
                ))}
              </div>
              
              <a href="https://t.me/SierraBluBot" target="_blank" rel="noopener noreferrer" className="lux-button lux-button-primary inline-flex">
                {T.aiCTA}
              </a>
            </div>

            {/* Chat mockup */}
            <div className={`reveal ${isAr ? 'order-1' : 'order-2'}`}>
              <div className="lux-glass border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative w-12 h-12 rounded-full lux-gold-gradient flex items-center justify-center text-xl text-[#071422]">
                    ◈
                    <div className="absolute inset-0 rounded-full animate-ping opacity-30 border border-[var(--gold-prime)]" />
                  </div>
                  <div>
                    <div className="font-serif text-lg text-white">Sierra Intelligence</div>
                    <div className="font-mono text-[9px] text-[#4ADE80] uppercase tracking-wider">● Online · 4s response</div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  {T.aiChat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-xs font-light leading-relaxed ${msg.from === 'user' ? 'lux-gold-gradient text-[#071422] rounded-tr-none' : 'bg-white/5 border border-white/5 text-white/80 rounded-tl-none'} ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center text-[9px] tracking-widest uppercase opacity-30 font-body">
                  AI-Powered Pipeline · 24/7 Availability
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className={`lux-section-padding ${mode === 'dark' ? 'bg-[#0A1628]' : 'bg-[var(--bg-2)]'}`}>
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <div className="reveal text-center mb-16">
            <div className="lux-section-subtitle mx-auto">{T.secTesti}</div>
            <h2 className="lux-section-title">{T.h2Testi}</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {T.testimonials.map((t, i) => (
              <div key={i} className="reveal lux-glass p-8 rounded-2xl border border-white/5 transition-all duration-500 hover:-translate-y-2 group shadow-xl">
                <div className="font-serif text-5xl lux-gold-text opacity-30 leading-none mb-4">&ldquo;</div>
                <p className={`text-sm font-light leading-relaxed opacity-70 italic mb-8 ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}>{t.q}</p>
                <div className={`flex items-center gap-4 ${isAr ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                  <div className="w-10 h-10 rounded-full lux-gold-gradient flex items-center justify-center font-mono text-[10px] font-bold text-[#071422]">{t.i}</div>
                  <div>
                    <div className={`text-sm font-medium text-white ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}>{t.name}</div>
                    <div className="text-[10px] tracking-widest uppercase opacity-40 font-body">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FORM ══ */}
      <section id="contact" className={`lux-section-padding border-t border-white/5 ${mode === 'dark' ? 'bg-gradient-to-br from-[#0A1520] to-[#0D2035]' : 'bg-gradient-to-br from-[var(--bg)] to-[var(--bg-alt)]'}`}>
        <div className="mx-auto px-6 max-w-xl">
          <div className="reveal text-center mb-12">
            <div className="lux-section-subtitle mx-auto">{T.ctaTag}</div>
            <h2 className="lux-section-title">{T.ctaH}</h2>
            <p className={`text-sm font-light opacity-70 ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}>{T.ctaSub}</p>
          </div>
          
          <div className="reveal">
            {submitted ? (
              <div className="lux-glass p-12 rounded-2xl border border-[var(--gold-prime)]/30 text-center">
                <div className="text-4xl mb-6">✓</div>
                <div className="font-serif text-2xl lux-gold-text mb-2">{lang === 'en' ? 'Request Received.' : 'تم استلام طلبك.'}</div>
                <p className={`text-sm font-light opacity-70 ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}>{T.formSuccess}</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                {[
                  { key: 'name' as const, label: T.formName, type: 'text' },
                  { key: 'phone' as const, label: T.formPhone, type: 'tel' },
                ].map((f) => (
                  <input
                    key={f.key}
                    type={f.type}
                    required
                    placeholder={f.label}
                    value={formData[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    className={`w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-sm font-light text-white outline-none focus:border-[var(--gold-prime)]/50 transition-all ${isAr ? 'text-right font-[\'Cairo\',sans-serif]' : 'text-left font-[\'Jost\',sans-serif]'}`}
                  />
                ))}
                <button type="submit" className="lux-button lux-button-primary w-full !py-4">
                  {T.formSubmit}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-[#040E1C] text-[#EFF8F7] py-20 border-t border-white/5">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-16 mb-20">
            <div className={isAr ? 'text-right' : 'text-left'}>
              <div className={`flex items-center gap-4 mb-6 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
                <ShieldLogo size={42} />
                <div>
                  <div className="font-serif text-xl lux-gold-text tracking-widest uppercase">{T.brand}</div>
                  <div className="text-[9px] tracking-[0.4em] opacity-40 font-body">{T.sub}</div>
                </div>
              </div>
              <p className={`text-xs font-light leading-relaxed opacity-40 max-w-xs ${isAr ? 'ml-auto font-["Cairo",sans-serif]' : 'font-["Jost",sans-serif]'}`}>{T.footDesc}</p>
            </div>
            
            {[
              { title: T.footNav, links: T.footNavLinks, ids: ['listings', 'intelligence', 'about', '', 'contact'] },
              { title: T.footMarkets, links: T.footMarketLinks, ids: ['intelligence', 'intelligence', 'intelligence', 'intelligence', 'intelligence'] },
            ].map((col) => (
              <div key={col.title} className={isAr ? 'text-right' : 'text-left'}>
                <div className="text-[10px] font-bold tracking-widest lux-gold-text uppercase mb-8 font-body">{col.title}</div>
                <div className="space-y-4">
                  {col.links.map((l, i) => (
                    <div 
                      key={l} 
                      onClick={() => col.ids[i] && scrollTo(col.ids[i])} 
                      className={`text-xs font-light opacity-40 hover:opacity-100 hover:lux-gold-text cursor-pointer transition-all ${isAr ? "font-['Cairo',sans-serif]" : "font-['Jost',sans-serif]"}`}
                    >
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className={`pt-10 border-t border-white/5 flex justify-between items-center flex-wrap gap-6 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="text-[10px] font-light opacity-30 font-body">{T.copyright}</div>
            <div className="flex gap-8">
              {T.legal.map((l) => (
                <span key={l} className="text-[10px] font-light opacity-30 hover:opacity-100 cursor-pointer transition-all font-body">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
