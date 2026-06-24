import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser, generateTempPassword } from "@/lib/auth";

export const runtime = "nodejs";

const createSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().max(120).optional().default(""),
});

async function requireSuperAdmin() {
  const session = await getSessionUser();
  if (!session || session.role !== "SUPERADMIN") return null;
  return session;
}

// List admins (ADMIN role only — super admins are never exposed here).
export async function GET() {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const admins = await prisma.adminUser.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, active: true, mustChangePassword: true, createdAt: true },
  });
  return NextResponse.json({ admins });
}

// Create a new admin with a generated temporary password.
export async function POST(req: NextRequest) {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = createSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const existing = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  const admin = await prisma.adminUser.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
      role: "ADMIN",
      mustChangePassword: true,
    },
    select: { id: true, email: true, name: true, active: true, mustChangePassword: true, createdAt: true },
  });

  // tempPassword is returned ONCE so the super admin can share it.
  return NextResponse.json({ admin, tempPassword });
}
