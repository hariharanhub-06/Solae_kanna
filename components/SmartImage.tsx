"use client";

import { useState } from "react";

/**
 * <img> that degrades gracefully: if it fails to load it swaps to `fallbackSrc`,
 * or renders `fallbackText` in a styled box (used for partner logos / office photo
 * before the real asset files are dropped in).
 */
export function SmartImage({
  src,
  alt,
  className = "",
  fallbackSrc,
  fallbackText,
  fallbackClassName = "",
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackText?: string;
  fallbackClassName?: string;
}) {
  const [errored, setErrored] = useState(false);
  const [usingFallbackSrc, setUsingFallbackSrc] = useState(false);

  if (errored && fallbackText && !fallbackSrc) {
    return (
      <div className={`grid place-items-center ${fallbackClassName}`}>
        <span className="text-lg font-extrabold tracking-tight text-slate-700">{fallbackText}</span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={usingFallbackSrc && fallbackSrc ? fallbackSrc : src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => {
        if (fallbackSrc && !usingFallbackSrc) setUsingFallbackSrc(true);
        else setErrored(true);
      }}
    />
  );
}
