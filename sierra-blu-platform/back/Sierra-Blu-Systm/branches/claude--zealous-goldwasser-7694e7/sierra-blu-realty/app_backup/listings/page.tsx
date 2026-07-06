import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeaturedListings from "../components/FeaturedListings";

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-premium">Curated Portfolio</h1>
              <p className="text-[#AEB4C6] mt-4 max-w-lg">
                Explore our exclusive collection of New Cairo&apos;s finest residences.
              </p>
            </div>
            
            <div className="flex gap-4">
              <select className="bg-[var(--surface)] border border-white/10 text-white px-4 py-2 rounded-none outline-none focus:border-[var(--accent-primary)] text-sm">
                <option>All Neighborhoods</option>
                <option>Katameya Heights</option>
                <option>Mivida</option>
                <option>Palm Hills</option>
              </select>
              <select className="bg-[var(--surface)] border border-white/10 text-white px-4 py-2 rounded-none outline-none focus:border-[var(--accent-primary)] text-sm">
                <option>Price: Any</option>
                <option>EGP 50M - 100M</option>
                <option>EGP 100M+</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Reuse the FeaturedListings component but wrapped in a slightly different context if needed, 
          or just render it directly. Here we render it directly as it handles its own layout. 
          In a real app, you might have a generic PropertyGrid component. */}
      <div className="pb-24">
         <FeaturedListings />
      </div>

      <Footer />
    </main>
  );
}
