import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { prisma } from "@/lib/prisma";
import { getContent, block } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Solar Products",
  description:
    "Browse Sri Sastha Solar products — high-efficiency WAAREE/EMMVEE/Adani panels, hybrid inverters, lithium batteries, solar water heaters and complete solar kits.",
};

export default async function ProductsPage() {
  const [content, products] = await Promise.all([
    getContent(),
    prisma.product.findMany({ where: { published: true }, orderBy: { sort: "asc" } }),
  ]);
  const hero = block(content, "products.hero");

  return (
    <>
      <PageHero eyebrow="Quality Equipment" heading={hero.heading} subheading={hero.subheading} imageUrl={hero.imageUrl} />

      <section className="section">
        <Container>
          {hero.body && (
            <Reveal animation="up"><p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">{hero.body}</p></Reveal>
          )}
          {products.length === 0 ? (
            <p className="text-center text-slate-500">Products will be listed here soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p, i) => (
                <Reveal key={p.id} animation="up" delay={(i % 4) * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal animation="zoom">
            <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-eco-600 p-10 text-center text-white shadow-2xl">
              <div className="solar-grid absolute inset-0 opacity-20" />
              <h2 className="relative text-xl font-extrabold sm:text-2xl">Need help choosing the right products?</h2>
              <p className="relative mx-auto mt-2 max-w-xl text-brand-50">We&apos;ll spec the right panels, inverter and battery for your exact load and budget.</p>
              <Link href="/contact" className="btn relative mt-6 bg-white text-brand-600 hover:bg-brand-50">Get Expert Advice</Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
