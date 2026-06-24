import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { getContent, block } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Solar Products",
  description:
    "Browse our solar products — high-efficiency panels, hybrid inverters, lithium batteries, solar water heaters and complete solar kits.",
};

export default async function ProductsPage() {
  const [content, products] = await Promise.all([
    getContent(),
    prisma.product.findMany({ where: { published: true }, orderBy: { sort: "asc" } }),
  ]);
  const hero = block(content, "products.hero");

  return (
    <>
      <PageHero heading={hero.heading} subheading={hero.subheading} imageUrl={hero.imageUrl} />

      <section className="section">
        <Container>
          {hero.body && (
            <p className="mx-auto mb-10 max-w-2xl text-center text-slate-600">{hero.body}</p>
          )}
          {products.length === 0 ? (
            <p className="text-center text-slate-500">Products will be listed here soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
