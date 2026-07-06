import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const property = {
    id,
    title: "serenity court villa",
    price: "38,500,000 egp",
    location: "Fifth Settlement, New Cairo",
    beds: 5,
    baths: 6,
    sqft: "520",
    description: "An uncompromising architectural masterpiece. This residence defines the nano-luxury segment in New Cairo, featuring raw concrete finishes and monolithic volumes.",
    features: ["Private Infinity Pool", "Smart Home Automation", "Geothermal Cooling", "Staff Quarters"],
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-32 pb-24 px-6 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Visuals */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="aspect-[16/9] bg-white/5 border border-white/10 flex items-center justify-center rounded-3xl overflow-hidden">
              <span className="text-[10px] tracking-widest text-neutral-400 uppercase">
                Primary Visual / 8k Data
              </span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl overflow-hidden" />
              <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl overflow-hidden" />
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-[#AEB4C6] uppercase block mb-4">
                Reference / SB-{id.padStart(3, "0")}
              </span>
              <h1 className="text-5xl font-medium tracking-tighter lowercase mb-4 font-premium">
                {property.title}
              </h1>
              <div className="text-xl text-[var(--accent-primary)] font-medium">
                {property.price}
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <p className="text-sm leading-relaxed text-[#AEB4C6] mb-8">
                {property.description}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8 text-[10px] tracking-widest uppercase">
                <div>
                  <span className="text-white/30 block mb-1">Beds</span>
                  <span className="text-white">{property.beds} Units</span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1">Baths</span>
                  <span className="text-white">{property.baths} Units</span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1">Area</span>
                  <span className="text-white">{property.sqft} sqm</span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1">Loc</span>
                  <span className="text-white">Cairo East</span>
                </div>
              </div>

              <button className="w-full bg-[var(--accent-primary)] text-[#0A0A24] py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                Inquire / Schedule
              </button>
            </div>

            <div>
              <h3 className="text-[10px] tracking-[0.2em] text-[#AEB4C6] uppercase mb-4">
                Technical Features
              </h3>
              <ul className="flex flex-col gap-2">
                {property.features.map((f) => (
                  <li key={f} className="text-[10px] uppercase tracking-widest text-[#AEB4C6] flex items-center gap-4">
                    <span className="w-4 h-[1px] bg-white/10" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
