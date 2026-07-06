"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';
import { I18nProvider, useI18n } from '../../lib/I18nContext';
import LanguageToggle from '../../components/UI/LanguageToggle';
import BrandLogo from '../../components/UI/BrandLogo';
import { SiteConfig } from '../../lib/config';

interface FeaturedProperty {
  title: string;
  titleAr?: string;
  location: string;
  locationAr?: string;
  price: string;
  img: string;
}

const fallbackCollection: FeaturedProperty[] = [
  { title: 'Azure Waterfront Villa', titleAr: 'فيلا أزور المطلة على البحر', location: 'Marassi, North Coast', locationAr: 'مراسي، الساحل الشمالي', price: 'EGP 13.5M', img: '/villa.png' },
  { title: 'Geometric Sky Penthouse', titleAr: 'بنتهاوس جيومتريك سكاي', location: 'Sodic East, New Cairo', locationAr: 'سوديك إيست، القاهرة الجديدة', price: 'EGP 22.0M', img: '/penthouse.png' },
  { title: 'Botanica Estate', titleAr: 'بوتانيكا إستيت', location: 'Mountain View, Giza', locationAr: 'ماونتن فيو، الجيزة', price: 'EGP 9.8M', img: '/estate.png' },
];

/* ─── Architectural Layer Data (The Construction Layers) ─── */
const ARCH_LAYERS = [
  { id: 'sky', depth: 0.05, opacity: 0.3, blend: 'screen' },
  { id: 'blueprint', depth: 0.15, opacity: 0.6, blend: 'overlay' },
  { id: 'structure', depth: 0.25, opacity: 0.8, blend: 'normal' },
  { id: 'glass', depth: 0.10, opacity: 0.4, blend: 'soft-light' },
];

