import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { AdminsManager, type Admin } from "@/components/admin/AdminsManager";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const session = await getSessionUser();
  // Only super admins may access — hide existence from regular admins.
  if (!session || session.role !== "SUPERADMIN") redirect("/admin");

  const rows = await prisma.adminUser.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "desc" },
  });
  const initial: Admin[] = rows.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    active: r.active,
    mustChangePassword: r.mustChangePassword,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manage Admins</h1>
        <p className="mt-1 text-slate-500">
          Create and manage admin accounts who can edit the website content.
        </p>
      </header>
      <AdminsManager initial={initial} />
    </div>
  );
}
