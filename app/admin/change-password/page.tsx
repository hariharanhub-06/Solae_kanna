import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const session = await getSessionUser();
  if (!session) redirect("/admin/login");
  return <ChangePasswordForm forced={session.mustChange} />;
}
