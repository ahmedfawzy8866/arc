import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/site";
import UserNav from "./UserNav";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-5 ${
          isScrolled ? "bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-2xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Updated to White per spec */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center p-1 overflow-hidden transition-all duration-300 group-hover:border-cyan group-hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12L12 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12L4 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12L20 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-bold tracking-tighter uppercase text-white font-premium">Sierra-Blu</span>
              <span className="text-[9px] uppercase tracking-[0.5em] text-white/60 font-medium -mt-1 ml-0.5">ESTATE ADVISORY</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.25em]">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative transition-all duration-300 ${isActive ? 'text-white' : 'text-white/50 hover:text-white'}`}
                >
                  {link.label}
                  <span className={`absolute -bottom-2 left-0 h-[2px] bg-cyan shadow-[0_0_10px_rgba(0,229,255,0.8)] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              );
            })}
          </div>

          {/* Action area */}
          <div className="flex items-center gap-8">
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-white cursor-default border-b border-cyan/40">EN</span>
              <span className="text-white/30 cursor-pointer hover:text-white transition-colors">AR</span>
            </div>

            <UserNav />

            <Link
              href="/portal"
              className="btn-primary !px-6 !py-2.5 !text-[10px] hidden lg:flex"
            >
              Private Portal
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-[var(--surface)] border-l border-white/5 pt-32 px-12 flex flex-col gap-8 shadow-2xl">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white text-2xl font-premium hover:text-cyan transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/portal"
              className="mt-8 btn-primary text-center py-5"
              onClick={() => setMobileOpen(false)}
            >
              Private Portal
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

