/**
 * Renders a Google-Maps embed from a setting that may be EITHER a plain embed
 * URL (…/maps/embed?pb=…) or a full <iframe …></iframe> snippet — whichever the
 * admin pastes. The iframe is forced to fill its container.
 */
export function MapEmbed({ embed, className = "" }: { embed: string; className?: string }) {
  if (!embed) {
    return <div className={`grid place-items-center bg-slate-100 text-slate-400 ${className}`}>Map</div>;
  }
  const isHtml = embed.trim().startsWith("<");
  if (isHtml) {
    return (
      <div
        className={`${className} [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0`}
        dangerouslySetInnerHTML={{ __html: embed }}
      />
    );
  }
  return (
    <iframe
      src={embed}
      title="Location map"
      className={`${className} border-0`}
      loading="lazy"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
