import { prisma } from "@/lib/prisma";
import { EnquiriesTable, type Enquiry } from "@/components/admin/EnquiriesTable";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const rows = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  const initial: Enquiry[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    message: r.message,
    source: r.source,
    isRead: r.isRead,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Enquiries</h1>
        <p className="mt-1 text-slate-500">Customer enquiries submitted through your website forms.</p>
      </header>
      <EnquiriesTable initial={initial} />
    </div>
  );
}
