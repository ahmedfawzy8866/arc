"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, ExternalLink, ShieldCheck } from "lucide-react";
import { Agent, getAgents } from "@/lib/firestore";
import { CONTACT } from "@/lib/site";
import MotionContainer from "./MotionContainer";
import { fadeIn, staggerContainer } from "@/lib/motion";

const INITIAL_ADVISORS: Agent[] = [
  {
    id: "1",
    name: "Layla Hassan",
    role: "Senior Private Advisor",
    phone: "+20 100 123 4567",
    email: "layla@sierra-blu.com",
    image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?q=80&w=600&h=800&auto=format&fit=crop",
    specialties: ["Luxury Villas", "Wealth Management", "New Cairo"],
    bio: "Guiding elite clientele through Egypt's most exclusive off-market opportunities with total discretion.",
  },
  {
    id: "2",
    name: "Karim El-Mansouri",
    role: "Investment Strategist",
    phone: "+20 100 234 5678",
    email: "karim@sierra-blu.com",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&h=800&auto=format&fit=crop",
    specialties: ["Capital Deployment", "Portfolio Analysis", "Yield Optimization"],
    bio: "Karim specializes in data-driven asset allocation, ensuring peak returns for high-net-worth portfolios.",
  },
  {
    id: "3",
    name: "Nour Khalil",
    role: "Private Client Relations",
    phone: "+20 100 345 6789",
    email: "nour@sierra-blu.com",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&h=800&auto=format&fit=crop",
    specialties: ["Client Experience", "Penthouse Sales", "International HNWIs"],
    bio: "Curating bespoke acquisition journeys for Sierra-Blu's most discerning global partners.",
  },
  {
    id: "4",
    name: "Omar Samir",
    role: "Development Specialist",
    phone: "+20 100 456 7890",
    email: "omar@sierra-blu.com",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&h=800&auto=format&fit=crop",
    specialties: ["New Developments", "Pre-Launch Access", "Architectural Consulting"],
    bio: "Leveraging exclusive developer relationships to deliver first-mover advantage in premium sectors.",
  },
];

export default function AgentsSection() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        if (data && data.length > 0) {
          setAgents(data);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const displayAgents = loading ? [] : (agents.length > 0 ? agents : INITIAL_ADVISORS).slice(0, 4);

  return (
    <section id="advisors" className="py-40 px-6 relative bg-background overflow-hidden">
      {/* Cinematic Ambient Atmosphere */}
      <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] -translate-y-1/2 -z-0" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-navy-deep/20 rounded-full blur-[120px] -translate-y-1/2 -z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12 text-left">
          <div className="max-w-2xl">
            <MotionContainer
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="w-10 h-[1px] bg-gold/40" />
              <span className="text-[10px] uppercase font-black tracking-[0.6em] text-gold">
                The Private Council
              </span>
            </MotionContainer>
            
            <h2 className="text-5xl md:text-7xl font-luxury leading-tight text-white mb-8">
              Expertise In <br />
              <span className="text-gold text-glow-gold italic">Asset Advisory.</span>
            </h2>
            
            <p className="text-[#F8F8F8]/60 text-lg font-light leading-relaxed">
              Our specialists combine decades of market intelligence with 
              unparalleled access to provide a sanctuary for your capital.
            </p>
          </div>
          
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            className="flex items-center gap-6"
          >
             <div className="flex -space-x-4">
                {INITIAL_ADVISORS.map((a, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-background overflow-hidden relative shadow-xl">
                    <Image src={a.image} alt="Council" fill className="object-cover" />
                  </div>
                ))}
             </div>
             <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">
                120+ Combined Years Expertise
             </div>
          </motion.div>
        </div>

        <MotionContainer
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {loading ? (
             Array(4).fill(0).map((_, i) => (
               <div key={i} className="h-[500px] rounded-[40px] bg-white/5 animate-pulse border border-white/10" />
             ))
          ) : (
            displayAgents.map((agent, i) => (
              <AdvisorCard key={agent.id || i} agent={agent} index={i} />
            ))
          )}
        </MotionContainer>
        
        {/* Verification Hub */}
        <motion.div 
           variants={fadeIn}
           initial="hidden"
           whileInView="visible"
           className="mt-24 p-8 glass-card border-gold/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                 <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                 <h4 className="text-xl font-bold text-white mb-1">Authenticated Advisory</h4>
                 <p className="text-sm text-white/40 font-light">All Sierra Blu advisors are licensed by the General Organization for Real Estate.</p>
              </div>
           </div>
           <button className="btn-ghost-glass px-12 group flex items-center gap-3">
              Book Private Consultation
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
        </motion.div>
      </div>
    </section>
  );
}

function AdvisorCard({ agent, index }: { agent: Agent; index: number }) {
  return (
    <motion.div
      variants={fadeIn}
      custom={index}
      className="group glass-card overflow-hidden flex flex-col items-center text-center hover:border-gold/40 transition-all duration-700 hover:shadow-[0_40px_100px_rgba(199,159,63,0.1)]"
    >
      <div className="relative w-full h-80 overflow-hidden">
        <Image
          src={agent.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&h=800&auto=format&fit=crop"}
          alt={agent.name}
          fill
          className="object-cover grayscale brightness-110 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-out group-hover:brightness-100" 
        />
        {/* Gold Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-1000" />
        <div className="absolute inset-0 ring-inset ring-1 ring-white/10 group-hover:ring-gold/30 transition-all duration-700" />
      </div>

      <div className="w-full p-10 flex flex-col flex-grow">
        <div className="mb-8">
           <span className="text-[9px] uppercase font-black tracking-[0.4em] text-gold mb-3 block opacity-80 group-hover:opacity-100 transition-opacity">
              {agent.role}
           </span>
           <h3 className="text-2xl font-luxury text-white mb-2 group-hover:text-gold transition-colors">{agent.name}</h3>
        </div>

        <div className="space-y-4 mb-10 text-white/40 text-sm font-light leading-relaxed italic group-hover:text-white/60 transition-colors">
           &quot;{agent.bio}&quot;
        </div>

        <div className="mt-auto grid grid-cols-2 gap-4 w-full pt-8 border-t border-white/5">
           <a 
             href={`tel:${agent.phone}`} 
             className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-gold/10 hover:text-gold transition-all group/icon"
             title={agent.phone}
           >
              <Phone className="w-4 h-4 mb-2 opacity-40 group-hover/icon:opacity-100" />
              <span className="text-[8px] uppercase font-bold tracking-widest">Voice</span>
           </a>
           <a 
             href={`mailto:${agent.email || CONTACT.email}`}
             className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-gold/10 hover:text-gold transition-all group/icon"
             title={agent.email}
           >
              <Mail className="w-4 h-4 mb-2 opacity-40 group-hover/icon:opacity-100" />
              <span className="text-[8px] uppercase font-bold tracking-widest">Connect</span>
           </a>
        </div>
      </div>
    </motion.div>
  );
}

