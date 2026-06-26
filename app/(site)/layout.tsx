import { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingButtons } from "@/components/FloatingButtons";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  // LocalBusiness structured data — boosts local SEO ("solar Pudukkottai", etc.).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SolarEnergyContractor",
    name: settings.companyName,
    description: settings.metaDescription,
    image: settings.logoUrl || undefined,
    telephone: settings.phone,
    email: settings.email,
    url: process.env.SITE_URL || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Pudukkottai",
      addressRegion: "Tamil Nadu",
      postalCode: "622003",
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: 10.3605, longitude: 78.8102 },
    areaServed: ["Pudukkottai", "Tamil Nadu", "India"],
    knowsAbout: [
      "Solar panel installation", "Rooftop solar", "On-grid solar", "Off-grid solar",
      "Hybrid solar systems", "EV charging stations", "Solar water heaters",
      "Solar water pumps", "Solar street lights", "Battery energy storage", "Solar inverters",
    ],
    hasMap: settings.mapDirections || undefined,
    sameAs: [settings.facebook, settings.instagram, settings.linkedin, settings.youtube].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader
        companyName={settings.companyName}
        logoUrl={settings.logoUrl}
        phone={settings.phone}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <FloatingButtons whatsapp={settings.whatsapp} companyName={settings.companyName} />
    </>
  );
}
