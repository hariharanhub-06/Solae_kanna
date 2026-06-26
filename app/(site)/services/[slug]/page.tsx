import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { EnquiryForm } from "@/components/EnquiryForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return { title: "Service Not Found" };
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service || !service.published) notFound();

  const related = await prisma.service.findMany({
    where: { published: true, NOT: { id: service.id } },
    orderBy: { sort: "asc" },
    take: 3,
  });

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="py-6">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-brand-600">Services</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700">{service.title}</span>
          </nav>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {service.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="aspect-[16/9] w-full rounded-2xl object-cover shadow-md"
                />
              )}
              <div className="mt-6 flex items-center gap-3">
                {service.iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={service.iconUrl} alt="" className="h-9 w-9 object-contain" />
                ) : service.icon ? (
                  <span className="text-3xl">{service.icon}</span>
                ) : null}
                <h1 className="text-3xl font-bold text-slate-900">{service.title}</h1>
              </div>
              {service.summary && (
                <p className="mt-3 text-lg text-slate-600">{service.summary}</p>
              )}
              <div className="prose mt-6 max-w-none whitespace-pre-line text-slate-700">
                {service.description}
              </div>
            </div>

            {/* Sidebar enquiry */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Interested in this service?</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Send us your details for a free quote.
                </p>
                <div className="mt-4">
                  <EnquiryForm source={`service:${service.slug}`} compact />
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-slate-900">Other Services</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/services/${r.slug}`}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"
                  >
                    {r.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.iconUrl} alt="" className="h-8 w-8 object-contain" />
                    ) : (
                      <div className="text-2xl">{r.icon || "☀"}</div>
                    )}
                    <h3 className="mt-2 font-semibold text-slate-900">{r.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{r.summary}</p>
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
