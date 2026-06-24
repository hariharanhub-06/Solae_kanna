import { prisma } from "@/lib/prisma";
import { ProductsManager, type Product } from "@/components/admin/ProductsManager";
import { parseSpecs } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const rows = await prisma.product.findMany({ orderBy: { sort: "asc" } });
  const initial: Product[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    summary: r.summary,
    description: r.description,
    imageUrl: r.imageUrl,
    price: r.price,
    specs: parseSpecs(r.specs),
    featured: r.featured,
    published: r.published,
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <p className="mt-1 text-slate-500">Add, edit, reorder and hide the products shown on your website.</p>
      </header>
      <ProductsManager initial={initial} />
    </div>
  );
}
