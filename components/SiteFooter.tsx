import Link from "next/link";
import { Container } from "./Container";
import type { SettingsMap } from "@/lib/data";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter({ settings }: { settings: SettingsMap }) {
  const socials = [
    { key: "facebook", label: "Facebook", icon: "f" },
    { key: "instagram", label: "Instagram", icon: "◎" },
    { key: "linkedin", label: "LinkedIn", icon: "in" },
    { key: "youtube", label: "YouTube", icon: "▶" },
  ].filter((s) => settings[s.key]);

  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + tagline */}
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500">
                ☀
              </span>
              {settings.companyName}
            </div>
            <p className="mt-3 text-sm text-slate-400">{settings.tagline}</p>
            {socials.length > 0 && (
              <div className="mt-4 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={settings[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-sm text-white hover:bg-brand-500"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {settings.address && <li>📍 {settings.address}</li>}
              {settings.phone && (
                <li>
                  📞{" "}
                  <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="hover:text-brand-400">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  ✉️{" "}
                  <a href={`mailto:${settings.email}`} className="hover:text-brand-400">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {settings.companyName}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
