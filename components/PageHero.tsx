import { Container } from "./Container";

/** Compact hero banner for inner pages, with an optional background image. */
export function PageHero({
  heading,
  subheading,
  imageUrl,
}: {
  heading: string;
  subheading?: string;
  imageUrl?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {imageUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40" />
        </>
      )}
      <Container className="relative py-16 sm:py-20">
        <h1 className="text-3xl font-bold sm:text-4xl">{heading}</h1>
        {subheading && (
          <p className="mt-3 max-w-2xl text-lg text-slate-200">{subheading}</p>
        )}
      </Container>
    </section>
  );
}
