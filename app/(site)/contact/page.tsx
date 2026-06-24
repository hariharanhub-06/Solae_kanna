import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { EnquiryForm } from "@/components/EnquiryForm";
import { getContent, getSettings, block } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch for a free solar quote. Call us, message us on WhatsApp, or fill in the enquiry form and our team will respond shortly.",
};

export default async function ContactPage() {
  const [content, settings] = await Promise.all([getContent(), getSettings()]);
  const hero = block(content, "contact.hero");
  const waNumber = (settings.whatsapp || "").replace(/[^0-9]/g, "");

  const items = [
    settings.phone && {
      icon: "📞",
      label: "Call Us",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s+/g, "")}`,
    },
    settings.email && {
      icon: "✉️",
      label: "Email Us",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    waNumber && {
      icon: "💬",
      label: "WhatsApp",
      value: settings.phone || `+${waNumber}`,
      href: `https://wa.me/${waNumber}`,
    },
    settings.address && {
      icon: "📍",
      label: "Visit Us",
      value: settings.address,
      href: "",
    },
  ].filter(Boolean) as { icon: string; label: string; value: string; href: string }[];

  return (
    <>
      <PageHero heading={hero.heading} subheading={hero.subheading} />

      <section className="section">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold">Let&apos;s talk solar</h2>
              <p className="mt-2 text-slate-600">
                Reach out through any of the channels below, or fill in the form and we&apos;ll
                get back to you as soon as possible.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {items.map((item) => {
                  const inner = (
                    <>
                      <div className="text-2xl">{item.icon}</div>
                      <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        {item.label}
                      </div>
                      <div className="mt-1 font-medium text-slate-900">{item.value}</div>
                    </>
                  );
                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      {inner}
                    </div>
                  );
                })}
              </div>

              {settings.mapEmbed && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                  <div
                    className="aspect-video w-full [&>iframe]:h-full [&>iframe]:w-full"
                    dangerouslySetInnerHTML={{ __html: settings.mapEmbed }}
                  />
                </div>
              )}
            </div>

            {/* Form */}
            <div id="enquiry" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">Send Us an Enquiry</h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the form below for a free, no-obligation quote.
              </p>
              <div className="mt-6">
                <EnquiryForm source="contact-page" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
