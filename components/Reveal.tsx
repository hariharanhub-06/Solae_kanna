"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Animation = "up" | "left" | "right" | "zoom" | "fade";

/**
 * Lightweight scroll-reveal. Adds a class when the element enters the viewport,
 * driving a CSS transition (no animation library — snappy + GPU-friendly).
 */
export function Reveal({
  children,
  animation = "up",
  delay = 0,
  className = "",
  once = true,
}: {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${animation} ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
