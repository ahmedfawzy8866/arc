"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { useUser } from "@clerk/nextjs";
import { getAgents, addAgent, Agent } from "../../lib/firestore";

export default function PortalPage() {
  const { user } = useUser();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    role: "Senior Advisor",
    phone: "",
    email: "",
    image: "",
    specialties: ["Luxury Rentals"],
    bio: ""
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await getAgents();
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAgent(newAgent);
      setIsAdding(false);
      setNewAgent({
        name: "",
        role: "Senior Advisor",
        phone: "",
        email: "",
        image: "",
        specialties: ["Luxury Rentals"],
        bio: ""
      });
      fetchAgents();
    } catch {
      alert("Error adding agent");
    }
  };

  const seedData = async () => {
    const demoAgents = [
      {
        name: "Omar El-Sherif",
        role: "Luxury Sales Director",
        phone: "+20 100 123 4567",
        email: "omar@sierrablu.com",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop",
        specialties: ["Capital Business Park", "Mivida"],
        bio: "Specializing in premium commercial and residential acquisitions."
      },
      {
        name: "Laila Mansour",
        role: "Senior Investment Boutique",
        phone: "+20 100 987 6543",
        email: "laila@sierrablu.com",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop",
        specialties: ["Lake View", "Sodic East"],
        bio: "Dedicated to finding the most exclusive properties for our elite clients."
      }
    ];

    for (const agent of demoAgents) {
      await addAgent(agent);
    }
    fetchAgents();
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-32 pb-24 px-6 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 border-b border-[#121225] pb-12">
          <span className="text-[10px] font-sans tracking-[0.4em] text-[#AEB4C6] uppercase block mb-4">
            Access / private portal
          </span>
          <div className="flex justify-between items-end">
             <h1 className="text-6xl font-[var(--font-display)] font-medium tracking-tighter lowercase text-[var(--foreground)]">
               welcome, {user?.firstName || "client"}.
             </h1>
             <div className="flex gap-4">
                <button 
                  onClick={() => setIsAdding(!isAdding)}
                  className="bg-[var(--accent-primary)] text-[var(--background)] px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#00B4D8] transition-all"
                >
                  {isAdding ? "Cancel" : "Add Advisor"}
                </button>
                {agents.length === 0 && (
                  <button 
                    onClick={seedData}
                    className="border border-white/10 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-[var(--accent-primary)] transition-all"
                  >
                    Seed Demo Data
                  </button>
                )}
             </div>
          </div>
        </header>

        {isAdding && (
          <div className="mb-16 border border-[var(--accent-primary)]/30 bg-[var(--surface)]/50 p-12 backdrop-blur-md">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--accent-primary)] mb-8">New Advisor Registration</h2>
            <form onSubmit={handleAddAgent} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-[#4E5872]">Full Name</label>
                <input 
                  required
                  className="bg-transparent border-b border-white/10 py-2 focus:border-[var(--accent-primary)] outline-none text-sm"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-[#4E5872]">Professional Role</label>
                <input 
                  required
                  className="bg-transparent border-b border-white/10 py-2 focus:border-[var(--accent-primary)] outline-none text-sm"
                  value={newAgent.role}
                  onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-[#4E5872]">Phone</label>
                <input 
                  required
                  className="bg-transparent border-b border-white/10 py-2 focus:border-[var(--accent-primary)] outline-none text-sm"
                  value={newAgent.phone}
                  onChange={(e) => setNewAgent({...newAgent, phone: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-[#4E5872]">Email</label>
                <input 
                  required
                  type="email"
                  className="bg-transparent border-b border-white/10 py-2 focus:border-[var(--accent-primary)] outline-none text-sm"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full bg-[var(--accent-primary)] text-[var(--background)] py-4 text-[11px] font-bold uppercase tracking-[0.3em] mt-4 hover:bg-[#00B4D8] transition-colors">
                  Register Advisor
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          {/* Main Dashboard Area */}
          <div className="md:col-span-8 flex flex-col gap-10">
            <h2 className="text-[10px] font-sans tracking-[0.35em] text-[#AEB4C6] uppercase border-b border-white/10 pb-3">
              Advisor Inventory / Active Personnel
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? (
                <div className="lg:col-span-2 py-20 text-center">
                   <div className="inline-block w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                   <div className="text-[10px] uppercase tracking-[0.4em] text-[#AEB4C6]">Synchronizing Personnel...</div>
                </div>
              ) : agents.length === 0 ? (
                <div className="lg:col-span-2 p-20 border border-dashed border-white/10 text-center bg-[var(--surface)]/10">
                   <p className="text-[10px] uppercase tracking-[0.4em] text-[#4E5872]">No advisors registered in the system.</p>
                </div>
              ) : (
                agents.map((agent) => (
                  <div key={agent.id} className="glass p-10 flex gap-10 items-center group relative overflow-hidden">
                    <div className="w-24 h-24 rounded-full border border-[var(--accent-primary)]/30 overflow-hidden relative shrink-0">
                      <Image
                        src={agent.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop"}
                        alt={agent.name}
                        fill
                        sizes="96px"
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors">{agent.name}</h3>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-primary)] mt-1 font-bold">{agent.role}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[11px] text-[#AEB4C6] tracking-wider">{agent.email}</p>
                        <p className="text-[11px] font-bold text-[#4E5872] uppercase tracking-[0.1em]">{agent.phone}</p>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-[var(--accent-primary)] hover:text-white transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <h2 className="text-[10px] font-sans tracking-[0.35em] text-[#AEB4C6] uppercase border-b border-white/10 pb-3 mt-8">
              Portal / Operational Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Firebase / Synchronized", status: "Optimal" },
                { label: "Encryption / AES-256", status: "Active" },
              ].map((signal, i) => (
                <div key={i} className="border border-white/10 p-8 flex justify-between items-center bg-[var(--surface)]/30">
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#AEB4C6]">{signal.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    <span className="text-[10px] font-sans font-bold text-emerald-500 uppercase tracking-widest">{signal.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          <div className="md:col-span-4 flex flex-col gap-10">
            <h2 className="text-[10px] font-sans tracking-[0.35em] text-[#AEB4C6] uppercase border-b border-white/10 pb-3">
              Performance / Analytics
            </h2>
            <div className="border border-[var(--accent-primary)]/30 bg-[var(--surface)]/30 p-16 text-center flex flex-col items-center justify-center gap-6">
              <span className="text-6xl font-sans font-bold text-[var(--foreground)] tracking-tighter">
                {agents.length.toString().padStart(3, '0')}
              </span>
              <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-[#AEB4C6]">Total Advisors</span>
            </div>

            <div className="p-10 border border-white/10 bg-[var(--surface)]/20">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)] mb-4">Advisor Rules</h3>
               <ul className="flex flex-col gap-3">
                 {["Authentication token required", "TLS 1.3 encryption forced", "Audit logs generated"].map((rule, idx) => (
                   <li key={idx} className="flex items-center gap-3 text-[10px] text-[#4E5872] uppercase tracking-wider">
                     <span className="w-1 h-1 bg-[var(--accent-primary)]"></span>
                     {rule}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