function LandingContent() {
  const { locale, setLocale, t } = useI18n();
  const isAr = locale === 'ar';

  const [featured, setFeatured] = useState<FeaturedProperty[]>(fallbackCollection);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const heroRef = useRef<HTMLElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  /* ─── Load featured from Firestore ─── */
  useEffect(() => {
    async function loadFeatured() {
      try {
        const q = query(collection(db, 'listings'), where('isFeatured', '==', true), limit(6));
        const snap = await getDocs(q);
        if (snap.size > 0) {
          const items = snap.docs.map(doc => {
            const d = doc.data();
            return {
              title: d.title || d.name || 'Property',
              titleAr: d.titleAr || d.nameAr || '',
              location: d.location || d.area || '',
              locationAr: d.locationAr || d.areaAr || '',
              price: d.price ? `EGP ${(d.price / 1_000_000).toFixed(1)}M` : 'Price on Request',
              img: d.images?.[0] || d.thumbnail || '/villa.png',
            };
          });
          setFeatured(items);
        }
      } catch { /* Silent handle fallback */ }
    }
    loadFeatured();
  }, []);

  /* ─── Parallax animation loop ─── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    let currentX = 0.5;
    let currentY = 0.5;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      currentX = lerp(currentX, mouseRef.current.x, 0.07);
      currentY = lerp(currentY, mouseRef.current.y, 0.07);

      const dx = (currentX - 0.5) * 2;
      const dy = (currentY - 0.5) * 2;
      const rtlMul = isAr ? -1 : 1;

      if (heroContentRef.current) {
        heroContentRef.current.style.transform = `translate(${dx * -15 * rtlMul}px, ${dy * -10}px)`;
      }
      if (heroTitleRef.current) {
        heroTitleRef.current.style.transform = `translate(${dx * -35 * rtlMul}px, ${dy * -25}px)`;
      }

      layersRef.current.forEach((layer, i) => {
        if (!layer) return;
        const depth = ARCH_LAYERS[i].depth;
        layer.style.transform = `translate(${dx * (150 * depth) * rtlMul}px, ${dy * (100 * depth)}px)`;
      });

      cardsRef.current.forEach((card) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const relX = (mouseRef.current.x * window.innerWidth - cx) / rect.width;
        const relY = (mouseRef.current.y * window.innerHeight - cy) / rect.height;
        if (Math.sqrt(relX * relX + relY * relY) < 1.5) {
          card.style.transform = `perspective(1000px) rotateY(${relX * 8}deg) rotateX(${-relY * 8}deg) translateY(-8px)`;
        } else {
          card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)`;
        }
      });

      statsRef.current.forEach((stat, i) => {
        if (!stat) return;
        stat.style.transform = `translate(${dx * (10 + i * 5) * rtlMul}px, ${dy * 5}px)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isAr, handleMouseMove]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      });
      const res = await response.json();
      if (!res.success) throw new Error(res.error);
      setSubmitted(true);
    } catch {
      setSubmitError(isAr ? 'خطأ في الإرسال' : 'Submission failed');
    }
    setLoading(false);
  };

  const stats = [
    { val: '1.2B', label: isAr ? 'أصول مُدارة' : 'Assets Managed' },
    { val: '85+', label: isAr ? 'مجمع سكني فاخر' : 'Luxury Compounds' },
    { val: '15m', label: isAr ? 'Avg. Response' : 'Avg. Response' },
  ];

  return (
    <div className="landing-container glassmorphism-bg" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="landing-nav">
        <BrandLogo size="lg" />
        <div className="nav-links">
          <LanguageToggle onLocaleChange={setLocale} />
          <Link href="/" className="btn btn-outline btn-sm cinematic-glow">
            {isAr ? 'مدخل المستشارين' : 'Advisor Portal'}
          </Link>
        </div>
      </nav>

      {/* Hero with Architectural Construction Parallax */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-overlay"></div>
        
        {/* The Building Layers (Villas/Buildings building up) */}
        <div className="arch-background">
          {ARCH_LAYERS.map((layer, i) => (
            <div
              key={layer.id}
              ref={el => { layersRef.current[i] = el; }}
              className={`arch-layer layer-${layer.id}`}
              style={{ opacity: layer.opacity, mixBlendMode: layer.blend as any }}
            />
          ))}
          {/* Moving Blueprint Grid */}
          <div className="blueprint-grid"></div>
        </div>

        <div ref={heroContentRef} className="hero-content">
          <h1 ref={heroTitleRef} className="hero-title serif luxury-gradient-text animate-up">
            {isAr ? 'بناء الرؤية الحقيقية' : 'The Art of Construction'}
          </h1>
          <p className="hero-subtitle animate-up" style={{ animationDelay: '0.2s' }}>
            {isAr
              ? 'تجاوز حدود العقار العادي. نحن نبني مستقبلاً مستداماً عبر اختيار الأصول بعناية معمارية مطلقة.'
              : 'Beyond standard real estate sourcing. We build sustained legacies through ultra-precise architectural selection.'}
          </p>
          <div className="animate-up" style={{ marginTop: '48px', animationDelay: '0.4s' }}>
            <a href="#collection" className="btn btn-primary btn-lg cinematic-glow">
              {isAr ? 'استعراض المحفظة' : 'Exhibit the Portfolio'}
            </a>
          </div>
        </div>
      </section>

      {/* Corporate Metrics */}
      <section className="stats-bar">
        {stats.map((stat, i) => (
          <div key={i} ref={el => { statsRef.current[i] = el; }} className="stat-item">
            <div className="stat-val gold-text">{stat.val}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Collection Matrix */}
      <section id="collection" className="collection-section">
        <h2 className="section-title luxury-gradient-text serif">
          {isAr ? 'أصول استراتيجية' : 'Curated Assets'}
        </h2>
        <div className="collection-grid">
          {featured.map((item, i) => (
            <div key={i} ref={el => { cardsRef.current[i] = el; }} className="collection-card cinematic-surface">
              <div className="card-img-mock">
                <img src={item.img} alt={item.title} />
                <div className="arch-lines"></div>
              </div>
              <div className="card-content">
                <div className="card-loc gold-text">{isAr ? item.locationAr : item.location}</div>
                <div className="card-title serif">{isAr ? item.titleAr : item.title}</div>
                <div className="card-price">{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Terminal */}
      <section className="contact-section shadow-gold">
        <div className="contact-grid">
          <div className="contact-info">
             <div className="protocol-tab">PROTOCOL</div>
             <h2 className="serif luxury-gradient-text">
               {isAr ? 'قناة اتصال استراتيجية' : 'Strategic Bridge'}
             </h2>
             <p>
               {isAr
                 ? 'شارك رؤيتك مع فريقي الاستشاري المعتمد. ستحصل على تحليل دقيق للسوق مخصص لمحفظتك.'
                 : 'Initiate contact via our advisory matrix. We offer high-fidelity market analysis tailored to your brief.'}
             </p>
          </div>
          <div className="contact-form-wrap cinematic-surface">
            {submitted ? (
              <div className="success-message">
                <div className="stat-val gold-text">RECEIVED</div>
                <p>{isAr ? 'تم تأمين طلبك.' : 'Your request is secured.'}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input className="form-input" placeholder={isAr ? 'الاسم' : 'Full Name'} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input className="form-input" placeholder={isAr ? 'رقم الهاتف' : 'Phone'} required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <textarea className="form-input" placeholder={isAr ? 'موجز الاستثمار...' : 'Investment Brief...'} rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                <button className="btn btn-primary btn-block cinematic-glow" disabled={loading}>
                  {loading ? '...' : (isAr ? 'تأمين الاستشارة' : 'SECURE CONSULTATION')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="landing-footer cinematic-surface">
        <div className="footer-grid">
           <div>
             <BrandLogo size="md" />
             <p>{isAr ? 'سييرا بلو — ما وراء الوساطة.' : 'Sierra Blu — Beyond Brokerage.'}</p>
           </div>
           <div>
             <h4 className="gold-text">EXECUTIVE</h4>
             <p><strong>{SiteConfig.executive.name}</strong></p>
             <p>{SiteConfig.executive.role}</p>
             <p className="luxury-gradient-text" style={{ fontWeight: 'bold' }}>{SiteConfig.executive.phone}</p>
           </div>
           <div>
             <h4 className="gold-text">CHANNELS</h4>
             <a href={SiteConfig.executive.telegramBot} target="_blank">Telegram Bot</a><br />
             <a href={SiteConfig.contact.whatsapp} target="_blank">WhatsApp Direct</a>
           </div>
        </div>
      </footer>

      <style jsx>{`
        .landing-container { background: #04101e; color: #fff; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .landing-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 8%; position: absolute; width: 100%; z-index: 100; top: 0; }
        .nav-links { display: flex; align-items: center; gap: 20px; }
        
        /* High-End Architectural Background */
        .hero-section { height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; }
        .hero-overlay { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(4,16,30,0.6) 0%, #04101e 95%); z-index: 10; }
        
        .arch-background { position: absolute; inset: -5%; z-index: 5; background: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop') center/cover; }
        .arch-layer { position: absolute; inset: -10%; background-size: cover; background-position: center; pointer-events: none; transition: transform 0.05s linear; }
        
        .layer-blueprint { background-image: url('https://www.transparenttextures.com/patterns/graphy-dark.png'); mix-blend-mode: color-dodge; filter: brightness(0.5) sepia(1) hue-rotate(30deg); }
        .blueprint-grid { position: absolute; inset: 0; background-image: radial-gradient(rgba(212,175,55,0.15) 1px, transparent 1px); background-size: 40px 40px; opacity: 0.3; }

        .hero-content { position: relative; z-index: 20; max-width: 900px; padding: 0 40px; }
        .hero-title { font-size: 5rem; line-height: 1; margin-bottom: 24px; font-weight: 800; }
        .hero-subtitle { font-size: 1.5rem; opacity: 0.8; line-height: 1.6; }

        .stats-bar { display: flex; justify-content: space-around; padding: 60px 10%; background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(212,175,55,0.1); }
        .stat-item { text-align: center; }
        .stat-val { font-size: 42px; font-weight: 800; }
        .stat-label { font-size: 12px; letter-spacing: 3px; opacity: 0.5; text-transform: uppercase; margin-top: 8px; }

        .collection-section { padding: 120px 10%; }
        .section-title { font-size: 3.5rem; text-align: center; margin-bottom: 80px; }
        .collection-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        
        .collection-card { background: rgba(255,255,255,0.03); border-radius: 2px; overflow: hidden; border: 1px solid rgba(212,175,55,0.08); transition: transform 0.1s ease-out; cursor: pointer; }
        .card-img-mock { height: 350px; background: #111; position: relative; overflow: hidden; }
        .card-img-mock img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; transition: scale 0.5s; }
        .collection-card:hover img { scale: 1.1; opacity: 0.9; }
        .card-content { padding: 30px; position: relative; }
        .card-loc { font-size: 11px; letter-spacing: 2px; font-weight: 700; margin-bottom: 10px; }
        .card-title { font-size: 24px; margin-bottom: 8px; }
        .card-price { font-weight: 600; opacity: 0.6; }

        .contact-section { padding: 120px 10%; background: #0a192f; position: relative; overflow: hidden; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
        .protocol-tab { border-left: 2px solid var(--gold); padding-left: 15px; font-size: 12px; font-weight: 900; letter-spacing: 4px; color: var(--gold); margin-bottom: 24px; }
        
        .contact-form-wrap { padding: 50px; border: 1px solid rgba(212,175,55,0.1); border-radius: 4px; background: rgba(0,0,0,0.2); }
        .form-input { width: 100%; background: rgba(255,255,255,0.02); border: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 15px 0; color: #fff; margin-bottom: 25px; outline: none; transition: border-color 0.3s; }
        .form-input:focus { border-color: var(--gold); }

        .landing-footer { padding: 80px 10%; border-top: 1px solid rgba(212,175,55,0.05); }
        .footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .contact-info p, .footer-grid p { opacity: 0.6; margin-bottom: 8px; }
        .footer-grid a { color: var(--gold); text-decoration: none; font-weight: 600; }

        .animate-up { opacity: 0; transform: translateY(40px); animation: fadeInUp 0.8s ease-out forwards; }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) {
           .collection-grid, .contact-grid, .footer-grid { grid-template-columns: 1fr; }
           .hero-title { font-size: 3rem; }
           .stats-bar { flex-direction: column; gap: 40px; }
        }
      `}</style>
    </div>
  );
}

export default function LandingPage() {
  return (
    <I18nProvider>
      <LandingContent />
    </I18nProvider>
  );
}
