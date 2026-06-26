"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const BASE_NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/content", label: "Page Content", icon: "📝" },
  { href: "/admin/services", label: "Services", icon: "🛠️" },
  { href: "/admin/products", label: "Products", icon: "🔆" },
  { href: "/admin/gallery", label: "Gallery & Logos", icon: "🖼️" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "📨" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export function AdminNav({
  unreadCount = 0,
  role,
  userName,
}: {
  unreadCount?: number;
  role: "ADMIN" | "SUPERADMIN";
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const nav = [...BASE_NAV];
  if (role === "SUPERADMIN") {
    nav.push({ href: "/admin/admins", label: "Manage Admins", icon: "👥" });
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const links = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive(item.href)
              ? "bg-brand-500 text-white"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span>{item.icon}</span>
          <span className="flex-1">{item.label}</span>
          {item.href === "/admin/enquiries" && unreadCount > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );

  const footer = (
    <div className="mt-4 space-y-1 border-t border-slate-800 pt-4">
      <div className="px-3 pb-1 text-xs text-slate-500">
        Signed in as
        <div className="truncate font-medium text-slate-300">{userName}</div>
      </div>
      <Link
        href="/admin/change-password"
        onClick={() => setOpen(false)}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
      >
        <span>🔒</span> Change Password
      </Link>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
      >
        <span>🌐</span> View Website
      </a>
      <button
        type="button"
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
      >
        <span>🚪</span> Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 text-white lg:hidden">
        <div className="flex items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500">☀</span>
          Admin
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-9 w-9 place-items-center rounded-md hover:bg-slate-800"
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute left-0 top-0 flex h-full w-64 flex-col bg-slate-900 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {links}
            {footer}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col bg-slate-900 p-4 lg:flex">
        <div className="mb-6 flex items-center gap-2 px-2 text-lg font-bold text-white">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500">☀</span>
          Admin Panel
        </div>
        {links}
        {footer}
      </aside>
    </>
  );
}
