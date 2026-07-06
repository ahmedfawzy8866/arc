"use client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import MotionContainer from "@/app/components/MotionContainer";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-[85vh] flex items-center">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
            alt="Luxury Architecture"
            fill
            className="object-cover opacity-10 scale-110 animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-accent-primary/5 blur-[120px] rounded-full -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <MotionContainer
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <div className="flex items-center gap-4">
              <span className="w-8 h-[1px] bg-gold/40" />
              <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gold">
                Heritage of Intelligence
              </span>
            </div>
            <h1 className="text-6xl md:text-9xl font-luxury leading-tight text-white mb-8">
              Protocol of <br/>
              <span className="text-gold text-glow-gold italic">Sierra Blu.</span>
            </h1>
            <p className="text-[#AEB4C6] text-xl font-light leading-relaxed max-w-2xl">
              We operate at the intersection of structural luxury and technological precision. Sierra Blu is a private advisory firm utilizing proprietary AI to pinpoint the most lucrative investment opportunities in the modern Egyptian landscape.
            </p>
          </MotionContainer>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 relative overflow-hidden">
         {/* Background Grid Accent */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
         
        <MotionContainer
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 relative z-10"
        >
          {[
            {
              title: "Proprietary Data",
              description: "Our algorithms analyze market velocity, infrastructure shifts, and historical trends to forecast asset appreciation with surgical precision.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              )
            },
            {
              title: "Private Network",
              description: "We serve a global clientele that demands absolute discretion, offering first-look access to off-market portfolios before public deployment.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              )
            },
            {
              title: "Signature Curation",
              description: "Beyond the common market, we maintain an elite catalog of New Cairo's most exceptional penthouses, villas, and legacy properties.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              )
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeIn}
              className="glass-card p-12 group hover:border-gold/30 transition-all duration-700"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gold mb-10 border border-white/10 group-hover:bg-gold group-hover:text-background transition-all duration-500">
                {item.icon}
              </div>
              <h3 className="text-2xl font-luxury text-white mb-6 group-hover:text-gold transition-colors">{item.title}</h3>
              <p className="text-[#AEB4C6] text-sm font-light leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </MotionContainer>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <MotionContainer
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "EGP 2B+", label: "Capital Deployed" },
              { value: "15+", label: "Elite Partners" },
              { value: "98%", label: "Retention" },
              { value: "500+", label: "Vetted Assets" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeIn} className="text-center p-12 glass-card border-none bg-surface/40">
                <div className="text-4xl md:text-5xl font-luxury text-gold mb-4 text-glow-gold">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#AEB4C6] font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </MotionContainer>
        </div>
      </section>

      <Footer />
    </main>
  );
}

