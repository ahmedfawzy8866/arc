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
//  DESIGN TOKENS
// ══════════════════════════════════════════════════════════
const G = '#E9C176';
const G2 = '#C8961A';

const THEMES = {
  dark: {
    bg: '#132D47', bgAlt: '#0F2435', bg2: '#1A3352',
    surface: 'rgba(255,255,255,0.065)', surfaceHover: 'rgba(233,193,118,0.12)',
    card: '#1A3352', cardBorder: 'rgba(233,193,118,0.12)',
    border: 'rgba(233,193,118,0.20)', borderHover: 'rgba(233,193,118,0.48)',
    text: '#F5FBFA', textSub: 'rgba(245,251,250,0.80)', textMuted: 'rgba(245,251,250,0.55)',
    navBg: 'rgba(19,45,71,0.97)', footerBg: '#0F2131', heroBg: '#0F2435',
  },
  light: {
    bg: '#E0F0ED', bgAlt: '#D0E2DF', bg2: '#F0F5F4',
    surface: 'rgba(27,108,168,0.09)', surfaceHover: 'rgba(233,193,118,0.16)',
    card: '#F0F5F4', cardBorder: 'rgba(27,108,168,0.16)',
    border: 'rgba(27,108,168,0.22)', borderHover: 'rgba(233,193,118,0.58)',
    text: '#061421', textSub: 'rgba(6,20,33,0.80)', textMuted: 'rgba(6,20,33,0.58)',
    navBg: 'rgba(224,240,237,0.98)', footerBg: '#030D16', heroBg: '#D0E2DF',
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
    nav: ['Properties', 'Intelligence', 'About', 'Contact'],
    cta: 'Browse Listings',
    heroTag: 'Beyond Brokerage',
    heroH1: ['Smarter', 'Real Estate.'],
    heroItalic: 'Powered by AI intelligence.',
    heroSub: 'New Cairo\'s Premier Rent & Resale Platform',
    heroDesc: 'We combine advanced AI with an exclusive network of 1,500+ elite brokers across New Cairo, Madinaty, and El Shorouk to deliver unmatched value tailored to your needs.',
    btnDiscover: 'Browse Properties',
    btnView: 'Talk to Sierra AI',
    stats: [['1,200+', 'Properties'], ['98%', 'Match Rate'], ['8+', 'Compounds'], ['4s', 'Response Time']],
    scroll: 'Scroll',
    secListings: 'Exclusive Listings',
    h2Listings: 'Homes worth knowing.',
    viewAll: 'View All →',
    searchType: 'Property Type', searchCompound: 'Compound', searchBudget: 'Budget', searchBtn: 'Search Now',
    beds: 'bed', baths: 'bath',
    secWhy: 'The Sierra Blu Difference',
    h2Why: 'Why clients choose us.',
    whyDesc: 'We don\'t just search the market — we analyze it. Powered by AI and 1,500+ trusted brokers, we scan every corner of New Cairo to bring you only the highest-value properties that meet your exact needs.',
    why: [
      { icon: '◆', title: 'Curated Selection', stat: '1,200+', statLabel: 'vetted listings', desc: 'Every property is hand-checked by our advisors. We reject overpriced inventory so you only see what\'s worth your time and money.' },
      { icon: '◈', title: 'AI-Powered Matching', stat: '98%', statLabel: 'match accuracy', desc: 'Our AI cross-references your criteria against live market data, price history, and ROI projections to surface the best deals first.' },
      { icon: '◉', title: 'Dedicated Advisor', stat: '4s', statLabel: 'avg response', desc: 'One advisor from first call to final signature. They know your budget, your preferences, and the market — no handoffs, no repeating yourself.' },
    ],
    bannerH: 'Exceptional Homes, Intelligent Matching',
    bannerSub: 'منازل استثنائية، مطابقة ذكية',
    bannerBtn: 'View Properties',
    secMap: 'Market Intelligence',
    mapH1: 'New Cairo', mapH2: 'Investment Map',
    mapDesc: 'Real-time data across New Cairo\'s premium zones. Track growth corridors, rental yields, and exclusive off-market signals.',
    zones: [
      { area: 'Fifth Settlement', stat: 'Growth +12%', color: '#4ECDC4' },
      { area: 'Madinaty', stat: 'High Demand', color: G },
      { area: 'MV iCity', stat: 'Yield 8%', color: '#7EA8B4' },
      { area: 'Mostakbal City', stat: 'Off‑Market', color: '#C084FC' },
      { area: 'Hyde Park', stat: 'Premium', color: '#F97316' },
      { area: 'Mivida', stat: 'Yield 7.5%', color: '#22D3EE' },
    ],
    mapBtn: 'Explore AI Insights →',
    secAI: 'Meet Sierra',
    aiH: 'Your AI Real Estate Consultant',
    aiSub: 'First Official AI Real Estate Bot Consultant in Egypt',
    aiDesc: 'Sierra is always on — analyzing market data, answering your questions, and matching you with properties that fit your exact criteria. Start a conversation and see the difference intelligence makes.',
    aiCTA: 'Start on Telegram →',
    aiFeatures: ['Instant property matching', 'Market analytics & ROI', 'Arabic & English support', '24/7 availability'],
    aiChat: [
      { from: 'user', text: 'Looking for a 4‑bed villa under 15M EGP in Fifth Settlement' },
      { from: 'bot', text: 'Found 7 matching properties. Top pick: Villa Lumière — 5 beds, 480 m², EGP 14.2M. ROI: 8.3% annual yield. Shall I send the full report?' },
    ],
    secTesti: 'Client Stories',
    h2Testi: 'What our clients say',
    testimonials: [
      { q: 'I used to spend weeks searching the New Cairo market. Sierra Blu changed everything. Their AI matched me with the exact villa I wanted at the best price available. One platform, zero wasted time.', name: 'Omar T.', role: 'Real Estate Investor', i: 'OT' },
      { q: 'Finding the right home in New Cairo seemed impossible until Sierra Blu. Their system understood our exact needs and filtered out the noise to deliver the perfect property. Smartest decision we made.', name: 'Sarah & Michael V.', role: 'Relocating Family', i: 'SMV' },
      { q: 'Sierra Blu found me a property that wasn\'t even on my radar. The AI scans the entire market and delivers the best value. Exact match, zero guesswork.', name: 'Karim H.', role: 'CEO, Apex Holdings', i: 'KH' },
    ],
    ctaTag: 'Find Your Place',
    ctaH: 'Find Your Place in New Cairo',
    ctaSub: 'Leave your details — a Sierra advisor reaches out within 4 seconds.',
    formName: 'Your name', formPhone: 'Mobile number', formSubmit: 'Get My 25% Discount',
    formSuccess: 'We\'re on it. A Sierra advisor will reach out within 4 seconds.',
    footDesc: 'Beyond Brokerage. AI-powered real estate intelligence for discerning investors in New Cairo and beyond.',
    footNav: 'Navigation', footNavLinks: ['Properties', 'Intelligence', 'About Us', 'Careers', 'Contact'],
    footMarkets: 'Markets', footMarketLinks: ['New Cairo', 'Fifth Settlement', 'Madinaty', 'Mostakbal City', 'Mountain View'],
    footContact: 'Contact',
    copyright: '© 2026 Sierra Blu Realty. All rights reserved.',
    legal: ['Privacy Policy', 'Terms of Service', 'Cookies'],
  },
  ar: {
    dir: 'rtl' as const,
    brand: 'سييرا بلو', sub: 'للعقارات',
    tagline: 'ذكاء عقاري مدعوم بالذكاء الاصطناعي',
    nav: ['العقارات', 'الذكاء', 'عنّا', 'اتصل'],
    cta: 'تصفح العقارات',
    heroTag: 'أبعد من الوساطة',
    heroH1: ['عقارات', 'أذكى.'],
    heroItalic: 'مدعومة بالذكاء الاصطناعي.',
    heroSub: 'منصة القاهرة الجديدة للبيع والإيجار',
    heroDesc: 'نجمع بين الذكاء الاصطناعي وشبكة حصرية من ١٥٠٠+ وسيط عقاري في القاهرة الجديدة ومدينتي والشروق لنوفر لك أفضل قيمة تلبي احتياجاتك بالضبط.',
    btnDiscover: 'تصفح العقارات',
    btnView: 'تحدّث مع سييرا',
    stats: [['١٢٠٠+', 'عقار'], ['٩٨٪', 'نسبة المطابقة'], ['٨+', 'كمباوند'], ['٤ث', 'زمن الرد']],
    scroll: 'اسحب',
    secListings: 'قوائم حصرية',
    h2Listings: 'منازل تستحق الاهتمام.',
    viewAll: '← عرض الكل',
    searchType: 'نوع العقار', searchCompound: 'الكمباوند', searchBudget: 'الميزانية', searchBtn: 'ابحث الآن',
    beds: 'غرف', baths: 'حمامات',
    secWhy: 'تميّز سييرا بلو',
    h2Why: 'لماذا يختارنا عملاؤنا.',
    why: [
      { icon: '◆', title: 'اختيار منتقى', stat: '١٢٠٠+', statLabel: 'عقار موثق', desc: 'كل عقار يتم فحصه يدوياً. نرفض المبالغ في سعره لتشاهد فقط ما يستحق وقتك ومالك.' },
      { icon: '◈', title: 'مطابقة بالذكاء الاصطناعي', stat: '٩٨٪', statLabel: 'دقة المطابقة', desc: 'ذكاؤنا الاصطناعي يقارن معاييرك ببيانات السوق الحية وتاريخ الأسعار وتوقعات العائد ليظهر لك أفضل الصفقات أولاً.' },
      { icon: '◉', title: 'مستشار مخصص', stat: '٤ث', statLabel: 'متوسط الرد', desc: 'مستشار واحد من أول اتصال لآخر توقيع. يعرف ميزانيتك وتفضيلاتك والسوق — بدون تحويلات أو تكرار.' },
    ],
    bannerH: 'منازل استثنائية، مطابقة ذكية',
    bannerSub: 'Exceptional Homes, Intelligent Matching',
    bannerBtn: 'عرض العقارات',
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
    formName: 'اسمك', formPhone: 'رقم الموبايل', formSubmit: 'احصل على خصم ٢٥٪',
    formSuccess: 'نحن على الموضوع. مستشار سييرا سيتواصل معك خلال ٤ ثوانٍ.',
    footDesc: 'أبعد من الوساطة. ذكاء عقاري مدعوم بالذكاء الاصطناعي للمستثمرين في القاهرة الجديدة.',
    footNav: 'روابط التنقل', footNavLinks: ['العقارات', 'الذكاء', 'عنّا', 'الوظائف', 'اتصل'],
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
  { id: 1, title: 'Aurora Penthouse', titleAr: 'بنتهاوس أورورا', location: 'Madinaty · New Cairo', locationAr: 'مدينتي · القاهرة الجديدة', price: 'EGP 8,500,000', beds: 4, baths: 3, sqft: '320 m²', badge: 'Hidden Gem', badgeColor: '#7C3AED', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80' },
  { id: 2, title: 'Villa Lumière', titleAr: 'فيلا لوميير', location: 'Mountain View · 5th Settlement', locationAr: 'ماونتن فيو · التجمع الخامس', price: 'EGP 14,200,000', beds: 5, baths: 4, sqft: '480 m²', badge: 'Featured', badgeColor: '#C8961A', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80' },
  { id: 3, title: 'The Boulevard', titleAr: 'ذا بوليفار', location: 'Mostakbal City · Future', locationAr: 'مستقبل سيتي · المستقبل', price: 'EGP 3,800,000', beds: 3, baths: 2, sqft: '185 m²', badge: 'New', badgeColor: '#1B6CA8', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80' },
  { id: 4, title: 'Emirates Crown', titleAr: 'إيمارتس كراون', location: 'Fifth Settlement · Cairo', locationAr: 'التجمع الخامس · القاهرة', price: 'EGP 22,000,000', beds: 6, baths: 5, sqft: '650 m²', badge: 'Off Market', badgeColor: '#059669', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80' },
  { id: 5, title: 'Palm Residences', titleAr: 'بالم ريزيدنسز', location: 'Madinaty · Block 7', locationAr: 'مدينتي · بلوك ٧', price: 'EGP 5,900,000', beds: 3, baths: 3, sqft: '240 m²', badge: 'High ROI', badgeColor: '#DC2626', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80' },
  { id: 6, title: 'Sky Tower Penthouse', titleAr: 'بنتهاوس سكاي تاور', location: 'Downtown New Cairo', locationAr: 'وسط القاهرة الجديدة', price: 'EGP 11,500,000', beds: 4, baths: 4, sqft: '380 m²', badge: 'Price Reduced', badgeColor: '#D97706', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80' },
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

    fetch('/api/listings?limit=6')
      .then((res) => res.json())
      .then((data) => {
        if (data.listings && Array.isArray(data.listings)) {
          const mapped = data.listings.map((item: any) => ({
            id: item.id,
            title: item.title,
            compound: item.compound,
            location: item.compound,
            price: item.price,
            bedrooms: item.beds,
            bathrooms: item.baths,
            area: parseInt(item.area) || 200,
            status: 'available',
          }));
          setFeatured(mapped);
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

  const sec: React.CSSProperties = { maxWidth: 1280, margin: '0 auto', padding: '0 48px' };

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
        price: `EGP ${p.price.toLocaleString()}`,
        beds: p.bedrooms || 3,
        baths: Math.max(1, Math.floor((p.bedrooms || 3) * 0.7)),
        sqft: `${p.area || 200} m²`,
        badge: p.status || 'Available',
        badgeColor: G2,
        img: STATIC_LISTINGS[Math.min(STATIC_LISTINGS.length - 1, featured.indexOf(p))].img,
      }))
    : STATIC_LISTINGS;

  return (
    <div style={{ minHeight: '100vh', background: th.bg, color: th.text, transition: 'background .5s, color .5s' }} dir={T.dir}>

      {/* ══ NAV ══ */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', background: scrolled ? th.navBg : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${th.border}` : '1px solid transparent', transition: 'all .4s cubic-bezier(.16,1,.3,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <ShieldLogo size={38} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isAr ? 16 : 18, fontWeight: 600, letterSpacing: isAr ? '.06em' : '.2em', color: G, lineHeight: 1 }}>{T.brand}</div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '.38em', color: th.textSub, marginTop: 2 }}>{T.sub}</div>
          </div>
        </div>
        <div className="hidden md:flex" style={{ gap: 32, alignItems: 'center' }}>
          {T.nav.map((n, i) => (
            <span key={n} onClick={() => scrollTo(['listings', 'intelligence', 'about', 'contact'][i])} className="hover:text-secondary transition-colors cursor-pointer" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.13em', textTransform: 'uppercase', color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{n}</span>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} style={{ background: th.surface, border: `1px solid ${th.border}`, color: G, padding: '6px 14px', borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}>
            {lang === 'en' ? 'AR' : 'EN'}
          </button>
          <button onClick={() => setTheme(mode === 'dark' ? 'light' : 'dark')} style={{ background: th.surface, border: `1px solid ${th.border}`, color: th.textSub, width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {mode === 'dark' ? '☀' : '🌙'}
          </button>
          <button onClick={() => scrollTo('listings')} className="hidden sm:inline-flex" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: th.text, border: `1px solid ${th.border}`, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', padding: '8px 18px', borderRadius: 4, transition: 'all .3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = G; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.text; }}>{T.cta}</button>
        </div>
      </nav>

      {/* Smart filter moved into listings section below */}

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: th.heroBg, paddingTop: 100 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=1800&q=80')", backgroundSize: 'cover', backgroundPosition: 'center 40%', transform: loaded ? 'scale(1)' : 'scale(1.06)', transition: 'transform 2s cubic-bezier(.16,1,.3,1)', opacity: mode === 'dark' ? 0.55 : 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, background: mode === 'dark' ? 'linear-gradient(105deg,rgba(10,21,32,.97) 0%,rgba(13,32,53,.85) 45%,rgba(10,21,32,.4) 100%)' : 'linear-gradient(105deg,rgba(192,214,212,.98) 0%,rgba(213,232,230,.95) 50%,rgba(192,214,212,.7) 100%)' }} />
        <ParticleCanvas />

        <div style={{ ...sec, position: 'relative', zIndex: 2, width: '100%' }}>
          <div className="grid md:grid-cols-[55%_45%] gap-14 items-center" style={{ paddingTop: 0, paddingBottom: 80 }}>
            <div style={{ order: isAr ? 2 : 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexDirection: isAr ? 'row-reverse' : 'row', animation: loaded ? 'fadeUp .6s ease .1s both' : 'none' }}>
                <div style={{ width: 28, height: 1, background: G }} />
                <span style={{ fontSize: 10, letterSpacing: isAr ? '.04em' : '.28em', color: G, fontWeight: 500, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.tagline}</span>
              </div>

              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, color: th.text, lineHeight: 1.1, letterSpacing: '-0.015em', margin: '20px 0 14px', textAlign: isAr ? 'right' : 'left', animation: loaded ? 'fadeUp .7s ease .2s both' : 'none' }}>
                {T.heroH1[0]}<br />{T.heroH1[1]}<br />
                <em className="gold-text" style={{ fontStyle: 'italic' }}>{T.heroItalic}</em>
              </h1>

              <div style={{ fontSize: isAr ? 13 : 11, letterSpacing: isAr ? '.04em' : '.2em', textTransform: 'uppercase', color: G, fontWeight: 500, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", marginBottom: 16, animation: loaded ? 'fadeUp .7s ease .3s both' : 'none' }}>{T.heroSub}</div>

              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.75, color: th.textSub, maxWidth: 480, textAlign: isAr ? 'right' : 'left', marginBottom: 28, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", animation: loaded ? 'fadeUp .7s ease .38s both' : 'none' }}>{T.heroDesc}</p>

              <div className="flex gap-3" style={{ flexDirection: isAr ? 'row-reverse' : 'row', marginBottom: 48, animation: loaded ? 'fadeUp .7s ease .46s both' : 'none' }}>
                <Link href="/listings">
                  <button className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: isAr ? '.02em' : '.14em', textTransform: 'uppercase', padding: '13px 28px', borderRadius: 4, boxShadow: '0 4px 20px rgba(233,193,118,0.26)', textDecoration: 'none', transition: 'all .3s ease' }}>{T.btnDiscover}</button>
                </Link>
                <Link href="/virtual-tour">
                  <button className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: th.text, border: `1px solid ${th.border}`, cursor: 'pointer', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: isAr ? '.02em' : '.14em', textTransform: 'uppercase', padding: '12px 28px', borderRadius: 4, textDecoration: 'none', transition: 'all .3s ease' }}>{T.btnView}</button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4" style={{ background: mode === 'dark' ? 'rgba(255,255,255,0.045)' : 'rgba(7,20,34,0.06)', border: `1px solid ${th.border}`, borderRadius: 8, overflow: 'hidden', backdropFilter: 'blur(12px)', animation: loaded ? 'fadeUp .7s ease .56s both' : 'none' }}>
                {T.stats.map(([val, lbl], i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '18px 12px', borderRight: i < T.stats.length - 1 ? `1px solid ${th.border}` : 'none' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: G, lineHeight: 1, letterSpacing: '-.02em' }}>{val}</div>
                    <div style={{ fontSize: 9, fontWeight: 400, letterSpacing: isAr ? '.02em' : '.12em', textTransform: 'uppercase', color: th.textMuted, marginTop: 5, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero card stack */}
            <div className="hidden md:block relative h-[520px]" style={{ order: isAr ? 1 : 2, animation: loaded ? 'fadeUp .9s ease .45s both' : 'none' }}>
              <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: mode === 'dark' ? 0.03 : 0.025 }}>
                <ShieldLogo size={340} />
              </div>
              {[{ off: 2, op: 0.4 }, { off: 1, op: 0.65 }, { off: 0, op: 1 }].map(({ off, op }, idx) => (
                <div key={idx} style={{ position: 'absolute', top: off * 20, left: off * 20, right: -(off * 20), bottom: -(off * 20), background: off === 0 ? th.card : th.surface, borderRadius: 18, overflow: off === 0 ? 'hidden' : undefined, border: off > 0 ? `1px solid ${th.border}` : undefined, opacity: op, boxShadow: off === 0 ? '0 40px 80px rgba(0,0,0,.4)' : undefined, zIndex: 3 - off }}>
                  {off === 0 && (
                    <>
                      <img src={STATIC_LISTINGS[1].img} alt="" style={{ width: '100%', height: '62%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 12, left: 12, background: G2, color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '.08em', padding: '4px 10px', borderRadius: 50, fontFamily: "'Jost', sans-serif", textTransform: 'uppercase' }}>{STATIC_LISTINGS[1].badge}</div>
                      <div style={{ padding: '18px 22px' }}>
                        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: G, marginBottom: 4, fontFamily: "'Jost', sans-serif" }}>{isAr ? STATIC_LISTINGS[1].locationAr : STATIC_LISTINGS[1].location}</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: th.text, marginBottom: 8 }}>{isAr ? STATIC_LISTINGS[1].titleAr : STATIC_LISTINGS[1].title}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 500, color: G }}>{STATIC_LISTINGS[1].price}</span>
                          <span style={{ fontSize: 11, color: th.textMuted, fontFamily: "'DM Mono', monospace", fontWeight: 300 }}>{STATIC_LISTINGS[1].beds} {T.beds} · {STATIC_LISTINGS[1].baths} {T.baths}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.4, zIndex: 2 }}>
          <span style={{ fontSize: 9, letterSpacing: '.24em', textTransform: 'uppercase', color: th.textMuted, fontFamily: "'Jost', sans-serif" }}>{T.scroll}</span>
          <div className="animate-shimmer" style={{ width: 1, height: 32, background: `linear-gradient(180deg,${G},transparent)` }} />
        </div>
      </section>

      {/* ══ LISTINGS ══ */}
      <section id="listings" ref={listingsSectionRef} style={{ background: mode === 'dark' ? '#0A1520' : th.bgAlt, padding: '80px 0' }}>
        <div style={sec}>
          <div className="reveal flex justify-between items-end mb-10 flex-wrap gap-4" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.secListings}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3.2vw, 42px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text }}>{T.h2Listings}</h2>
            </div>
            <Link href="/listings" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: th.text, border: `1px solid ${th.border}`, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', padding: '9px 20px', borderRadius: 4, textDecoration: 'none' }}>{T.viewAll}</Link>
          </div>

          {/* Smart Filters */}
          <div className="reveal grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-0 rounded-lg overflow-hidden mb-10" style={{ background: mode === 'dark' ? '#122A47' : th.card, border: `1px solid ${th.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            {[
              { val: filterType, set: setFilterType, label: T.searchType, opts: [{ v: '', l: T.searchType }, { v: 'villa', l: 'Villa' }, { v: 'apartment', l: 'Apartment' }, { v: 'penthouse', l: 'Penthouse' }, { v: 'townhouse', l: 'Townhouse' }] },
              { val: filterCompound, set: setFilterCompound, label: T.searchCompound, opts: [{ v: '', l: T.searchCompound }, { v: 'Fifth Settlement', l: 'Fifth Settlement' }, { v: 'New Cairo', l: 'New Cairo' }, { v: 'Madinaty', l: 'Madinaty' }, { v: 'Sheikh Zayed', l: 'Sheikh Zayed' }] },
              { val: filterBedrooms, set: setFilterBedrooms, label: isAr ? 'غرف' : 'Rooms', opts: [{ v: '', l: isAr ? 'غرف' : 'Rooms' }, { v: '1', l: `1 ${T.beds}` }, { v: '2', l: `2 ${T.beds}` }, { v: '3', l: `3 ${T.beds}` }, { v: '4', l: `4 ${T.beds}` }, { v: '5', l: `5+ ${T.beds}` }] },
              { val: filterPrice, set: setFilterPrice, label: T.searchBudget, opts: [{ v: '', l: T.searchBudget }, { v: '2000000', l: 'Under 2M' }, { v: '5000000', l: 'Under 5M' }, { v: '10000000', l: 'Under 10M' }, { v: '15000000', l: 'Under 15M' }] },
            ].map((seg, i) => (
              <div key={i} style={{ padding: '14px 18px', borderRight: `1px solid ${th.border}` }}>
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: th.textMuted, marginBottom: 3, fontFamily: "'Jost', sans-serif" }}>{seg.label}</div>
                <select value={seg.val} onChange={(e) => seg.set(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 13, fontWeight: 300, width: '100%', cursor: 'pointer' }}>
                  {seg.opts.map((o) => <option key={o.v} value={o.v} style={{ background: mode === 'dark' ? '#122A47' : '#fff', color: mode === 'dark' ? '#F5FBFA' : '#071422' }}>{o.l}</option>)}
                </select>
              </div>
            ))}
            <button onClick={handleSearch} className="btn-gold" style={{ borderRadius: 0, padding: '0 28px', background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', transition: 'all .3s ease' }}>{T.searchBtn}</button>
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
      <section id="about" style={{ background: th.bg, padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ opacity: mode === 'dark' ? 0.025 : 0.02 }}>
          <ShieldLogo size={600} />
        </div>
        <div style={{ ...sec, position: 'relative', zIndex: 2 }}>
          <div className="reveal text-center mb-14">
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.secWhy}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3.2vw, 42px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text, marginBottom: 14 }}>{T.h2Why}</h2>
            {'whyDesc' in T && <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: th.textSub, maxWidth: 560, margin: '0 auto', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{(T as any).whyDesc}</p>}
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {T.why.map((w: any, i: number) => (
              <div key={i} className="reveal rounded-[14px] p-8 transition-all hover:-translate-y-1 card-lift" style={{ background: th.surface, border: `1px solid ${th.border}`, textAlign: isAr ? 'right' : 'left' }}>
                <div className="flex items-center justify-between mb-4" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
                  <div style={{ fontSize: 24, color: G, fontFamily: "'Cormorant Garamond', serif" }}>{w.icon}</div>
                  {w.stat && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: G, lineHeight: 1 }}>{w.stat}</div>
                      <div style={{ fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase', color: th.textMuted, fontFamily: "'Jost', sans-serif", marginTop: 2 }}>{w.statLabel}</div>
                    </div>
                  )}
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: th.text, marginBottom: 8 }}>{w.title}</h3>
                <div style={{ width: 36, height: 2, background: `linear-gradient(90deg,${G2},${G})`, borderRadius: 1, marginBottom: 12, marginLeft: isAr ? 'auto' : 0 }} />
                <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{w.desc}</p>
              </div>
            ))}
          </div>

          {/* Banner */}
          <div className="reveal mt-14 p-8 rounded-[14px] flex items-center justify-between flex-wrap gap-5" style={{ background: 'linear-gradient(130deg, rgba(233,193,118,0.10), rgba(233,193,118,0.04))', border: '1px solid rgba(233,193,118,0.22)', flexDirection: isAr ? 'row-reverse' : 'row' }}>
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: th.text, marginBottom: 4 }}>{T.bannerH}</div>
              <div style={{ fontSize: 12, color: 'rgba(233,193,118,0.7)', fontFamily: isAr ? "'Jost', sans-serif" : "'Cairo', sans-serif" }}>{T.bannerSub}</div>
            </div>
            <Link href="/listings">
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '12px 26px', borderRadius: 4, textDecoration: 'none' }}>{T.bannerBtn}</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ INTELLIGENCE MAP ══ */}
      <section id="intelligence" style={{ background: mode === 'dark' ? '#091828' : th.bgAlt, padding: '96px 0' }}>
        <div style={sec}>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div style={{ order: isAr ? 2 : 1 }}>
              <div className="reveal" style={{ textAlign: isAr ? 'right' : 'left' }}>
                <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.secMap}</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: th.text, marginBottom: 10 }}>
                  {T.mapH1}<br /><em className="gold-text" style={{ fontStyle: 'italic' }}>{T.mapH2}</em>
                </h2>
                <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${G2},${G})`, borderRadius: 1, margin: '14px 0' }} />
                <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: th.textSub, marginBottom: 24, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.mapDesc}</p>
              </div>
              <div className="flex flex-col gap-2.5">
                {T.zones.map((z, i) => (
                  <div
                    key={i}
                    className="reveal flex items-center gap-3.5 p-3 px-4 rounded-[10px] cursor-pointer transition-all"
                    style={{ background: activeZone === i ? th.surfaceHover : th.surface, border: `1px solid ${activeZone === i ? z.color + '55' : th.border}`, flexDirection: isAr ? 'row-reverse' : 'row' }}
                    onClick={() => setActiveZone(activeZone === i ? null : i)}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: z.color, flexShrink: 0, boxShadow: `0 0 8px ${z.color}88` }} />
                    <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", textAlign: isAr ? 'right' : 'left' }}>{z.area}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: z.color, background: `${z.color}18`, padding: '3px 10px', borderRadius: 50, fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>{z.stat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal h-[480px]" style={{ order: isAr ? 1 : 2 }}>
              <div className="relative h-full rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(233,193,118,0.22)', boxShadow: '0 32px 80px rgba(0,0,0,.4)' }}>
                <LiveMap mode={mode} />
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none" style={{ fontSize: 8, letterSpacing: '4px', color: 'rgba(233,193,118,0.35)', fontFamily: "'Jost', sans-serif", whiteSpace: 'nowrap' }}>SIERRA BLU INTELLIGENCE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SIERRA AI ══ */}
      <section style={{ padding: '96px 0', background: mode === 'dark' ? 'linear-gradient(135deg, #0A1520 0%, #0D2035 50%, #122A47 100%)' : `linear-gradient(135deg, ${th.bgAlt} 0%, ${th.bg} 50%, ${th.bg2} 100%)`, borderTop: `1px solid ${th.border}`, borderBottom: `1px solid ${th.border}` }}>
        <div style={sec}>
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="reveal" style={{ textAlign: isAr ? 'right' : 'left', order: isAr ? 2 : 1 }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.secAI}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text, marginBottom: 10 }}>{T.aiH}</h2>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', color: '#1B6CA8', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'Jost', sans-serif" }}>{T.aiSub}</div>
              <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${G2},${G})`, borderRadius: 1, margin: '14px 0' }} />
              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: th.textSub, margin: '16px 0 24px', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.aiDesc}</p>
              <div className="flex flex-col gap-2.5 mb-7">
                {T.aiFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5" style={{ fontSize: 13, color: th.textSub, flexDirection: isAr ? 'row-reverse' : 'row', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: G, flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
              <a href="https://t.me/SierraBluBot" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: isAr ? '.02em' : '.14em', textTransform: 'uppercase', padding: '12px 26px', borderRadius: 4, textDecoration: 'none' }}>{T.aiCTA}</a>
            </div>

            {/* Chat mockup */}
            <div className="reveal" style={{ order: isAr ? 1 : 2 }}>
              <div style={{ background: mode === 'dark' ? 'rgba(255,255,255,0.045)' : 'rgba(27,108,168,0.06)', border: '1px solid rgba(233,193,118,0.25)', borderRadius: 16, padding: 28, backdropFilter: 'blur(12px)', boxShadow: '0 0 40px rgba(233,193,118,0.10)' }}>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="relative flex-shrink-0" style={{ width: 50, height: 50, borderRadius: '50%', background: `linear-gradient(135deg,${G2},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    ◈
                    <div className="absolute -inset-1 rounded-full animate-ping opacity-20" style={{ border: `1px solid ${G}` }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: th.text }}>Sierra</div>
                    <div style={{ fontSize: 11, color: '#4ADE80', marginTop: 2, fontFamily: "'DM Mono', monospace", fontWeight: 300 }}>● Online · 4s avg</div>
                  </div>
                </div>
                {T.aiChat.map((msg, i) => (
                  <div key={i} className="flex mb-2.5" style={{ justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 300, lineHeight: 1.6, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", background: msg.from === 'user' ? `linear-gradient(135deg,${G2},${G})` : 'rgba(255,255,255,0.06)', color: msg.from === 'user' ? '#071422' : th.text, border: msg.from === 'user' ? 'none' : `1px solid ${th.border}` }}>{msg.text}</div>
                  </div>
                ))}
                <div className="text-center mt-4" style={{ fontSize: 11, color: th.textMuted, fontFamily: "'Jost', sans-serif" }}>
                  AI-powered · 24/7 · Arabic & English
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ background: mode === 'dark' ? '#0A1628' : th.bg2, padding: '96px 0' }}>
        <div style={sec}>
          <div className="reveal text-center mb-12">
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.secTesti}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text }}>{T.h2Testi}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {T.testimonials.map((t, i) => (
              <div key={i} className="reveal rounded-[14px] card-lift" style={{ padding: 28, background: th.surface, border: `1px solid ${th.border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, color: G, lineHeight: 0.7, marginBottom: 16 }}>&ldquo;</div>
                <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: th.textSub, marginBottom: 20, fontStyle: 'italic', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{t.q}</p>
                <div className="flex items-center gap-3" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${G2},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#071422', flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>{t.i}</div>
                  <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: th.textMuted, fontFamily: "'Jost', sans-serif" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FORM ══ */}
      <section id="contact" style={{ padding: '96px 0', background: mode === 'dark' ? 'linear-gradient(135deg, #0A1520, #0D2035)' : `linear-gradient(135deg, ${th.bg}, ${th.bgAlt})`, borderTop: `1px solid ${th.border}` }}>
        <div style={{ ...sec, maxWidth: 600 }}>
          <div className="reveal text-center mb-10">
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.ctaTag}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: th.text, marginBottom: 12 }}>{T.ctaH}</h2>
            <p style={{ fontSize: 14, fontWeight: 300, color: th.textSub, lineHeight: 1.8, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.ctaSub}</p>
          </div>
          <div className="reveal">
            {submitted ? (
              <div className="text-center p-10 rounded-xl" style={{ background: mode === 'dark' ? 'rgba(233,193,118,0.08)' : 'rgba(233,193,118,0.14)', border: '1px solid rgba(233,193,118,0.3)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: G, marginBottom: 8 }}>{lang === 'en' ? 'Thank you.' : 'شكراً.'}</div>
                <p style={{ fontSize: 14, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.formSuccess}</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-3.5">
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
                    className="focus:border-secondary transition-colors"
                    style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 6, padding: '13px 16px', color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 14, fontWeight: 300, outline: 'none', textAlign: isAr ? 'right' : 'left' }}
                  />
                ))}
                <button type="submit" className="btn-gold" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '14px 26px', borderRadius: 4, transition: 'all .3s ease' }}>{T.formSubmit}</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#040E1C', color: '#EFF8F7', padding: '72px 0 36px', borderTop: '1px solid rgba(233,193,118,0.12)' }}>
        <div style={sec}>
          <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-14 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <ShieldLogo size={42} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isAr ? 16 : 19, fontWeight: 600, letterSpacing: isAr ? '.06em' : '.2em', color: G }}>{T.brand}</div>
                  <div style={{ fontSize: 8, letterSpacing: '.38em', color: 'rgba(239,248,247,0.45)', fontFamily: "'Jost', sans-serif" }}>{T.sub}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.85, color: 'rgba(239,248,247,0.45)', maxWidth: 280, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", textAlign: isAr ? 'right' : 'left' }}>{T.footDesc}</p>
            </div>
            {[
              { title: T.footNav, links: T.footNavLinks, ids: ['listings', 'intelligence', 'about', '', 'contact'] },
              { title: T.footMarkets, links: T.footMarketLinks, ids: ['intelligence', 'intelligence', 'intelligence', 'intelligence', 'intelligence'] },
            ].map((col) => (
              <div key={col.title} style={{ textAlign: isAr ? 'right' : 'left' }}>
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '.22em', color: G, marginBottom: 16, fontFamily: "'Jost', sans-serif" }}>{col.title}</div>
                {col.links.map((l, i) => (
                  <div key={l} onClick={() => col.ids[i] && scrollTo(col.ids[i])} className="hover:text-secondary transition-colors cursor-pointer" style={{ fontSize: 12, fontWeight: 300, color: 'rgba(239,248,247,0.45)', marginBottom: 10, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center flex-wrap gap-3 pt-6" style={{ borderTop: '1px solid rgba(239,248,247,0.07)', flexDirection: isAr ? 'row-reverse' : 'row' }}>
            <div style={{ fontSize: 11, fontWeight: 300, color: 'rgba(239,248,247,0.28)', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.copyright}</div>
            <div className="flex gap-5">
              {T.legal.map((l) => (
                <span key={l} className="hover:text-secondary transition-colors cursor-pointer" style={{ fontSize: 11, fontWeight: 300, color: 'rgba(239,248,247,0.28)', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
