"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  isRead: boolean;
  createdAt: string;
};

export function EnquiriesTable({ initial }: { initial: Enquiry[] }) {
  const [items, setItems] = useState<Enquiry[]>(initial);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const router = useRouter();

  const visible = filter === "unread" ? items.filter((e) => !e.isRead) : items;

  async function toggleRead(e: Enquiry) {
    const isRead = !e.isRead;
    setItems((prev) => prev.map((x) => (x.id === e.id ? { ...x, isRead } : x)));
    await fetch(`/api/enquiries/${e.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });
    // Refresh server components so the sidebar unread badge updates immediately.
    router.refresh();
  }

  async function remove(e: Enquiry) {
    if (!confirm(`Delete enquiry from ${e.name}?`)) return;
    setItems((prev) => prev.filter((x) => x.id !== e.id));
    await fetch(`/api/enquiries/${e.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-brand-500 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f} {f === "unread" && `(${items.filter((e) => !e.isRead).length})`}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          {filter === "unread" ? "No unread enquiries." : "No enquiries yet."}
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((e) => (
            <div
              key={e.id}
              className={`rounded-xl border bg-white p-4 shadow-sm sm:p-5 ${
                e.isRead ? "border-slate-200" : "border-brand-300 ring-1 ring-brand-100"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{e.name}</h3>
                    {!e.isRead && (
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
                        New
                      </span>
                    )}
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{e.source}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                    {e.phone && (
                      <a href={`tel:${e.phone}`} className="hover:text-brand-600">📞 {e.phone}</a>
                    )}
                    {e.email && (
                      <a href={`mailto:${e.email}`} className="hover:text-brand-600">✉️ {e.email}</a>
                    )}
                  </div>
                </div>
                <time className="shrink-0 text-xs text-slate-400">
                  {new Date(e.createdAt).toLocaleString()}
                </time>
              </div>
              {e.message && (
                <p className="mt-3 whitespace-pre-line rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  {e.message}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => toggleRead(e)} className="btn-outline !py-1.5 !text-xs">
                  {e.isRead ? "Mark as unread" : "Mark as read"}
                </button>
                {e.phone && (
                  <a
                    href={`https://wa.me/${e.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline !py-1.5 !text-xs"
                  >
                    Reply on WhatsApp
                  </a>
                )}
                <button type="button" onClick={() => remove(e)} className="btn-outline !py-1.5 !text-xs !text-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
