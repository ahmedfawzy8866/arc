"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const POSTS = [
  { id: 1, title: "the new cairo shift: beyond development", category: "market insights", date: "24.03.2026" },
  { id: 2, title: "monolithic minimalism in modern estates", category: "architecture", date: "18.03.2026" },
  { id: 3, title: "liquidity and luxury: the q1 report", category: "investment", date: "12.03.2026" },
];

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-32 pb-24 px-6 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/10 pb-12">
          <div>
            <span className="text-[10px] tracking-[0.4em] text-[#AEB4C6] uppercase block mb-4">
              Intelligence / journal
            </span>
            <h1 className="text-6xl font-medium tracking-tighter lowercase text-[var(--foreground)]">
              market signals.
            </h1>
          </div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-[#4E5872]">
            Archive / 042
          </div>
        </header>

        <div className="flex flex-col gap-px bg-white/5 border border-white/5">
          {POSTS.map((post) => (
            <article key={post.id} className="group bg-[var(--background)] p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:bg-white/5 transition-all duration-500">
              <div className="flex flex-col gap-6 max-w-2xl">
                <span className="text-[10px] tracking-[0.35em] text-[var(--accent-primary)] uppercase font-bold">
                  {post.category}
                </span>
                <h2 className="text-4xl font-medium tracking-tight lowercase text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors leading-tight">
                  {post.title}
                </h2>
              </div>
              <div className="flex items-center gap-16">
                <time className="text-[11px] text-[#4E5872] uppercase tracking-[0.2em]">
                  {post.date}
                </time>
                <div className="w-16 h-16 border border-white/10 flex items-center justify-center group-hover:border-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-[#0A0A24] transition-all duration-300 rounded-full cursor-pointer">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Read</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
