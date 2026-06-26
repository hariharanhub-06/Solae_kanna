import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { Reveal } from "@/components/Reveal";
import { prisma } from "@/lib/prisma";
import { getContent, block } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Solar Services",
  description:
    "Explore Sri Sastha Solar services — on-grid/off-grid/hybrid solar, EV charging, solar water heaters, pumps, street lights, BESS, rooftop solar and more in Pudukkottai.",
};

export default async function ServicesPage() {
  const [content, services] = await Promise.all([
    getContent(),
    prisma.service.findMany({ where: { published: true }, orderBy: { sort: "asc" } }),
  ]);
  const hero = block(content, "services.hero");

  return (
    <>
      <PageHero eyebrow="What We Offer" heading={hero.heading} subheading={hero.subheading} imageUrl={hero.imageUrl} />

      <section className="section">
        <Container>
          {hero.body && (
            <Reveal animation="up"><p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">{hero.body}</p></Reveal>
          )}
          {services.length === 0 ? (
            <p className="text-center text-slate-500">Services will be listed here soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal key={s.id} animation="up" delay={(i % 3) * 90}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal animation="zoom">
            <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center text-white shadow-2xl">
              <div className="solar-grid absolute inset-0 opacity-30" />
              <h2 className="relative text-xl font-extrabold sm:text-2xl">Not sure which solution fits you?</h2>
              <p className="relative mx-auto mt-2 max-w-xl text-slate-300">Get a free consultation and we&apos;ll recommend the best setup for your roof, load and budget.</p>
              <Link href="/contact" className="btn-primary relative mt-6">Request a Free Consultation</Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
