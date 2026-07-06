"use client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MotionContainer from "@/app/components/MotionContainer";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";
import { CONTACT } from "@/lib/site";

const SERVICES = [
  {
    title: "Signature Advisory",
    description:
      "Elite representation tailored for the global collector. Your dedicated advisor orchestrates every detail — from initial discovery to final acquisition — with absolute discretion.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Global Intelligence",
    description:
      "Leveraging proprietary data layers to forecast market velocity and infrastructure shifts, surfacing high-yield opportunities before they materialize in the public sphere.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Off-Market Access",
    description:
      "A curated network of private sellers, developers, and funds allows Sierra-Blu clients first access to properties that never reach the public market.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Portfolio Mastery",
    description:
      "For clients holding a legacy of assets, we provide deep-dive performance audits, yield optimization, and institutional-grade exit strategies.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "Developer Liaison",
    description:
      "We bridge the gap between discerning buyers and Egypt's top developers — negotiating terms, payment structures, and exclusive unit selection on your behalf.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: "Compliance Mastery",
    description:
      "Our trusted legal partners ensure clean titles, secure escrow arrangements, and full regulatory compliance — protecting your capital at every stage.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <MotionContainer
             variants={fadeIn}
             initial="hidden"
             animate="visible"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[1px] bg-gold/40" />
              <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gold">
                Beyond Brokerage
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-luxury leading-tight text-white mb-8">
              Protocol of <br />
              <span className="text-gold text-glow-gold">Excellence.</span>
            </h1>
            <p className="text-[#AEB4C6] text-xl font-light max-w-2xl leading-relaxed">
              We combine artificial intelligence with human expertise to deliver a real estate experience reserved for those who demand more than what the market openly offers.
            </p>
          </MotionContainer>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 relative">
         {/* Background Grid Accent */}
         <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
         
        <MotionContainer
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
        >
          {SERVICES.map((service, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn}
              className="glass-card p-12 group hover:border-gold/30 transition-all duration-700"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold mb-10 group-hover:bg-gold group-hover:text-background transition-all duration-500">
                {service.icon}
              </div>
              <h3 className="text-2xl font-luxury text-white mb-6 group-hover:text-gold transition-colors">
                {service.title}
              </h3>
              <p className="text-[#AEB4C6] text-sm leading-relaxed font-light">{service.description}</p>
            </motion.div>
          ))}
        </MotionContainer>
      </section>

      {/* CTA Block */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto relative">
           <div className="absolute inset-0 bg-gold/5 blur-[100px] rounded-full" />
           <div className="glass-card p-16 md:p-24 border border-gold/20 text-center relative z-10 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <MotionContainer
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <span className="text-gold text-[10px] uppercase font-bold tracking-[0.5em] mb-10 block">
                  Confidential Briefing
                </span>
                <h2 className="text-4xl md:text-6xl font-luxury text-white mb-8">
                  Initiate Your <br /> Consultation.
                </h2>
                <p className="text-[#AEB4C6] text-lg mb-12 max-w-xl mx-auto leading-relaxed font-light">
                  Our Senior Advisory team will respond within a private window to arrange a briefing tailored to your portfolio goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <a
                    href={CONTACT.emailHref}
                    className="btn-primary px-12 py-5 text-sm uppercase tracking-widest min-w-[240px]"
                  >
                    Contact Concierge
                  </a>
                  <a
                    href={`https://wa.me/${CONTACT.phoneHref.replace('tel:', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost-glass px-12 py-5 text-sm uppercase tracking-widest min-w-[240px]"
                  >
                    Direct WhatsApp
                  </a>
                </div>
              </MotionContainer>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
