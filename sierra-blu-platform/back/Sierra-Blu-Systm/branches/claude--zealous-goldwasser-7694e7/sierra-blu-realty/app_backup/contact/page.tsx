"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-32 pb-24 px-6 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 border-b border-white/10 pb-12">
          <span className="text-[10px] tracking-[0.4em] text-[#AEB4C6] uppercase block mb-4">
            Contact / inquiries
          </span>
          <h1 className="text-6xl font-medium tracking-tighter lowercase text-[var(--foreground)]">
            secure a consult.
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* Form */}
          <div className="lg:col-span-8">
            <form className="flex flex-col gap-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] tracking-[0.3em] text-[#4E5872] uppercase">Identity</label>
                  <input type="text" placeholder="Full Name" className="bg-transparent border-b border-white/10 py-4 text-sm outline-none focus:border-[var(--accent-primary)] transition-colors placeholder:text-[#4E5872] text-white" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] tracking-[0.3em] text-[#4E5872] uppercase">Channel</label>
                  <input type="email" placeholder="Secure Email" className="bg-transparent border-b border-white/10 py-4 text-sm outline-none focus:border-[var(--accent-primary)] transition-colors placeholder:text-[#4E5872] text-white" />
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <label className="text-[10px] tracking-[0.3em] text-[#4E5872] uppercase">Requirement / Narrative</label>
                <textarea rows={4} placeholder="Describe your real estate objectives..." className="bg-transparent border-b border-white/10 py-4 text-sm outline-none focus:border-[var(--accent-primary)] transition-colors resize-none placeholder:text-[#4E5872] text-white" />
              </div>

              <button className="self-start px-16 py-5 bg-[var(--accent-primary)] text-[#0A0A24] text-[11px] font-bold uppercase tracking-[0.4em] hover:opacity-90 transition-all shadow-[0_10px_30px_rgba(0,229,255,0.2)] cursor-pointer">
                Transmit / Inquiry
              </button>
            </form>
          </div>

          {/* Details */}
          <div className="lg:col-span-4 flex flex-col gap-16">
            <div className="space-y-6">
              <h3 className="text-[10px] tracking-[0.4em] text-[#AEB4C6] uppercase border-b border-white/10 pb-2">Advisory Hub</h3>
              <p className="text-[12px] text-[#C7CCDB] leading-relaxed uppercase tracking-[0.2em]">
                Fifth Settlement, New Cairo<br />
                Monolithic Building, Floor 42
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-[10px] tracking-[0.4em] text-[#AEB4C6] uppercase border-b border-white/10 pb-2">Direct Wire</h3>
              <p className="text-[12px] text-[#C7CCDB] leading-relaxed uppercase tracking-[0.2em]">
                +20 2 3333 7810<br />
                portal@sierra-blu.com
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
