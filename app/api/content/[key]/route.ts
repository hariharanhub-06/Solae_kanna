import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

type Params = { params: Promise<{ key: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { key } = await params;
  const body = await req.json().catch(() => ({}));

  const data: Record<string, string> = {};
  for (const field of ["heading", "subheading", "body", "imageUrl"] as const) {
    if (typeof body[field] === "string") data[field] = body[field];
  }

  try {
    const blockRow = await prisma.contentBlock.update({ where: { key }, data });
    return NextResponse.json({ block: blockRow });
  } catch {
    return NextResponse.json({ error: "Content block not found." }, { status: 404 });
  }
}
