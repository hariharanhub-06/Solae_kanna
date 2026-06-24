import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await getSessionUser();
  if (!session) redirect("/admin/login");

  const unreadCount = await prisma.enquiry.count({ where: { isRead: false } });

  return (
    <div className="lg:flex">
      <AdminNav
        unreadCount={unreadCount}
        role={session.role}
        userName={session.name || session.email}
      />
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
