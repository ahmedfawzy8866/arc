"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import FeaturedListings from "@/app/components/FeaturedListings";
import MotionContainer from "@/app/components/MotionContainer";
import { fadeIn } from "@/lib/motion";

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-hidden">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <MotionContainer
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-12"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-[1px] bg-gold/40" />
                <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gold">
                  Asset Discovery
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-luxury leading-tight text-white mb-8">
                Curated <br />
                <span className="text-gold text-glow-gold">Portfolio.</span>
              </h1>
              <p className="text-[#AEB4C6] text-lg font-light max-w-lg leading-relaxed">
                Explore our exclusive collection of New Cairo&apos;s finest residences, vetted through our AI-led selection process.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="p-[1px] rounded-full bg-gradient-to-r from-white/10 to-transparent">
                <select className="bg-surface/40 backdrop-blur-xl border-none text-white px-8 py-4 rounded-full outline-none focus:ring-1 focus:ring-accent-primary/50 text-xs font-bold uppercase tracking-widest cursor-pointer appearance-none pr-12">
                  <option>All Neighborhoods</option>
                  <option>Katameya Heights</option>
                  <option>Mivida</option>
                  <option>Palm Hills</option>
                </select>
              </div>
              <div className="p-[1px] rounded-full bg-gradient-to-r from-white/10 to-transparent">
                <select className="bg-surface/40 backdrop-blur-xl border-none text-white px-8 py-4 rounded-full outline-none focus:ring-1 focus:ring-accent-primary/50 text-xs font-bold uppercase tracking-widest cursor-pointer appearance-none pr-12">
                  <option>Price: Any</option>
                  <option>EGP 50M - 100M</option>
                  <option>EGP 100M+</option>
                </select>
              </div>
            </div>
          </MotionContainer>
        </div>
      </section>

      {/* Grid Section */}
      <div className="pb-32">
         <FeaturedListings />
      </div>

      <Footer />
    </main>
  );
}
