import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const data: Record<string, unknown> = {};
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.imageUrl === "string") data.imageUrl = body.imageUrl.trim();
  if (typeof body.published === "boolean") data.published = body.published;

  if (data.imageUrl === "") {
    return NextResponse.json({ error: "An image is required." }, { status: 400 });
  }

  try {
    const item = await prisma.media.update({ where: { id }, data });
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }
}
