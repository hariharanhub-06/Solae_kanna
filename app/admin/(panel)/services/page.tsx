import { prisma } from "@/lib/prisma";
import { ServicesManager, type Service } from "@/components/admin/ServicesManager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const rows = await prisma.service.findMany({ orderBy: { sort: "asc" } });
  const initial: Service[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    summary: r.summary,
    description: r.description,
    imageUrl: r.imageUrl,
    icon: r.icon,
    iconUrl: r.iconUrl,
    published: r.published,
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Services</h1>
        <p className="mt-1 text-slate-500">Add, edit, reorder and hide the services shown on your website.</p>
      </header>
      <ServicesManager initial={initial} />
    </div>
  );
}
