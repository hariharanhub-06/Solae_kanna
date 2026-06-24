import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { ServiceCard } from "@/components/ServiceCard";
import { prisma } from "@/lib/prisma";
import { getContent, block } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Solar Services",
  description:
    "Explore our solar services — residential and commercial installation, battery storage, solar water heating, maintenance and consultation.",
};

export default async function ServicesPage() {
  const [content, services] = await Promise.all([
    getContent(),
    prisma.service.findMany({ where: { published: true }, orderBy: { sort: "asc" } }),
  ]);
  const hero = block(content, "services.hero");

  return (
    <>
      <PageHero heading={hero.heading} subheading={hero.subheading} imageUrl={hero.imageUrl} />

      <section className="section">
        <Container>
          {hero.body && (
            <p className="mx-auto mb-10 max-w-2xl text-center text-slate-600">{hero.body}</p>
          )}
          {services.length === 0 ? (
            <p className="text-center text-slate-500">Services will be listed here soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}

          <div className="mt-14 rounded-3xl bg-slate-50 p-8 text-center">
            <h2 className="text-xl font-bold sm:text-2xl">Not sure which solution fits you?</h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-600">
              Get a free consultation and we&apos;ll recommend the best solar setup for your needs.
            </p>
            <Link href="/contact" className="btn-primary mt-5">
              Request a Free Consultation
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
