import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data";
import { isSiteEnabled } from "@/lib/siteStatus";
import SiteDisabledScreen from "@/components/SiteDisabledScreen";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: {
      default: s.metaTitle || s.companyName,
      template: `%s | ${s.companyName}`,
    },
    description: s.metaDescription,
    keywords: [
      "solar Pudukkottai", "solar panel installation Pudukkottai", "Sri Sastha Solar",
      "rooftop solar Tamil Nadu", "on grid off grid hybrid solar", "EV charging station Pudukkottai",
      "solar water heater", "solar water pump", "solar street lights", "BESS battery storage",
      "WAAREE EMMVEE Adani solar dealer", "solar inverter", "renewable energy Pudukkottai",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      title: s.metaTitle || s.companyName,
      description: s.metaDescription,
      type: "website",
      locale: "en_IN",
      siteName: s.companyName,
    },
    twitter: { card: "summary_large_image", title: s.metaTitle || s.companyName, description: s.metaDescription },
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Central kill-switch: when the admin disables this site from the Platform Hub,
  // every page (customer + admin) shows a 403 screen. Fails open on hub errors.
  const enabled = await isSiteEnabled();
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        {enabled ? children : <SiteDisabledScreen />}
      </body>
    </html>
  );
}
