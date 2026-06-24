"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "./Container";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({
  companyName,
  logoUrl,
  phone,
}: {
  companyName: string;
  logoUrl?: string;
  phone?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo / brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={companyName} className="h-9 w-auto" />
            ) : (
              <>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-white">
                  ☀
                </span>
                <span className="text-lg">{companyName}</span>
              </>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-brand-600"
                    : "text-slate-600 hover:text-brand-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="text-sm font-medium text-slate-600 hover:text-brand-600"
              >
                📞 {phone}
              </a>
            )}
            <Link href="/contact" className="btn-primary !px-4 !py-2">
              Get a Quote
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-md text-slate-700 hover:bg-slate-100 md:hidden"
          >
            <span className="text-2xl leading-none">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <Container className="py-3">
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-3 text-base font-medium ${
                    isActive(item.href)
                      ? "bg-brand-50 text-brand-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/contact" className="btn-primary mt-2">
                Get a Quote
              </Link>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="mt-1 px-3 py-2 text-center text-sm font-medium text-slate-600"
                >
                  📞 {phone}
                </a>
              )}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
