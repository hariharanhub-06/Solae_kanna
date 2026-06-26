import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { getContent, block } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Sri Sastha Solar — our story, mission and vision, and why customers across Pudukkottai trust us for solar, EV charging and renewable energy.",
};

const WHY_ICONS = ["🔧", "🏅", "🎛️", "🤝"];

export default async function AboutPage() {
  const content = await getContent();
  const hero = block(content, "about.hero");
  const story = block(content, "about.story");
  const mission = block(content, "about.mission");
  const vision = block(content, "about.vision");
  const why = block(content, "about.why");
  const whyCards = [1, 2, 3, 4].map((n) => block(content, `about.why.${n}`));

  return (
    <>
      <PageHero eyebrow="About Us" heading={hero.heading} subheading={hero.subheading} imageUrl={hero.imageUrl} />

      {/* STORY */}
      <section className="section">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal animation="left">
              <div className="group relative overflow-hidden rounded-3xl shadow-xl">
                {story.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={story.imageUrl} alt={story.heading} className="zoom-img aspect-[4/3] w-full object-cover" />
                )}
                <div className="animate-float absolute bottom-4 left-4 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
                  <div className="text-xs text-slate-500">Powering a</div>
                  <div className="text-lg font-extrabold text-eco-600">Sustainable Future ☀</div>
                </div>
              </div>
            </Reveal>
            <Reveal animation="right">
              <SectionHeading eyebrow="Our Story" title={story.heading} center={false} />
              <p className="mt-4 text-slate-600">{story.body}</p>
              <div className="mt-7 grid grid-cols-3 gap-4">
                {[
                  { to: 500, suffix: "+", l: "Projects" },
                  { to: 12, suffix: "", l: "Solutions" },
                  { to: 100, suffix: "%", l: "Support" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-gradient-to-br from-brand-50 to-eco-50 p-4 text-center">
                    <div className="text-xl font-extrabold text-brand-600"><Counter to={s.to} suffix={s.suffix} /></div>
                    <div className="mt-1 text-xs text-slate-500">{s.l}</div>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn-primary mt-7">Get a Free Quote</Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* MISSION + VISION */}
      <section className="section bg-slate-50">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {[{ ic: "🎯", b: mission }, { ic: "🌍", b: vision }].map((m, i) => (
              <Reveal key={i} animation="up" delay={i * 120}>
                <div className="card-shine h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-eco-100 text-3xl">{m.ic}</div>
                  <h3 className="text-xl font-bold text-slate-900">{m.b.heading}</h3>
                  <p className="mt-3 text-slate-600">{m.b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section">
        <Container>
          <Reveal animation="up"><SectionHeading eyebrow={why.subheading} title={why.heading} /></Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((c, i) => (
              <Reveal key={i} animation="up" delay={i * 90}>
                <div className="card-shine group h-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-eco-100 text-3xl transition-transform group-hover:scale-110">{WHY_ICONS[i]}</div>
                  <h3 className="text-base font-bold text-slate-900">{c.heading}</h3>
                  <p className="mt-2 text-sm text-slate-600">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="section pt-0">
        <Container>
          <Reveal animation="zoom">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-eco-600 p-10 text-center text-white shadow-2xl">
              <div className="solar-grid absolute inset-0 opacity-20" />
              <h2 className="relative text-2xl font-extrabold sm:text-3xl">Let&apos;s build a cleaner, greener tomorrow</h2>
              <p className="relative mx-auto mt-3 max-w-xl text-brand-50">Free site survey and a transparent, no-obligation quote for your home, business or industry.</p>
              <Link href="/contact" className="btn relative mt-6 bg-white text-brand-600 hover:bg-brand-50">Talk to Us</Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
