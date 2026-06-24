"use client";

import { useState } from "react";

export type Admin = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  mustChangePassword: boolean;
  createdAt: string;
};

export function AdminsManager({ initial }: { initial: Admin[] }) {
  const [admins, setAdmins] = useState<Admin[]>(initial);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [tempInfo, setTempInfo] = useState<{ email: string; password: string } | null>(null);

  async function createAdmin(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setTempInfo(null);
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not create admin.");
      setAdmins((prev) => [body.admin, ...prev]);
      setTempInfo({ email: body.admin.email, password: body.tempPassword });
      setEmail("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create admin.");
    } finally {
      setCreating(false);
    }
  }

  async function resetPassword(admin: Admin) {
    if (!confirm(`Reset password for ${admin.email}? A new temporary password will be generated.`)) return;
    const res = await fetch(`/api/admins/${admin.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) {
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, mustChangePassword: true } : a))
      );
      setTempInfo({ email: admin.email, password: body.tempPassword });
    }
  }

  async function toggleActive(admin: Admin) {
    const active = !admin.active;
    setAdmins((prev) => prev.map((a) => (a.id === admin.id ? { ...a, active } : a)));
    await fetch(`/api/admins/${admin.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
  }

  async function remove(admin: Admin) {
    if (!confirm(`Delete admin ${admin.email}? This cannot be undone.`)) return;
    setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    await fetch(`/api/admins/${admin.id}`, { method: "DELETE" });
  }

  return (
    <div className="space-y-8">
      {/* Create admin */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">Create New Admin</h2>
        <p className="mt-1 text-sm text-slate-500">
          A temporary password will be generated. The new admin must change it on first login.
        </p>
        <form onSubmit={createAdmin} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              required
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="label">Name (optional)</label>
            <input
              className="field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <button type="submit" disabled={creating} className="btn-primary h-[46px]">
            {creating ? "Creating..." : "Create Admin"}
          </button>
        </form>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {tempInfo && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">
              Temporary password for {tempInfo.email}
            </p>
            <p className="mt-1 text-xs text-amber-700">
              Copy and share this now — it won&apos;t be shown again. The admin must change it on first login.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="rounded bg-white px-3 py-2 font-mono text-base font-bold text-slate-900">
                {tempInfo.password}
              </code>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(tempInfo.password)}
                className="btn-outline !py-2 !text-xs"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admins list */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-semibold text-slate-900">Admins ({admins.length})</h2>
        </div>
        {admins.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No admins yet. Create one above.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {admins.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-900">{a.name || a.email}</span>
                    {!a.active && (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Disabled</span>
                    )}
                    {a.mustChangePassword && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                        Temp password
                      </span>
                    )}
                  </div>
                  {a.name && <p className="text-sm text-slate-500">{a.email}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => resetPassword(a)} className="btn-outline !py-1.5 !text-xs">
                    Reset password
                  </button>
                  <button type="button" onClick={() => toggleActive(a)} className="btn-outline !py-1.5 !text-xs">
                    {a.active ? "Disable" : "Enable"}
                  </button>
                  <button type="button" onClick={() => remove(a)} className="btn-outline !py-1.5 !text-xs !text-red-600">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
