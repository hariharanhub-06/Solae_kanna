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

export type Media = {
  id: string;
  category: "partner" | "project";
  title: string;
  imageUrl: string;
  published: boolean;
};

const TABS: { key: Media["category"]; label: string; hint: string; titleLabel: string }[] = [
  {
    key: "partner",
    label: "Panel Partners",
    hint: "Brand logos shown in the “Panels We Install” strip. Use transparent or white-background logos.",
    titleLabel: "Brand name",
  },
  {
    key: "project",
    label: "Project Gallery",
    hint: "Photos shown in the “Recent Solar Projects” gallery on the homepage.",
    titleLabel: "Caption (optional)",
  },
];

function emptyItem(category: Media["category"]): Media {
  return { id: "", category, title: "", imageUrl: "", published: true };
}

function Row({
  item,
  titleLabel,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  item: Media;
  titleLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
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
      <div className="grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="text-xl">🖼️</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium text-slate-900">
            {item.title || <span className="text-slate-400">{titleLabel}</span>}
          </span>
          {!item.published && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">Hidden</span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button type="button" onClick={onTogglePublish} title="Show/Hide" className="rounded-md px-2 py-1 text-sm hover:bg-slate-100">
          {item.published ? "👁️" : "🚫"}
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

export function MediaManager({ initial }: { initial: Media[] }) {
  const [items, setItems] = useState<Media[]>(initial);
  const [active, setActive] = useState<Media["category"]>("partner");
  const [editing, setEditing] = useState<Media | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const tab = TABS.find((t) => t.key === active)!;
  const visible = items.filter((m) => m.category === active);

  async function persistOrder(categoryItems: Media[]) {
    await fetch("/api/media/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: categoryItems.map((m) => m.id) }),
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active: a, over } = event;
    if (!over || a.id === over.id) return;
    const current = items.filter((m) => m.category === active);
    const oldIndex = current.findIndex((m) => m.id === a.id);
    const newIndex = current.findIndex((m) => m.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(current, oldIndex, newIndex);
    persistOrder(reordered);
    // Rebuild the full list keeping other categories in place.
    setItems((prev) => [...prev.filter((m) => m.category !== active), ...reordered]);
  }

  async function togglePublish(item: Media) {
    const published = !item.published;
    setItems((prev) => prev.map((m) => (m.id === item.id ? { ...m, published } : m)));
    await fetch(`/api/media/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
  }

  async function remove(item: Media) {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    setItems((prev) => prev.filter((m) => m.id !== item.id));
    await fetch(`/api/media/${item.id}`, { method: "DELETE" });
  }

  function onSaved(saved: Media) {
    setItems((prev) => {
      const exists = prev.some((m) => m.id === saved.id);
      return exists ? prev.map((m) => (m.id === saved.id ? saved : m)) : [...prev, saved];
    });
    setEditing(null);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === t.key ? "bg-brand-500 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{tab.hint}</p>
        <button
          type="button"
          onClick={() => setEditing(emptyItem(active))}
          className="btn-primary shrink-0 !py-2 !text-sm"
        >
          + Add {active === "partner" ? "Logo" : "Photo"}
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          Nothing here yet. Click &quot;Add&quot; to upload one.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visible.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {visible.map((m) => (
                <Row
                  key={m.id}
                  item={m}
                  titleLabel={tab.titleLabel}
                  onEdit={() => setEditing(m)}
                  onDelete={() => remove(m)}
                  onTogglePublish={() => togglePublish(m)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {editing && (
        <MediaModal
          item={editing}
          titleLabel={tab.titleLabel}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}

function MediaModal({
  item,
  titleLabel,
  onClose,
  onSaved,
}: {
  item: Media;
  titleLabel: string;
  onClose: () => void;
  onSaved: (m: Media) => void;
}) {
  const isNew = !item.id;
  const [form, setForm] = useState<Media>(item);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof Media>(field: K, value: Media[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save() {
    if (!form.imageUrl.trim()) {
      setError("Please upload an image.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(isNew ? "/api/media" : `/api/media/${form.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Save failed.");
      onSaved(body.item as Media);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {isNew ? "Add" : "Edit"} {form.category === "partner" ? "Partner Logo" : "Project Photo"}
          </h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <ImageUploader value={form.imageUrl} onChange={(url) => set("imageUrl", url)} label="Image *" />
          <div>
            <label className="label">{titleLabel}</label>
            <input className="field" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
            Show on the website
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
