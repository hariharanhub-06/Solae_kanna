import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateTempPassword } from "@/lib/auth";
import { getSessionUser } from "@/lib/session";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

async function requireSuperAdmin() {
  const session = await getSessionUser();
  if (!session || session.role !== "SUPERADMIN") return null;
  return session;
}

// PATCH: reset password (action: "reset") or toggle active (active: boolean).
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target || target.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));

  if (body.action === "reset") {
    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    await prisma.adminUser.update({
      where: { id },
      data: { passwordHash, mustChangePassword: true },
    });
    return NextResponse.json({ ok: true, tempPassword });
  }

  if (typeof body.active === "boolean") {
    const admin = await prisma.adminUser.update({
      where: { id },
      data: { active: body.active },
      select: { id: true, email: true, name: true, active: true, mustChangePassword: true, createdAt: true },
    });
    return NextResponse.json({ admin });
  }

  return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
}

// DELETE an admin (cannot delete super admins — they are never targetable here).
export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target || target.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin not found." }, { status: 404 });
  }
  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
