import Link from "next/link";

const neighborhoods = [
  "Katameya Heights",
  "Al Rehab",
  "Mivida",
  "Mountain View",
  "Palm Hills",
  "Al Marasem",
];

const markers = [
  { name: "Katameya", top: "22%", left: "28%" },
  { name: "Rehab", top: "48%", left: "18%" },
  { name: "Mivida", top: "62%", left: "52%" },
  { name: "Mountain", top: "34%", left: "62%" },
  { name: "Palm Hills", top: "70%", left: "34%" },
];

export default function Neighborhoods() {
  return (
    <section id="neighborhoods" className="py-32 px-6 relative overflow-hidden bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-20 lg:grid-cols-[1fr_1.2fr] items-center">
          <div className="space-y-10">
            <div>
              <div className="ai-badge mb-6 w-fit">Regional Intelligence</div>
              <h2 className="text-4xl md:text-6xl font-bold font-premium text-white leading-tight">
                New Cairo Atlas: <br/> <span className="text-cyan text-glow-cyan font-light">Mapped with precision.</span>
              </h2>
            </div>
            
            <p className="text-lg text-white/60 leading-relaxed max-w-lg">
              Our advisors combine on-the-ground insight with proprietary AI analysis to
              pinpoint the sectors with the strongest long-term appreciation in the villa belt.
            </p>

            <div className="flex flex-wrap gap-3">
              {neighborhoods.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold hover:border-cyan/40 hover:text-white transition-all cursor-default"
                >
                  {area}
                </span>
              ))}
            </div>

            <Link href="/listings" className="btn-ghost-glass mt-4 inline-flex">
              Explore Neighborhoods
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[var(--surface)] p-6 shadow-2xl">
            {/* Luxury Grid Overlay */}
            <div className="luxury-grid absolute inset-0 opacity-20" />
            
            {/* Map Placeholder */}
            <div className="relative aspect-[4/3] rounded-[32px] border border-white/5 bg-black/20 overflow-hidden backdrop-blur-sm">
               {/* Radial Glow */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,229,255,0.1),transparent_70%)]" />
               
               {/* Markers */}
               {markers.map((marker) => (
                <div
                  key={marker.name}
                  className="absolute flex items-center gap-3 group translate-x-[-50%] translate-y-[-50%]"
                  style={{ top: marker.top, left: marker.left }}
                >
                   <div className="relative">
                      <div className="h-3 w-3 rounded-full bg-cyan shadow-[0_0_15px_rgba(0,229,255,0.8)] z-10 relative" />
                      <div className="absolute inset-0 h-3 w-3 rounded-full bg-cyan animate-ping opacity-40" />
                   </div>
                   <span className="text-[10px] uppercase tracking-[0.3em] text-cyan font-bold opacity-0 group-hover:opacity-100 transition-all bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan/20 whitespace-nowrap shadow-xl">
                    {marker.name}
                  </span>
                </div>
              ))}

              <div className="absolute bottom-8 left-8 right-8 glassy-panel px-8 py-5 border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl">
                 <div className="flex items-center gap-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_15px_rgba(0,229,255,0.8)] animate-pulse"></div>
                    <span className="text-[11px] uppercase tracking-[0.3em] text-white/70 font-bold">
                       Real-time market volatility | Private Access Only
                    </span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

