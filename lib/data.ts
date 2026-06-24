import { prisma } from "./prisma";

// ---- Site settings (key/value) ----------------------------------------------

export const SETTING_DEFAULTS: Record<string, string> = {
  companyName: "SunVolt Solar",
  tagline: "Powering Your Future with Clean Solar Energy",
  phone: "+91 98765 43210",
  whatsapp: "919876543210", // digits only, with country code, no +
  email: "info@sunvoltsolar.com",
  address: "123 Solar Street, Green Park, Bengaluru, Karnataka 560001",
  mapEmbed: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  logoUrl: "",
  metaTitle: "SunVolt Solar — Solar Panel Installation & Solar Products",
  metaDescription:
    "SunVolt Solar designs, supplies and installs rooftop and commercial solar power systems. Explore our solar services and products, and get a free quote.",
};

export type SettingsMap = Record<string, string>;

export async function getSettings(): Promise<SettingsMap> {
  const rows = await prisma.setting.findMany();
  const map: SettingsMap = { ...SETTING_DEFAULTS };
  for (const row of rows) {
    if (row.value !== "" && row.value != null) map[row.key] = row.value;
    else if (!(row.key in map)) map[row.key] = row.value;
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
  const rows = await prisma.contentBlock.findMany();
  const map: ContentMap = {};
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
