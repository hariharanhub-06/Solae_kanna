import { Container } from "./Container";
import { Reveal } from "./Reveal";

/** Premium hero banner for inner pages — realistic photo + gradient + reveal. */
export function PageHero({
  heading,
  subheading,
  imageUrl,
  eyebrow,
}: {
  heading: string;
  subheading?: string;
  imageUrl?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden text-white">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="kenburns absolute inset-0 -z-20 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-950 via-slate-900 to-[#2a1605]" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/50" />
      <div className="solar-grid absolute inset-0 -z-10 opacity-20" />

      <Container className="relative py-20 sm:py-28">
        <Reveal animation="up">
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-200 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-eco-400" /> {eyebrow}
            </span>
          )}
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">{heading}</h1>
          {subheading && <p className="mt-4 max-w-2xl text-lg text-slate-200">{subheading}</p>}
        </Reveal>
      </Container>
    </section>
  );
}
