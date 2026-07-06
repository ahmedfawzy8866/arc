import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getProperties } from "@/lib/firestore";
import {
  findPropertyByIdentifier,
  formatOfferType,
  formatPropertyPrice,
  formatPropertyType,
  getPrimaryPropertyImage,
  resolveProperties,
} from "@/lib/properties";
import { CONTACT } from "@/lib/site";

type PageProps = {
  params: Promise<{ id: string }>;
};

const getProperty = async (identifier: string) => {
  const properties = resolveProperties(await getProperties());
  return findPropertyByIdentifier(properties, identifier);
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return {
      title: "Listing Not Found",
    };
  }

  return {
    title: property.title,
    description: property.description,
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const gallery = property.images.length > 0 ? property.images : [getPrimaryPropertyImage(property)];
  const inquiryHref = `${CONTACT.emailHref}?subject=${encodeURIComponent(
    `Inquiry about ${property.referenceNumber}`,
  )}`;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-32 pb-24 px-6 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative aspect-[16/9] bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <Image
                src={gallery[0]!}
                alt={property.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {gallery.slice(1, 3).map((image, index) => (
                <div
                  key={`${property.referenceNumber}-${index}`}
                  className="relative aspect-square bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`${property.title} view ${index + 2}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-12">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-[#AEB4C6] uppercase block mb-4">
                Reference / {property.referenceNumber}
              </span>
              <h1 className="text-5xl font-medium tracking-tighter lowercase mb-4 font-premium">
                {property.title}
              </h1>
              <div className="text-xl text-[var(--accent-primary)] font-medium">
                {formatPropertyPrice(property.price)}
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <p className="text-sm leading-relaxed text-[#AEB4C6] mb-8">
                {property.description}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8 text-[10px] tracking-widest uppercase">
                <div>
                  <span className="text-white/30 block mb-1">Beds</span>
                  <span className="text-white">{property.bedrooms} Bedrooms</span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1">Baths</span>
                  <span className="text-white">{property.bathrooms} Bathrooms</span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1">Area</span>
                  <span className="text-white">{property.size} sqm</span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1">Type</span>
                  <span className="text-white">{property.propertyType ? formatPropertyType(property.propertyType) : "Apartment"}</span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1">Offer</span>
                  <span className="text-white">{property.offerType ? formatOfferType(property.offerType) : "For Sale"}</span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1">Location</span>
                  <span className="text-white">{property.subCommunity || property.community}</span>
                </div>
              </div>

                <a
                href={inquiryHref}
                className="block w-full bg-[var(--accent-primary)] text-[#0A0A24] py-4 text-center text-[10px] font-bold uppercase tracking-[0.3em] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(0,229,255,0.2)]"
              >
                Request Private Viewing
              </a>
            </div>

            <div>
              <h3 className="text-[10px] tracking-[0.2em] text-[#AEB4C6] uppercase mb-4">
                Signature Amenities
              </h3>
              <ul className="flex flex-col gap-2">
                {(property.facilities?.length ? property.facilities : ["Private Advisory", "Site Visit Coordination"]).map((f) => (
                  <li key={f} className="text-[10px] uppercase tracking-widest text-[#AEB4C6] flex items-center gap-4">
                    <span className="w-4 h-[1px] bg-white/10" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
