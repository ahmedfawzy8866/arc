"use client";

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

export default function CinematicHero() {
    const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 300 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

  const bgX = useTransform(smoothX, [-0.5, 0.5], ['2%', '-2%']);
    const bgY = useTransform(smoothY, [-0.5, 0.5], ['2%', '-2%']);
    const textX = useTransform(smoothX, [-0.5, 0.5], ['-10px', '10px']);
    const textY = useTransform(smoothY, [-0.5, 0.5], ['-10px', '10px']);

  const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        mouseX.set((clientX - left) / width - 0.5);
        mouseY.set((clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
  };

  const stats = [
    { value: '1,200+', label: 'Portfolio Assets' },
    { value: '98%', label: 'Match Rate' },
    { value: '8+', label: 'Compounds' },
    { value: '4s', label: 'Response Time' },
      ];

  return (
        <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full h-screen min-h-[700px] overflow-hidden bg-[#03080F] flex flex-col items-center justify-center font-serif text-[#F4F0E8]"
              >
          {/* ── LAYER 1: Villa Background Image ── */}
              <motion.div
                        className="absolute inset-0 z-0 scale-[1.06]"
                        style={{ x: bgX, y: bgY }}
                      >
                {/* High-quality Unsplash luxury villa – golden garden view */}
                      <img
                                  src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=2000&q=85&auto=format&fit=crop"
                                  alt="Luxury villa with golden garden"
                                  className="w-full h-full object-cover"
                                />
              
                {/* Dark cinematic overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#03080F] via-[#03080F]/60 to-[#03080F]/30" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#03080F]/70 via-transparent to-[#03080F]/40" />
              
                {/* Warm gold tint overlay for Uptown Cairo golden-hour feel */}
                      <div className="absolute inset-0 bg-[#C9A24D]/8 mix-blend-overlay" />
              </motion.div>motion.div>
        
          {/* ── LAYER 2: Gold accent top bar ── */}
              <motion.div
                        className="absolute top-0 left-0 right-0 h-[2px] z-20"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
                        style={{ background: 'linear-gradient(90deg, transparent, #C9A24D, #F0D080, #C9A24D, transparent)' }}
                      />
        
          {/* ── LAYER 3: Main Hero Content ── */}
              <motion.div
                        className="relative z-30 flex flex-col items-center text-center px-6 max-w-6xl mx-auto"
                        style={{ x: textX, y: textY }}
                      >
                {/* Brand label */}
                      <motion.div
                                  className="mb-6 flex items-center gap-3"
                                  initial={{ opacity: 0, y: -20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 1, delay: 0.8 }}
                                >
                                <div className="h-[1px] w-12 bg-[#C9A24D]" />
                                <span className="text-[#C9A24D] text-xs tracking-[0.35em] uppercase font-sans font-semibold">
                                            Sierra Blu Realty · New Cairo
                                </span>span>
                                <div className="h-[1px] w-12 bg-[#C9A24D]" />
                      </motion.div>motion.div>
              
                {/* Diamond icon */}
                      <motion.div
                                  className="mb-6"
                                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                  transition={{ duration: 1.2, delay: 1, ease: 'easeOut' }}
                                >
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                            <motion.path
                                                            d="M24 3 L45 24 L24 45 L3 24 Z"
                                                            stroke="#C9A24D"
                                                            strokeWidth="1"
                                                            fill="none"
                                                            initial={{ pathLength: 0, opacity: 0 }}
                                                            animate={{ pathLength: 1, opacity: 1 }}
                                                            transition={{ duration: 1.8, ease: 'easeInOut', delay: 1.2 }}
                                                            className="drop-shadow-[0_0_6px_rgba(201,162,77,0.9)]"
                                                          />
                                            <motion.circle
                                                            cx="24" cy="24" r="4"
                                                            fill="#C9A24D"
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ delay: 2.5, duration: 0.8, ease: 'easeOut' }}
                                                          />
                                </svg>svg>
                      </motion.div>motion.div>
              
                {/* Main headline */}
                      <motion.h1
                                  className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-[-0.02em] leading-none mb-5"
                                  initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
                                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                  transition={{ duration: 1.6, ease: 'easeOut', delay: 1.2 }}
                                >
                                Disciplined
                                <br />
                                <span
                                              style={{
                                                              background: 'linear-gradient(135deg, #E8D5A3 0%, #C9A24D 40%, #F0D080 60%, #C9A24D 100%)',
                                                              WebkitBackgroundClip: 'text',
                                                              WebkitTextFillColor: 'transparent',
                                                              backgroundClip: 'text',
                                              }}
                                            >
                                            Intelligence.
                                </span>span>
                      </motion.h1>motion.h1>
              
                {/* Subtitle */}
                      <motion.p
                                  className="text-base md:text-lg font-sans tracking-[0.18em] text-[#F4F0E8]/65 uppercase mb-10 max-w-xl"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 2, delay: 2.2 }}
                                >
                                New Cairo&apos;s Premier Rent &amp; Resale Platform
                                <span className="block text-[#C9A24D]/70 text-xs tracking-[0.3em] mt-2">
                                            AI‑Powered Real Estate Intelligence
                                </span>span>
                      </motion.p>motion.p>
              
                {/* CTA Buttons */}
                      <motion.div
                                  className="flex flex-col sm:flex-row items-center gap-4 font-sans mb-16"
                                  initial={{ opacity: 0, y: 24 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 1, delay: 2.6 }}
                                >
                                <Link href="/portfolio">
                                            <button className="px-9 py-4 border border-[#C9A24D] text-[#C9A24D] text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#C9A24D] hover:text-[#03080F] transition-all duration-400 rounded-sm min-w-[200px]">
                                                          Explore Portfolio
                                            </button>button>
                                </Link>Link>
                                <button className="px-9 py-4 bg-[#C9A24D] text-[#03080F] text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#F0D080] transition-all duration-400 rounded-sm min-w-[200px] flex items-center justify-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#03080F] animate-pulse" />
                                            Talk to Sierra AI
                                </button>button>
                      </motion.div>motion.div>
              
                {/* Stats bar */}
                      <motion.div
                                  className="flex flex-wrap justify-center gap-8 sm:gap-12"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 1, delay: 3 }}
                                >
                        {stats.map((stat, i) => (
                                              <motion.div
                                                              key={stat.label}
                                                              className="flex flex-col items-center"
                                                              initial={{ opacity: 0, y: 16 }}
                                                              animate={{ opacity: 1, y: 0 }}
                                                              transition={{ delay: 3 + i * 0.15, duration: 0.7 }}
                                                            >
                                                            <span className="text-3xl md:text-4xl font-black text-[#C9A24D] tracking-tight leading-none">
                                                              {stat.value}
                                                            </span>span>
                                                            <span className="text-[10px] text-[#F4F0E8]/50 uppercase tracking-[0.2em] font-sans mt-1">
                                                              {stat.label}
                                                            </span>span>
                                              </motion.div>motion.div>
                                            ))}
                      </motion.div>motion.div>
              </motion.div>motion.div>
        
          {/* ── LAYER 4: Scroll indicator ── */}
              <motion.div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4.5, duration: 1 }}
                      >
                      <span className="text-[9px] text-[#C9A24D]/60 tracking-[0.3em] uppercase font-sans">Descent</span>span>
                      <div className="w-[1px] h-12 bg-gradient-to-b from-[#C9A24D] to-transparent animate-pulse" />
              </motion.div>motion.div>
        </div>div>
      );
}</div>
