"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MotionContainer from "@/app/components/MotionContainer";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans pt-48 pb-24 px-6 overflow-hidden">
      <Navbar />
      
      {/* Ambient backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[140px] rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-primary/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <MotionContainer
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-gold/40" />
            <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gold">
              Encrypted Inquiry
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-luxury leading-tight text-white mb-4">
            Secure a <span className="text-gold italic text-glow-gold">Consult.</span>
          </h1>
          <p className="text-[#AEB4C6] text-lg font-light max-w-xl">
            Our advisors operate with absolute discretion. Initiate a protocol for private portfolio access or structured investment analysis.
          </p>
        </MotionContainer>

        <MotionContainer
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start"
        >
          {/* Form */}
          <motion.div variants={fadeIn} className="lg:col-span-12 xl:col-span-8">
            <div className="glass-card p-12 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              
              <form className="flex flex-col gap-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] tracking-[0.4em] text-gold uppercase font-bold">Identity</label>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="bg-transparent border-b border-white/10 py-4 text-white text-lg outline-none focus:border-gold transition-all placeholder:text-white/20 font-light" 
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] tracking-[0.4em] text-gold uppercase font-bold">Secure Channel</label>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="bg-transparent border-b border-white/10 py-4 text-white text-lg outline-none focus:border-gold transition-all placeholder:text-white/20 font-light" 
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] tracking-[0.4em] text-gold uppercase font-bold">Investment Narrative</label>
                  <textarea 
                    rows={4} 
                    placeholder="Describe your structural requirements or investment objectives..." 
                    className="bg-transparent border-b border-white/10 py-4 text-white text-lg outline-none focus:border-gold transition-all resize-none placeholder:text-white/20 font-light" 
                  />
                </div>

                <div className="flex items-center gap-8 mt-4">
                  <button className="px-12 py-5 bg-gold text-background text-[11px] font-bold uppercase tracking-[0.5em] hover:bg-white transition-all transform hover:-translate-y-1 shadow-xl cursor-pointer">
                    Initiate Protocol
                  </button>
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] hidden md:block">
                    Estimated response: <br/> 04 hours
                  </span>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div variants={fadeIn} className="lg:col-span-12 xl:col-span-4 flex flex-col md:flex-row xl:flex-col gap-16">
            <div className="space-y-8 flex-1">
              <h3 className="text-[10px] tracking-[0.5em] text-gold uppercase font-bold border-b border-white/10 pb-4">Advisory Hub</h3>
              <div className="space-y-2">
                 <p className="text-xl text-white font-luxury">Fifth Settlement</p>
                 <p className="text-sm text-[#AEB4C6] leading-relaxed font-light tracking-[0.1em]">
                  Monolithic Business District<br />
                  Tower 02, Executive Suite 88
                </p>
              </div>
            </div>
            <div className="space-y-8 flex-1">
              <h3 className="text-[10px] tracking-[0.5em] text-gold uppercase font-bold border-b border-white/10 pb-4">Direct Wire</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                   <p className="text-[10px] text-gold/60 uppercase tracking-[0.2em]">Phone</p>
                   <p className="text-xl text-white font-premium tracking-wide">+20 15 500 00 230</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-gold/60 uppercase tracking-[0.2em]">Email</p>
                   <p className="text-xl text-white font-premium tracking-wide">portal@sierra-blu.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </MotionContainer>
      </div>
      <Footer />
    </main>
  );
}
