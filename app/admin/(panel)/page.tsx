import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [services, products, enquiries, unread, recent] = await Promise.all([
    prisma.service.count(),
    prisma.product.count(),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { isRead: false } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Services", value: services, href: "/admin/services", icon: "🛠️" },
    { label: "Products", value: products, href: "/admin/products", icon: "🔆" },
    { label: "Total Enquiries", value: enquiries, href: "/admin/enquiries", icon: "📨" },
    { label: "Unread Enquiries", value: unread, href: "/admin/enquiries", icon: "🔔" },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Welcome back! Here&apos;s an overview of your website.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-3xl font-bold text-slate-900">{s.value}</span>
            </div>
            <div className="mt-2 text-sm font-medium text-slate-500">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent enquiries */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-semibold text-slate-900">Recent Enquiries</h2>
              <Link href="/admin/enquiries" className="text-sm font-medium text-brand-600 hover:underline">
                View all
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">No enquiries yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recent.map((e) => (
                  <li key={e.id} className="flex items-start justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{e.name}</span>
                        {!e.isRead && (
                          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-slate-500">
                        {e.phone} {e.email && `· ${e.email}`}
                      </p>
                      {e.message && (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{e.message}</p>
                      )}
                    </div>
                    <time className="shrink-0 text-xs text-slate-400">
                      {e.createdAt.toLocaleDateString()}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Quick Actions</h2>
          <div className="mt-4 space-y-2">
            <Link href="/admin/content" className="block rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
              📝 Edit page text &amp; images
            </Link>
            <Link href="/admin/services" className="block rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
              🛠️ Add or edit services
            </Link>
            <Link href="/admin/products" className="block rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
              🔆 Add or edit products
            </Link>
            <Link href="/admin/settings" className="block rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
              ⚙️ Update company info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
