"use client";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import MotionContainer from "@/app/components/MotionContainer";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { ArrowUpRight } from "lucide-react";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-hidden">
      <Navbar />

      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <MotionContainer
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mb-32"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[1px] bg-gold/40" />
              <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gold">
                Visionary Architecture
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-luxury leading-tight text-white mb-8">
              Strategic <br />
              <span className="text-gold text-glow-gold">Developments.</span>
            </h1>
            <p className="text-[#AEB4C6] text-xl font-light max-w-2xl leading-relaxed">
              Exclusive early-stage access to the most transformative luxury developments in New Cairo and the New Capital.
            </p>
          </MotionContainer>

          <MotionContainer
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-48"
          >
            {/* Project 1 */}
            <div className="grid lg:grid-cols-2 gap-20 items-center group">
              <div className="relative h-[700px] w-full overflow-hidden glass-card p-4">
                <div className="relative h-full w-full overflow-hidden rounded-[30px]">
                   <Image
                     src="/images/olympos.png"
                     alt="The Olympos Towers"
                     fill
                     className="object-cover transition-transform duration-[3000ms] group-hover:scale-110 brightness-[1.1]"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                   <div className="absolute top-8 left-8 badge-gold px-6 py-3">Off-Plan Launch</div>
                </div>
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                   <h2 className="text-4xl md:text-5xl font-luxury text-white group-hover:text-gold transition-colors duration-500">The Olympos Towers</h2>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">New Capital District</span>
                      <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                   </div>
                </div>
                <p className="text-[#AEB4C6] text-lg leading-relaxed font-light">
                  A twin-tower residential marvel featuring Egypt&apos;s first sky-bridge infinity pool. Designed by globally renowned architects, setting a new benchmark for vertical luxury and structural intelligence.
                </p>
                
                <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/5">
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-white/30 uppercase tracking-widest">Completion</span>
                      <span className="text-white font-medium text-lg">Q4 2028</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-white/30 uppercase tracking-widest">Pricing From</span>
                      <span className="text-gold font-medium text-lg">EGP 80M</span>
                   </div>
                </div>

                <button className="btn-primary flex items-center gap-4 group/btn">
                  Request Floor Plans
                  <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Project 2 */}
            <div className="grid lg:grid-cols-2 gap-20 items-center group">
              <div className="order-2 lg:order-1 space-y-10">
                <div className="space-y-4">
                   <h2 className="text-4xl md:text-5xl font-luxury text-white group-hover:text-gold transition-colors duration-500">Aura Villas Phase II</h2>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Golden Square, New Cairo</span>
                      <span className="w-2 h-2 rounded-full bg-accent-primary" />
                   </div>
                </div>
                <p className="text-[#AEB4C6] text-lg leading-relaxed font-light">
                  An exclusive enclave of 14 ultra-modern smart villas. Fully integrated home automation, private thermal pools, and expansive glass facades overlooking the central park and private gardens.
                </p>
                
                <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/5">
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-white/30 uppercase tracking-widest">Inventory</span>
                      <span className="text-white font-medium text-lg">2 Units Remaining</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-white/30 uppercase tracking-widest">Status</span>
                      <span className="text-accent-primary font-medium text-lg uppercase tracking-wider">Immediate</span>
                   </div>
                </div>

                <button className="btn-ghost-glass flex items-center gap-4 group/btn px-12">
                  Schedule Private Tour
                  <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
              <div className="relative h-[700px] w-full overflow-hidden glass-card p-4 order-1 lg:order-2">
                <div className="relative h-full w-full overflow-hidden rounded-[30px]">
                   <Image
                     src="/images/aura.png"
                     alt="Aura Villas Phase II"
                     fill
                     className="object-cover transition-transform duration-[3000ms] group-hover:scale-110 brightness-[1.1]"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                   <div className="absolute top-8 right-8 badge-gold px-6 py-3">Signature Series</div>
                </div>
              </div>
            </div>

          </MotionContainer>
        </div>
      </section>

      <Footer />
    </main>
  );
}

