import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SERVICES = [
  {
    title: "Private Advisory",
    description:
      "A fully bespoke service for high-net-worth buyers and investors. Your dedicated advisor leads every step — from discovery to title transfer — with absolute discretion.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Investment Intelligence",
    description:
      "Our proprietary AI platform cross-references market velocity, infrastructure developments, and demographic shifts to surface opportunities ahead of the wider market.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Off-Market Access",
    description:
      "A curated network of private sellers, developers, and funds allows Sierra-Blu clients first access to properties that never reach the public market.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Portfolio Management",
    description:
      "For clients holding multiple assets, we provide quarterly performance reviews, rental yield optimization, and strategic holding or exit recommendations.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "Developer Liaison",
    description:
      "We bridge the gap between discerning buyers and Egypt's top developers — negotiating terms, payment structures, and exclusive unit selection on your behalf.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: "Legal & Compliance",
    description:
      "Our trusted legal partners ensure clean titles, secure escrow arrangements, and full regulatory compliance — protecting your capital at every stage.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[#E8EBF3] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-44 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <span className="text-[var(--accent-primary)] text-xs font-bold uppercase tracking-[0.4em] inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-[var(--accent-primary)]" />
            Sierra-Blu Services
          </span>
          <h1 className="text-5xl md:text-7xl font-bold font-premium leading-[1.05] mb-6 max-w-3xl">
            Beyond Brokerage.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-white/60">
              True Advisory.
            </span>
          </h1>
          <p className="text-[#AEB4C6] text-lg max-w-2xl leading-relaxed">
            We combine artificial intelligence with human expertise to deliver a real estate 
            experience reserved for those who demand more than what the market openly offers.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, idx) => (
            <div
              key={idx}
              className="glass p-10 group hover:-translate-y-2 transition-all duration-500 hover:border-[var(--accent-primary)]/20 border border-white/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] mb-8 group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--background)] transition-all duration-500">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 font-premium group-hover:text-[var(--accent-primary)] transition-colors">
                {service.title}
              </h3>
              <p className="text-[#AEB4C6] text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Block */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center glass p-16 border border-[var(--accent-primary)]/10">
          <span className="text-[var(--accent-primary)] text-xs font-bold uppercase tracking-[0.4em] mb-6 block">
            Ready to Begin
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-premium mb-6">
            Request a Private Consultation
          </h2>
          <p className="text-[#AEB4C6] mb-10 max-w-xl mx-auto">
            A senior advisor will respond within 24 hours to arrange a confidential briefing tailored to your goals and timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:concierge@sierra-blu.com"
              className="btn-accent px-10 py-4 text-sm"
            >
              Contact Concierge
            </a>
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 text-sm border border-white/10 text-white/70 hover:border-[var(--accent-primary)]/40 hover:text-white transition-all font-bold uppercase tracking-widest"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
