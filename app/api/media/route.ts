import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/session";

const CATEGORIES = ["partner", "project"];

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const category = CATEGORIES.includes(body.category) ? body.category : "project";
  const imageUrl = (body.imageUrl || "").trim();
  if (!imageUrl) {
    return NextResponse.json({ error: "An image is required." }, { status: 400 });
  }

  const max = await prisma.media.aggregate({
    where: { category },
    _max: { sort: true },
  });
  const item = await prisma.media.create({
    data: {
      category,
      title: (body.title || "").trim(),
      imageUrl,
      published: body.published !== false,
      sort: (max._max.sort ?? -1) + 1,
    },
  });
  return NextResponse.json({ item });
}
