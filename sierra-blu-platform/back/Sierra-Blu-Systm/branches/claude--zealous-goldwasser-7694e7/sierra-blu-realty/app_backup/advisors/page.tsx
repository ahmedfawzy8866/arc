"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ADVISORS = [
  { id: 1, name: "karim morsy", role: "senior strategy advisor", specialty: "new cairo east", email: "k.morsy@sierra-blu.com" },
  { id: 2, name: "laila zaid", name_ar: "ليلى زيد", role: "private client partner", specialty: "katameya portfolio", email: "l.zaid@sierra-blu.com" },
  { id: 3, name: "omar fathy", role: "market intelligence lead", specialty: "data & forecasting", email: "o.fathy@sierra-blu.com" },
];

export default function AdvisorsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-32 pb-24 px-6 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 border-b border-white/10 pb-12">
          <span className="text-[10px] tracking-[0.4em] text-[#AEB4C6] uppercase block mb-4">
            Network / advisors
          </span>
          <h1 className="text-6xl font-medium tracking-tighter lowercase text-[var(--foreground)]">
            human intelligence.
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {ADVISORS.map((advisor) => (
            <div key={advisor.id} className="group border-l border-white/10 pl-8 py-6 hover:border-[var(--accent-primary)] transition-all duration-500">
              <span className="text-[10px] tracking-[0.4em] text-[#4E5872] uppercase block mb-8">
                Profile / 0{advisor.id}
              </span>
              <h2 className="text-3xl font-medium tracking-tight lowercase mb-2 text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors">
                {advisor.name}
              </h2>
              <div className="text-[10px] uppercase tracking-[0.35em] text-[#AEB4C6] mb-12">
                {advisor.role}
              </div>
              
              <div className="flex flex-col gap-8 text-[11px] uppercase tracking-[0.25em]">
                <div>
                  <span className="text-[#4E5872] block mb-2">Expertise / Portfolio</span>
                  <span className="text-[#C7CCDB]">{advisor.specialty}</span>
                </div>
                <div>
                  <span className="text-[#4E5872] block mb-2">Secure Channel</span>
                  <a href={`mailto:${advisor.email}`} className="text-[var(--accent-primary)] font-bold border-b border-[var(--accent-primary)]/30 hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all pb-1 cursor-pointer">
                    Initiate Wire
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
