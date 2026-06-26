import { prisma } from "@/lib/prisma";
import { MediaManager, type Media, type ServiceIcon } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const [rows, svcRows] = await Promise.all([
    prisma.media.findMany({ orderBy: [{ category: "asc" }, { sort: "asc" }] }),
    prisma.service.findMany({ orderBy: { sort: "asc" } }),
  ]);

  const initial: Media[] = rows.map((r) => ({
    id: r.id,
    category: (r.category === "partner" ? "partner" : "project") as Media["category"],
    title: r.title,
    imageUrl: r.imageUrl,
    published: r.published,
  }));
  const services: ServiceIcon[] = svcRows.map((s) => ({
    id: s.id,
    title: s.title,
    icon: s.icon,
    iconUrl: s.iconUrl,
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gallery &amp; Logos</h1>
        <p className="mt-1 text-slate-500">
          One place for all your homepage images — panel-partner logos, the project gallery,
          and the &ldquo;What We Offer&rdquo; service icons.
        </p>
      </header>
      <MediaManager initial={initial} services={services} />
    </div>
  );
}
