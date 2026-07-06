import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import FeaturedListings from "@/app/components/FeaturedListings";
import Neighborhoods from "@/app/components/Neighborhoods";
import AgentsSection from "@/app/components/AgentsSection";
import { CONTACT } from "@/lib/site";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* WhatsApp quick contact — visible on mobile */}
      <a
        href={CONTACT.phoneHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 md:hidden"
        aria-label="WhatsApp"
      >
        {/* WhatsApp icon */}
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M11.998 2.003C6.476 2.003 2.003 6.476 2.003 12c0 1.762.466 3.411 1.277 4.843L2 22l5.354-1.254A9.955 9.955 0 0011.998 22C17.522 22 22 17.524 22 12c0-5.523-4.478-9.997-10.002-9.997zm0 18.18a8.164 8.164 0 01-4.16-1.142l-.298-.177-3.177.744.772-3.09-.194-.313A8.2 8.2 0 013.82 12c0-4.516 3.672-8.19 8.178-8.19 4.507 0 8.178 3.674 8.178 8.19 0 4.518-3.671 8.183-8.178 8.183z"/>
        </svg>
      </a>

      {/* Desktop advisor CTA */}
      <Link
        href="/contact"
        className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-3 bg-[var(--navy-900)] text-white px-5 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Book a Free Consultation
      </Link>

      <Hero />
      <FeaturedListings />
      <Neighborhoods />
      <AgentsSection />
      <Footer />
    </main>
  );
}
