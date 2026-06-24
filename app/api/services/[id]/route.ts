import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const data: Record<string, unknown> = {};
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.summary === "string") data.summary = body.summary.trim();
  if (typeof body.description === "string") data.description = body.description.trim();
  if (typeof body.imageUrl === "string") data.imageUrl = body.imageUrl.trim();
  if (typeof body.icon === "string") data.icon = body.icon.trim();
  if (typeof body.published === "boolean") data.published = body.published;

  if (data.title === "") {
    return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
  }

  try {
    const service = await prisma.service.update({ where: { id }, data });
    return NextResponse.json({ service });
  } catch {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }
}
