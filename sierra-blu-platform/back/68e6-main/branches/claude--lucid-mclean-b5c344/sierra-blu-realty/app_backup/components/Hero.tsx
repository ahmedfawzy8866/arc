"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const heroImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop";
  const { scrollY } = useScroll();

  // Parallax effects
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.1]);

  return (
    <section className="relative min-h-[110vh] flex flex-col items-center justify-center pt-24 pb-32 overflow-hidden bg-[#050510]">
      {/* Immersive Background */}
      <motion.div 
        style={{ opacity, scale }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={heroImage}
          alt="Cinematic luxury villa"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        {/* Deep blue/purple cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/80 via-[#0A0A16]/40 to-[#050510]" />
        <div className="absolute inset-0 bg-[#050510]/30 mix-blend-multiply" />
      </motion.div>

      <div className="container relative z-10 px-6 max-w-7xl text-center flex flex-col items-center">
        {/* Top Brand Mark */}
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="mb-8"
        >
           <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-[0.4em] font-premium text-white text-glow-cyan">
              Sierra Blu Realty
           </h2>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-7xl font-light mb-12 leading-[1.2] font-premium text-white max-w-4xl"
        >
          AI-Driven — <span className="font-normal text-cyan">Smarter Decisions</span>
        </motion.h1>

        {/* CTA Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-6 mb-24"
        >
          <Link href="/listings" className="btn-primary min-w-[200px]">
             Beyond Brokerage
          </Link>
          <Link href="/about" className="btn-ghost-glass min-w-[200px]">
             Our Philosophy
          </Link>
        </motion.div>


        {/* Feature Tray (Bottom Hero) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-full mt-auto"
        >
           <div className="flex flex-col items-start mb-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-primary)] font-bold mb-2">Upcoming Featured Properties</span>
              <div className="w-12 h-0.5 bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]"></div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {[
                { title: "The Obsidian Villa", loc: "Katameya Heights", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop" },
                { title: "Azure Heights", loc: "New Capital", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" },
                { title: "Lumina Estate", loc: "Mivida", img: "https://images.unsplash.com/photo-1600607687940-467f4b630a19?q=80&w=2070&auto=format&fit=crop" },
                { title: "Neon Skyline", loc: "Golden Square", img: "https://images.unsplash.com/photo-1541888086225-ee826be0c2b2?q=80&w=2070&auto=format&fit=crop" }
              ].map((prop, i) => (
                <div key={i} className="group relative h-48 rounded-2xl overflow-hidden glass border-white/5 cursor-pointer">
                   <Image 
                     src={prop.img} 
                     alt={prop.title}
                     fill 
                     className="object-cover opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent " />
                   <div className="absolute bottom-4 left-4 text-left">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)] mb-1">{prop.loc}</p>
                      <h4 className="text-sm font-bold text-white group-hover:text-[var(--accent-primary)] transition-colors">{prop.title}</h4>
                   </div>
                </div>
              ))}
           </div>
        </motion.div>
      </div>

      {/* Floating Action / Advisor button fixed but adjusted */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="fixed bottom-12 right-12 z-40 hidden lg:block"
      >
        <Link href="/portal" className="glass flex items-center gap-4 px-6 py-4 border-[var(--accent-primary)]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-105 transition-all group">
            <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-[var(--background)] shadow-[0_0_20px_var(--accent-glow-strong)] transition-shadow group-hover:shadow-[0_0_40px_var(--accent-glow-strong)]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3c0 1.13-.91 2.08-2.04 2.02A19.88 19.88 0 0 1 3.08 4.02C3.02 2.89 3.97 1.98 5.1 2h3c.96 0 1.8.63 2.06 1.56.26.96-.13 1.96-.83 2.6L7.5 7.92a15.42 15.42 0 0 0 8.58 8.58l1.76-1.83c.64-.7 1.64-1.09 2.6-.83.93.26 1.56 1.1 1.56 2.06z"/></svg>
            </div>
            <div className="flex flex-col text-left">
               <span className="text-[10px] uppercase font-bold tracking-widest text-[#4E5872]">Private Access</span>
               <span className="text-white font-bold group-hover:text-[var(--accent-primary)] transition-colors">Advisor Portal</span>
            </div>
        </Link>
      </motion.div>
    </section>
  );
}
