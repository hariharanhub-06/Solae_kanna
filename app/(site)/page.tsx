import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { ProductCard } from "@/components/ProductCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { prisma } from "@/lib/prisma";
import { getContent, block } from "@/lib/data";

export const dynamic = "force-dynamic";

const FEATURE_ICONS = ["🌟", "🛠️", "📋", "🛡️"];
const STEP_COLORS = ["bg-brand-500", "bg-eco-600", "bg-brand-500", "bg-eco-600"];

export default async function HomePage() {
  const [content, services, products] = await Promise.all([
    getContent(),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { sort: "asc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { sort: "asc" }],
      take: 4,
    }),
  ]);

  const hero = block(content, "home.hero");
  const about = block(content, "home.about");
  const special = block(content, "home.special");
  const features = [1, 2, 3, 4].map((n) => block(content, `home.feature.${n}`));
  const process = block(content, "home.process");
  const steps = [1, 2, 3, 4].map((n) => block(content, `home.process.${n}`));
  const cta = block(content, "home.cta");

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {hero.imageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/30" />
          </>
        )}
        <Container className="relative py-20 sm:py-28">
          <div className="max-w-2xl">
            {hero.subheading && (
              <p className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-sm font-semibold text-brand-300">
                {hero.subheading}
              </p>
            )}
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{hero.heading}</h1>
            {hero.body && <p className="mt-5 text-lg text-slate-200">{hero.body}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Get a Free Quote
              </Link>
              <Link href="/services" className="btn-outline !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">
                Explore Services
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* WHY SOLAR */}
      <section className="section">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <SectionHeading title={about.heading} center={false} />
              <p className="mt-4 text-slate-600">{about.body}</p>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                {[
                  { v: "Save", l: "on power bills" },
                  { v: "Clean", l: "renewable energy" },
                  { v: "25 yr", l: "panel warranty" },
                ].map((stat) => (
                  <div key={stat.l} className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xl font-bold text-brand-600">{stat.v}</div>
                    <div className="mt-1 text-xs text-slate-500">{stat.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              {about.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={about.imageUrl}
                  alt={about.heading}
                  className="aspect-[4/3] w-full rounded-2xl object-cover shadow-md"
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* WHAT MAKES US SPECIAL */}
      <section className="section bg-slate-50">
        <Container>
          <SectionHeading eyebrow={special.subheading} title={special.heading} subtitle={special.body} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-2xl">
                  {FEATURE_ICONS[i]}
                </div>
                <h3 className="text-base font-semibold">{f.heading}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* SERVICES PREVIEW */}
      {services.length > 0 && (
        <section className="section">
          <Container>
            <SectionHeading eyebrow="What We Offer" title="Our Solar Services" subtitle="Complete, end-to-end solar solutions for homes and businesses." />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/services" className="btn-outline">
                View All Services
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* INSTALLATION PROCESS */}
      <section className="section bg-slate-900 text-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            {process.subheading && (
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-400">
                {process.subheading}
              </p>
            )}
            <h2 className="text-2xl font-bold sm:text-3xl">{process.heading}</h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${STEP_COLORS[i]} text-xl font-bold text-white`}>
                  {i + 1}
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{step.heading}</h3>
                <p className="mt-2 text-sm text-slate-300">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PRODUCTS PREVIEW */}
      {products.length > 0 && (
        <section className="section bg-slate-50">
          <Container>
            <SectionHeading eyebrow="Quality Equipment" title="Featured Products" subtitle="Premium solar panels, inverters, batteries and more." />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/products" className="btn-outline">
                View All Products
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* CTA + ENQUIRY */}
      <section className="section">
        <Container>
          <div className="grid items-center gap-10 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 p-8 text-white sm:p-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{cta.heading}</h2>
              <p className="mt-3 text-brand-50">{cta.subheading}</p>
              <ul className="mt-6 space-y-2 text-sm text-brand-50">
                <li>✓ Free site survey &amp; consultation</li>
                <li>✓ Transparent, no-obligation quote</li>
                <li>✓ Certified, experienced installers</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-6 text-slate-700 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Request a Free Quote</h3>
              <EnquiryForm source="home-cta" compact />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
