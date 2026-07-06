import Image from "next/image";
import Link from "next/link";
import { getProperties } from "@/lib/firestore";

export default async function FeaturedListings() {
  const properties = await getProperties();
  
  // Use real properties or fallback to hardcoded if empty
  const displayProperties = properties.length > 0 ? properties.slice(0, 3) : [
    {
      id: "fallback-1",
      referenceNumber: "SB-514",
      title: "Serenity Court Villa",
      community: "New Cairo",
      subCommunity: "Fifth Settlement",
      price: 38500000,
      bedrooms: 5,
      bathrooms: 6,
      size: 520,
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"],
      propertyType: "VI",
    },
    {
      id: "fallback-2",
      referenceNumber: "SB-532",
      title: "Luma Residence",
      community: "New Cairo",
      subCommunity: "Lake View",
      price: 17900000,
      bedrooms: 3,
      bathrooms: 3,
      size: 240,
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"],
      propertyType: "AP",
    },
    {
      id: "fallback-3",
      referenceNumber: "SB-701",
      title: "Terrace Suites",
      community: "New Cairo",
      subCommunity: "Katameya Heights",
      price: 26200000,
      bedrooms: 4,
      bathrooms: 4,
      size: 310,
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"],
      propertyType: "AP",
    }
  ];

  return (
    <section id="listings" className="py-32 px-6 relative overflow-hidden bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="ai-badge mb-6 w-fit">AI Recommends</div>
            <h2 className="text-4xl md:text-6xl font-bold font-premium leading-tight">
              A private portfolio for <br/> <span className="text-cyan text-glow-cyan font-light">discerning buyers.</span>
            </h2>
          </div>
          <Link href="/listings" className="text-cyan font-bold uppercase tracking-widest text-xs flex items-center gap-2 group pb-1 border-b border-cyan/20 hover:border-cyan transition-all">
            Explore Portfolio
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayProperties.map((item) => (
            <div key={item.id} className="glass-card-ai group cursor-pointer flex flex-col h-full">
              <div className="relative h-[320px] w-full overflow-hidden">
                <Image 
                  src={item.images[0]} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-60" />
                
                {/* Ref tag */}
                <div className="absolute top-6 left-6 ai-badge bg-black/40 border-white/10 text-white/90">
                  {item.referenceNumber}
                </div>

                {/* AI Match Badge */}
                <div className="absolute top-6 right-6 ai-badge !bg-cyan/20 !text-cyan border-cyan/30">
                  98% Match
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  {item.community} {item.subCommunity ? `| ${item.subCommunity}` : ""}
                </div>
                <h3 className="text-2xl font-bold mb-6 group-hover:text-cyan transition-colors line-clamp-1">{item.title}</h3>
                
                {/* Details */}
                <div className="grid grid-cols-3 gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-8 mt-auto">
                  <div className="flex flex-col gap-1">
                    <span className="text-white">{item.bedrooms} BEDS</span>
                  </div>
                  <div className="flex flex-col gap-1 border-x border-white/5 px-4">
                    <span className="text-white">{item.bathrooms} BATHS</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-white">{item.size} SQM</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-cyan font-bold text-xl tracking-tight">
                    EGP {item.price.toLocaleString()}
                  </span>
                  <div className="btn-ghost-glass !px-6 !py-2 group-hover:!bg-cyan group-hover:!text-black group-hover:!border-cyan transition-all duration-300">
                    Insight
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

