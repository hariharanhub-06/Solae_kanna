"use client";

import { useState } from "react";
import { ImageUploader } from "./ImageUploader";

export type Block = {
  key: string;
  page: string;
  label: string;
  heading: string;
  subheading: string;
  body: string;
  imageUrl: string;
};

const PAGE_TITLES: Record<string, string> = {
  home: "Home Page",
  about: "About Page",
  services: "Services Page",
  products: "Products Page",
  contact: "Contact Page",
};

// Only these blocks actually render an image on the site. Every other block
// (features, process steps, CTA, mission/vision, why-us, etc.) is text-only,
// so we hide the image uploader for them to avoid confusion.
const IMAGE_BLOCKS = new Set([
  "home.hero",
  "home.about",
  "about.hero",
  "about.story",
  "services.hero",
  "products.hero",
  "contact.hero",
]);

function BlockCard({ block }: { block: Block }) {
  const [form, setForm] = useState(block);
  const showImage = IMAGE_BLOCKS.has(block.key);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  function set<K extends keyof Block>(field: K, value: Block[K]) {
    setForm((f) => ({ ...f, [field]: value }));
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    setError("");
    try {
      const res = await fetch(`/api/content/${encodeURIComponent(block.key)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heading: form.heading,
          subheading: form.subheading,
          body: form.body,
          imageUrl: form.imageUrl,
        }),
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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-900">{block.label}</div>
      <div className="space-y-3">
        <div>
          <label className="label">Heading</label>
          <input className="field" value={form.heading} onChange={(e) => set("heading", e.target.value)} />
        </div>
        <div>
          <label className="label">Subheading / tagline (optional)</label>
          <input className="field" value={form.subheading} onChange={(e) => set("subheading", e.target.value)} />
        </div>
        <div>
          <label className="label">Body text (optional)</label>
          <textarea
            className="field resize-y"
            rows={3}
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
          />
        </div>
        {showImage && (
          <ImageUploader value={form.imageUrl} onChange={(url) => set("imageUrl", url)} label="Image (optional)" />
        )}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={save} disabled={status === "saving"} className="btn-primary !py-2 !text-xs">
          {status === "saving" ? "Saving..." : "Save"}
        </button>
        {status === "saved" && <span className="text-xs font-medium text-eco-600">✓ Saved</span>}
        {status === "error" && <span className="text-xs font-medium text-red-600">{error}</span>}
      </div>
    </div>
  );
}

export function ContentEditor({ blocks }: { blocks: Block[] }) {
  const pages = Array.from(new Set(blocks.map((b) => b.page)));
  const [active, setActive] = useState(pages[0] ?? "home");

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setActive(p)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === p ? "bg-brand-500 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {PAGE_TITLES[p] ?? p}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {blocks
          .filter((b) => b.page === active)
          .map((b) => (
            <BlockCard key={b.key} block={b} />
          ))}
      </div>
    </div>
  );
}
