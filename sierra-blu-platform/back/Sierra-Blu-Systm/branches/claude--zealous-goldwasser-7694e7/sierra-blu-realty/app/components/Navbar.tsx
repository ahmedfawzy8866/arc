"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import UserNav from "./UserNav";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled
            ? "bg-background/80 backdrop-blur-2xl border-white/5 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          
          {/* ── Logo Container ── */}
          <Link href="/" className="flex items-center group">
            <div className="relative flex items-center justify-center">
              {/* Animated Glow Behind Logo */}
              <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Logo Image — contains full brand text inside the asset */}
              <div className="relative z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Sierra Blu Realty"
                  className="h-14 w-auto object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)] group-hover:drop-shadow-[0_4px_20px_rgba(212,175,55,0.7)] transition-all duration-700"
                />
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 py-1 ${
                    isActive ? "text-gold" : "text-white/50 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 w-8 h-[2px] bg-gold rounded-full" 
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-6">
            <UserNav />

            {/* AI Portal Link */}
            <Link
              href="/portal"
              className="hidden lg:inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white hover:text-background hover:border-white transition-all duration-500 shadow-xl backdrop-blur-md"
            >
              Analyze <ChevronDown className="w-3 h-3 -rotate-90" />
            </Link>

            {/* Mobile toggle */}
            <button
              className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div
              className="absolute inset-0 bg-[var(--navy-900)]/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl flex flex-col pt-24 px-8"
            >
              <div className="space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center justify-between py-3.5 border-b border-[var(--mist)] text-[var(--navy-900)] font-medium text-sm hover:text-[var(--gold-500)] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[var(--silver)]" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pb-10">
                <Link
                  href="/portal"
                  className="btn-primary w-full text-center justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Access Portal
                </Link>
                <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-[var(--silver)] text-center">
                  Sierra Blu · Fifth Settlement
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
