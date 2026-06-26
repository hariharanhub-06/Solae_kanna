"use client";

import { FormEvent, useState } from "react";
import { ImageUploader } from "./ImageUploader";
import type { SettingsMap } from "@/lib/data";

type Field = { key: string; label: string; placeholder?: string; type?: "text" | "textarea" };

const SECTIONS: { title: string; fields: Field[] }[] = [
  {
    title: "Company Information",
    fields: [
      { key: "companyName", label: "Company Name" },
      { key: "tagline", label: "Tagline / Slogan" },
      { key: "metaTitle", label: "SEO Title (browser tab & search results)" },
      { key: "metaDescription", label: "SEO Description", type: "textarea" },
    ],
  },
  {
    title: "Contact Details",
    fields: [
      { key: "phone", label: "Phone Number 1", placeholder: "9176444114" },
      { key: "phone2", label: "Phone Number 2 (optional)", placeholder: "8838075327" },
      { key: "phone3", label: "Phone Number 3 (optional)", placeholder: "7904202501" },
      { key: "whatsapp", label: "WhatsApp Number (with country code, digits only)", placeholder: "919876543210" },
      { key: "email", label: "Email Address", placeholder: "info@example.com" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "mapEmbed", label: "Google Maps Embed (full <iframe> code or embed URL)", type: "textarea" },
      { key: "mapDirections", label: "Get Directions Link (Google Maps share URL)", placeholder: "https://goo.gl/maps/..." },
    ],
  },
  {
    title: "Social Media Links",
    fields: [
      { key: "facebook", label: "Facebook URL" },
      { key: "instagram", label: "Instagram URL" },
      { key: "linkedin", label: "LinkedIn URL" },
      { key: "youtube", label: "YouTube URL" },
    ],
  },
];

export function SettingsForm({ settings }: { settings: SettingsMap }) {
  const [form, setForm] = useState<SettingsMap>({ ...settings });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus("idle");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || "Save failed.");
      }
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Save failed.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-slate-900">Logo</h2>
        <ImageUploader value={form.logoUrl || ""} onChange={(url) => set("logoUrl", url)} label="Company Logo" />
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">{section.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="label">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    className="field resize-y"
                    rows={2}
                    value={form[field.key] || ""}
                    placeholder={field.placeholder}
                    onChange={(e) => set(field.key, e.target.value)}
                  />
                ) : (
                  <input
                    className="field"
                    value={form[field.key] || ""}
                    placeholder={field.placeholder}
                    onChange={(e) => set(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur">
        <button type="submit" disabled={status === "saving"} className="btn-primary">
          {status === "saving" ? "Saving..." : "Save Settings"}
        </button>
        {status === "saved" && <span className="text-sm font-medium text-eco-600">✓ Settings saved</span>}
        {status === "error" && <span className="text-sm font-medium text-red-600">{error}</span>}
      </div>
    </form>
  );
}
