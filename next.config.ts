import type { NextConfig } from "next";

// Content-Security-Policy tuned for this app:
// - scripts/styles: self + inline (Next.js injects inline bootstrap + Tailwind/styled-jsx)
// - images: self + data/blob + the ImageKit CDN (IMAGEKIT_URL_ENDPOINT host)
// - frames we embed: the Google Maps embed iframe
// - frame-ancestors: who may embed US — 'self' plus the Platform Hub, which
//   iframes /admin from hariharanhub.com. Keep this in sync with that hub.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://ik.imagekit.io",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'self' https://www.google.com",
  "form-action 'self'",
  // Who may embed /admin in an iframe: the Platform Hub. Cover the apex domain,
  // any subdomain (www.*), and localhost for hub local dev.
  "frame-ancestors 'self' https://hariharanhub.com https://*.hariharanhub.com http://localhost:3000 http://localhost:3001",
].join("; ");

// Headers shared by every route.
const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Public site (everything except /admin): also deny external framing.
        // /admin is intentionally excluded so the Platform Hub can iframe it
        // (its CSP frame-ancestors above whitelists hariharanhub.com instead).
        source: "/((?!admin).*)",
        headers: [
          ...baseSecurityHeaders,
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: baseSecurityHeaders,
      },
    ];
  },
};

export default nextConfig;
