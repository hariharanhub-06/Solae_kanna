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

export type Service = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl: string;
  icon: string;
  iconUrl: string;
  published: boolean;
};

const EMPTY: Service = {
  id: "",
  title: "",
  slug: "",
  summary: "",
  description: "",
  imageUrl: "",
  icon: "",
  iconUrl: "",
  published: true,
};

function Row({
  service,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: service.id,
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
        {service.iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.iconUrl} alt="" className="h-full w-full object-contain p-1" />
        ) : service.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xl">{service.icon || "🛠️"}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium text-slate-900">{service.title}</span>
          {!service.published && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">Hidden</span>
          )}
        </div>
        <p className="truncate text-sm text-slate-500">{service.summary}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button type="button" onClick={onTogglePublish} title="Show/Hide" className="rounded-md px-2 py-1 text-sm hover:bg-slate-100">
          {service.published ? "👁️" : "🚫"}
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

export function ServicesManager({ initial }: { initial: Service[] }) {
  const [items, setItems] = useState<Service[]>(initial);
  const [editing, setEditing] = useState<Service | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function persistOrder(next: Service[]) {
    await fetch("/api/services/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((s) => s.id) }),
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex);
      persistOrder(next);
      return next;
    });
  }

  async function togglePublish(service: Service) {
    const published = !service.published;
    setItems((prev) => prev.map((s) => (s.id === service.id ? { ...s, published } : s)));
    await fetch(`/api/services/${service.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
  }

  async function remove(service: Service) {
    if (!confirm(`Delete service "${service.title}"? This cannot be undone.`)) return;
    setItems((prev) => prev.filter((s) => s.id !== service.id));
    await fetch(`/api/services/${service.id}`, { method: "DELETE" });
  }

  function onSaved(saved: Service) {
    setItems((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      return exists ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved];
    });
    setEditing(null);
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">Drag rows to reorder how services appear on the site.</p>
        <button type="button" onClick={() => setEditing(EMPTY)} className="btn-primary !py-2 !text-sm">
          + Add Service
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No services yet. Click &quot;Add Service&quot; to create one.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((s) => (
                <Row
                  key={s.id}
                  service={s}
                  onEdit={() => setEditing(s)}
                  onDelete={() => remove(s)}
                  onTogglePublish={() => togglePublish(s)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {editing && <ServiceModal service={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </div>
  );
}

function ServiceModal({
  service,
  onClose,
  onSaved,
}: {
  service: Service;
  onClose: () => void;
  onSaved: (s: Service) => void;
}) {
  const isNew = !service.id;
  const [form, setForm] = useState<Service>(service);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof Service>(field: K, value: Service[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(isNew ? "/api/services" : `/api/services/${form.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Save failed.");
      onSaved(body.service as Service);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{isNew ? "Add Service" : "Edit Service"}</h2>
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
            <label className="label">Icon (emoji, optional)</label>
            <input className="field" value={form.icon} placeholder="🏠" onChange={(e) => set("icon", e.target.value)} />
          </div>
          <ImageUploader
            value={form.iconUrl}
            onChange={(url) => set("iconUrl", url)}
            label="Icon / logo image (optional — overrides the emoji)"
          />
          <div>
            <label className="label">Short Summary</label>
            <input className="field" value={form.summary} onChange={(e) => set("summary", e.target.value)} />
          </div>
          <div>
            <label className="label">Full Description</label>
            <textarea className="field resize-y" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <ImageUploader value={form.imageUrl} onChange={(url) => set("imageUrl", url)} label="Service Image" />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
            Show this service on the website
          </label>
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
