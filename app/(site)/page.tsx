import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { SmartImage } from "@/components/SmartImage";
import { MapEmbed } from "@/components/MapEmbed";
import { prisma } from "@/lib/prisma";
import { getContent, block, getSettings, getMedia } from "@/lib/data";

export const dynamic = "force-dynamic";

const PARTNERS = [
  { name: "WAAREE", src: "/brands/waaree.jpg" },
  { name: "EMMVEE", src: "/brands/emmvee.jpg" },
  { name: "Adani Solar", src: "/brands/adani.jpg" },
];
const WORKS = Array.from({ length: 9 }, (_, i) => `/work/work-${i + 1}.jpg`);
const STEP_TINT = ["from-brand-400 to-brand-600", "from-eco-400 to-eco-600", "from-brand-400 to-brand-600", "from-eco-400 to-eco-600"];

export default async function HomePage() {
  const [content, services, products, settings, partnerMedia, projectMedia] = await Promise.all([
    getContent(),
    prisma.service.findMany({ where: { published: true }, orderBy: { sort: "asc" }, take: 12 }),
    prisma.product.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { sort: "asc" }], take: 4 }),
    getSettings(),
    getMedia("partner"),
    getMedia("project"),
  ]);

  const hero = block(content, "home.hero");
  const about = block(content, "home.about");
  const special = block(content, "home.special");
  const features = [1, 2, 3, 4].map((n) => block(content, `home.feature.${n}`));
  const process = block(content, "home.process");
  const steps = [1, 2, 3, 4].map((n) => block(content, `home.process.${n}`));
  const cta = block(content, "home.cta");
  const featureIcons = ["♻️", "🤝", "⚙️", "👷"];

  // Panel partners + project gallery — managed in admin → Gallery & Logos.
  // Fall back to the bundled assets if the admin hasn't added any yet.
  const partnersHeading = block(content, "home.partners");
  const partners = partnerMedia.length
    ? partnerMedia.map((m) => ({ name: m.title || "Panel partner", src: m.imageUrl }))
    : PARTNERS;
  const works = projectMedia.length ? projectMedia.map((m) => m.imageUrl) : WORKS;

  return (
    <>
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative isolate flex min-h-[86vh] items-center overflow-hidden text-white">
        {/* realistic full-bleed install photo */}
        {hero.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.imageUrl} alt="Sri Sastha Solar installation" className="kenburns absolute inset-0 -z-20 h-full w-full object-cover" />
        )}
        {/* legibility gradients (strong on the text side) */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40" />

        <Container className="relative py-28 sm:py-36">
          <div className="max-w-2xl">
            <Reveal animation="up">
              {hero.subheading && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold text-brand-200 backdrop-blur">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-eco-400" /> {hero.subheading}
                </span>
              )}
            </Reveal>
            <Reveal animation="up" delay={80}>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
                {hero.heading}
              </h1>
            </Reveal>
            <Reveal animation="up" delay={160}>
              {hero.body && <p className="mt-6 max-w-xl text-lg text-slate-200">{hero.body}</p>}
            </Reveal>
            <Reveal animation="up" delay={240}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary shadow-lg shadow-brand-500/30">☀ Get a Free Quote</Link>
                <Link href="/services" className="btn-outline !border-white/25 !bg-white/10 !text-white hover:!bg-white/20">Explore Solutions</Link>
              </div>
            </Reveal>
            <Reveal animation="fade" delay={360}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
                <span>✓ On / Off-grid & Hybrid</span>
                <span>✓ EV Charging</span>
                <span>✓ WAAREE · EMMVEE · Adani panels</span>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ─────────────── STATS ─────────────── */}
      <section className="relative z-10 bg-white">
        <Container>
          <div className="-mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8 lg:grid-cols-4">
            {[
              { to: 500, suffix: "+", label: "Projects Completed", icon: "🔆" },
              { to: 2500, suffix: "+ kW", label: "Solar Installed", icon: "⚡" },
              { to: 10, suffix: "+ yrs", label: "Industry Experience", icon: "🏆" },
              { to: 100, suffix: "%", label: "After-sales Support", icon: "🛠️" },
            ].map((s, i) => (
              <Reveal key={s.label} animation="up" delay={i * 90} className="text-center">
                <div className="text-2xl">{s.icon}</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────── ABOUT ─────────────── */}
      <section className="section">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal animation="left" className="order-2 lg:order-1">
              <SectionHeading eyebrow={about.subheading} title={about.heading} center={false} />
              <p className="mt-4 text-slate-600">{about.body}</p>
              <div className="mt-7 grid grid-cols-3 gap-4">
                {[
                  { v: "Save", l: "on power bills" },
                  { v: "Clean", l: "renewable energy" },
                  { v: "25 yr", l: "panel warranty" },
                ].map((stat) => (
                  <div key={stat.l} className="rounded-xl bg-gradient-to-br from-brand-50 to-eco-50 p-4 text-center">
                    <div className="text-lg font-bold text-brand-600">{stat.v}</div>
                    <div className="mt-1 text-xs text-slate-500">{stat.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal animation="right" className="order-1 lg:order-2">
              <div className="group relative overflow-hidden rounded-3xl shadow-xl">
                {about.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={about.imageUrl} alt={about.heading} className="zoom-img aspect-[4/3] w-full object-cover" />
                )}
                <div className="animate-float absolute bottom-4 left-4 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
                  <div className="text-xs text-slate-500">Clean energy generated</div>
                  <div className="text-lg font-extrabold text-eco-600">100% Green ⚡</div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ─────────────── WHAT MAKES US SPECIAL ─────────────── */}
      <section className="section bg-slate-50">
        <Container>
          <Reveal animation="up"><SectionHeading eyebrow={special.subheading} title={special.heading} subtitle={special.body} /></Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={i} animation="up" delay={i * 90}>
                <div className="card-shine group h-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-eco-100 text-3xl transition-transform group-hover:scale-110">
                    {featureIcons[i]}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{f.heading}</h3>
                  <p className="mt-2 text-sm text-slate-600">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────── PANEL PARTNERS ─────────────── */}
      <section className="section">
        <Container>
          <Reveal animation="up">
            <SectionHeading
              eyebrow={partnersHeading.subheading || "Genuine Tier-1 Modules"}
              title={partnersHeading.heading || "Panels We Install"}
              subtitle={partnersHeading.body || "We build only with globally trusted, high-efficiency solar panels."}
            />
          </Reveal>
          <Reveal animation="fade" delay={120}>
            <div className="marquee mt-10 rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 py-8">
              <div className="marquee-track gap-16 px-8">
                {[...partners, ...partners, ...partners, ...partners].map((p, i) => (
                  <SmartImage
                    key={i}
                    src={p.src}
                    alt={p.name}
                    className="h-12 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-14"
                    fallbackText={p.name}
                    fallbackClassName="h-12 w-36 sm:h-14"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ─────────────── RANGE OF SOLUTIONS ─────────────── */}
      {services.length > 0 && (
        <section className="section bg-slate-50">
          <Container>
            <Reveal animation="up"><SectionHeading eyebrow="What We Offer" title="Our Range of Solutions" subtitle="Complete solar & renewable-energy solutions for homes, businesses and industries." /></Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal key={s.id} animation="up" delay={(i % 3) * 90}>
                  <Link href={`/services/${s.slug}`} className="card-shine group flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-100 to-eco-100 text-2xl transition-transform group-hover:scale-110">{s.icon || "🔆"}</div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-600">{s.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{s.summary}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ─────────────── PROCESS ─────────────── */}
      <section className="section relative overflow-hidden bg-slate-900 text-white">
        <div className="solar-grid absolute inset-0 opacity-30" />
        <Container className="relative">
          <Reveal animation="up">
            <div className="mx-auto max-w-2xl text-center">
              {process.subheading && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-400">{process.subheading}</p>}
              <h2 className="text-2xl font-bold sm:text-4xl">{process.heading}</h2>
            </div>
          </Reveal>
          <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-white/15 lg:block" />
            {steps.map((step, i) => (
              <Reveal key={i} animation="up" delay={i * 120} className="relative text-center">
                <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br ${STEP_TINT[i]} text-xl font-extrabold text-white shadow-lg`}>{i + 1}</div>
                <h3 className="mt-4 text-base font-bold text-white">{step.heading}</h3>
                <p className="mt-2 text-sm text-slate-300">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────── PROJECTS GALLERY ─────────────── */}
      <section className="section">
        <Container>
          <Reveal animation="up"><SectionHeading eyebrow="Our Work" title="Recent Solar Projects" subtitle="A glimpse of installations we've delivered across Pudukkottai and beyond." /></Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {works.map((src, i) => (
              <Reveal key={src} animation="zoom" delay={(i % 4) * 80} className={i % 5 === 0 ? "sm:col-span-2 sm:row-span-2" : ""}>
                <div className="group relative h-full overflow-hidden rounded-2xl shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Sri Sastha Solar project ${i + 1}`} className="zoom-img h-full min-h-44 w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute bottom-3 left-3 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">Solar Installation</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────── VISIT US / LOCATION ─────────────── */}
      <section className="section bg-slate-50">
        <Container>
          <Reveal animation="up"><SectionHeading eyebrow="Visit Us" title="Find Sri Sastha Solar" subtitle="Drop by our office in Pudukkottai or get directions in one tap." /></Reveal>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <Reveal animation="left">
              <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
                <MapEmbed embed={settings.mapEmbed} className="h-[360px] w-full" />
              </div>
            </Reveal>
            <Reveal animation="right">
              <div className="flex h-full flex-col gap-5">
                <div className="group relative overflow-hidden rounded-3xl shadow-lg">
                  <SmartImage src="/office.jpg" alt="Sri Sastha Solar office" className="zoom-img aspect-[16/9] w-full object-cover" fallbackSrc="/work/work-3.jpg" />
                  <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur">Our Office</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex gap-3"><span>📍</span><span>{settings.address}</span></li>
                    <li className="flex gap-3"><span>📞</span><span className="flex flex-wrap gap-x-2">{[settings.phone, settings.phone2, settings.phone3].filter(Boolean).map((p, i, arr) => (<span key={p}><a className="hover:text-brand-600" href={`tel:${p}`}>{p}</a>{i < arr.length - 1 ? " · " : ""}</span>))}</span></li>
                    <li className="flex gap-3"><span>✉️</span><a className="break-all hover:text-brand-600" href={`mailto:${settings.email}`}>{settings.email}</a></li>
                  </ul>
                  <a href={settings.mapDirections || "#"} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 w-full">➤ Get Directions</a>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ─────────────── CTA + ENQUIRY ─────────────── */}
      <section className="section">
        <Container>
          <Reveal animation="zoom">
            <div className="relative grid items-center gap-10 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-eco-600 p-8 text-white shadow-2xl sm:p-12 lg:grid-cols-2">
              <div className="solar-grid absolute inset-0 opacity-20" />
              <div className="relative">
                <h2 className="text-2xl font-extrabold sm:text-3xl">{cta.heading}</h2>
                <p className="mt-3 text-brand-50">{cta.subheading}</p>
                <ul className="mt-6 space-y-2 text-sm text-brand-50">
                  <li>✓ Free site survey &amp; consultation</li>
                  <li>✓ Transparent, no-obligation quote</li>
                  <li>✓ Certified, experienced installers</li>
                </ul>
              </div>
              <div className="relative rounded-2xl bg-white p-6 text-slate-700 shadow-lg">
                <h3 className="mb-4 text-lg font-bold text-slate-900">Request a Free Quote</h3>
                <EnquiryForm source="home-cta" compact />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
