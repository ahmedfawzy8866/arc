"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { getAgents, Agent, getProperties, addProperty, Property } from "@/lib/firestore";
import { 
  Plus, 
  Building, 
  User as UserIcon, 
  LogOut, 
  CheckCircle2, 
  LayoutDashboard, 
  Clipboard, 
  Database, 
  Link as LinkIcon,
  Sparkles,
  Search,
  Bed,
  Bath,
  Maximize2,
  DollarSign,
  Trash2,
  Edit2,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PortalPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "portfolio" | "advisors">("dashboard");
  
  // Dashboard State
  const [rawInput, setRawInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    code: "",
    content: "",
    shortLink: ""
  });

  // Form State
  const [formData, setFormData] = useState({
    ownerName: "",
    compound: "",
    furnishing: "Unfurnished",
    phoneNumber: "",
    bedrooms: 0,
    price: 0,
    garden: false,
    pool: false,
    view: false,
    smartHome: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [agentsData, propertiesData] = await Promise.all([
        getAgents(),
        getProperties()
      ]);
      setAgents(agentsData);
      setProperties(propertiesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessInput = () => {
    if (!rawInput.trim()) return;
    setIsProcessing(true);
    
    // Simulate AI extraction / Generation
    setTimeout(() => {
      const mockCode = `SB-MAR-${Math.floor(Math.random() * 900) + 100}`;
      setGeneratedContent({
        code: mockCode,
        content: `✦ SIERRA BLU EXCLUSIVE ✦\n\n${rawInput.substring(0, 50)}...\n\nLocation: Marassi\nRef: ${mockCode}\nContact: +201092048333`,
        shortLink: `sierra-blu.link/${mockCode.toLowerCase()}`
      });
      
      // Auto-fill some fields based on simulation
      setFormData(prev => ({
        ...prev,
        compound: "Marassi",
        bedrooms: 3,
        price: 25000000
      }));
      
      setIsProcessing(false);
    }, 1500);
  };

  const handleSaveToDatabase = async () => {
    if (!user || !generatedContent.code) return;
    
    try {
      await addProperty({
        code: generatedContent.code,
        referenceNumber: generatedContent.code,
        title: `${formData.compound} Residence`,
        description: rawInput,
        whatsappContent: generatedContent.content,
        compound: formData.compound,
        price: formData.price,
        bedrooms: formData.bedrooms,
        bathrooms: 2, // Default
        area: 180, // Default
        ownerName: formData.ownerName,
        phoneNumber: formData.phoneNumber,
        furnished: formData.furnishing,
        garden: formData.garden,
        pool: formData.pool,
        view: formData.view,
        smartHome: formData.smartHome,
        images: [],
        updatedAt: new Date().toISOString(),
        createdBy: user.displayName || user.email?.split("@")[0] || "Unknown",
        createdByEmail: user.email || "unknown@sierra-blu.com",
      });
      
      alert("Property record indexed successfully.");
      fetchData();
      // Reset dashboard
      setGeneratedContent({ code: "", content: "", shortLink: "" });
      setRawInput("");
    } catch (error) {
       console.error(error);
       alert("Failed to save property.");
    }
  };

  if (authLoading) return null;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        {/* Superior Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold/60">
                Sierra Blu Property Manager v2.0
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-luxury tracking-tighter text-white lowercase leading-none">
               portal.
            </h1>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 bg-surface/50 p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "dashboard" ? "bg-gold text-background shadow-lg" : "text-white/40 hover:text-white"}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab("portfolio")}
                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "portfolio" ? "bg-gold text-background shadow-lg" : "text-white/40 hover:text-white"}`}
              >
                Portfolio
              </button>
              <button 
                onClick={() => setActiveTab("advisors")}
                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "advisors" ? "bg-gold text-background shadow-lg" : "text-white/40 hover:text-white"}`}
              >
                Advisors
              </button>
            </div>
            <div className="flex items-center gap-4 pr-2">
               <div className="text-right">
                 <p className="text-[10px] font-bold text-white uppercase tracking-widest">{user.displayName || user.email?.split("@")[0]}</p>
                 <p className="text-[8px] text-gold/60 uppercase tracking-widest">Internal Access</p>
               </div>
               <button 
                 onClick={logout}
                 className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
               >
                 <LogOut className="w-4 h-4" />
               </button>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              {/* Left Side: Input & Generation */}
              <div className="lg:col-span-8 space-y-10">
                <section className="bg-surface/30 border border-white/5 rounded-[40px] p-10 backdrop-blur-md">
                   <div className="flex items-center justify-between mb-8">
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white flex items-center gap-3">
                         <Sparkles className="w-4 h-4 text-gold" />
                         Property Intelligence Input
                      </h2>
                      <span className="text-[9px] text-white/30 uppercase tracking-widest italic">AI Processing Enabled</span>
                   </div>

                   <textarea 
                     rows={8}
                     className="w-full bg-background/50 border border-white/10 rounded-3xl p-8 text-sm text-silver resize-none focus:border-gold/50 outline-none transition-all font-light leading-relaxed mb-8"
                     placeholder="Paste property description or Whatsapp message here..."
                     value={rawInput}
                     onChange={(e) => setRawInput(e.target.value)}
                   />

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <button 
                        onClick={handleProcessInput}
                        disabled={isProcessing || !rawInput}
                        className="flex flex-col items-center justify-center gap-3 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all group"
                      >
                         <div className="p-3 rounded-2xl bg-gold/10 text-gold group-hover:scale-110 transition-transform">
                            {isProcessing ? <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-5 h-5" />}
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Generate Code & Content</span>
                      </button>

                      <button 
                        onClick={handleSaveToDatabase}
                        disabled={!generatedContent.code}
                        className="flex flex-col items-center justify-center gap-3 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition-all group disabled:opacity-30"
                      >
                         <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                            <Database className="w-5 h-5" />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Save to Database</span>
                      </button>

                      <button 
                        disabled={!generatedContent.code}
                        className="flex flex-col items-center justify-center gap-3 p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition-all group disabled:opacity-30"
                      >
                         <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                            <LinkIcon className="w-5 h-5" />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Generate Short Link</span>
                      </button>
                   </div>
                </section>

                {/* Processing Results Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="bg-white/5 border border-white/10 p-10 rounded-[32px] text-center">
                      <p className="text-[9px] uppercase tracking-widest text-gold mb-6 font-bold">Property Code</p>
                      <h3 className="text-4xl font-luxury text-white tracking-widest uppercase">{generatedContent.code || "---"}</h3>
                   </div>
                   <div className="md:col-span-2 bg-white/5 border border-white/10 p-10 rounded-[32px] relative overflow-hidden group">
                      <p className="text-[9px] uppercase tracking-widest text-gold mb-6 font-bold flex items-center justify-between">
                         Whatsapp Content Preview
                         <button className="text-white/40 hover:text-white"><Clipboard className="w-3 h-3" /></button>
                      </p>
                      <pre className="text-[11px] text-silver font-sans whitespace-pre-wrap leading-relaxed h-32 overflow-y-auto">
                         {generatedContent.content || "Awaiting input processing..."}
                      </pre>
                   </div>
                </div>

                <section className="bg-surface/30 border border-white/5 rounded-[40px] p-10">
                   <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white mb-10 border-b border-white/5 pb-4">
                      Property Intelligence Record
                   </h2>

                   <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest text-silver font-bold">Owner Name</label>
                        <input className="input-field" placeholder="Full legal name" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest text-silver font-bold">Compound / Location</label>
                        <input className="input-field" placeholder="e.g. Marassi, Verona" value={formData.compound} onChange={e => setFormData({...formData, compound: e.target.value})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest text-silver font-bold">Furnishing Status</label>
                        <select className="input-field appearance-none" value={formData.furnishing} onChange={e => setFormData({...formData, furnishing: e.target.value})}>
                           <option>Unfurnished</option>
                           <option>Semi-Furnished</option>
                           <option>Fully Furnished</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest text-silver font-bold">Contact Phone Number</label>
                        <input className="input-field" placeholder="+20 XXX XXX XXXX" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest text-silver font-bold">Bedrooms</label>
                        <input type="number" className="input-field" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] uppercase tracking-widest text-silver font-bold">Price (EGP)</label>
                        <input type="number" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                      </div>

                      <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
                         {[
                           { key: "garden", label: "Garden" },
                           { key: "pool", label: "Pool" },
                           { key: "view", label: "View" },
                           { key: "smartHome", label: "Smart Home" }
                         ].map(feature => (
                           <label key={feature.key} className="flex items-center gap-4 cursor-pointer group">
                             <div 
                               onClick={() => setFormData(prev => ({...prev, [feature.key]: !prev[feature.key as keyof typeof formData]}))}
                               className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${formData[feature.key as keyof typeof formData] ? "bg-gold border-gold text-background shadow-[0_0_15px_rgba(201,162,74,0.3)]" : "border-white/10 text-white/20 hover:border-white/30"}`}
                             >
                                {formData[feature.key as keyof typeof formData] ? <Check className="w-5 h-5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                             </div>
                             <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${formData[feature.key as keyof typeof formData] ? "text-white" : "text-white/30"}`}>
                               {feature.label}
                             </span>
                           </label>
                         ))}
                      </div>
                   </form>
                </section>
              </div>

              {/* Right Side: Quick Stats / Registry Summary */}
              <div className="lg:col-span-4 space-y-10">
                 <div className="bg-white p-16 rounded-[40px] text-center flex flex-col items-center justify-center border-2 border-gold/20 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                       <LayoutDashboard className="w-6 h-6 text-background/10" />
                    </div>
                    <span className="text-8xl font-luxury text-background tracking-tighter leading-none mb-4 group-hover:scale-110 transition-transform">
                       {properties.length.toString().padStart(3, '0')}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.5em] text-background/40 font-bold">
                       Portfolio Registry
                    </span>
                 </div>

                 <section className="bg-surface/30 border border-white/5 rounded-[40px] p-10">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">Security Directive</h3>
                    <ul className="space-y-6">
                       {[
                         { icon: CheckCircle2, text: "End-to-end data encryption", color: "text-emerald-500" },
                         { icon: CheckCircle2, text: "Session timeout: 30 minutes", color: "text-emerald-500" },
                         { icon: CheckCircle2, text: "Automatic audit logging", color: "text-emerald-500" },
                         { icon: UserIcon, text: `Logged in: ${user.email}`, color: "text-gold" }
                       ].map((rule, idx) => (
                         <li key={idx} className="flex items-center gap-4">
                           <rule.icon className={`w-4 h-4 ${rule.color}`} />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-silver">{rule.text}</span>
                         </li>
                       ))}
                    </ul>
                 </section>

                 <div className="p-10 border border-white/5 rounded-[40px] bg-gold/5 border-dashed text-center">
                    <p className="text-[10px] text-gold/60 uppercase tracking-widest leading-relaxed">
                       Beyond Brokerage System<br/>Sierra Blu Operations 2026
                    </p>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === "portfolio" && (
            <motion.div 
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between">
                 <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">Full Inventory Registry</h2>
                 <div className="flex items-center gap-4">
                   <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-sm focus:border-gold outline-none w-64 transition-all" placeholder="Search reference code..." />
                   </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {loading ? (
                    <div className="py-20 text-center"><Sparkles className="w-8 h-8 text-gold animate-spin mx-auto mb-4" /><p className="text-[10px] uppercase tracking-widest text-silver">Syncing Data...</p></div>
                 ) : properties.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-[40px] bg-white/5"><p className="text-[10px] uppercase tracking-widest text-silver font-bold">The vault is empty.</p></div>
                 ) : (
                    properties.map((prop) => (
                      <div key={prop.id} className="bg-surface/30 border border-white/5 p-8 rounded-3xl hover:border-white/10 transition-all group flex flex-col md:flex-row items-center gap-10">
                         <div className="w-32 h-32 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative shrink-0">
                            {prop.images && prop.images[0] ? (
                              <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full"><Building className="w-8 h-8 text-white/5" /></div>
                            )}
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                               <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">{prop.code}</span>
                               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Added by: {prop.createdBy || "System"}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{prop.compound} Residence</h3>
                            <div className="flex items-center gap-6">
                               <div className="flex items-center gap-2 text-silver"><Bed className="w-4 h-4" /><span className="text-xs">{prop.bedrooms} Bed</span></div>
                               <div className="flex items-center gap-2 text-silver"><Bath className="w-4 h-4" /><span className="text-xs">{prop.bathrooms} Bath</span></div>
                               <div className="flex items-center gap-2 text-silver"><Maximize2 className="w-4 h-4" /><span className="text-xs">{prop.area} SQM</span></div>
                               <div className="flex items-center gap-2 text-gold font-bold"><DollarSign className="w-4 h-4" /><span className="text-sm">EGP {(prop.price / 1000000).toFixed(1)}M</span></div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:border-red-500/30 transition-all"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </div>
                    ))
                 )}
              </div>
            </motion.div>
          )}

          {activeTab === "advisors" && (
            <motion.div 
              key="advisors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">Advisor Network Registry</h2>
                  <button className="bg-white text-background px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all flex items-center gap-3">
                     <Plus className="w-4 h-4" /> Add Personnel
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {agents.map(agent => (
                    <div key={agent.id} className="bg-surface/30 border border-white/5 p-10 rounded-3xl group relative overflow-hidden flex items-center gap-8">
                       <div className="w-24 h-24 rounded-full border border-gold/30 overflow-hidden relative shrink-0 bg-background">
                          <Image
                            src={agent.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop"}
                            alt={agent.name}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all"
                          />
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">{agent.name}</h3>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-gold/60 mt-1 font-bold">{agent.role}</p>
                          <div className="mt-4 flex flex-col gap-1">
                             <span className="text-[11px] text-silver font-light">{agent.email}</span>
                             <span className="text-[11px] text-silver font-bold tracking-widest">{agent.phone}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .input-field {
          @apply w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-white/10 font-light;
        }
      `}</style>
    </main>
  );
}
