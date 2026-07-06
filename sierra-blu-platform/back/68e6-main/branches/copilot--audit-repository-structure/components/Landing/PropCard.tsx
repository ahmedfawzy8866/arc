'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PropCardProps {
  id: string | number;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  badge: string;
  badgeColor: string;
  img: string;
  videoUrl?: string;
  dealDelay?: number;
  dealt?: boolean;
  isAr?: boolean;
}

const ICON_ATTRS = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Spec({ icon, children, isAr }: { icon: React.ReactNode; children: React.ReactNode; isAr?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 text-[12px] font-medium tracking-tight text-on-surface-variant ${isAr ? 'flex-row-reverse' : ''}`}>
      <span className="text-secondary/60">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

export default function PropCard({ id, title, location, price, beds, baths, sqft, badge, badgeColor, img, videoUrl, dealDelay = 0, dealt = false, isAr = false }: PropCardProps) {
  const [hov, setHov] = useState(false);

  return (
    <Link
        href={`/listings/${id}`}
      className={`deal-card${dealt ? ' dealt' : ''} block group no-underline h-full`}
      style={{ animationDelay: `${dealDelay}s` }}
    >
      <div className="lux-card card-lift rounded-2xl overflow-hidden border border-outline-variant bg-surface-container-lowest h-full flex flex-col shadow-ambient">
        {/* Image wrapper */}
        <div className="relative h-[260px] overflow-hidden bg-primary">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 cubic-bezier(0.16,1,0.3,1) group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-60" />
          
          {/* Badge */}
          <div
            className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} lux-glass !bg-secondary/90 !text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase shadow-xl border-none`}
          >
            {badge}
          </div>

          {/* Video Indicator */}
          {videoUrl && (
            <div className={`absolute bottom-4 ${isAr ? 'left-4' : 'right-4'} flex items-center gap-2 lux-glass !bg-black/40 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest text-white uppercase backdrop-blur-sm border border-white/10`}>
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              {isAr ? 'عرض سينمائي' : 'Cinematic View'}
            </div>
          )}

          {/* Play Icon Overlay */}
          {videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-primary/10">
              <div className="w-12 h-12 rounded-full lux-glass flex items-center justify-center text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`p-6 flex flex-col flex-grow ${isAr ? 'text-right items-end' : 'text-left items-start'}`}>
          {/* Location / Compound */}
          <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-secondary mb-3 font-body">
            {location.split('·')[0]?.trim()}
          </div>

          {/* Title */}
          <h3 className="font-serif text-2xl font-medium text-on-surface mb-4 leading-tight line-clamp-2 h-[3.5rem] group-hover:text-secondary transition-colors duration-300">
            {title}
          </h3>

          {/* Price */}
          <div className="lux-gold-text text-xl font-semibold mb-6 tracking-tight font-mono">
            {price}
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-outline-variant/30 mb-6" />

          {/* Specs */}
          <div className={`w-full flex items-center justify-between gap-4 ${isAr ? 'flex-row-reverse' : ''}`}>
            <Spec isAr={isAr} icon={
              <svg {...ICON_ATTRS}>
                <path d="M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7" />
                <path d="M21 10H3" />
                <path d="M7 7V4a1 1 0 011-1h3v4" />
                <path d="M17 7V4a1 1 0 00-1-1h-3v4" />
              </svg>
            }>
              {beds} <span className="opacity-60">{isAr ? 'غرف' : 'Beds'}</span>
            </Spec>

            <Spec isAr={isAr} icon={
              <svg {...ICON_ATTRS}>
                <path d="M4 12h16a1 1 0 011 1v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a1 1 0 011-1z" />
                <path d="M6 12V5a2 2 0 012-2h8a2 2 0 012 2v7" />
              </svg>
            }>
              {baths} <span className="opacity-60">{isAr ? 'حمامات' : 'Baths'}</span>
            </Spec>

            <Spec isAr={isAr} icon={
              <svg {...ICON_ATTRS}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 3v18" />
              </svg>
            }>
              {sqft}
            </Spec>
          </div>
        </div>
      </div>
    </Link>
  );
}
