import { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingButtons } from "@/components/FloatingButtons";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  return (
    <>
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
