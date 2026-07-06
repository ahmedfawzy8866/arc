"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { getProperties } from "@/lib/firestore";
import {
  resolveProperties,
  getPrimaryPropertyImage,
  getPropertyHref,
  formatPropertyPrice,
} from "@/lib/properties";
import { motion } from "framer-motion";
import MotionContainer from "./MotionContainer";
import { fadeIn, staggerContainer } from "@/lib/motion";
import type { Property } from "@/lib/firestore";

/**
 * Featured Collections Section
 * High-performance, luxury rendering of private real estate portfolio.
 */
export default function FeaturedListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getProperties();
        setProperties(resolveProperties(data).slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

  return (
    <section id="listings" className="py-40 px-6 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
          <div className="max-w-2xl">
            <MotionContainer
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
               <span className="w-8 h-[1px] bg-gold/40" />
               <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gold">
                 Curated Portfolio
               </span>
            </MotionContainer>
            <h2 className="text-5xl md:text-7xl font-luxury leading-tight text-white mb-8">
              Intelligence in <br />
              <span className="text-gold text-glow-gold">Acquisition.</span>
            </h2>
            <p className="text-[#F8F8F8]/60 text-lg font-light max-w-xl">
              From Katameya Heights to Azure Residences, our AI-led selection process identifies the most promising luxury assets.
            </p>
          </div>
          
          <Link href="/listings" className="btn-ghost-glass px-10 group flex items-center gap-3">
             View Entire Collection
             <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Grid */}
        <MotionContainer
           variants={staggerContainer}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[600px] rounded-[32px] bg-white/5 animate-pulse" />
            ))
          ) : (
            properties.map((item, i) => (
              <ListingCard key={item.id ?? i} item={item} index={i} />
            ))
          )}
        </MotionContainer>
      </div>
    </section>
  );
}

/**
 * Signature Listing Card Component
 */
function ListingCard({ item, index }: { item: Property; index: number }) {
  return (
    <motion.div
      variants={fadeIn}
      custom={index}
      className="group flex flex-col h-full glass-card overflow-hidden border border-gold/5 hover:border-gold/30 transition-all duration-700 hover:shadow-[0_40px_100px_rgba(199,159,63,0.15)]"
    >
      {/* Visual Header */}
      <div className="relative h-[420px] w-full overflow-hidden">
        <Image 
          src={getPrimaryPropertyImage(item)}
          alt={item.title} 
          fill 
          className="object-cover transition-all duration-[2000ms] group-hover:scale-110 brightness-[1.1] group-hover:brightness-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        
        {/* Context Badges */}
        <div className="absolute top-8 left-8 flex flex-col gap-2">
           <div className="px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] bg-gold/20 text-gold-light border border-gold/40 backdrop-blur-md">
             Match Score: 98%
           </div>
        </div>

        <Link href={getPropertyHref(item)} className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-gold hover:text-background">
           <ExternalLink className="w-5 h-5" />
        </Link>
      </div>

      {/* Narrative Footer */}
      <div className="p-10 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-4 text-gold/80">
           <MapPin className="w-3 h-3" />
           <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{item.community}</span>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-luxury text-white mb-8 group-hover:text-gold transition-colors">{item.title}</h3>
        
        {/* Technical Profile */}
        <div className="grid grid-cols-3 gap-8 py-8 border-y border-white/5 mt-auto">
           <div className="flex flex-col">
              <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Beds</span>
              <span className="text-white font-medium">{item.bedrooms}</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Baths</span>
              <span className="text-white font-medium">{item.bathrooms}</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Area</span>
              <span className="text-white font-medium">{item.size}m²</span>
           </div>
        </div>

        {/* Pricing Discovery */}
        <div className="flex items-center justify-between pt-8">
           <span className="text-2xl font-bold font-luxury text-gold-light text-glow-gold">
             {formatPropertyPrice(item.price)}
           </span>
           <Link href={getPropertyHref(item)} className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40 hover:text-gold transition-all">
             View Property →
           </Link>
        </div>
      </div>
    </motion.div>
  );
}
