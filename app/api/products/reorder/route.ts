import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const ids: unknown = body.ids;
  if (!Array.isArray(ids) || ids.some((i) => typeof i !== "string")) {
    return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
  }

  await prisma.$transaction(
    (ids as string[]).map((id, index) =>
      prisma.product.update({ where: { id }, data: { sort: index } })
    )
  );
  return NextResponse.json({ ok: true });
}
