"use client";
import { Agent, getAgents } from "@/lib/firestore";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CONTACT } from "@/lib/site";

const FALLBACK_AGENTS: Agent[] = [
  {
    id: "1",
    name: "Layla Hassan",
    role: "Senior Advisor",
    phone: "+20 100 123 4567",
    email: "layla@sierra-blu.com",
    image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?q=80&w=400&h=400&auto=format&fit=crop",
    specialties: ["Luxury Villas", "Investment Properties", "New Cairo"],
    bio: "A seasoned advisor with over 10 years guiding elite clientele through New Cairo's most exclusive opportunities.",
  },
  {
    id: "2",
    name: "Karim El-Mansouri",
    role: "Investment Strategist",
    phone: "+20 100 234 5678",
    email: "karim@sierra-blu.com",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&auto=format&fit=crop",
    specialties: ["Capital Deployment", "Portfolio Analysis", "Off-Market Deals"],
    bio: "Karim specializes in data-driven investment strategies, helping high-net-worth clients maximize their returns.",
  },
  {
    id: "3",
    name: "Nour Khalil",
    role: "Private Client Relations",
    phone: "+20 100 345 6789",
    email: "nour@sierra-blu.com",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&auto=format&fit=crop",
    specialties: ["Client Experience", "Penthouse Sales", "Private Listings"],
    bio: "Nour curates a bespoke experience for Sierra-Blu's most discerning clients, ensuring total discretion.",
  },
  {
    id: "4",
    name: "Omar Samir",
    role: "Development Specialist",
    phone: "+20 100 456 7890",
    email: "omar@sierra-blu.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop",
    specialties: ["New Developments", "Pre-Launch Access", "Developer Relations"],
    bio: "Omar maintains exclusive relationships with Egypt's top developers, delivering pre-market access to premium units.",
  },
];

export default function AgentsSection() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const displayAgents = loading ? [] : agents.length > 0 ? (agents.length > 4 ? agents.slice(0, 4) : agents) : FALLBACK_AGENTS;

  return (
    <section id="advisors" className="py-32 px-6 relative bg-[var(--background)] overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[rgba(199,159,63,0.05)] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <div className="ai-badge mb-6 w-fit border-[rgba(199,159,63,0.2)] text-[var(--gold)] bg-[rgba(199,159,63,0.05)]">The Council</div>
          <h2 className="text-4xl md:text-6xl font-bold font-premium text-white leading-tight">
            Private Wealth <br/> <span className="text-[var(--gold)] text-glow-gold font-light">Advisors.</span>
          </h2>
          <p className="text-lg text-white/50 mt-6 max-w-2xl leading-relaxed">
            Our multi-disciplinary team combines decades of regional real estate expertise with 
            advanced asset management strategies to protect and grow your capital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayAgents.map((agent) => (
            <div key={agent.id} className="group glass-card-premium p-8 flex flex-col items-center text-center hover:bg-white/[0.02] transition-all duration-500">
              <div className="relative w-40 h-40 rounded-full mb-8 p-1.5 border border-[var(--gold)]/10 group-hover:border-[var(--gold)]/30 transition-all duration-700">
                <div className="w-full h-full rounded-full overflow-hidden relative shadow-2xl">
                  <Image
                    src={agent.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&auto=format&fit=crop"}
                    alt={agent.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                  />
                  {/* Subtle Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(199,159,63,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-bold text-white font-premium transition-colors duration-300">{agent.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] font-bold">{agent.role}</p>
              </div>

              <div className="mt-auto w-full space-y-4">
                <div className="text-[11px] font-bold text-white/40 tracking-widest">{agent.phone}</div>
                <a
                  href={agent.email ? `mailto:${agent.email}` : CONTACT.emailHref}
                  className="btn-gold w-full text-[10px] uppercase tracking-[0.2em] py-4"
                >
                  Consult
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
