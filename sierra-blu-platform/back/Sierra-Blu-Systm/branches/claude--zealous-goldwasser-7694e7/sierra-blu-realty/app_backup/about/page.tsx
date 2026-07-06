import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
            alt="Luxury Architecture"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/80 via-[var(--background)]/60 to-[var(--background)]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-[var(--accent-primary)] text-xs font-bold uppercase tracking-[0.4em] inline-flex items-center gap-2">
              <span className="w-8 h-px bg-[var(--accent-primary)]"></span>
              The Sierra Blu Vision
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-premium leading-tight">
              Redefining <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Real Estate</span>
            </h1>
            <p className="text-[#AEB4C6] text-lg leading-relaxed max-w-xl">
              We are not just a brokerage. We are a private advisory firm utilizing artificial intelligence to pinpoint the most lucrative investment opportunities in New Cairo and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6 relative border-y border-white/5 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Data-Driven Precision",
                description: "Our proprietary algorithms analyze market trends, infrastructure developments, and historical pricing to forecast appreciation.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                )
              },
              {
                title: "Private Advisory",
                description: "We serve a discerning clientele that demands discretion, exclusive access, and a personalized approach to wealth building.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                )
              },
              {
                title: "Curated Portfolio",
                description: "We don't list everything. We curate a handpicked selection of New Cairo's most exceptional villas, penthouses, and commercial spaces.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                )
              }
            ].map((item, idx) => (
              <div key={idx} className="glass p-8 group hover:-translate-y-2 transition-transform duration-500">
                <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] mb-6 border border-[var(--accent-primary)]/20 group-hover:bg-[var(--accent-primary)] group-hover:text-[#050510] transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-[#AEB4C6] text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "EGP 2B+", label: "Capital Deployed" },
              { value: "15+", label: "Partner Developers" },
              { value: "98%", label: "Client Retention" },
              { value: "110+", label: "Off-Market Deals" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-8 border border-white/5 glass">
                <div className="text-4xl md:text-5xl font-bold font-premium text-[var(--accent-primary)] mb-2">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#AEB4C6] font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
