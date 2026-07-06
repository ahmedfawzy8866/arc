import Link from "next/link";
import { CONTACT, NAV_LINKS } from "@/lib/site";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0A1128] border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 border-2 border-[var(--accent-primary)] rounded-full flex items-center justify-center p-1 overflow-hidden">
                <svg width="24" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><path d="M12 2L4 7V17L12 22L20 17V7L12 2Z"/></svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold tracking-wider uppercase text-white">Sierra Blu</span>
                <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent-primary)] font-medium">— REALTY —</span>
              </div>
            </div>
            <p className="text-[#C7CCDB] text-sm leading-relaxed max-w-xs">
              Smarter Decisions, AI-Driven. Private advisory for New Cairo&apos;s most refined residences. Beyond Brokerage.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm text-[#AEB4C6]">
              <li><Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">Home</Link></li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[var(--accent-primary)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li><Link href="/#neighborhoods" className="hover:text-[var(--accent-primary)] transition-colors">Neighborhoods</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Contact</h4>
            <ul className="space-y-4 text-sm text-[#AEB4C6]">
              <li className="flex items-center gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3c0 1.13-.91 2.08-2.04 2.02A19.88 19.88 0 0 1 3.08 4.02C3.02 2.89 3.97 1.98 5.1 2h3c.96 0 1.8.63 2.06 1.56.26.96-.13 1.96-.83 2.6L7.5 7.92a15.42 15.42 0 0 0 8.58 8.58l1.76-1.83c.64-.7 1.64-1.09 2.6-.83.93.26 1.56 1.1 1.56 2.06z"/></svg>
                <a href={CONTACT.phoneHref} className="hover:text-white transition-colors">{CONTACT.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href={CONTACT.emailHref} className="hover:text-white transition-colors">{CONTACT.email}</a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8">Newsletter</h4>
            <p className="text-[#AEB4C6] text-xs leading-relaxed uppercase tracking-wider">
               Join our private mailing list <br/> for signature listings.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="EMAIL" 
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs w-full focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <button className="w-10 h-10 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-[#0A1128]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <span className="text-[10px] uppercase tracking-[0.4em] text-[#4E5872]">
              © 2026 Sierra-Blu Realty. Private Client Portfolio.
           </span>
           <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] text-[#4E5872]">
              <Link href="/services" className="hover:text-[#AEB4C6] transition-colors">Services</Link>
              <a href={CONTACT.emailHref} className="hover:text-[#AEB4C6] transition-colors">Email</a>
              <Link href="/portal" className="hover:text-[#AEB4C6] transition-colors">Portal</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
