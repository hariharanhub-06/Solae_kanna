"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ChangePasswordForm({ forced }: { forced: boolean }) {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not change password.");
      setDone(true);
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password.");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-900 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-brand-500 text-2xl text-white">
            🔒
          </div>
          <h1 className="text-xl font-bold text-slate-900">Change Password</h1>
          {forced ? (
            <p className="mt-1 text-sm text-amber-600">
              You&apos;re using a temporary password. Please set a new password to continue.
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">Update your account password</p>
          )}
        </div>

        {done ? (
          <p className="rounded-lg bg-eco-50 px-3 py-3 text-center text-sm text-eco-700">
            ✓ Password updated. Redirecting…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="current">
                {forced ? "Temporary password" : "Current password"}
              </label>
              <input
                id="current"
                type="password"
                required
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="new">
                New password
              </label>
              <input
                id="new"
                type="password"
                required
                value={next}
                onChange={(e) => setNext(e.target.value)}
                className="field"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="label" htmlFor="confirm">
                Confirm new password
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="field"
              />
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Updating..." : "Update Password"}
            </button>
            {!forced && (
              <Link href="/admin" className="block text-center text-sm text-slate-500 hover:text-brand-600">
                Back to dashboard
              </Link>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
