"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import MotionContainer from "./MotionContainer";
import { fadeIn, fadeInWithBlur, staggerContainer, scrollIndicatorFloat } from "@/lib/motion";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop";

const FEATURED = [
  {
    title: "Marasem Villas",
    loc: "Fifth Settlement",
    beds: 4,
    price: "EGP 18M",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
    badge: "AI Verified",
  },
  {
    title: "Hyde Park Residence",
    loc: "New Cairo",
    beds: 3,
    price: "EGP 12M",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    badge: "Exclusive",
  },
  {
    title: "La Vista City",
    loc: "Golden Square",
    beds: 5,
    price: "EGP 22M",
    img: "https://images.unsplash.com/photo-1600607687940-467f4b630a19?q=80&w=800&auto=format&fit=crop",
    badge: "Yield +12%",
  },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[100vh] flex flex-col justify-center overflow-hidden bg-background"
    >
      {/* ── Cinematic Background ── */}
      <motion.div
        style={{ y: imgY, opacity }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <Image
          src={HERO_IMAGE}
          alt="Sierra Blu Luxury Property"
          fill
          priority
          className="object-cover object-center scale-105 animate-slow-zoom"
          sizes="100vw"
        />
        {/* Dynamic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
      </motion.div>

      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-gold/5 blur-[140px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-primary/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-32 pb-16">
        <MotionContainer
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Label */}
          <motion.div variants={fadeInWithBlur} className="flex items-center gap-4">
             <span className="w-12 h-[1px] bg-gold/40" />
             <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gold drop-shadow-sm">
               Strategic AI Real Estate Advisory
             </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeInWithBlur}
            className="text-6xl md:text-8xl lg:text-[9rem] font-luxury leading-[0.9] text-white tracking-tight"
          >
            Structural <br />
            <span className="text-gold italic text-glow-gold">Intelligence.</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={fadeInWithBlur}
            className="text-[#AEB4C6] text-xl font-light leading-relaxed max-w-2xl"
          >
            Sierra Blu defines the intersection of high-fidelity luxury and algorithmic precision.
            We secure the most exclusive assets in New Cairo for a discerning global clientele.
          </motion.p>

          {/* ── Search Bar / CTA ── */}
          <motion.div
            variants={fadeInWithBlur}
            className="flex flex-col sm:flex-row items-stretch gap-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 max-w-2xl overflow-hidden group hover:border-gold/30 hover:bg-white/10 transition-all duration-400 shadow-2xl"
          >
            <div className="flex items-center gap-4 flex-1 px-6 py-4">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
              <input
                type="text"
                placeholder="Region, compound or structural requirement…"
                className="flex-1 text-lg text-white placeholder:text-white/20 outline-none bg-transparent font-light"
              />
            </div>
            <Link
              href="/listings"
              className="bg-gold text-background px-10 py-5 flex items-center justify-center gap-3 font-bold uppercase tracking-[0.3em] text-[11px] group/btn relative overflow-hidden active:scale-[0.98] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:drop-shadow-[0_0_20px_rgba(200,150,26,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Analyze Market
                <span className="w-7 h-7 rounded-full bg-background/20 flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px transition-all duration-400">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity duration-400" />
            </Link>
          </motion.div>

          {/* ── Featured Property Tray ── */}
          <motion.div
            variants={fadeInWithBlur}
            className="pt-12"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-8 flex items-center gap-4">
              <span className="w-6 h-px bg-white/10" /> Vetted Portfolios
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
              {FEATURED.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, filter: "blur(8px)", y: 20 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                  className="h-full"
                >
                  <Link
                    href="/listings"
                    className="group relative h-48 rounded-[2rem] overflow-hidden p-1.5 ring-1 ring-black/20 bg-black/5 backdrop-blur-sm transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-gold/30 hover:bg-black/20 hover:shadow-[0_0_30px_rgba(200,150,26,0.2)]"
                  >
                    {/* Inner Core */}
                    <div className="relative w-full h-full rounded-[calc(2rem-0.375rem)] overflow-hidden bg-background/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                      <Image
                        src={p.img}
                        alt={p.title}
                        fill
                        className="object-cover transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 opacity-60 group-hover:opacity-100 group-hover:saturate-110"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />

                      <span className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1 bg-gold/90 text-background rounded-full shadow-sm">
                        {p.badge}
                      </span>

                      <div className="absolute bottom-4 left-4 right-4 transition-transform duration-400">
                        <p className="text-[#AEB4C6] text-[10px] uppercase tracking-[0.1em] mb-1 font-medium">{p.loc}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm font-luxury">{p.title}</p>
                          <span className="text-gold text-xs font-bold tracking-tight">{p.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </MotionContainer>
      </div>

      {/* Scroll indicator */}
      <motion.div
        variants={scrollIndicatorFloat}
        initial="hidden"
        animate={!prefersReducedMotion ? "visible" : "hidden"}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 rotate-180 [writing-mode:vertical-lr]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold/40 to-transparent" />
      </motion.div>
    </section>
  );
}
