"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import MotionContainer from "./MotionContainer";
import { fadeIn, staggerContainer } from "@/lib/motion";

const neighborhoods = [
  { name: "Al Marasem", count: "24 properties", score: 98 },
  { name: "Katameya Heights", count: "18 properties", score: 96 },
  { name: "Hyde Park", count: "31 properties", score: 95 },
  { name: "Mountain View", count: "14 properties", score: 94 },
  { name: "Palm Hills", count: "22 properties", score: 93 },
  { name: "Mivida", count: "19 properties", score: 92 },
  { name: "Al Rehab", count: "27 properties", score: 91 },
  { name: "La Vista City", count: "11 properties", score: 90 },
];

const markers = [
  { name: "Katameya", top: "22%", left: "28%", score: "96" },
  { name: "Al Rehab", top: "48%", left: "18%", score: "91" },
  { name: "Mivida", top: "62%", left: "54%", score: "92" },
  { name: "Mountain View", top: "32%", left: "64%", score: "94" },
  { name: "Palm Hills", top: "75%", left: "36%", score: "93" },
];

export default function Neighborhoods() {
  return (
    <section id="neighborhoods" className="py-28 bg-[var(--offwhite)]">
      <div className="section-wrap">

        {/* ── Header ── */}
        <MotionContainer
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="gold-line" />
            <span className="label-tag">Browse by Area</span>
            <span className="gold-line" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--navy-900)] font-medium leading-tight mb-4">
            Fifth Settlement,{" "}
            <em className="not-italic text-[var(--gold-500)]">Mapped.</em>
          </h2>
          <p className="text-[var(--blue-gray)] text-base leading-relaxed">
            Our AI analyzes micro-market data across every compound in New Cairo to
            surface the best investment opportunities tailored to your goals.
          </p>
        </MotionContainer>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">

          {/* ── Left: Neighborhood list ── */}
          <MotionContainer
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {neighborhoods.map((area, i) => (
              <motion.div
                key={area.name}
                variants={fadeIn}
                custom={i}
              >
                <Link
                  href={`/areas/${area.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-[var(--mist)] hover:border-[var(--gold-500)]/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* Score indicator */}
                    <div className="relative w-9 h-9 flex-shrink-0">
                      <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#DFE3ED" strokeWidth="2.5" />
                        <circle
                          cx="18" cy="18" r="15" fill="none"
                          stroke="var(--gold-500)" strokeWidth="2.5"
                          strokeDasharray={`${(area.score / 100) * 94} 94`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[var(--navy-900)]">
                        {area.score}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--navy-900)] group-hover:text-[var(--gold-500)] transition-colors">
                        {area.name}
                      </p>
                      <p className="text-xs text-[var(--silver)]">{area.count}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--silver)] group-hover:text-[var(--gold-500)] transition-colors" />
                </Link>
              </motion.div>
            ))}

            <motion.div variants={fadeIn} className="pt-2">
              <Link href="/listings" className="btn-primary w-full justify-center">
                Browse All Listings
              </Link>
            </motion.div>
          </MotionContainer>

          {/* ── Right: Map panel ── */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="sticky top-28"
          >
            {/* Map container with navy background (map sections use navy per spec) */}
            <div className="relative rounded-2xl overflow-hidden bg-[var(--navy-900)] aspect-[4/3] shadow-xl">

              {/* Subtle grid lines */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "linear-gradient(var(--silver) 1px, transparent 1px), linear-gradient(90deg, var(--silver) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Ambient glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(179,133,83,0.08),transparent_70%)]" />

              {/* Map label */}
              <div className="absolute top-5 left-5">
                <p className="label-tag text-white/40">Fifth Settlement · New Cairo</p>
              </div>

              {/* Live indicator */}
              <div className="absolute top-5 right-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Live</span>
              </div>

              {/* Markers */}
              {markers.map((marker) => (
                <div
                  key={marker.name}
                  className="absolute group -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ top: marker.top, left: marker.left }}
                >
                  {/* Pulse ring */}
                  <div className="w-3 h-3 rounded-full bg-[var(--gold-500)] shadow-[0_0_12px_rgba(179,133,83,0.7)] relative z-10" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-[var(--gold-500)] opacity-30 animate-ping" />

                  {/* Tooltip */}
                  <div className="absolute left-5 -top-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                    <div className="bg-white rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-[11px] font-semibold text-[var(--navy-900)]">{marker.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-2.5 h-2.5 text-[var(--gold-500)]" />
                        <span className="text-[10px] text-[var(--gold-500)] font-bold">{marker.score} / 100</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom stats bar */}
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Avg. Market Yield</p>
                    <p className="text-white font-semibold text-sm">8.4% · Q1 2026</p>
                  </div>
                  <div className="h-8 w-px bg-white/10 mx-4" />
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">AI Confidence</p>
                    <p className="text-[var(--gold-400)] font-semibold text-sm">94.7%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
