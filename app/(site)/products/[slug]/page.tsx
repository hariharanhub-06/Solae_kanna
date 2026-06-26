import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { EnquiryForm } from "@/components/EnquiryForm";
import { prisma } from "@/lib/prisma";
import { parseSpecs } from "@/lib/data";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product Not Found" };
  return { title: product.title, description: product.summary };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.published) notFound();

  const specs = parseSpecs(product.specs);
  const related = await prisma.product.findMany({
    where: { published: true, NOT: { id: product.id } },
    orderBy: { sort: "asc" },
    take: 4,
  });

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="py-6">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-brand-600">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700">{product.title}</span>
          </nav>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image */}
            <div>
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="aspect-square w-full rounded-2xl object-cover shadow-md"
                />
              ) : (
                <div className="grid aspect-square place-items-center rounded-2xl bg-slate-100 text-6xl">
                  🔆
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{product.title}</h1>
              {product.summary && <p className="mt-2 text-lg text-slate-600">{product.summary}</p>}
              {product.price && (
                <p className="mt-4 inline-block rounded-lg bg-eco-50 px-4 py-2 text-lg font-semibold text-eco-700">
                  {product.price}
                </p>
              )}
              {product.description && (
                <p className="mt-5 whitespace-pre-line text-slate-700">{product.description}</p>
              )}

              {specs.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Specifications
                  </h2>
                  <dl className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200">
                    {specs.map((spec, i) => (
                      <div key={i} className="flex justify-between gap-4 px-4 py-3 text-sm">
                        <dt className="text-slate-500">{spec.label}</dt>
                        <dd className="font-medium text-slate-900">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <Link href="/contact" className="btn-primary mt-7">
                Enquire About This Product
              </Link>
            </div>
          </div>

          {/* Enquiry form */}
          <div className="mt-14 rounded-3xl bg-slate-50 p-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Get a Quote for {product.title}</h2>
                <p className="mt-2 text-slate-600">
                  Share your details and our team will send you pricing and availability.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <EnquiryForm source={`product:${product.slug}`} compact />
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-slate-900">Related Products</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/products/${r.slug}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md"
                  >
                    {r.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.imageUrl} alt={r.title} className="aspect-square w-full rounded-lg object-cover" />
                    ) : (
                      <div className="grid aspect-square place-items-center rounded-lg bg-slate-100 text-3xl">🔆</div>
                    )}
                    <h3 className="mt-3 text-sm font-semibold text-slate-900">{r.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
