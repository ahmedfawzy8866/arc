import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[#E8EBF3] font-sans">
      <Navbar />

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-[var(--accent-primary)] text-xs font-bold uppercase tracking-[0.4em] inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-[var(--accent-primary)]"></span>
              Future Forward
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-premium">
              Visionary Projects
            </h1>
            <p className="text-[#AEB4C6] mt-6 max-w-xl text-lg">
              Exclusive pre-launch access to New Cairo&apos;s most transformative luxury developments.
            </p>
          </div>

          <div className="space-y-32">
            {/* Project 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center group">
              <div className="relative h-[600px] w-full overflow-hidden rounded-[40px] border border-white/5">
                <Image
                  src="/images/olympos.png"
                  alt="The Olympos Towers"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-80" />
                <div className="absolute top-8 left-8 badge-new">Off-Plan</div>
              </div>
              <div className="space-y-8">
                <div>
                   <h2 className="text-4xl font-bold font-premium mb-2">The Olympos Towers</h2>
                   <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-primary)] font-bold">New Capital District</p>
                </div>
                <p className="text-[#AEB4C6] leading-relaxed">
                  A twin-tower residential marvel featuring Egypt&apos;s first sky-bridge infinity pool. Designed by globally renowned architects, setting a new benchmark for vertical luxury.
                </p>
                
                <ul className="space-y-4">
                   <li className="flex items-center gap-3 text-sm text-[#E8EBF3]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-glow)]"></div>
                      Completion: Q4 2028
                   </li>
                   <li className="flex items-center gap-3 text-sm text-[#E8EBF3]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-glow)]"></div>
                      Starting from EGP 80,000,000
                   </li>
                </ul>

                <button className="btn-pill-accent mt-8 w-fit text-xs px-10 py-4">
                  Request Floor Plans
                </button>
              </div>
            </div>

            {/* Project 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center group">
              <div className="order-2 lg:order-1 space-y-8">
                <div>
                   <h2 className="text-4xl font-bold font-premium mb-2">Aura Villas Phase II</h2>
                   <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-primary)] font-bold">Golden Square, New Cairo</p>
                </div>
                <p className="text-[#AEB4C6] leading-relaxed">
                  An exclusive enclave of 14 ultra-modern smart villas. Fully integrated home automation, private thermal pools, and expansive glass facades overlooking the central park.
                </p>
                
                <ul className="space-y-4">
                   <li className="flex items-center gap-3 text-sm text-[#E8EBF3]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-glow)]"></div>
                      Immediate Delivery
                   </li>
                   <li className="flex items-center gap-3 text-sm text-[#E8EBF3]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-glow)]"></div>
                      Only 2 units remaining
                   </li>
                </ul>

                <button className="btn-pill-glass hover:!bg-[var(--accent-primary)] hover:!text-[#050510] mt-8 w-fit text-xs px-10 py-4">
                  Schedule Private Tour
                </button>
              </div>
              <div className="relative h-[600px] w-full overflow-hidden rounded-[40px] border border-white/5 order-1 lg:order-2">
                <Image
                  src="/images/aura.png"
                  alt="Aura Villas Phase II"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-80" />
                <div className="absolute top-8 right-8 badge-premium">Signature</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
