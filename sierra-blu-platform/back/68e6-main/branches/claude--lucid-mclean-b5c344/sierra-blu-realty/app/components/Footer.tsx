import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook, ArrowRight } from "lucide-react";
import { CONTACT, NAV_LINKS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="section-navy" id="contact">
      {/* ── Top CTA Band ── */}
      <div className="border-b border-white/10">
        <div className="section-wrap py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="label-tag text-[var(--gold-400)] mb-2">Ready to find your property?</p>
            <h2 className="font-display text-3xl md:text-4xl text-white font-medium">
              Let&apos;s Talk.
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="btn-gold">
              Book a Consultation
            </Link>
            <Link href="/listings" className="btn-outline border-white/30 text-white hover:bg-white hover:text-[var(--navy-900)]">
              View Listings
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="section-wrap py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand column */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="inline-block group">
              <div className="relative">
                <div className="absolute inset-0 bg-gold/15 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Sierra Blu Realty"
                  className="relative z-10 h-20 w-auto object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)] group-hover:drop-shadow-[0_4px_20px_rgba(212,175,55,0.6)] transition-all duration-700"
                />
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-12">
              Architecting the future of property acquisition in Egypt through structural precision and AI-powered intelligence.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:border-[var(--gold-500)] hover:text-[var(--gold-400)] transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="label-tag text-[var(--gold-400)] mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/50 hover:text-white text-sm transition-colors duration-200">
                  Home
                </Link>
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/50 hover:text-white text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-tag text-[var(--gold-400)] mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors duration-200 group"
                >
                  <Phone className="w-4 h-4 text-[var(--gold-500)] flex-shrink-0" />
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.emailHref}
                  className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors duration-200 group"
                >
                  <Mail className="w-4 h-4 text-[var(--gold-500)] flex-shrink-0" />
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin className="w-4 h-4 text-[var(--gold-500)] flex-shrink-0 mt-0.5" />
                <span>Fifth Settlement, New Cairo, Egypt</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="label-tag text-[var(--gold-400)] mb-6">Private Newsletter</h4>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-5">
              Get curated property picks and market intelligence delivered directly to you.
            </p>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none px-2"
              />
              <button
                aria-label="Subscribe"
                className="w-9 h-9 bg-[var(--gold-500)] rounded-lg flex items-center justify-center text-white hover:bg-[var(--gold-400)] transition-colors flex-shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-[11px] uppercase tracking-[0.3em]">
            © 2026 Sierra Blu Realty. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.25em] text-white/30">
            <Link href="/privacy" className="hover:text-[var(--gold-400)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--gold-400)] transition-colors">Terms of Use</Link>
            <Link href="/portal" className="hover:text-[var(--gold-400)] transition-colors">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
