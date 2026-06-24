"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImageUploader } from "./ImageUploader";

export type Spec = { label: string; value: string };
export type Product = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl: string;
  price: string;
  specs: Spec[];
  featured: boolean;
  published: boolean;
};

const EMPTY: Product = {
  id: "",
  title: "",
  slug: "",
  summary: "",
  description: "",
  imageUrl: "",
  price: "",
  specs: [],
  featured: false,
  published: true,
};

function Row({
  product,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm ${
        isDragging ? "opacity-60 shadow-lg" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab px-1 text-slate-400 hover:text-slate-600 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xl">🔆</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium text-slate-900">{product.title}</span>
          {product.featured && (
            <span className="rounded bg-eco-100 px-1.5 py-0.5 text-xs text-eco-700">Featured</span>
          )}
          {!product.published && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">Hidden</span>
          )}
        </div>
        <p className="truncate text-sm text-slate-500">{product.summary}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button type="button" onClick={onTogglePublish} title="Show/Hide" className="rounded-md px-2 py-1 text-sm hover:bg-slate-100">
          {product.published ? "👁️" : "🚫"}
        </button>
        <button type="button" onClick={onEdit} className="rounded-md px-2 py-1 text-sm hover:bg-slate-100">
          ✏️
        </button>
        <button type="button" onClick={onDelete} className="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50">
          🗑️
        </button>
      </div>
    </div>
  );
}

export function ProductsManager({ initial }: { initial: Product[] }) {
  const [items, setItems] = useState<Product[]>(initial);
  const [editing, setEditing] = useState<Product | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function persistOrder(next: Product[]) {
    await fetch("/api/products/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((p) => p.id) }),
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id);
      const newIndex = prev.findIndex((p) => p.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex);
      persistOrder(next);
      return next;
    });
  }

  async function togglePublish(product: Product) {
    const published = !product.published;
    setItems((prev) => prev.map((p) => (p.id === product.id ? { ...p, published } : p)));
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
  }

  async function remove(product: Product) {
    if (!confirm(`Delete product "${product.title}"? This cannot be undone.`)) return;
    setItems((prev) => prev.filter((p) => p.id !== product.id));
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
  }

  function onSaved(saved: Product) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved];
    });
    setEditing(null);
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">Drag rows to reorder how products appear on the site.</p>
        <button type="button" onClick={() => setEditing(EMPTY)} className="btn-primary !py-2 !text-sm">
          + Add Product
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No products yet. Click &quot;Add Product&quot; to create one.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((p) => (
                <Row
                  key={p.id}
                  product={p}
                  onEdit={() => setEditing(p)}
                  onDelete={() => remove(p)}
                  onTogglePublish={() => togglePublish(p)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {editing && <ProductModal product={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </div>
  );
}

function ProductModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product;
  onClose: () => void;
  onSaved: (p: Product) => void;
}) {
  const isNew = !product.id;
  const [form, setForm] = useState<Product>(product);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof Product>(field: K, value: Product[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateSpec(index: number, key: keyof Spec, value: string) {
    setForm((f) => ({
      ...f,
      specs: f.specs.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }));
  }
  function addSpec() {
    setForm((f) => ({ ...f, specs: [...f.specs, { label: "", value: "" }] }));
  }
  function removeSpec(index: number) {
    setForm((f) => ({ ...f, specs: f.specs.filter((_, i) => i !== index) }));
  }

  async function save() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(isNew ? "/api/products" : `/api/products/${form.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Save failed.");
      // API returns specs as a JSON string — normalise back to array for local state.
      const saved = body.product;
      onSaved({
        ...saved,
        specs: typeof saved.specs === "string" ? JSON.parse(saved.specs || "[]") : saved.specs,
      } as Product);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{isNew ? "Add Product" : "Edit Product"}</h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input className="field" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className="label">Short Summary</label>
            <input className="field" value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>
          <div>
            <label className="label">Price / Price Label</label>
            <input className="field" value={form.price} placeholder="e.g. Request a quote, or ₹15,000" onChange={(e) => set("price", e.target.value)} />
          </div>
          <div>
            <label className="label">Full Description</label>
            <textarea className="field resize-y" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="label !mb-0">Specifications</span>
              <button type="button" onClick={addSpec} className="text-sm font-medium text-brand-600 hover:underline">
                + Add spec
              </button>
            </div>
            <div className="space-y-2">
              {form.specs.length === 0 && (
                <p className="text-xs text-slate-400">No specifications added.</p>
              )}
              {form.specs.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="field !py-2"
                    placeholder="Label (e.g. Power)"
                    value={spec.label}
                    onChange={(e) => updateSpec(i, "label", e.target.value)}
                  />
                  <input
                    className="field !py-2"
                    placeholder="Value (e.g. 550 W)"
                    value={spec.value}
                    onChange={(e) => updateSpec(i, "value", e.target.value)}
                  />
                  <button type="button" onClick={() => removeSpec(i)} className="shrink-0 rounded-md px-2 text-red-600 hover:bg-red-50">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <ImageUploader value={form.imageUrl} onChange={(url) => set("imageUrl", url)} label="Product Image" />

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
              Feature on homepage
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
              Show on website
            </label>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-outline !py-2 !text-sm">
            Cancel
          </button>
          <button type="button" onClick={save} disabled={saving} className="btn-primary !py-2 !text-sm">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
