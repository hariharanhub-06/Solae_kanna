import { prisma } from "@/lib/prisma";
import { ContentEditor, type Block } from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

const PAGE_ORDER = ["home", "about", "services", "products", "contact"];

export default async function ContentPage() {
  const rows = await prisma.contentBlock.findMany({ orderBy: { sort: "asc" } });

  const blocks: Block[] = rows
    .map((r) => ({
      key: r.key,
      page: r.page,
      label: r.label,
      heading: r.heading,
      subheading: r.subheading,
      body: r.body,
      imageUrl: r.imageUrl,
    }))
    .sort((a, b) => PAGE_ORDER.indexOf(a.page) - PAGE_ORDER.indexOf(b.page));

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Page Content</h1>
        <p className="mt-1 text-slate-500">
          Edit the text and images shown on each page. Choose a page tab, change the fields, then click Save.
        </p>
      </header>
      <ContentEditor blocks={blocks} />
    </div>
  );
}
