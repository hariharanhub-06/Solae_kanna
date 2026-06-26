import { prisma } from "./prisma";

// ---- Site settings (key/value) ----------------------------------------------

export const SETTING_DEFAULTS: Record<string, string> = {
  companyName: "Sri Sastha Solar",
  tagline: "Powering a Sustainable Future",
  phone: "9176444114",
  phone2: "8838075327",
  phone3: "7904202501",
  whatsapp: "919176444114", // digits only, with country code, no +
  email: "kamalakannan632004@gmail.com",
  address: "No-5105, Arimalam Road, Near Ram Theatre, Pudukkottai - 622003",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3924.767064747539!2d78.81020107503606!3d10.360500989764112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDIxJzM3LjgiTiA3OMKwNDgnNDYuMCJF!5e0!3m2!1sen!2sin!4v1782458276498!5m2!1sen!2sin",
  mapDirections: "https://goo.gl/maps/oohcWSZNpLTJgzoM8?g_st=aw",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  logoUrl: "/logo.png",
  metaTitle:
    "Sri Sastha Solar — Solar Panels, EV Charging & Renewable Energy in Pudukkottai",
  metaDescription:
    "Sri Sastha Solar (Pudukkottai) installs on-grid, off-grid & hybrid rooftop solar, EV charging stations, solar water heaters, pumps, street lights, BESS and more — using WAAREE, EMMVEE & Adani panels. Free site survey & quote.",
};

export type SettingsMap = Record<string, string>;

export async function getSettings(): Promise<SettingsMap> {
  const map: SettingsMap = { ...SETTING_DEFAULTS };
  try {
    const rows = await prisma.setting.findMany();
    for (const row of rows) {
      if (row.value !== "" && row.value != null) map[row.key] = row.value;
      else if (!(row.key in map)) map[row.key] = row.value;
    }
  } catch {
    // DB unavailable (e.g. during build with no DATABASE_URL) — use defaults.
  }
  return map;
}

// ---- Content blocks (editable page sections) --------------------------------

export type ContentMap = Record<
  string,
  {
    heading: string;
    subheading: string;
    body: string;
    imageUrl: string;
  }
>;

export async function getContent(): Promise<ContentMap> {
  const map: ContentMap = {};
  let rows: Awaited<ReturnType<typeof prisma.contentBlock.findMany>> = [];
  try {
    rows = await prisma.contentBlock.findMany();
  } catch {
    return map; // DB unavailable during build — render with empty content.
  }
  for (const row of rows) {
    map[row.key] = {
      heading: row.heading,
      subheading: row.subheading,
      body: row.body,
      imageUrl: row.imageUrl,
    };
  }
  return map;
}

/** Safe accessor with a fallback so pages never crash on a missing block. */
export function block(content: ContentMap, key: string) {
  return content[key] ?? { heading: "", subheading: "", body: "", imageUrl: "" };
}

// ---- Media (partner logos + project gallery), managed from the admin ---------

export type MediaItem = { id: string; title: string; imageUrl: string };

export async function getMedia(category: "partner" | "project"): Promise<MediaItem[]> {
  try {
    const rows = await prisma.media.findMany({
      where: { category, published: true },
      orderBy: { sort: "asc" },
    });
    return rows.map((r) => ({ id: r.id, title: r.title, imageUrl: r.imageUrl }));
  } catch {
    return []; // DB unavailable or table not migrated yet — fall back to bundled assets.
  }
}

// ---- Product specs are stored as a JSON string ------------------------------

export type Spec = { label: string; value: string };

export function parseSpecs(specs: string): Spec[] {
  try {
    const parsed = JSON.parse(specs || "[]");
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (s) => s && typeof s.label === "string" && typeof s.value === "string"
      );
    }
  } catch {
    /* ignore malformed JSON */
  }
  return [];
}

/** Normalise an incoming specs value to a JSON string of {label,value}[]. */
export function normalizeSpecs(specs: unknown): string {
  if (Array.isArray(specs)) {
    const clean = specs
      .filter((s) => s && typeof s.label === "string" && typeof s.value === "string")
      .filter((s) => s.label.trim() || s.value.trim())
      .map((s) => ({ label: String(s.label).trim(), value: String(s.value).trim() }));
    return JSON.stringify(clean);
  }
  return "[]";
}
