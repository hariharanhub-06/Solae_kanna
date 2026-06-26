import { prisma } from "@/lib/prisma";
import { MediaManager, type Media } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const rows = await prisma.media.findMany({ orderBy: [{ category: "asc" }, { sort: "asc" }] });
  const initial: Media[] = rows.map((r) => ({
    id: r.id,
    category: (r.category === "partner" ? "partner" : "project") as Media["category"],
    title: r.title,
    imageUrl: r.imageUrl,
    published: r.published,
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gallery &amp; Logos</h1>
        <p className="mt-1 text-slate-500">
          Manage the panel-partner logos and the project gallery photos shown on your homepage.
          Drag to reorder, upload to add, and hide anything you don&apos;t want shown.
        </p>
      </header>
      <MediaManager initial={initial} />
    </div>
  );
}
