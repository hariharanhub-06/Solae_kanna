// Reads the central Platform Hub kill-switch so the admin can deactivate this
// entire site (customer + admin) from the hub's Access Control panel.
//
// The hub stores a per-site toggle keyed "solar" and exposes it through a public,
// unauthenticated endpoint. We poll it server-side from the root layout. On ANY
// error (hub down, network, bad JSON) we FAIL OPEN — a hub outage must never take
// this site down.

const HUB_STATUS_URL =
  process.env.HUB_STATUS_URL || "https://hariharanhub.com/api/hub/site-status";

// Our stable key in the hub's toggle table (matches PORTAL_KEYS / SITE_KEYS there).
const SITE_KEY = "solar";

export async function isSiteEnabled(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    // Revalidate every 30s — matches the hub's "changes apply within ~30s" promise
    // and keeps pages ISR-cached instead of forcing per-request SSR.
    const res = await fetch(HUB_STATUS_URL, {
      next: { revalidate: 30 },
      signal: controller.signal,
    });
    if (!res.ok) return true; // fail open
    const data = await res.json();
    // Only an explicit `false` disables the site; anything else stays enabled.
    return data?.[SITE_KEY] !== false;
  } catch {
    return true; // fail open
  } finally {
    clearTimeout(timeout);
  }
}
