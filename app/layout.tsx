import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data";

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
    openGraph: {
      title: s.metaTitle || s.companyName,
      description: s.metaDescription,
      type: "website",
    },
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
