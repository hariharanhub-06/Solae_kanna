import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { getContent, block } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about our solar company — our story, mission, vision and why customers trust us for solar installation and energy solutions.",
};

const WHY_ICONS = ["👷", "🔆", "💰", "🤝"];

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
      <PageHero heading={hero.heading} subheading={hero.subheading} imageUrl={hero.imageUrl} />

      {/* STORY */}
      <section className="section">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              {story.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={story.imageUrl}
                  alt={story.heading}
                  className="aspect-[4/3] w-full rounded-2xl object-cover shadow-md"
                />
              )}
            </div>
            <div>
              <SectionHeading title={story.heading} center={false} />
              <p className="mt-4 text-slate-600">{story.body}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* MISSION + VISION */}
      <section className="section bg-slate-50">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-3 text-3xl">🎯</div>
              <h3 className="text-xl font-bold">{mission.heading}</h3>
              <p className="mt-3 text-slate-600">{mission.body}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-3 text-3xl">🌍</div>
              <h3 className="text-xl font-bold">{vision.heading}</h3>
              <p className="mt-3 text-slate-600">{vision.body}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section">
        <Container>
          <SectionHeading eyebrow={why.subheading} title={why.heading} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((c, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-3 text-3xl">{WHY_ICONS[i]}</div>
                <h3 className="text-base font-semibold">{c.heading}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
